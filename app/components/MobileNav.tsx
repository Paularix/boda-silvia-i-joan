'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, Button, IconButton,
  useMediaQuery, useTheme, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';


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



export const MobileNav = ({ activeSection, onNavigate }: { activeSection: string; onNavigate: (s: string) => void }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sections = [
    { id: 'hero',   label: 'Inici',       icon: <FavoriteIcon fontSize="small" /> },
    { id: 'info',   label: 'Cerimònia',   icon: <LocationOnIcon fontSize="small" /> },
    { id: 'form',   label: 'Confirmació', icon: <ConfirmationNumberIcon fontSize="small" /> },
    { id: 'photos', label: 'Fotos',       icon: <PhotoCameraIcon fontSize="small" /> },
    { id: 'gift',   label: 'Detallet',       icon: <LocalFloristIcon fontSize="small" /> },
  ];
  const navBtn = (s: typeof sections[0]) => (
    <Button key={s.id} onClick={() => { onNavigate(s.id); setOpen(false); }} startIcon={s.icon}
      sx={{ color: activeSection === s.id ? C.roseDark : C.slateLight, fontWeight: activeSection === s.id ? 700 : 400, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: activeSection === s.id ? `2px solid ${C.rose}` : '2px solid transparent', borderRadius: 0, px: 2, py: 1.5, '&:hover': { bgcolor: 'transparent', color: C.roseDark }, transition: 'all 0.2s ease' }}>{s.label}</Button>
  );
  if (!isMobile) return (
    <Box sx={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, bgcolor: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(16px)', borderRadius: '100px', px: 2, py: 0.5, border: `1px solid rgba(196,169,154,0.25)`, boxShadow: '0 4px 24px rgba(61,53,48,0.08)' }}>
      <Box sx={{ display: 'flex', gap: 0 }}>{sections.map(navBtn)}</Box>
    </Box>
  );
  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, bgcolor: C.slate, color: C.cream, width: 52, height: 52, boxShadow: '0 4px 16px rgba(61,53,48,0.25)', '&:hover': { bgcolor: C.slateLight } }}><MenuIcon /></IconButton>
      <AnimatePresence>
        {open && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(61,53,48,0.4)', zIndex: 1001 }} onClick={() => setOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 260, background: C.white, zIndex: 1002, boxShadow: '-8px 0 32px rgba(61,53,48,0.1)' }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}><IconButton onClick={() => setOpen(false)} size="small"><CloseIcon fontSize="small" /></IconButton></Box>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.4rem', color: C.slate, mb: 3, pl: 1 }}>S & J</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {sections.map(s => (
                  <Button key={s.id} onClick={() => { onNavigate(s.id); setOpen(false); }} startIcon={s.icon} fullWidth
                    sx={{ justifyContent: 'flex-start', color: activeSection === s.id ? C.roseDark : C.slateLight, fontWeight: activeSection === s.id ? 700 : 400, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', py: 1.5, '&:hover': { bgcolor: C.cream } }}>{s.label}</Button>
                ))}
              </Box>
            </Box>
          </motion.div>
        </>}
      </AnimatePresence>
    </>
  );
};