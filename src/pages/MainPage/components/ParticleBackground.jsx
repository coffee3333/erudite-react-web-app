import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

const COUNT    = 70;   // reduced from 120 — same visual effect, ~66% less CPU
const MAX_DIST = 130;
const SPEED    = 0.3;

export default function ParticleBackground() {
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';
    const canvasRef  = useRef(null);
    const animRef    = useRef(null);
    const stateRef   = useRef({ particles: [] });
    const colorsRef  = useRef({});

    // Keep colors in a ref so draw() never needs to be recreated on theme change
    colorsRef.current = {
        dotAlpha:  isDark ? 0.4  : 0.25,
        lineAlpha: isDark ? 0.15 : 0.1,
        color:     isDark ? '108,142,255' : '80,110,220',
    };

    const initParticles = useCallback(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        stateRef.current.particles = Array.from({ length: COUNT }, () => ({
            x:  Math.random() * w,
            y:  Math.random() * h,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r:  1.2 + Math.random() * 1.6,
        }));
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    // draw never changes — colors come from colorsRef
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w   = canvas.width;
        const h   = canvas.height;
        const pts = stateRef.current.particles;
        const { dotAlpha, lineAlpha, color } = colorsRef.current;

        ctx.clearRect(0, 0, w, h);

        for (const p of pts) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx   = pts[i].x - pts[j].x;
                const dy   = pts[i].y - pts[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const a = lineAlpha * (1 - dist / MAX_DIST);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${color},${a})`;
                    ctx.lineWidth   = 0.7;
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.stroke();
                }
            }
        }

        for (const p of pts) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color},${dotAlpha})`;
            ctx.fill();
        }

        animRef.current = requestAnimationFrame(draw);
    }, []); // stable — no deps, colors read from ref each frame

    useEffect(() => {
        resize();
        initParticles();
        animRef.current = requestAnimationFrame(draw);

        const handleResize = () => { resize(); initParticles(); };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [resize, initParticles, draw]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
