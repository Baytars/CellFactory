import React from 'react';
import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import { getChainSteps, getCurrentStepIndex, getLevelProgress } from '../../engine/selectors';
import SynthesisArea from './SynthesisArea';
import s from '../../styles/components/game.module.css';

export default function Workspace() {
  const { state } = useGame();
  if (state.currentLevel === null) return null;

  const lv = LEVELS[state.currentLevel];
  const chainSteps = getChainSteps(state);
  const currentStepIdx = getCurrentStepIndex(state);
  const progress = getLevelProgress(state);

  // Detect epoch for environment display
  const isEpoch2 = lv.id.startsWith('2-');

  return (
    <div className={s.workspace}>
      <div className={s.envDisplay}>
        {isEpoch2 ? (
          <>
            <div className={s.envItem}><span>🍬 葡萄糖</span>底物</div>
            <div className={s.envItem}><span>💰 ATP</span>货币</div>
            <div className={s.envItem}><span>🔋 NAD⁺</span>辅酶</div>
          </>
        ) : (
          <>
            <div className={s.envItem}><span>🌡️ 100°C</span>温度</div>
            <div className={s.envItem}><span>⬇️ 高压</span>压力</div>
            <div className={s.envItem}><span>🪨 FeS</span>催化</div>
          </>
        )}
      </div>

      <div className={s.progressBar}>
        <div className={s.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {chainSteps.length > 1 && (
        <div className={s.chainIndicator} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {chainSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div
                className={`${s.chainStep} ${i === currentStepIdx ? s.active : ''} ${step.isDone ? s.done : ''}`}
                style={step.isRateLimiting ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}}
              >
                {step.isRateLimiting && '★'}{step.label}
              </div>
              {i < chainSteps.length - 1 && <span className={s.chainArrow}>→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      <SynthesisArea />
    </div>
  );
}
