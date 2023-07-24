import { useState, useCallback, useContext, useEffect } from 'react';
import { set } from 'lodash';

import { Box, Autocomplete, TextField, Tooltip, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { iDocumentContext, DocumentContext } from './DocumentContext';

export default function PropertyDisplay({ 
  documentId, 
  propertyName, 
  properties, 
  propertyPath,
  disableUpdate,
}: {documentId: string, propertyName: string, properties: any, propertyPath: string, disableUpdate: boolean}) {
  const { updateDocument } = useContext(DocumentContext) as iDocumentContext;

  const [ propertyNames ] = useState(Object.keys(properties));
  const [ canSave, setCanSave ] = useState(false);
  const [ newPropValue, setNewPropValue ] = useState(properties[propertyName] || '');
  const [ newPropName, setNewPropName ] = useState(propertyName);
  const [ isUpdating, setIsUpdating ] = useState(false);

  const handleSave = useCallback(async () => {
    setIsUpdating(true);
    let data = {};
    if (propertyPath) {
      set(data, `${propertyPath}.${newPropName}`, newPropValue);
    } else {
      set(data, newPropName, newPropValue);
    }

    await updateDocument(documentId, data);
    setIsUpdating(false);
    setCanSave(false);
  },[newPropName, newPropValue]);

  useEffect(() => {
    setNewPropValue(properties[propertyName] || '');
  }, [properties, propertyName]);

  return (
    <Box sx={{ mb: 1, mt: 0, mr: 2 }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
      <Box style={{ border: '1px solid #eeeeee' }}>
        <Tooltip title={propertyName}>
          <Autocomplete
            disabled={isUpdating || disableUpdate}
            options={propertyNames}
            defaultValue={propertyName}
            sx={{
              background: '#EEEEEE',
              p: 0,
              width: '100%',
            }}
            onChange={(_, value) => {
              setNewPropName(value);
              setCanSave(true);
            }}
            renderInput={(params) => (
              <TextField {...params} 
                variant="standard"
                sx={{
                  '& .MuiAutocomplete-endAdornment': {
                    opacity: '0.15',
                  },
                  '& .MuiAutocomplete-endAdornment:hover': {
                    opacity: '1',
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    display: 'none',
                  },
                  '& .MuiInput-root': {
                    paddingLeft: '8px',
                    fontWeight: 100,
                    fontSize: 12,
                    color: '#555555',
                  },
                  '& .MuiAutocomplete-inputRoot:before': {
                    border: '0'
                  },
                  '& .MuiAutocomplete-inputRoot:after': {
                    border: '0'
                  },
              }}
                label=""
              />
            )}
          />
        </Tooltip>
        <Tooltip title={properties[propertyName]}>
          <TextField
            label=""
            sx={{ width: '100%', fontSize: 8 }}
            disabled={isUpdating}
            variant="standard"
            value={newPropValue}
            color='success'
            margin="dense"
            fullWidth={true}
            size="small"
            onChange={e => {
              setNewPropValue(e.currentTarget.value);
              setCanSave(true);
             } }
            inputProps={{ min: 0, style: { textAlign: 'center', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}}
            InputProps={{ 
              readOnly: disableUpdate,
              disableUnderline: true,
            }}
          />
        </Tooltip>
      </Box>
      <Box sx={{ height: '100%' }} style={{ visibility: canSave ? 'visible' : 'hidden' }}>
        {isUpdating ? <CircularProgress /> : <CheckIcon color="primary" onClick={handleSave} />}
      </Box>
    </Box>
  );
}
