'use client'
import { motion } from 'framer-motion';
import {
  Box, Typography
} from '@mui/material';
import { SectionLabel } from './SectionLabel';

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
interface InfoCardProps {
  icon: React.ReactNode;
  subtitle: string; // Tu "SectionLabel"
  title: string;    // El texto principal (ej: "16:00 hores")
  description: string; // El texto secundario (ej: "Arribeu amb temps!")
}

export const InfoCard = ({ icon, subtitle, title, description }: InfoCardProps) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      sx={{
        // FLEX 1 es la clave: todas las cajas se reparten el ancho del padre por igual
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        // Aseguramos que si el contenido es mucho, no rompa el ancho
        minWidth: { xs: '100%', sm: '250px' }, 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: { xs: 4, sm: 5 },
          bgcolor: C.white,
          borderRadius: '24px',
          border: `1px solid ${C.mist}`,
          height: '100%', // Se estira para igualar a la más alta
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: C.rose,
            boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Box sx={{ color: C.rose, mb: 2, '& svg': { fontSize: 35 } }}>
          {icon}
        </Box>

        <SectionLabel>{subtitle}</SectionLabel>

        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            fontWeight: 600,
            color: C.slate,
            mt: 1,
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            color: C.slateLight,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};