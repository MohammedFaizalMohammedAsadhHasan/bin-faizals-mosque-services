'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  type: 'bubble' | 'bokeh' | 'star';
  color: string;
  baseAlpha: number;
  alpha: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  wobbleOffset: number;
  pulseSpeed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  points?: number; // For 4-point sparkling stars
}

export const AmbientBubbles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const particles: Particle[] = [];
    const totalCount = 120; // Rich, dense, graceful atmospheric field

    // Royal Blue & Celestial Color Palettes
    const colorPalettes = [
      '56, 189, 248',  // Celestial Sapphire Cyan
      '125, 211, 252', // Soft Ice Blue
      '59, 130, 246',  // Royal Blue
      '99, 102, 241',  // Royal Indigo
      '147, 197, 253', // Light Sky Blue
      '255, 255, 255', // Pure Diamond White
      '253, 224, 71',  // Warm Celestial Gold Star
    ];

    for (let i = 0; i < totalCount; i++) {
      const pChoice = Math.random();
      let type: 'bubble' | 'bokeh' | 'star' = 'bubble';
      let baseRadius = 5;
      let speedY = -(Math.random() * 0.4 + 0.2);
      let baseAlpha = 0.35;

      if (pChoice < 0.38) {
        // Sparkling Twinkling Star
        type = 'star';
        baseRadius = Math.random() * 2.5 + 1.2;
        speedY = -(Math.random() * 0.2 + 0.05); // Very gentle ascent
        baseAlpha = Math.random() * 0.5 + 0.3;
      } else if (pChoice > 0.82) {
        // Large Glowing Bokeh Orb
        type = 'bokeh';
        baseRadius = Math.random() * 15 + 10;
        speedY = -(Math.random() * 0.2 + 0.1);
        baseAlpha = Math.random() * 0.22 + 0.1;
      } else {
        // Translucent 3D Glass Bubble
        type = 'bubble';
        baseRadius = Math.random() * 6 + 3.5;
        speedY = -(Math.random() * 0.45 + 0.25);
        baseAlpha = Math.random() * 0.45 + 0.25;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius,
        radius: baseRadius,
        type,
        color: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        baseAlpha,
        alpha: baseAlpha,
        speedY,
        speedX: (Math.random() - 0.5) * 0.2,
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        wobbleDistance: Math.random() * 2.2 + 0.8,
        wobbleOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.02,
        points: 4,
      });
    }

    let timestamp = 0;

    // Helper: Draw 4-pointed shimmering star
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();

      // Soft glow around star center
      const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius * 2);
      starGlow.addColorStop(0, `rgba(${color}, ${alpha * 0.7})`);
      starGlow.addColorStop(1, `rgba(${color}, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = starGlow;
      ctx.fill();
    };

    const render = () => {
      timestamp += 0.016;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Natural graceful bubble ascent with sinusoidal horizontal wobble
        p.y += p.speedY;
        p.x += Math.sin(timestamp * p.wobbleSpeed * 60 + p.wobbleOffset) * (p.wobbleDistance * 0.35) + p.speedX;

        // Twinkling / breathing pulse
        p.twinklePhase += p.twinkleSpeed;
        const pulse = Math.sin(p.twinklePhase);
        p.radius = p.baseRadius * (1 + pulse * 0.15);
        p.alpha = Math.max(0.06, Math.min(0.85, p.baseAlpha + pulse * 0.2));

        // Soft interactive mouse repel
        if (mouseX > -1000) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            p.x += (dx / dist) * force * 1.6;
            p.y += (dy / dist) * force * 1.6;
          }
        }

        // Screen wrap-around
        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        // Render Particle by Type
        if (p.type === 'star') {
          // 4-point twinkling star
          drawStar(p.x, p.y, 4, p.radius * 2.2, p.radius * 0.6, p.color, p.alpha);
        } else if (p.type === 'bokeh') {
          // Large luminous bokeh orb with rich radial glow
          const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
          radial.addColorStop(0, `rgba(${p.color}, ${p.alpha * 0.65})`);
          radial.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.28})`);
          radial.addColorStop(1, `rgba(${p.color}, 0)`);

          ctx.beginPath();
          ctx.fillStyle = radial;
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Mid-size realistic 3D glass bubble with refraction ring & specular shine arc
          // 1. Soft radial outer halo
          const halo = ctx.createRadialGradient(p.x, p.y, p.radius * 0.3, p.x, p.y, p.radius * 1.6);
          halo.addColorStop(0, `rgba(${p.color}, ${p.alpha * 0.15})`);
          halo.addColorStop(0.8, `rgba(${p.color}, ${p.alpha * 0.4})`);
          halo.addColorStop(1, `rgba(${p.color}, 0)`);

          ctx.beginPath();
          ctx.fillStyle = halo;
          ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
          ctx.fill();

          // 2. Bubble membrane ring
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.color}, ${p.alpha * 0.8})`;
          ctx.lineWidth = 1.3;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();

          // 3. Delicate top-left specular highlight shine
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
          ctx.lineWidth = 1.5;
          ctx.arc(
            p.x - p.radius * 0.2,
            p.y - p.radius * 0.2,
            p.radius * 0.55,
            Math.PI * 1.15,
            Math.PI * 1.65
          );
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
