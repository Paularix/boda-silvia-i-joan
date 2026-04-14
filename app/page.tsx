'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, Container, TextField, RadioGroup,
  FormControlLabel, Radio, MenuItem, Button, Snackbar, Alert,
 CircularProgress, 
} from '@mui/material';

import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { createClient } from '@supabase/supabase-js';
import { InfoCard } from './components/InfoCard';
import { SectionLabel } from './components/SectionLabel';
import { CountdownTimer } from './components/CountdownTimer';
import { ScratchCard } from './components/ScratchCard';
import { PhotoUploadSection } from './components/PhotoUploadSection';
import { Flourish } from './components/Flourish';
import { MobileNav } from './components/MobileNav';
import { CheckCircleOutline } from '@mui/icons-material';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.25, 0.46, 0.45, 0.94] as const
    } 
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.12, 
      delayChildren: 0.1 
    } 
  }
} as const;


export default function Home() {
  const [autoReveal, setAutoReveal] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({ name: '', attendance: 'si', meal: '', allergies: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [songInput, setSongInput] = useState('');
  const [songSubmitting, setSongSubmitting] = useState(false);
  const [songDone, setSongDone] = useState(false);
  const [sessionSongs, setSessionSongs] = useState<string[]>([]);
  const [allSongs, setAllSongs] = useState<{ song: string }[]>([]);

  useEffect(() => {
    const loadSongs = async () => {
      const { data } = await supabase.from('songs').select('song').order('created_at', { ascending: false });
      if (data) setAllSongs(data);
    };
    loadSongs();
  }, []);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const ibanReal = "ES12 3456 7890 1234 5678";

  const heroRef   = useRef<HTMLDivElement>(null);
  const infoRef   = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const giftRef   = useRef<HTMLDivElement>(null);
  const refs: Record<string, React.RefObject<HTMLDivElement | null>> = { hero: heroRef, info: infoRef, form: formRef, photos: photosRef, gift: giftRef };

  const scrollTo = useCallback((id: string) => {
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 220;
      for (const [key, ref] of Object.entries(refs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (y >= offsetTop && y < offsetTop + offsetHeight) { setActiveSection(key); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (formErrors[field]) setFormErrors(p => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'El nom és obligatori';
    else if (formData.name.trim().length < 3) errs.name = 'Nom massa curt';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('confirmations').insert({
        name: formData.name.trim(), attendance: formData.attendance,
        meal: formData.meal || null, allergies: formData.allergies.trim() || null,
      });
      if (error) {
        if (error.code === '23505') { setFormErrors({ name: 'Aquest nom ja ha confirmat assistència 😊' }); }
        else throw error;
        return;
      }
      setFormDone(true);
      setSnackbar({ open: true, message: `Gràcies ${formData.name}! T'esperem el 3 d'octubre 🌿`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Hi ha hagut un error. Torna-ho a intentar.', severity: 'error' });
    } finally { setIsSubmitting(false); }
  };

  const handleSongSubmit = async () => {
    if (!songInput.trim()) return;
    setSongSubmitting(true);
    const songText = songInput.trim();
    try {
      const { error } = await supabase.from('songs').insert({ song: songText });
      if (error) throw error;
      setSessionSongs(prev => [...prev, songText]);
      setAllSongs(prev => [{ song: songText }, ...prev]);
      setSongDone(true); setSongInput('');
      setTimeout(() => setSongDone(false), 2500);
    } catch {
      setSnackbar({ open: true, message: 'Error enviant la cançó. Torna-ho a intentar.', severity: 'error' });
    } finally { setSongSubmitting(false); }
  };

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: C.cream, overflowX: 'hidden', fontFamily: '"Cormorant Garamond", serif' }}>
      <MobileNav activeSection={activeSection} onNavigate={scrollTo} />

      {/* ── 1. HERO ── */}
      <Box ref={heroRef} id="hero" sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Box component="img" src="/silviaijoan.png" alt="Silvia i Joan" loading="eager" sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(247,243,238,0.15) 0%, rgba(61,53,48,0.35) 100%)', zIndex: 1 }} />
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 4 } }}>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <Box sx={{ p: { xs: 4, sm: 6 }, borderRadius: { xs: '24px', md: '28px' }, bgcolor: 'rgba(247,243,238,0.82)', backdropFilter: 'blur(1px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 64px rgba(61,53,48,0.14)', textAlign: 'center' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><SectionLabel>Ens casam!</SectionLabel></motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Typography variant="h1" sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '3.2rem', sm: '4.4rem', md: '5rem' }, fontWeight: 300, fontStyle: 'italic', color: C.slate, lineHeight: 1.05, mb: 0 }}>Silvia</Typography>
                <Typography sx={{ color: C.rose, fontSize: 13, letterSpacing: '0.4em', textTransform: 'uppercase', my: 1 }}>&amp;</Typography>
                <Typography variant="h1" sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '3.2rem', sm: '4.4rem', md: '5rem' }, fontWeight: 300, fontStyle: 'italic', color: C.slate, lineHeight: 1.05 }}>Joan</Typography>
              </motion.div>
              <Flourish />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.sage, mb: 1.5 }}>03.10.2026</Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: C.slateLight, fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.7, maxWidth: 380, mx: 'auto', mb: 4 }}>
                  &ldquo;Amb gran il·lusió, et convidem a celebrar amb nosaltres aquest dia tan especial. Que el que ha unit Maó i Ciutadella, no ho separi res ni ningú!&rdquo;
                </Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}><CountdownTimer /></motion.div>
            </Box>
          </motion.div>
        </Container>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: '18vh', background: `linear-gradient(transparent, ${C.cream})`, zIndex: 3 }} />
      </Box>

      {/* ── SECCIÓ DE INFO ── */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            // En móvil se ponen una debajo de otra, en tablet/PC en fila
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3,
            // alignItems STRETCH obliga a que todas tengan el mismo alto que la más alta
            alignItems: 'stretch', 
            justifyContent: 'center',
            mt: 6
          }}
        >
          <InfoCard 
            icon={<AccessTimeIcon />} 
            subtitle="Hora" 
            title="16:00 hores" 
            description="Arribeu amb temps per no perdre-us res!" 
          />
          <InfoCard 
            icon={<LocationOnIcon />} 
            subtitle="Lloc" 
            title="Finca de Binimazoch" 
            description="Es Mercadal, Menorca. Hi ha parking disponible." 
          />
          <InfoCard 
            icon={<MusicNoteIcon />} 
            subtitle="Festa" 
            title="Fins que aguanti es cos!" 
            description="Prepareu les sabates de ball." 
          />
        </Box>
      </Container>

      {/* ── 3. FORM ── */}
      <Box ref={formRef} id="form" sx={{ py: { xs: 10, md: 14 }, bgcolor: C.white, borderTop: `1px solid ${C.linen}`, borderBottom: `1px solid ${C.linen}` }}>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <SectionLabel>Confirmació</SectionLabel>
              <Typography variant="h2" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontStyle: 'italic', fontSize: { xs: '2.2rem', sm: '3rem' }, color: C.slate, mb: 1.5 }}>Ens acompanyes a celebrar-ho?</Typography>
              <Typography sx={{ color: C.slateLight, fontSize: '0.9rem' }}>Confirmar abans del 30 d&apos;agost</Typography>
            </Box>
            <AnimatePresence mode="wait">
              {formDone ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircleOutline sx={{ fontSize: 64, color: C.sage, mb: 2 }} />
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.5rem', color: C.slate, mb: 1 }}>Gràcies, {formData.name}!</Typography>
                    <Typography sx={{ color: C.slateLight, fontSize: '0.9rem' }}>Hem rebut la teva confirmació. Ens veiem el 3 d&apos;octubre 🌿</Typography>
                  </Box>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <TextField label="Nom i llinatges" variant="standard" fullWidth required value={formData.name} onChange={e => handleChange('name', e.target.value)} error={!!formErrors.name} helperText={formErrors.name}
                      InputLabelProps={{ sx: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: C.slateLight, fontFamily: 'inherit' } }}
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: C.rose }, '& .MuiInput-underline:before': { borderBottomColor: C.mist } }} />
                    <Box>
                      <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 1.5, color: C.slateLight }}>Podeu venir?</Typography>
                      <RadioGroup row value={formData.attendance} onChange={e => handleChange('attendance', e.target.value)}>
                        {[{ v: 'si', l: 'Sí, i tant!' }, { v: 'no', l: 'No podrem' }].map(opt => (
                          <FormControlLabel key={opt.v} value={opt.v} label={opt.l} control={<Radio sx={{ color: C.mist, '&.Mui-checked': { color: C.rose } }} />}
                            sx={{ '& .MuiFormControlLabel-label': { fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.05rem', color: C.slate } }} />
                        ))}
                      </RadioGroup>
                    </Box>
                    <TextField select label="Plat principal" variant="standard" value={formData.meal || ''} onChange={e => handleChange('meal', e.target.value)}
                      InputLabelProps={{ sx: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: C.slateLight, fontFamily: 'inherit' } }}
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: C.rose }, '& .MuiInput-underline:before': { borderBottomColor: C.mist } }}
                      SelectProps={{ displayEmpty: true, renderValue: (v) => { if (!v) return <span style={{ color: C.mist, fontStyle: 'italic' }}>Selecciona un plat…</span>; const map: Record<string, string> = { carn: '🥩 Arròs de carn', peix: '🦞 Arròs de llamàntol', negre: '🖤 Arròs negre', vege: '🥬 Arròs de verdura' }; return (map[v as string] || v) as React.ReactNode; } }}>
                      <MenuItem value="" disabled><em style={{ color: C.mist }}>Selecciona un plat…</em></MenuItem>
                      <MenuItem value="carn">🥩 Arròs de carn</MenuItem>
                      <MenuItem value="peix">🦞 Arròs de llamàntol</MenuItem>
                      <MenuItem value="negre">🖤 Arròs negre</MenuItem>
                      <MenuItem value="vege">🥬 Arròs de verdura</MenuItem>
                    </TextField>
                    <TextField label="Al·lèrgies o restriccions" variant="standard" fullWidth multiline rows={2} value={formData.allergies} onChange={e => handleChange('allergies', e.target.value)}
                      InputLabelProps={{ sx: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: C.slateLight, fontFamily: 'inherit' } }}
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: C.rose }, '& .MuiInput-underline:before': { borderBottomColor: C.mist } }} />
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        <Button type="submit" variant="contained" disabled={isSubmitting}
                          sx={{ bgcolor: C.slate, color: C.cream, py: 1.8, px: 5, borderRadius: '100px', fontSize: 10, fontFamily: 'inherit', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, minWidth: 260, '&:hover': { bgcolor: C.slateLight }, '&:disabled': { bgcolor: C.mist, color: C.white }, boxShadow: '0 4px 20px rgba(61,53,48,0.16)' }}>
                          {isSubmitting ? <CircularProgress size={18} sx={{ color: C.white }} /> : 'Confirmar Assistència'}
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </Box>

      {/* ── 4. CANÇONS ── */}
      <Box sx={{ py: { xs: 10, md: 12 }, bgcolor: C.linen }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <SectionLabel>Playlist</SectionLabel>
              <Typography variant="h2" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontStyle: 'italic', fontSize: { xs: '2.2rem', sm: '3rem' }, color: C.slate, mb: 1.5 }}>Cançons que no poden faltar</Typography>
              <Typography sx={{ color: C.slateLight, fontSize: '0.9rem' }}>Proposa totes les cançons que vulguis. Pots afegir-ne tantes com vulguis!</Typography>
            </Box>
            <Box sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', border: `1px solid ${C.mist}`, bgcolor: C.white, boxShadow: '0 4px 24px rgba(61,53,48,0.06)', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <MusicNoteIcon sx={{ color: C.rose, mb: 0.5, flexShrink: 0 }} />
                <TextField fullWidth variant="standard" placeholder="Ex: 'Despacito' de Luis Fonsi…"
                  value={songInput} onChange={e => { setSongInput(e.target.value); setSongDone(false); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSongSubmit(); } }}
                  InputProps={{ sx: { fontSize: '1rem', fontFamily: '"Cormorant Garamond", serif', color: C.slate } }}
                  sx={{ '& .MuiInput-underline:after': { borderBottomColor: C.rose } }} />
              </Box>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <AnimatePresence mode="wait">
                  {songDone ? (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: C.sage }}>
                        <CheckCircleOutline fontSize="small" />
                        <Typography sx={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Afegida! Escriu una altra si vols 🎵</Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div key="btn">
                      <Button variant="outlined" onClick={handleSongSubmit} disabled={songSubmitting || !songInput.trim()}
                        sx={{ color: C.sage, borderColor: C.sage, borderRadius: '100px', px: 4, py: 1.2, fontSize: 10, fontFamily: 'inherit', letterSpacing: '0.2em', textTransform: 'uppercase', '&:hover': { borderColor: C.sageDark, color: C.sageDark, bgcolor: 'transparent' }, '&:disabled': { borderColor: C.mist, color: C.mist } }}>
                        {songSubmitting ? <CircularProgress size={16} sx={{ color: C.sage }} /> : '+ Afegir Cançó'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
              <AnimatePresence>
                {sessionSongs.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                    <Box sx={{ mt: 4, pt: 3, borderTop: `1px dashed ${C.mist}` }}>
                      <Typography sx={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.mist, mb: 2 }}>Les teves propostes · {sessionSongs.length}</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {sessionSongs.map((s, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: C.linen, borderRadius: '100px', px: 2, py: 0.8 }}>
                              <MusicNoteIcon sx={{ fontSize: 12, color: C.rose }} />
                              <Typography sx={{ fontSize: 12, color: C.slateLight, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>{s}</Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            <AnimatePresence>
              {allSongs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography sx={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight }}>
                      {allSongs.length} cançó{allSongs.length !== 1 ? 'ns' : ''} a la playlist · Segueix creixent!
                    </Typography>
                  </Box>
                  {[0, 1].map(row => (
                    <Box key={row} sx={{ overflow: 'hidden', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 2, animation: `marquee${row === 1 ? 'Rev' : ''} ${Math.max(18, allSongs.length * 3)}s linear infinite`, '@keyframes marquee': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } }, '@keyframes marqueeRev': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } }, width: 'max-content' }}>
                        {[...allSongs, ...allSongs].map((s, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: i % 3 === 0 ? C.white : i % 3 === 1 ? 'rgba(94,138,106,0.1)' : 'rgba(194,115,90,0.08)', border: `1px solid ${i % 3 === 0 ? C.mist : i % 3 === 1 ? 'rgba(94,138,106,0.25)' : 'rgba(194,115,90,0.2)'}`, borderRadius: '100px', px: 2.5, py: 1.2, flexShrink: 0, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(61,53,48,0.04)' }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i % 3 === 0 ? C.mist : i % 3 === 1 ? C.sage : C.rose, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: C.slateLight, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>{s.song}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </Box>

      {/* ── 5. RECOMANACIONS ── */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: C.cream }}>
        <Container maxWidth="lg">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            
            {/* Cabecera de la sección */}
            <motion.div variants={fadeUp}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <SectionLabel>Detalls Pràctics</SectionLabel>
                <Typography variant="h2" sx={{ 
                  fontFamily: '"Cormorant Garamond", serif', 
                  fontWeight: 300, 
                  fontStyle: 'italic', 
                  fontSize: { xs: '2.2rem', sm: '3rem' }, 
                  color: C.slate 
                }}>
                  Recomanacions
                </Typography>
              </Box>
            </motion.div>

            {/* CONTENEDOR FLEX: Sustituye al Grid */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Columna en móvil, fila en PC
                gap: 3,                                    // Espacio uniforme entre cajas
                alignItems: 'stretch',                     // CLAVE: Fuerza igual altura
                justifyContent: 'center',
                flexWrap: 'wrap'                           // Permite bajar a la siguiente línea si es necesario
              }}
            >
              <InfoCard 
                icon={<LocalFloristIcon />} 
                subtitle="Dress Code" 
                title="Al teu estil" 
                description="L'important és que vinguis còmode i amb ganes de xalar. No hi ha regles, vine com et sentis millor." 
              />
              
              <InfoCard 
                icon={<WbSunnyIcon />} 
                subtitle="Clima" 
                title="Octubre a Menorca" 
                description="Durant el dia sol fer bon temps, però refresca per es vespre. No t'oblidis d'agafar una jaqueta!" 
              />
              
              <InfoCard 
                icon={<PhotoCameraIcon />} 
                subtitle="Fotos" 
                title="Comparteix el moment" 
                description="Fes servir l'etiqueta #BodaSilvia&Joan a les teves xarxes o puja-les directament a la nostra galeria." 
              />
            </Box>

          </motion.div>
        </Container>
      </Box>

      {/* ── 6. FOTOS ── */}
      <Box ref={photosRef} id="photos" sx={{ py: { xs: 10, md: 14 }, bgcolor: C.white, borderTop: `1px solid ${C.linen}` }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <SectionLabel>Galeria</SectionLabel>
              <Typography variant="h2" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontStyle: 'italic', fontSize: { xs: '2.2rem', sm: '3rem' }, color: C.slate, mb: 1.5 }}>Ses vostres instantàneas</Typography>
              <Typography sx={{ color: C.slateLight, fontSize: '0.95rem', maxWidth: 460, mx: 'auto', lineHeight: 1.8 }}>
                Comparteix els moments que has viscut. Les fotos es compartirán més endavant a una carpeta compartida.
              </Typography>
            </Box>
            <PhotoUploadSection />
          </motion.div>
        </Container>
      </Box>

      {/* ── 7. REGAL ── */}
      <Box ref={giftRef} id="gift" sx={{ py: { xs: 10, md: 14 }, textAlign: 'center', bgcolor: C.linen, borderTop: `1px solid ${C.linen}` }}>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>Un detallet</SectionLabel>
            <Typography variant="h2" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontStyle: 'italic', fontSize: { xs: '2.2rem', sm: '3rem' }, color: C.slate, mb: 1.5 }}>Per a nosaltres, el millor regal</Typography>
            <Typography sx={{ color: C.slateLight, fontStyle: 'italic', fontSize: '1rem', maxWidth: 380, mx: 'auto', mb: 5, lineHeight: 1.8 }}>
...és compartir aquest dia amb vosaltres. Si tot i així ens voleu ajudar, aquí teniu els detalls            </Typography>
            <Flourish color={C.sage} />
            <Box sx={{ mt: 4 }}>
              <ScratchCard iban={ibanReal} reveal={autoReveal} onReveal={() => setAutoReveal(true)}
                onCopy={() => setSnackbar({ open: true, message: 'IBAN copiat al porta-retalls! 🌿', severity: 'success' })} />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box component="footer" sx={{ py: { xs: 6, md: 8 }, textAlign: 'center', bgcolor: C.slate }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: { xs: '1.8rem', sm: '2.4rem' }, color: C.cream, letterSpacing: '0.2em', fontWeight: 300, mb: 1.5 }}>Silvia & Joan</Typography>
          <Flourish color={C.rose} />
          <Typography sx={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(237,230,218,0.45)', mt: 1 }}>Fet amb ♡ per Paula · 2026</Typography>
        </motion.div>
      </Box>

      {/* ── SNACKBAR ── */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontFamily: '"Cormorant Garamond", serif' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
