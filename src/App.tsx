import { Box, Grid }from '@mui/material';

import { DocumentProvider } from './DocumentContext';
import DocumentDisplay from './DocumentDisplay';

import FileUploader from './FileUploader';
import FileDisplay from './FileDisplay';
import DocumentSelector from './DocumentSelector';

export default function App() {
  return (
      <Box sx={{ m: 0, p: 0, width: '80vw' }}>
        <DocumentProvider>
          <Box sx={{ height: 50, mt: 0, p:2 , background: '#EEEEEE', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <FileUploader />
            <DocumentSelector />
          </Box>
          <Grid container spacing={2} columns={16} >
            <Grid item xs={6} >
              <FileDisplay />
            </Grid>
            <Grid item xs={10}>
              <DocumentDisplay />
            </Grid>
          </Grid>
        </DocumentProvider>
      </Box>
  );
}
