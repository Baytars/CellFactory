import { useGame } from '../../context/GameContext';
import { LEVELS } from '../../data/levels';
import ReagentItem from './ReagentItem';
import s from '../../styles/components/game.module.css';

export default function ReagentPanel() {
  const { state } = useGame();
  if (state.currentLevel === null) return null;
  const lv = LEVELS[state.currentLevel];

  const inventoryItems = Object.values(state.inventory);

  return (
    <div className={s.reagentPanel}>
      <div className={s.panelTitle}>🪨 环境原料</div>
      {lv.reagents.map(r => (
        <ReagentItem key={r.id} reagent={r} fromInventory={false} />
      ))}
      <div className={s.panelDivider} />
      <div className={`${s.panelTitle} ${s.inventory}`}>🧪 已合成产物</div>
      {inventoryItems.length === 0 ? (
        <div className={s.inventoryEmpty}>尚无产物</div>
      ) : (
        inventoryItems.map(item => (
          <ReagentItem
            key={item.id}
            reagent={item}
            fromInventory={true}
            count={item.count}
          />
        ))
      )}
    </div>
  );
}
