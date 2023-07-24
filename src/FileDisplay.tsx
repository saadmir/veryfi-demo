import { useContext } from 'react';

import { Box } from '@mui/material';
import { iDocumentContext, DocumentContext } from './DocumentContext';

export default function FileDisplay() {
  const { isLoading, selectedFile, fileImageSrc } = useContext(DocumentContext) as iDocumentContext;

  if (!fileImageSrc) return null;
  
  return (
    <Box style={{ display: "flex", justifyContent: "center", opacity: isLoading ? '0.15' : 1 }}>
        <img
          style={{ objectFit: "contain",  width: '100%', height: '100%' }}
          src={fileImageSrc}
          alt={selectedFile?.file?.name}
        />
    </Box>
  );
}
