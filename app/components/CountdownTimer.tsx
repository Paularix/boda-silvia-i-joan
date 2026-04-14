import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
export const CountdownTimer = () => {
  const targetDate = new Date('2026-10-03T16:00:00');
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff > 0) setTimeLeft({ Dies: Math.floor(diff / 86400000), Hores: Math.floor((diff / 3600000) % 24), Minuts: Math.floor((diff / 60000) % 60), Segons: Math.floor((diff / 1000) % 60) });
    };
    calc(); const t = setInterval(calc, 1000); return () => clearInterval(t);
  }, []);
  return (
    <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div key={unit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: { xs: 62, sm: 80 }, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)', border: `1px solid rgba(196,169,154,0.3)`, borderRadius: '16px', py: { xs: 1.5, sm: 2.5 }, px: { xs: 1, sm: 2 } }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: { xs: '1.7rem', sm: '2.4rem' }, color: C.slate, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {String(value).padStart(2, '0')}
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: '0.18em', color: C.slateLight, mt: 0.5, textTransform: 'uppercase' }}>{unit}</Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};