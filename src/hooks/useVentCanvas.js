// ========================================
//  useVentCanvas.js — 深海热泉背景动画 Hook
//  从 bg.js 迁移，用 useRef/useEffect 管理 Canvas
// ========================================

import { useRef, useEffect, useCallback } from 'react';

export function useVentCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 1.5 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.6 ? '#ff6b35' : (Math.random() > 0.5 ? '#4ecdc4' : '#ffe66d');
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }
      update() {
        this.x += this.speedX + Math.sin(this.life * 0.02) * 0.3;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -20) this.reset();
      }
      draw() {
        const fade = this.life < 30 ? this.life / 30 :
          (this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1);
        ctx.globalAlpha = this.opacity * fade;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles spread across screen
    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function drawVent() {
      const cx = canvas.width * 0.5, by = canvas.height;
      const grad = ctx.createRadialGradient(cx, by, 10, cx, by - 100, 300);
      grad.addColorStop(0, 'rgba(255, 107, 53, 0.12)');
      grad.addColorStop(0.5, 'rgba(255, 140, 66, 0.04)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height - 300, canvas.width, 300);
      // Chimney shapes
      ctx.fillStyle = 'rgba(40, 30, 20, 0.8)';
      ctx.beginPath(); ctx.moveTo(cx-60,by); ctx.lineTo(cx-30,by-80); ctx.lineTo(cx-20,by-80); ctx.lineTo(cx-10,by); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+10,by); ctx.lineTo(cx+20,by-60); ctx.lineTo(cx+30,by-60); ctx.lineTo(cx+60,by); ctx.fill();
    }

    function animateBg() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#050810');
      bgGrad.addColorStop(0.6, '#0a0e1a');
      bgGrad.addColorStop(1, '#12100e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawVent();
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animateBg);
    }
    animateBg();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return canvasRef;
}
