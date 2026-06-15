import { useGame } from '../../context/GameContext';
import { getLevelsWithUnlock } from '../../engine/selectors';
import s from '../../styles/components/screens.module.css';
import ss from '../../styles/components/shared.module.css';

const EPOCHS = [
  { id: '1', title: '🌋 纪元一：化学黎明', desc: '在热泉口合成最初的有机分子' },
  { id: '2', title: '🔥 纪元二：自催化之火', desc: '建立第一条代谢产线——糖酵解' },
];

export default function LevelScreen({ onNavigate }) {
  const { state, dispatch } = useGame();
  const levels = getLevelsWithUnlock(state);

  const handleStartLevel = (levelIdx) => {
    dispatch({ type: 'INIT_LEVEL', payload: { levelIdx } });
    onNavigate('game');
  };

  // Group levels by epoch
  const epochGroups = EPOCHS.map(epoch => ({
    ...epoch,
    levels: levels
      .map((lv, i) => ({ ...lv, originalIndex: i }))
      .filter(lv => lv.id.startsWith(epoch.id + '-')),
  }));

  return (
    <div className={s.levelScreen}>
      <div className={s.levelHeader}>
        <h2>选择关卡</h2>
        <p>从热泉起源到代谢产线</p>
      </div>

      {epochGroups.map(epoch => (
        <div key={epoch.id} style={{ width: '100%', maxWidth: 900, marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, color: 'var(--vent-warm)', marginBottom: 2 }}>
              {epoch.title}
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>{epoch.desc}</p>
          </div>
          <div className={s.levelGrid}>
            {epoch.levels.map(lv => (
              <div
                key={lv.id}
                className={`${s.levelCard} ${!lv.unlocked ? s.locked : ''}`}
                onClick={() => lv.unlocked && handleStartLevel(lv.originalIndex)}
              >
                <div className={s.levelNum}>{lv.name}</div>
                <div className={s.levelTitle}>{lv.title}</div>
                <div className={s.levelDesc}>{lv.desc}</div>
                <div className={s.levelStars}>
                  {'★'.repeat(lv.stars)}{'☆'.repeat(3 - lv.stars)}
                </div>
                {!lv.unlocked ? (
                  <div className={s.levelLocked}>🔒 完成上一关解锁</div>
                ) : (
                  <div className={s.levelReward}>🔬 解锁：{lv.knowledgeCard.title.split(' ')[0]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className={ss.btnBack} onClick={() => onNavigate('title')} style={{ marginTop: 16 }}>
        ← 返回
      </button>
    </div>
  );
}
