import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import s from '../../styles/components/shared.module.css';

export default function Toast() {
  const { state, dispatch } = useGame();
  const toast = state.toast;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch({ type: 'SHOW_TOAST', payload: null }), 2500);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  return (
    <div className={`${s.toast} ${s[toast.type] || s.info} ${s.show}`}>
      {toast.message}
    </div>
  );
}
