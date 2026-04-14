import { Box } from '@mui/material';
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
export const Flourish = ({ color = C.rose }: { color?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 3 }}>
    <Box sx={{ height: '1px', width: 48, bgcolor: color, opacity: 0.5 }} />
    <Box component="span" sx={{ color, fontSize: 10, opacity: 0.7 }}>✦</Box>
    <Box sx={{ height: '1px', width: 48, bgcolor: color, opacity: 0.5 }} />
  </Box>
);