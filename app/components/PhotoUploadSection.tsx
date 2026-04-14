'use client'
import { useState, useRef} from 'react';
import {
  Box, Typography, Snackbar, Alert,
 CircularProgress, LinearProgress
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const BUCKET = 'wedding-photos';

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
export const PhotoUploadSection = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [snack, setSnack] = useState({ open: false, msg: '', ok: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArr.length) return;
    setUploading(true); setUploadProgress(0);
    let done = 0;
    for (const file of fileArr) {
      const ext = file.name.split('.').pop();
      const fileName = `photo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from(BUCKET).upload(fileName, file, { cacheControl: '3600', upsert: false });
      done++; setUploadProgress(Math.round((done / fileArr.length) * 100));
    }
    setUploading(false); setUploadProgress(0);
    setUploadedCount(prev => prev + done);
    setSnack({ open: true, msg: `${done} foto${done > 1 ? 's' : ''} pujada${done > 1 ? 's' : ''} amb èxit! 📸`, ok: true });
  };

  return (
    <Box>
      <Box
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{ border: `2px dashed ${dragOver ? C.rose : C.mist}`, borderRadius: '24px', p: { xs: 6, sm: 8 }, textAlign: 'center', cursor: uploading ? 'default' : 'pointer', bgcolor: dragOver ? `rgba(194,115,90,0.05)` : C.white, transition: 'all 0.25s ease',
          '&:hover': !uploading ? { borderColor: C.rose, bgcolor: `rgba(194,115,90,0.04)`, transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(61,53,48,0.08)' } : {} }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { if (e.target.files?.length) uploadFiles(e.target.files); }} />
        {uploading ? (
          <Box>
            <CircularProgress size={44} sx={{ color: C.rose, mb: 2 }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: C.slateLight, mb: 2 }}>Pujant les fotos…</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ maxWidth: 260, mx: 'auto', borderRadius: 4, height: 6, bgcolor: C.linen, '& .MuiLinearProgress-bar': { bgcolor: C.rose, borderRadius: 4 } }} />
            <Typography sx={{ fontSize: 12, color: C.mist, mt: 1 }}>{uploadProgress}%</Typography>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 52, color: uploadedCount > 0 ? C.sage : C.mist, mb: 2, transition: 'color 0.3s' }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: { xs: '1.2rem', sm: '1.5rem' }, color: C.slate, mb: 1 }}>
              {uploadedCount > 0 ? 'Puja més fotos' : 'Puja les teves fotos'}
            </Typography>
            <Typography sx={{ fontSize: 12, color: C.slateLight, mb: 2 }}>Arrossega aquí o fes clic per seleccionar</Typography>
            <Typography sx={{ fontSize: 10, color: C.mist, letterSpacing: '0.1em' }}>JPG, PNG, HEIC · Múltiples fotos acceptades</Typography>
            {uploadedCount > 0 && (
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: C.sage }} />
                <Typography sx={{ fontSize: 12, color: C.sage, fontWeight: 700, letterSpacing: '0.1em' }}>
                  {uploadedCount} foto{uploadedCount > 1 ? 's' : ''} pujada{uploadedCount > 1 ? 's' : ''} — gràcies!
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.ok ? 'success' : 'error'} sx={{ borderRadius: '12px', fontFamily: '"Cormorant Garamond", serif' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};