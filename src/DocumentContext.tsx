import { 
  ReactNode, 
  createContext, 
  useState, 
  useEffect, 
  useCallback 
} from 'react';

interface iProps {
  children: ReactNode
}

export interface iKeyValue {
  k: string
  v: any
}

export interface iFile {
  data?: string | ArrayBuffer | null
  url?: string | null
  file?: File | null
}

export interface iDocumentContext {
  allDocuments: any
  isLoading: boolean
  fileImageSrc: string | undefined
  getSelectedDocument: (id: string) => void
  selectedDocument: any
  selectedFile: iFile | undefined
  setSelectedFile: (file: iFile | undefined) => void
  updateDocument: (documentId: string, data: any) => Promise<any>
}
const endpoints = {
  documents: '/veryfi/partner/documents',
};

const options = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'CLIENT-ID': import.meta.env.VITE_CLIENT_ID,
    AUTHORIZATION: import.meta.env.VITE_AUTHORIZATION,
  }
};

const readFile = (file: File): Promise<iFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const fileContent: iFile = {};
    reader.onload = (event) => {
      if (!event || !event.target) return;
      fileContent.data = event.target.result
      resolve(fileContent)
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsDataURL(file)
  })
}

export const DocumentContext = createContext<undefined | iDocumentContext>(undefined);

export const DocumentProvider = ({ children }: iProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<iFile>();
  const [allDocuments, setAllDocuments] = useState<any>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>();
  const [fileImageSrc, setFileImageSrc] = useState<string>();
 
  console.log('SAAD DocumentContext.tsx:75', 'SAAD', import.meta.env.VITE_SAAD1);
  const getSelectedDocument = async (id: string) => await getDocument(id);

  const getAllDocuments = async () => {
    const method = 'GET';

    setIsLoading(true);
    try {
      const response = await fetch(endpoints.documents, {...options, method});
      const { documents = {} } = await response.json();
      setAllDocuments(documents);
    } catch (error) {
        return { data: null, err: error }
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllDocuments();
  },[]);

  useEffect(() => {
    setFileImageSrc(selectedFile?.url || '');
  },[selectedFile]);

  useEffect(() => {
    setFileImageSrc(selectedDocument?.img_url || '');
  },[selectedDocument]);

  const processFile = useCallback(async () => {
    if (!selectedFile?.file?.name) return;
    
    const method = 'POST';
    const auto_delete = true;

    setIsLoading(true);
    try {
      const { data: file_data } = await readFile(selectedFile.file);
      const body = JSON.stringify({ file_data });
      const response = await fetch(endpoints.documents, {...options, method, body });
      const data = await response.json();
      await getDocument(data.id);
    } catch (error) {
        return { data: null, err: error }
    } finally{
      setIsLoading(false);
    }

  }, [selectedFile]);

  const updateDocument = useCallback(async (documentId: string, data: any) => {
    if (!documentId) return;
    
    const method = 'PUT';

    try {
      const body = JSON.stringify(data);
      const response = await fetch(`${endpoints.documents}/${documentId}`, {...options, method, body});
      await response.json();
      await getDocument(documentId);
    } catch (error) {
        return { data: null, err: error }
    } finally{
    }
  }, []);

  const getDocument = useCallback(async (documentId: string) => {
    if (!documentId) return;
    
    const method = 'GET';

    setIsLoading(true);
    try {
      const response = await fetch(`${endpoints.documents}/${documentId}`, {...options, method});
      const data = await response.json();
      setSelectedDocument(data);
    } catch (error) {
        return { data: null, err: error }
    } finally{
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    selectedFile?.file?.name && processFile();
  }, [selectedFile]);

  return (
    <DocumentContext.Provider value={{
      allDocuments,
      selectedDocument,
      getSelectedDocument,
      fileImageSrc,
      isLoading,
      selectedFile,
      setSelectedFile,
      updateDocument,
     }}>
      {children}
    </DocumentContext.Provider>
  );
};
