import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import s from '../../styles/components/game.module.css';

export default function InfoPanel() {
  const { state } = useGame();
  if (state.currentLevel === null) return null;
  const lv = LEVELS[state.currentLevel];

  return (
    <div className={s.infoPanel}>
      <div className={s.infoCard}>
        <h4>📋 目标</h4>
        <ul className={s.objectiveList}>
          {lv.objectives.map((obj, i) => (
            <li key={i} className={state.completedObjectives.includes(i) ? s.objectiveItemDone : s.objectiveItem}>
              <span className={s.objCheck}>
                {state.completedObjectives.includes(i) ? '✓' : ''}
              </span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
      <div className={s.infoCard}>
        <h4>📖 背景知识</h4>
        <p>{lv.knowledge}</p>
      </div>
      {state.synthLog.length > 0 && (
        <div className={s.infoCard}>
          <h4>📝 合成日志</h4>
          {state.synthLog.map((log, i) => (
            <div key={i} className={s.synthLogItem}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
