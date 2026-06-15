import { useGame } from '../../context/GameContext';
import { useNarrative } from '../../hooks/useNarrative';
import s from '../../styles/components/shared.module.css';

export default function NarrativeBox() {
  const { state, dispatch } = useGame();
  const { narrativeQueue, narrativeIndex } = state;
  const { displayedText, isTyping, isComplete, currentEntry, skipTyping } = useNarrative(narrativeQueue, narrativeIndex);

  if (narrativeQueue.length === 0 || isComplete) return null;

  const handleAdvance = () => {
    if (isTyping) {
      skipTyping();
    } else {
      dispatch({ type: 'ADVANCE_NARRATIVE' });
    }
  };

  return (
    <div className={s.narrativeBox}>
      <div className={s.narrativeText}>
        {currentEntry?.speaker && <span className={s.narrator}>{currentEntry.speaker}：</span>}
        {displayedText}
      </div>
      <button className={s.narrativeContinue} onClick={handleAdvance}>
        继续 ▸
      </button>
    </div>
  );
}
