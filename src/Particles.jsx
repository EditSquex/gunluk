import React, { useEffect, useRef } from 'react';

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors = ['#ffffff'],
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateBounds = () => {
      const dpr = pixelRatio || window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    updateBounds();

    const handleResize = () => {
      updateBounds();
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Generate particles adhering to props
    const particles = Array.from({ length: particleCount }).map(() => {
      const color = particleColors[Math.floor(Math.random() * particleColors.length)] || '#ffffff';
      const baseR = (particleBaseSize / 50) * (1 + (Math.random() - 0.5) * sizeRandomness);
      return {
        x: (Math.random() - 0.5) * width * (particleSpread / 5),
        y: (Math.random() - 0.5) * height * (particleSpread / 5),
        z: Math.random() * cameraDistance,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        radius: Math.max(0.5, baseR),
        color,
        alpha: alphaParticles ? Math.random() * 0.7 + 0.3 : 1
      };
    });

    let rotationAngle = 0;

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!disableRotation) {
        rotationAngle += 0.001 * speed;
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        const maxSpreadX = (w * particleSpread) / 2;
        const maxSpreadY = (h * particleSpread) / 2;

        if (p.x < -maxSpreadX) p.x = maxSpreadX;
        if (p.x > maxSpreadX) p.x = -maxSpreadX;
        if (p.y < -maxSpreadY) p.y = maxSpreadY;
        if (p.y > maxSpreadY) p.y = -maxSpreadY;

        // Apply rotation simulation
        let rotX = p.x;
        let rotY = p.y;
        if (!disableRotation) {
          const cos = Math.cos(rotationAngle);
          const sin = Math.sin(rotationAngle);
          rotX = p.x * cos - p.y * sin;
          rotY = p.x * sin + p.y * cos;
        }

        let finalX = w / 2 + rotX;
        let finalY = h / 2 + rotY;

        // Mouse hover interaction
        if (moveParticlesOnHover && mouseRef.current.isHovered) {
          const dx = mouseRef.current.x - finalX;
          const dy = mouseRef.current.y - finalY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            finalX -= (dx / dist) * force * 20 * particleHoverFactor;
            finalY -= (dy / dist) * force * 20 * particleHoverFactor;
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(finalX, finalY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 w-full h-full" 
    />
  );
}
