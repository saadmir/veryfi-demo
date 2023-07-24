import { useContext } from 'react'

import { iFile, iDocumentContext, DocumentContext } from './DocumentContext';

export default function FileUploader() {
  const { setSelectedFile } = useContext(DocumentContext) as iDocumentContext;

  const onChange = (e: any) => {
    const { target: { files = [] } } = e;
    const file: iFile = {
      url: URL.createObjectURL(files[0]),
      file: files[0]
    };
    setSelectedFile(file);
  };

  return <input type="file" accept="image/*" onChange={onChange} />;
}
