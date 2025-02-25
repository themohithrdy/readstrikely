
import { useState, useEffect } from 'react';
import { Underline, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SelectionToolbar = () => {
  const [selection, setSelection] = useState<{
    text: string;
    rect?: DOMRect;
  } | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({
          text: selection.toString(),
          rect
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleUnderline = () => {
    if (selection) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const span = document.createElement('span');
        span.style.textDecoration = 'underline';
        span.style.textDecorationColor = '#4DB6AC';
        span.style.textDecorationThickness = '2px';
        range.surroundContents(span);
        setSelection(null);
      }
    }
  };

  const handleLookup = () => {
    if (selection) {
      window.open(`https://www.google.com/search?q=define+${encodeURIComponent(selection.text)}`, '_blank');
      toast.success('Opening definition');
      setSelection(null);
    }
  };

  if (!selection || !selection.rect) return null;

  const style = {
    top: `${window.scrollY + selection.rect.bottom + 8}px`,
    left: `${selection.rect.left + (selection.rect.width / 2) - 50}px`,
  };

  return (
    <div
      className={`text-selection-menu visible`}
      style={style}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUnderline}
        className="p-1 h-8 w-8"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLookup}
        className="p-1 h-8 w-8"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SelectionToolbar;
