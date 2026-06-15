// ========================================
//  gameReducer.js — 游戏状态 Reducer
//  从 engine.js 迁移，修复了递归 bug
// ========================================

import { LEVELS } from '../data/levels';

// ─── Action Types ──────────────────────────────

export const INIT_LEVEL = 'INIT_LEVEL';
export const ADD_TO_SLOT = 'ADD_TO_SLOT';
export const REMOVE_FROM_SLOT = 'REMOVE_FROM_SLOT';
export const CLEAR_SLOTS = 'CLEAR_SLOTS';
export const SYNTHESIZE = 'SYNTHESIZE';
export const SHOW_HINT = 'SHOW_HINT';
export const ADVANCE_NARRATIVE = 'ADVANCE_NARRATIVE';
export const FINISH_LEVEL = 'FINISH_LEVEL';
export const SET_SYNTH_FEEDBACK = 'SET_SYNTH_FEEDBACK';
export const CLEAR_SYNTH_FEEDBACK = 'CLEAR_SYNTH_FEEDBACK';
export const SHOW_OVERLAY = 'SHOW_OVERLAY';
export const HIDE_OVERLAY = 'HIDE_OVERLAY';
export const SHOW_TOAST = 'SHOW_TOAST';

// ─── Initial State ──────────────────────────────

export const initialState = {
  // Game state
  currentLevel: null,
  currentSlots: [],          // [{id, name, formula, color, emoji, fromInventory}]
  inventory: {},             // {productId: {id, name, formula, color, emoji, count}}
  completedObjectives: [],   // [index]
  hintLevel: 0,
  synthLog: [],              // [string]
  narrativeQueue: [],        // [{speaker, text}]
  narrativeIndex: 0,
  levelStars: {},            // {levelId: stars}
  currentStep: 0,

  // UI state (was scattered in ui.js)
  synthFeedback: null,       // null | 'correct' | 'wrong'
  synthResult: null,         // null | {product, isFinal}
  overlay: null,             // null | {type: 'knowledge', data} | {type: 'result', data}
  toast: null,               // null | {message, type, id}
};

// ─── Reducer ────────────────────────────────────

export function gameReducer(state, action) {
  switch (action.type) {

    case INIT_LEVEL: {
      const { levelIdx } = action.payload;
      const lv = LEVELS[levelIdx];
      return {
        ...state,
        currentLevel: levelIdx,
        currentSlots: [],
        inventory: {},
        completedObjectives: [],
        hintLevel: 0,
        synthLog: [],
        narrativeQueue: [...lv.narrative],
        narrativeIndex: 0,
        currentStep: 0,
        synthFeedback: null,
        synthResult: null,
        overlay: null,
        toast: null,
      };
    }

    case ADD_TO_SLOT: {
      const { reagentId, fromInventory } = action.payload;
      const lv = LEVELS[state.currentLevel];
      if (state.currentSlots.length >= lv.slots) return state;

      // Check inventory availability
      if (fromInventory) {
        const invItem = state.inventory[reagentId];
        if (!invItem || invItem.count <= 0) return state;
      }

      let slotData;
      if (fromInventory) {
        const invItem = state.inventory[reagentId];
        slotData = {
          id: invItem.id, name: invItem.name, formula: invItem.formula,
          color: invItem.color, emoji: invItem.emoji, fromInventory: true,
        };
      } else {
        const reagent = lv.reagents.find(r => r.id === reagentId);
        if (!reagent) return state;
        slotData = {
          id: reagent.id, name: reagent.name, formula: reagent.formula,
          color: reagent.color, emoji: reagent.emoji, fromInventory: false,
        };
      }

      return {
        ...state,
        currentSlots: [...state.currentSlots, slotData],
      };
    }

    case REMOVE_FROM_SLOT: {
      const { index } = action.payload;
      const newSlots = [...state.currentSlots];
      newSlots.splice(index, 1);
      return { ...state, currentSlots: newSlots };
    }

    case CLEAR_SLOTS: {
      return { ...state, currentSlots: [] };
    }

    case SYNTHESIZE: {
      const lv = LEVELS[state.currentLevel];
      const inputIds = state.currentSlots.map(s => s.id).sort();

      // Try to match a recipe
      let matchedRecipe = null;
      for (const recipe of lv.recipes) {
        const recipeInputs = recipe.inputs.slice().sort();
        if (recipeInputs.length === inputIds.length &&
            recipeInputs.join(',') === inputIds.join(',')) {
          matchedRecipe = recipe;
          break;
        }
      }

      if (!matchedRecipe) {
        // Synthesis failed
        return {
          ...state,
          synthFeedback: 'wrong',
          toast: { message: '❌ 合成失败——这些原料无法反应', type: 'error', id: Date.now() },
        };
      }

      // Synthesis succeeded
      const product = matchedRecipe.product;
      const inventoryUsed = state.currentSlots.filter(s => s.fromInventory).map(s => s.id);

      // Consume inventory items
      let newInventory = { ...state.inventory };
      for (const id of inventoryUsed) {
        if (newInventory[id]) {
          newInventory[id] = { ...newInventory[id], count: newInventory[id].count - 1 };
          if (newInventory[id].count <= 0) {
            const { [id]: _, ...rest } = newInventory;
            newInventory = rest;
          }
        }
      }

      // Add product to inventory (even for isFinal, so it shows in result)
      if (!newInventory[product.id]) {
        newInventory[product.id] = { ...product, count: 0 };
      }
      newInventory[product.id] = {
        ...newInventory[product.id],
        count: newInventory[product.id].count + 1,
      };

      // Add byproducts to inventory (e.g., NADH from step 6, ATP from steps 7/10)
      if (matchedRecipe.byproducts) {
        for (const bp of matchedRecipe.byproducts) {
          if (!newInventory[bp.id]) {
            newInventory[bp.id] = { ...bp, count: 0 };
          }
          newInventory[bp.id] = {
            ...newInventory[bp.id],
            count: newInventory[bp.id].count + 1,
          };
        }
      }

      // Update objectives — progressive completion based on synthesis milestones
      const newCompleted = [...state.completedObjectives];

      // Objective 0: complete on first successful synthesis
      if (!newCompleted.includes(0)) newCompleted.push(0);

      if (matchedRecipe.isFinal) {
        // Final recipe → complete all objectives
        lv.objectives.forEach((_, i) => {
          if (!newCompleted.includes(i)) newCompleted.push(i);
        });
      } else {
        // Intermediate recipe → check if inventory satisfies next milestone
        const finalRecipe = lv.recipes.find(r => r.isFinal);
        if (finalRecipe) {
          // Check if we have enough of this product for the final recipe
          const neededCount = finalRecipe.inputs.filter(id => id === product.id).length;
          const haveCount = (newInventory[product.id]?.count || 0);
          if (haveCount >= neededCount && !newCompleted.includes(1)) {
            newCompleted.push(1);
          }
        } else {
          // No final recipe in this level — complete objectives based on inventory progress
          const totalRecipes = lv.recipes.length;
          const doneRecipes = lv.recipes.filter(r =>
            !r.isFinal && (newInventory[r.product.id]?.count || 0) > 0
          ).length;
          // Complete objective 1 when half or more recipes done
          if (doneRecipes >= Math.ceil(totalRecipes / 2) && !newCompleted.includes(1)) {
            newCompleted.push(1);
          }
          // Complete objective 2 when all non-final recipes done
          if (doneRecipes >= totalRecipes && !newCompleted.includes(2)) {
            newCompleted.push(2);
          }
        }
      }

      // Build log and toast messages (include byproducts if any)
      let logMsg = `✅ 合成成功：${product.name} (${product.formula})`;
      let toastMsg = `✅ 合成成功！${product.name}已加入库存`;
      if (matchedRecipe.byproducts && matchedRecipe.byproducts.length > 0) {
        const bpNames = matchedRecipe.byproducts.map(bp => bp.name).join('、');
        logMsg += ` + 副产物：${bpNames}`;
        toastMsg += `，同时产出${bpNames}`;
      }

      const newLog = [...state.synthLog, logMsg];

      return {
        ...state,
        currentSlots: [],
        inventory: newInventory,
        completedObjectives: newCompleted,
        synthLog: newLog,
        synthFeedback: 'correct',
        synthResult: { product, isFinal: matchedRecipe.isFinal },
        toast: matchedRecipe.isFinal
          ? { message: `🎉 关卡完成！你合成了${product.name}！`, type: 'success', id: Date.now() }
          : { message: toastMsg, type: 'success', id: Date.now() },
      };
    }

    case SHOW_HINT: {
      const lv = LEVELS[state.currentLevel];
      if (state.hintLevel >= lv.hintLevels.length) return state;
      return { ...state, hintLevel: state.hintLevel + 1 };
    }

    case ADVANCE_NARRATIVE: {
      return { ...state, narrativeIndex: state.narrativeIndex + 1 };
    }

    case FINISH_LEVEL: {
      const lv = LEVELS[state.currentLevel];
      const stars = state.hintLevel === 0 ? 3 : (state.hintLevel <= 1 ? 2 : 1);
      const newLevelStars = {
        ...state.levelStars,
        [lv.id]: Math.max(state.levelStars[lv.id] || 0, stars),
      };
      const successCount = state.synthLog.filter(l => l.startsWith('✅')).length;
      const nextIdx = state.currentLevel + 1;

      return {
        ...state,
        levelStars: newLevelStars,
        overlay: {
          type: 'result',
          data: { stars, nextIdx, hintCount: state.hintLevel, successCount },
        },
      };
    }

    case SET_SYNTH_FEEDBACK: {
      return { ...state, synthFeedback: action.payload };
    }

    case CLEAR_SYNTH_FEEDBACK: {
      return { ...state, synthFeedback: null, synthResult: null };
    }

    case SHOW_OVERLAY: {
      return { ...state, overlay: action.payload };
    }

    case HIDE_OVERLAY: {
      return { ...state, overlay: null };
    }

    case SHOW_TOAST: {
      return { ...state, toast: action.payload };
    }

    default:
      return state;
  }
}
