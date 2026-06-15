import { useEffect, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import { isLevelComplete } from '../../engine/selectors';
import ReagentPanel from '../game/ReagentPanel';
import Workspace from '../game/Workspace';
import InfoPanel from '../game/InfoPanel';
import s from '../../styles/components/game.module.css';
import ss from '../../styles/components/shared.module.css';

export default function GameScreen({ onNavigate }) {
  const { state, dispatch } = useGame();
  const [activeDrag, setActiveDrag] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handle synthesis feedback lifecycle
  useEffect(() => {
    if (state.synthFeedback === 'wrong') {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_SYNTH_FEEDBACK' }), 800);
      return () => clearTimeout(t);
    }
    if (state.synthFeedback === 'correct' && state.synthResult) {
      const t1 = setTimeout(() => {
        dispatch({ type: 'CLEAR_SYNTH_FEEDBACK' });
        if (state.synthResult?.isFinal) {
          // Level complete — show knowledge card first, then result
          const lv = LEVELS[state.currentLevel];
          dispatch({ type: 'SHOW_OVERLAY', payload: { type: 'knowledge', data: lv.knowledgeCard } });
        }
      }, 1200);
      return () => clearTimeout(t1);
    }
  }, [state.synthFeedback, state.synthResult?.isFinal]);

  // Check level completion
  useEffect(() => {
    if (isLevelComplete(state) && !state.overlay) {
      const lv = LEVELS[state.currentLevel];
      // Knowledge card was shown, now finish
    }
  }, [state.completedObjectives.length]);

  if (state.currentLevel === null) return null;
  const lv = LEVELS[state.currentLevel];

  const handleDragStart = (event) => {
    // @dnd-kit 的 data 是 DataRef 对象，实际数据在 .current 中
    const data = event.active.data.current;
    setActiveDrag(data);
  };

  const handleDragEnd = (event) => {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over || over.id !== 'synthesis-area') return;

    const { reagentId, fromInventory } = active.data.current;
    dispatch({ type: 'ADD_TO_SLOT', payload: { reagentId, fromInventory } });
  };

  const handleExit = () => {
    dispatch({ type: 'CLEAR_SLOTS' });
    onNavigate('levels');
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={s.gameScreen}>
        <div className={s.gameTopBar}>
          <div className={s.gameLevelInfo}>
            <button className={ss.btnBack} onClick={handleExit}>← 退出</button>
            <div className={s.gameLevelName}>{lv.name}</div>
            <div className={s.gameLevelTitle}>{lv.title}</div>
          </div>
          <div className={s.gameProgressText}>
            {state.completedObjectives.length}/{lv.objectives.length} 目标
          </div>
        </div>
        <div className={s.gameBody}>
          <ReagentPanel />
          <Workspace />
          <InfoPanel />
        </div>
      </div>
      <DragOverlay>
        {activeDrag ? (
          <div className={`${ss.dragOverlay} ${activeDrag.fromInventory ? ss.fromInventory : ''}`}>
            {activeDrag.reagent.emoji} {activeDrag.reagent.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
