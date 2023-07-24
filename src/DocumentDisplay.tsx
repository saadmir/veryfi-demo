import { useContext, useState, useEffect } from 'react';
import { pickBy, isString, isPlainObject, isArray, isNull } from 'lodash';

import { 
  Stack, 
  Box, 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Typography, 
  Divider, 
  CircularProgress 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DataArrayIcon from '@mui/icons-material/DataArray';

import { iDocumentContext, DocumentContext } from './DocumentContext';
import PropertyDisplay from './PropertyDisplay';


export default function DocumentDisplay({}) {
  const { selectedDocument, isLoading } = useContext(DocumentContext) as iDocumentContext;
  const [grouped, setGrouped] = useState<any>({});
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    const _grouped = {
      validProps: pickBy(selectedDocument, isString),
      objectProps: pickBy(selectedDocument, isPlainObject),
      arrayProps: pickBy(selectedDocument, isArray),
      nullProps: pickBy(selectedDocument, isNull),
    };

    setGrouped(_grouped);
  }, [selectedDocument]);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderProperties = (properties: any = {}, propertyPath: string = '', disableUpdate: boolean = false) => (
    <Box key={propertyPath} style={{ width: '100%', display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
      {properties && Object.keys(properties).map(name => {
        return (
          <PropertyDisplay 
            key={`${selectedDocument.id}-${propertyPath}-${name}`} 
            documentId={selectedDocument.id} 
            propertyName={name} 
            properties={properties} 
            propertyPath={propertyPath} 
            disableUpdate={disableUpdate}
          />
        );
      })}
    </Box>
  );

  const renderObjectTitle = (title: string) => (
    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '4px' }}>
      <DataObjectIcon color="disabled" fontSize="small" />
      <Typography variant="subtitle1" color="primary" style={{ textTransform: 'capitalize' }}>{title.replace(/_/g, ' ')}</Typography>
    </Box>
  );

  const renderArrayTitle = (title: string) => (
    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '4px' }}>
      <DataArrayIcon color="disabled" fontSize="small" />
      <Typography variant="subtitle1" color="primary" style={{ textTransform: 'capitalize' }}>{title.replace(/_/g, ' ')}</Typography>
    </Box>
  );

  const renderObject = (properties = {}, propertyPath = '__ROOT__') => {
    if (!Object.keys(properties).length) return <></>;
    return (
      <Accordion key={`${propertyPath}-${selectedDocument.id}`} expanded={expanded === propertyPath} onChange={handleChange(propertyPath)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            {renderObjectTitle(propertyPath === '__ROOT__' ? `${selectedDocument.document_type} properties` : propertyPath)}
        </AccordionSummary>
        <AccordionDetails>
          {renderProperties(properties, propertyPath === '__ROOT__' ? '' : propertyPath)}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderArray = (array = [], propertyPath = '') => (
    <Accordion key={`${propertyPath}-${selectedDocument.id}`} expanded={expanded === propertyPath} onChange={handleChange(propertyPath)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} >
        {renderArrayTitle(propertyPath)}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {array.map((properties, i) => (
            <Box key={`${propertyPath}-${i}-div`} sx={{ mb: 3}} >
              <Divider textAlign="left" sx={{ mb: 1 }}>{`${propertyPath} ${i}`}</Divider>
              {renderProperties(properties, `${propertyPath}[${i}]`, true)}
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  const renderDocument = () => (
    <>
      {renderObject(grouped.validProps)}
      {grouped?.objectProps && Object.keys(grouped.objectProps).map((k: string) => renderObject(grouped.objectProps[k], k))}
      {grouped?.arrayProps && Object.keys(grouped.arrayProps).map((k: string) => renderArray(grouped.arrayProps[k], k))}
      {renderObject(grouped.nullProps, 'Properties Not Found')}
    </>
  );

  const renderLoader = () => <Box style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress /> </Box>;
  
  return isLoading ? renderLoader() : renderDocument();
}
