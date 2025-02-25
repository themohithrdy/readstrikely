
import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Book, Search } from 'lucide-react';
import SelectionToolbar from '@/components/SelectionToolbar';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">ReadStrike</h1>
        <p className="text-muted-foreground">
          Enhanced reading experience with powerful tools
        </p>
      </header>

      {!file && (
        <Card className="mt-8">
          <div
            {...getRootProps()}
            className={`file-dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="space-y-2">
                <p className="text-xl font-medium">
                  Drop your document here
                </p>
                <p className="text-sm text-muted-foreground">
                  Support for PDF and TXT files
                </p>
              </div>
              <Button variant="outline">
                Browse files
              </Button>
            </div>
          </div>
        </Card>
      )}

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <span className="font-medium">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setFile(null)}
            >
              Change file
            </Button>
          </div>

          <Card className="p-6">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-4xl mx-auto"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                className="page"
              />
            </Document>

            {numPages && (
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="flex items-center">
                  Page {currentPage} of {numPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      <SelectionToolbar />
    </div>
  );
};

export default Index;
