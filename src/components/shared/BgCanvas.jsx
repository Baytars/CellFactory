import { useRef, useEffect } from 'react';
import { useVentCanvas } from '../../hooks/useVentCanvas';
import s from '../../styles/components/shared.module.css';

export default function BgCanvas() {
  const canvasRef = useVentCanvas();
  return <canvas ref={canvasRef} className={s.bgCanvas} />;
}
