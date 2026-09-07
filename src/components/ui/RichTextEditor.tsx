
import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Image as ImageIcon, Type, Palette, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, List as ListIcon, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent = '', onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      if (editorRef.current.innerHTML !== initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  }, [initialContent]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        
        // Prompt for optional link
        const imageLink = prompt("Paste a link URL for this image (optional):", "");
        
        if (imageLink) {
            const html = `<a href="${imageLink}" target="_blank" rel="noopener noreferrer"><img src="${base64}" style="max-width: 100%; height: auto; margin: 10px 0; border: 2px solid #7C3AED;" /></a>`;
            execCommand('insertHTML', html);
        } else {
            execCommand('insertImage', base64);
            // Apply some styling to newly inserted image if possible (naive approach)
            const images = editorRef.current?.getElementsByTagName('img');
            if (images && images.length > 0) {
                const lastImg = images[images.length - 1];
                lastImg.style.maxWidth = '100%';
                lastImg.style.height = 'auto';
                lastImg.style.margin = '10px 0';
            }
        }
        handleInput();
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = ['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#7C3AED'];

  return (
    <div className="flex flex-col border-2 border-gray-200 dark:border-[#222] rounded-none overflow-hidden bg-white dark:bg-[#111] transition-colors shadow-sm relative min-h-[450px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#1a1a1a] sticky top-0 z-10">
        <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold size={16} />} title="Bold" />
        <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic size={16} />} title="Italic" />
        <ToolbarButton onClick={() => execCommand('underline')} icon={<span className="font-bold underline text-xs">U</span>} title="Underline" />
        
        <div className="w-px h-6 bg-gray-300 dark:bg-[#333] mx-2"></div>
        
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<ListIcon size={16} />} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={<ListOrdered size={16} />} title="Numbered List" />

        <div className="w-px h-6 bg-gray-300 dark:bg-[#333] mx-2"></div>

        <ToolbarButton onClick={() => execCommand('justifyLeft')} icon={<AlignLeft size={16} />} title="Align Left" />
        <ToolbarButton onClick={() => execCommand('justifyCenter')} icon={<AlignCenter size={16} />} title="Align Center" />
        <ToolbarButton onClick={() => execCommand('justifyRight')} icon={<AlignRight size={16} />} title="Align Right" />

        <div className="w-px h-6 bg-gray-300 dark:bg-[#333] mx-2"></div>

        {/* Image Upload */}
        <label className="p-2.5 rounded-none hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 cursor-pointer transition-colors" title="Insert Image with Link">
            <div className="flex items-center gap-1">
                <ImageIcon size={16} />
                <LinkIcon size={10} className="-ml-1 mt-1 opacity-50" />
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        {/* Color Picker */}
        <div className="relative">
            <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2.5 rounded-none hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 transition-colors"
                title="Text Color"
            >
                <Palette size={16} />
            </button>
            {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-[#222] rounded-none shadow-2xl border border-gray-200 dark:border-[#444] grid grid-cols-4 gap-2 z-50 animate-dropdown-reveal">
                    {colors.map(c => (
                        <button 
                            key={c}
                            onClick={() => { execCommand('foreColor', c); setShowColorPicker(false); }}
                            className="w-6 h-6 rounded-none border border-gray-300 dark:border-[#555] hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 flex flex-col">
          <div 
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="flex-1 p-6 min-h-[400px] outline-none text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none overflow-y-auto custom-scrollbar font-medium"
            style={{ minHeight: '400px' }}
          />
          {(!editorRef.current?.innerText && placeholder) && (
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none font-bold uppercase text-[10px] tracking-widest opacity-40">
                  {placeholder}
              </div>
          )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, title }: any) => (
    <button 
        onClick={(e) => { e.preventDefault(); onClick(); }} 
        title={title}
        className="p-2.5 rounded-none hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 transition-colors"
    >
        {icon}
    </button>
);
