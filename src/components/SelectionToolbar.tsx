
import { useState, useEffect } from 'react';
import { Underline, Search, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectionState {
  text: string;
  rect?: DOMRect;
  isUnderlined?: boolean;
  color?: string;
}

const COLORS = [
  { name: 'Teal', value: '#4DB6AC' },
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#D946EF' },
  { name: 'Blue', value: '#0EA5E9' },
  { name: 'Red', value: '#ea384c' },
];

const SelectionToolbar = () => {
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0].value);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        const underlinedElement = range.commonAncestorContainer.parentElement;
        const isUnderlined = underlinedElement?.classList.contains('underline-text');
        const currentColor = underlinedElement?.style.textDecorationColor;
        
        setSelection({
          text: selection.toString(),
          rect,
          isUnderlined,
          color: currentColor
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleUnderline = (color = activeColor) => {
    if (selection) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const span = document.createElement('span');
        span.style.textDecoration = 'underline';
        span.style.textDecorationColor = color;
        span.style.textDecorationThickness = '2px';
        span.style.textDecorationSkipInk = 'none';
        span.style.textUnderlineOffset = '3px';
        span.style.transition = 'all 0.2s ease-in-out';
        span.className = 'underline-text hover:opacity-80';
        
        // Create wrapper for animation
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.animation = 'underlineSlideIn 0.3s ease-out forwards';
        wrapper.appendChild(span);
        
        range.surroundContents(wrapper);
        setSelection(null);
        toast.success('Text underlined');
      }
    }
  };

  const handleChangeColor = () => {
    if (selection?.isUnderlined) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement?.classList.contains('underline-text')) {
          parentElement.style.textDecorationColor = activeColor;
          setSelection(null);
          toast.success('Color updated');
        }
      }
    }
  };

  const handleRemoveUnderline = () => {
    if (selection) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement?.classList.contains('underline-text')) {
          const wrapper = parentElement.parentElement;
          if (wrapper) {
            wrapper.style.animation = 'underlineSlideOut 0.2s ease-out forwards';
            
            setTimeout(() => {
              const text = wrapper.textContent;
              const textNode = document.createTextNode(text || '');
              wrapper.parentNode?.replaceChild(textNode, wrapper);
            }, 200);
            
            setSelection(null);
            toast.success('Underline removed');
          }
        }
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
    left: `${selection.rect.left + (selection.rect.width / 2) - 80}px`,
  };

  return (
    <div
      className={`text-selection-menu visible`}
      style={style}
    >
      {selection.isUnderlined ? (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Palette className="h-4 w-4" style={{ color: activeColor }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" side="top">
              <div className="grid grid-cols-3 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    className="w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{
                      backgroundColor: color.value,
                      borderColor: activeColor === color.value ? 'white' : 'transparent',
                    }}
                    onClick={() => {
                      setActiveColor(color.value);
                      handleChangeColor();
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveUnderline}
            className="p-1 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Palette className="h-4 w-4" style={{ color: activeColor }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" side="top">
              <div className="grid grid-cols-3 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    className="w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{
                      backgroundColor: color.value,
                      borderColor: activeColor === color.value ? 'white' : 'transparent',
                    }}
                    onClick={() => {
                      setActiveColor(color.value);
                      handleUnderline(color.value);
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUnderline()}
            className="p-1 h-8 w-8"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </>
      )}
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
