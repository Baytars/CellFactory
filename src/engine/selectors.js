// ========================================
//  selectors.js — 派生状态计算
// ========================================

import { LEVELS } from '../data/levels';

/**
 * 获取反应链步骤（用于 ChainIndicator 组件）
 */
export function getChainSteps(state) {
  if (state.currentLevel === null) return [];
  const lv = LEVELS[state.currentLevel];
  return lv.recipes.map(r => {
    const inputNames = r.inputs.map(id => {
      const reagent = lv.reagents.find(rr => rr.id === id);
      const invItem = state.inventory[id];
      return reagent ? reagent.formula : (invItem ? invItem.formula : id);
    });
    const uniqueInputs = [...new Set(inputNames)];
    // Build label: include byproducts if any (e.g., "F1,6BP → DHAP + GAP")
    let productLabel = r.product.formula;
    if (r.byproducts && r.byproducts.length > 0) {
      productLabel += '+' + r.byproducts.map(bp => bp.formula).join('+');
    }
    return {
      label: uniqueInputs.join('+') + ' → ' + productLabel,
      isFinal: r.isFinal,
      isDone: r.isFinal ? false : ((state.inventory[r.product.id]?.count || 0) > 0),
      isRateLimiting: r.isRateLimiting || false,
      enzymeName: r.enzymeName || null,
    };
  });
}

/**
 * 获取当前步骤索引
 */
export function getCurrentStepIndex(state) {
  if (state.currentLevel === null) return 0;
  const lv = LEVELS[state.currentLevel];
  const hasIntermediate = lv.recipes.some(
    r => !r.isFinal && (state.inventory[r.product.id]?.count || 0) > 0
  );
  if (hasIntermediate) return lv.recipes.findIndex(r => r.isFinal);
  return lv.recipes.findIndex(r => !r.isFinal);
}

/**
 * 获取关卡进度百分比
 */
export function getLevelProgress(state) {
  if (state.currentLevel === null) return 0;
  const lv = LEVELS[state.currentLevel];
  return Math.round((state.completedObjectives.length / lv.objectives.length) * 100);
}

/**
 * 判断当前关卡是否已通关（所有目标完成）
 */
export function isLevelComplete(state) {
  if (state.currentLevel === null) return false;
  const lv = LEVELS[state.currentLevel];
  return state.completedObjectives.length >= lv.objectives.length;
}

/**
 * 获取带解锁状态的关卡列表
 */
export function getLevelsWithUnlock(state) {
  return LEVELS.map((lv, i) => ({
    ...lv,
    unlocked: i === 0 || (state.levelStars[LEVELS[i - 1]?.id] || 0) > 0,
    stars: state.levelStars[lv.id] || 0,
  }));
}

/**
 * 判断合成按钮是否可用
 */
export function canSynthesize(state) {
  if (state.currentLevel === null) return false;
  return state.currentSlots.length > 0;
}
