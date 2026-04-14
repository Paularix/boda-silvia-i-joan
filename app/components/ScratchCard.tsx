'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const C = {
  cream:      '#F5EDE0',
  rose:       '#C2735A',
  sage:       '#5E8A6A',
  slate:      '#2C2118',
  slateLight: '#5C4A3E',
  mist:       '#C9BEB4',
  white:      '#FDFAF6',
};

export const ScratchCard = ({ iban, onCopy }: { iban: string; onCopy: () => void }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const plainIban = iban.replace(/\s/g, '');
    const textArea = document.createElement("textarea");
    textArea.value = plainIban;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <Box sx={{ position: 'relative', width: { xs: '280px', sm: '340px' }, mx: 'auto', height: '90px' }}>
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          // --- CAPA INICIAL: EL REGALO ---
          <motion.div
            key="gift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ height: '100%' }}
          >
            <Button
              fullWidth
              onClick={() => setIsRevealed(true)}
              sx={{
                height: '100%',
                bgcolor: '#B8A898', // Color cobre/gris elegante
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#A89888' }
              }}
            >
              <CardGiftcardIcon sx={{ fontSize: 28, mb: 0.5 }} />
            </Button>
          </motion.div>
        ) : (
          // --- CAPA FINAL: EL BOTÓN DE COPIAR ---
          <motion.div
            key="copy-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ height: '100%' }}
          >
            <Button
              fullWidth
              onClick={handleCopy}
              sx={{
                height: '100%',
                bgcolor: C.white,
                border: `2px solid ${copied ? C.sage : C.mist}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: C.cream }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {copied ? null : <ContentCopyIcon sx={{ fontSize: 14, color: C.slateLight }} />}
                <Typography sx={{ fontSize: 10, color: copied ? C.sage : C.slateLight, fontWeight: 700, letterSpacing: '0.1em' }}>
                  {copied ? '✓ COPIAT!' : 'TOCA PER COPIAR'}
                </Typography>
              </Box>
              <Typography sx={{ color: C.slate, fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontFamily: 'monospace' }}>
                {iban}
              </Typography>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};