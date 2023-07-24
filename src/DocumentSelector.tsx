import { useContext, useState, useEffect } from 'react';
import { groupBy } from 'lodash';

import { MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { iDocumentContext, DocumentContext } from './DocumentContext';

export default function FileDisplay() {
  const { allDocuments, getSelectedDocument, selectedDocument } = useContext(DocumentContext) as iDocumentContext;
  const [ selected, setSelected] = useState<string>(selectedDocument?.id || '');
  const [grouped, setGrouped] = useState<any>({});

  useEffect(() => {
    setGrouped(groupBy(allDocuments, 'document_type'));
  }, [allDocuments]);

  useEffect(() => {
    selectedDocument?.id && selectedDocument.id !== selected && setSelected('');
  }, [selectedDocument]);

   const renderSelect = (documents: any[] = [], documentType: string = '') => {
    const items = documents.map(document => (
      <MenuItem
        key={`${document.id}-${documentType}`}
        value={document.id}
        selected={document.id === selected}
      >
        {`[${documentType}] ${document.id} (${document.created_date})`}
      </MenuItem>
    ));

    return (
      <FormControl key={documentType} variant="standard" sx={{ m: 1, minWidth: 300 }}>
        <InputLabel style={{ textTransform: 'capitalize' }}>
          {`Select Existing ${documentType}s (${documents.length} found)`}
        </InputLabel>
        <Select
          displayEmpty
          value={selected}
          onChange={(event: SelectChangeEvent) => {
            setSelected(event.target.value);
            getSelectedDocument(event.target.value);
          }}
        >
          {items}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
      {Object.keys(grouped).map(documentType => renderSelect(grouped[documentType], documentType))}
    </Box>
  );
}
