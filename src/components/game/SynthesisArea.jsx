import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import { canSynthesize } from '../../engine/selectors';
import s from '../../styles/components/game.module.css';

export default function SynthesisArea() {
  const { state, dispatch } = useGame();
  const { setNodeRef, isOver } = useDroppable({ id: 'synthesis-area' });

  if (state.currentLevel === null) return null;
  const lv = LEVELS[state.currentLevel];
  const canSynth = canSynthesize(state);

  // Determine area visual state
  let areaClass = s.synthesisArea;
  if (state.synthFeedback === 'correct') areaClass += ` ${s.correct}`;
  if (state.synthFeedback === 'wrong') areaClass += ` ${s.wrong}`;
  if (isOver) areaClass += ` ${s.dragOver}`;

  const handleSynthesize = () => {
    if (!canSynth) return;
    dispatch({ type: 'SYNTHESIZE' });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_SLOTS' });
  };

  const handleHint = () => {
    dispatch({ type: 'SHOW_HINT' });
  };

  const hint = state.hintLevel > 0 ? lv.hintLevels[state.hintLevel - 1] : null;

  return (
    <div ref={setNodeRef} className={areaClass}>
      {state.currentSlots.length === 0 && !state.synthResult && (
        <div className={s.synthLabel}>将原料拖入合成台</div>
      )}

      <div className={s.synthSlots}>
        {state.currentSlots.map((slot, i) => (
          <React.Fragment key={i}>
            <div className={`${s.synthSlot} ${s.filled} ${slot.fromInventory ? s.fromInventory : ''}`}>
              <div className={s.slotDot} style={{ background: slot.color }}>{slot.emoji}</div>
              <div className={s.slotName}>{slot.formula}</div>
              <button
                className={s.removeBtn}
                onClick={() => dispatch({ type: 'REMOVE_FROM_SLOT', payload: { index: i } })}
              >
                ✕
              </button>
            </div>
            {i < state.currentSlots.length - 1 && <span className={s.synthPlus}>+</span>}
          </React.Fragment>
        ))}

        {state.currentSlots.length > 0 && !state.synthResult && (
          <span className={s.synthArrow}>→</span>
        )}

        {state.synthResult && (
          <div className={`${s.synthResult} ${s.revealed} ${!state.synthResult.isFinal ? s.intermediate : ''}`}>
            <div className={s.resultDot} style={{ background: state.synthResult.product.color }}>
              {state.synthResult.product.emoji}
            </div>
            <div className={s.resultName}>{state.synthResult.product.name}</div>
            <div className={s.resultFormula}>{state.synthResult.product.formula}</div>
            <div className={`${s.resultTag} ${state.synthResult.isFinal ? s.final : s.inventory}`}>
              {state.synthResult.isFinal ? '最终产物' : '→ 库存'}
            </div>
          </div>
        )}
      </div>

      <div className={s.synthActions}>
        <button className={`${s.btnSynth} ${s.hint}`} onClick={handleHint}>💡 提示</button>
        <button className={`${s.btnSynth} ${s.secondary}`} onClick={handleClear}>清空</button>
        <button className={`${s.btnSynth} ${s.primary}`} onClick={handleSynthesize} disabled={!canSynth}>🔬 合成</button>
      </div>

      {hint && (
        <div className={`${s.hintText} ${s.show}`}>{hint}</div>
      )}
    </div>
  );
}
