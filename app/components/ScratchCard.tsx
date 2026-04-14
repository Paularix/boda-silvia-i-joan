'use client'
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button,
  useMediaQuery, useTheme
} from '@mui/material';

const C = {
  cream:      '#F5EDE0',
  linen:      '#E8D9C4',
  rose:       '#C2735A',
  roseDark:   '#A0513C',
  sage:       '#5E8A6A',
  sageDark:   '#3D6B4F',
  slate:      '#2C2118',
  slateLight: '#5C4A3E',
  mist:       '#C9BEB4',
  white:      '#FDFAF6',
};
export const ScratchCard = ({ iban, reveal, onReveal, onCopy }: { iban: string; reveal: boolean; onReveal: () => void; onCopy: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [started, setStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = isMobile ? 280 : 340; const H = 90;
    canvas.width = W; canvas.height = H;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#C4B5A8'); grad.addColorStop(0.5, '#B8A898'); grad.addColorStop(1, '#A89888');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 500; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
    if (reveal) {
      setIsScratched(true); let p = 0;
      const anim = () => { if (p < 60) { ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, 28, 0, Math.PI * 2); ctx.fill(); p++; requestAnimationFrame(anim); } else { ctx.clearRect(0, 0, W, H); onReveal?.(); } };
      anim(); return;
    }
    const scratch = (x: number, y: number) => {
      if (!started) setStarted(true);
      ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
      const d = ctx.getImageData(0, 0, W, H).data; let t = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] === 0) t++;
      if ((t / (W * H)) * 100 > 60 && !isScratched) { setIsScratched(true); onReveal?.(); }
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect(); const sx = W / rect.width; const sy = H / rect.height;
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      scratch((cx - rect.left) * sx, (cy - rect.top) * sy);
    };
    canvas.addEventListener('mousemove', onMove); canvas.addEventListener('touchmove', onMove, { passive: false }); canvas.addEventListener('touchstart', onMove);
    return () => { canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('touchmove', onMove); canvas.removeEventListener('touchstart', onMove); };
  }, [reveal, isMobile, isScratched, onReveal, started]);
  const handleCopy = () => { navigator.clipboard.writeText(iban); setCopied(true); onCopy(); setTimeout(() => setCopied(false), 2500); };
  return (
    <Box sx={{ position: 'relative', width: { xs: '280px', sm: '340px' }, mx: 'auto' }}>
      <Button onClick={handleCopy} fullWidth sx={{ bgcolor: C.white, border: `1.5px solid ${C.mist}`, borderRadius: '16px', py: 2.5, flexDirection: 'column', gap: 0.5, transition: 'all 0.3s ease', boxShadow: '0 2px 12px rgba(61,53,48,0.06)', '&:hover': { bgcolor: C.cream, transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(61,53,48,0.1)' } }}>
        <Typography sx={{ fontSize: 9, color: copied ? C.sage : C.slateLight, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{copied ? '✓ Copiat!' : 'Toca per copiar'}</Typography>
        <Typography component="code" sx={{ color: C.slate, fontWeight: 600, letterSpacing: { xs: 0.5, sm: 1.5 }, fontSize: { xs: '0.78rem', sm: '0.9rem' }, fontFamily: 'monospace', wordBreak: 'break-all' }}>{iban}</Typography>
      </Button>
      {!reveal && !isScratched && (<Box component="canvas" ref={canvasRef} sx={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', touchAction: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(61,53,48,0.12)', width: '100%', height: '100%' }} />)}
      {!started && !reveal && !isScratched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>✦ Rasca aquí ✦</Typography>
        </motion.div>
      )}
    </Box>
  );
};