import { useDraggable } from '@dnd-kit/core';
import s from '../../styles/components/game.module.css';

export default function ReagentItem({ reagent, fromInventory = false, count }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reagent-${reagent.id}${fromInventory ? '-inv' : ''}`,
    data: { reagentId: reagent.id, fromInventory, reagent },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${s.reagentItem} ${fromInventory ? s.fromInventory : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={s.reagentDot} style={{ background: reagent.color }}>
        {reagent.emoji}
      </div>
      <div>
        <div className={s.reagentName}>{reagent.name}</div>
        <div className={s.reagentFormula}>{reagent.formula}</div>
      </div>
      {fromInventory && count > 0 && (
        <div className={s.reagentCount}>×{count}</div>
      )}
    </div>
  );
}
