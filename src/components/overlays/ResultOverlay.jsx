import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import s from '../../styles/components/overlays.module.css';

export default function ResultOverlay({ onNavigate }) {
  const { state, dispatch } = useGame();
  if (!state.overlay || state.overlay.type !== 'result') return null;

  const { stars, nextIdx, hintCount, successCount } = state.overlay.data;
  const hasNextLevel = nextIdx < LEVELS.length;

  const handleNextLevel = () => {
    dispatch({ type: 'HIDE_OVERLAY' });
    dispatch({ type: 'INIT_LEVEL', payload: { levelIdx: nextIdx } });
  };

  const handleBackToLevels = () => {
    dispatch({ type: 'HIDE_OVERLAY' });
    onNavigate('levels');
  };

  return (
    <div className={s.overlay}>
      <div className={s.resultContent}>
        <div className={s.resultIcon}>🎉</div>
        <div className={s.resultTitle}>关卡完成！</div>
        <div className={s.resultSubtitle}>你成功合成了目标产物</div>
        <div className={s.resultStars}>
          {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
        </div>
        <div className={s.resultStats}>
          <div className={s.statBox}>
            <div className={s.statVal}>{stars}</div>
            <div className={s.statLabel}>星级</div>
          </div>
          <div className={s.statBox}>
            <div className={s.statVal}>{successCount}</div>
            <div className={s.statLabel}>合成次数</div>
          </div>
          <div className={s.statBox}>
            <div className={s.statVal}>{hintCount}</div>
            <div className={s.statLabel}>使用提示</div>
          </div>
        </div>
        <div className={s.resultActions}>
          {hasNextLevel ? (
            <button className={s.btnNext} onClick={handleNextLevel}>
              下一关 →
            </button>
          ) : null}
          <button className={s.btnResultBack} onClick={handleBackToLevels}>返回关卡</button>
        </div>
      </div>
    </div>
  );
}
