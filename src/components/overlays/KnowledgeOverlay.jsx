import { useGame } from '../../context/GameContext';
import s from '../../styles/components/overlays.module.css';

export default function KnowledgeOverlay() {
  const { state, dispatch } = useGame();
  if (!state.overlay || state.overlay.type !== 'knowledge') return null;

  const kc = state.overlay.data;

  const handleContinue = () => {
    dispatch({ type: 'HIDE_OVERLAY' });
    dispatch({ type: 'FINISH_LEVEL' });
  };

  return (
    <div className={s.overlay}>
      <div className={s.knowledgeCard}>
        <div className={s.kcIcon} style={{ background: kc.iconBg }}>{kc.icon}</div>
        <div className={s.kcTitle}>{kc.title}</div>
        <div className={s.kcSubtitle}>{kc.subtitle}</div>
        <div className={s.kcScroll}>
          <div className={s.kcBody} dangerouslySetInnerHTML={{ __html: kc.body }} />
          {kc.note && (
            <div className={s.kcNote}>{kc.note}</div>
          )}
          {kc.medLink && (
            <div className={s.kcMedLink}>
              <h5>{kc.medLink.title}</h5>
              <p>{kc.medLink.text}</p>
            </div>
          )}
        </div>
        <button className={s.btnContinue} onClick={handleContinue}>继续</button>
      </div>
    </div>
  );
}
