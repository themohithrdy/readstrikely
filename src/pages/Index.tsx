import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Book, Search, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import SelectionToolbar from '@/components/SelectionToolbar';
import { toast } from 'sonner';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [width, setWidth] = useState(100);

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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
    toast.success('Zoomed in');
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
    toast.success('Zoomed out');
  };

  const handleReset = () => {
    setScale(1.2);
    setWidth(100);
    toast.success('View reset');
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(prev => prev + 1);
      toast.success('Next page');
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      toast.success('Previous page');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!file) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goToNextPage();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPreviousPage();
          break;
        case '+':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleReset();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, numPages, currentPage]);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">ReadStrike</h1>
        <p className="text-muted-foreground">
          Enhanced reading experience with powerful tools
        </p>
        {file && (
          <p className="text-sm text-muted-foreground mt-2">
            Use arrow keys to navigate pages, +/- to zoom, Ctrl+R to reset view
          </p>
        )}
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
            {/* Controls */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="min-w-[60px] text-center">
                  {(scale * 100).toFixed(0)}%
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={scale >= 2.5}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 min-w-[200px]">
                <span className="text-sm">Width</span>
                <Slider
                  value={[width]}
                  onValueChange={(values) => setWidth(values[0])}
                  min={50}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm w-12">{width}%</span>
              </div>
            </div>

            {/* PDF Viewer */}
            <div style={{ width: `${width}%` }} className="mx-auto">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="mx-auto"
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  className="page"
                  width={undefined}
                />
              </Document>
            </div>

            {numPages && (
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousPage}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="flex items-center">
                  Page {currentPage} of {numPages}
                </span>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
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
