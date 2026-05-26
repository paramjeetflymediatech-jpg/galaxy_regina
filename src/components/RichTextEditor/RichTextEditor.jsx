"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight, 
  FaLink, 
  FaCode, 
  FaEraser, 
  FaEye 
} from 'react-icons/fa';
import './RichTextEditor.css';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Start writing here..." 
}) => {
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const [isSourceMode, setIsSourceMode] = useState(false);

  // Sync internal editor content with incoming value
  useEffect(() => {
    if (isSourceMode) return;
    
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = value || '';
        isUpdatingRef.current = false;
      }
    }
  }, [value, isSourceMode]);

  const handleInput = () => {
    if (isUpdatingRef.current) return;
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleSourceChange = (e) => {
    onChange(e.target.value);
  };

  // Run document styling command
  const execCmd = (command, arg = undefined) => {
    if (isSourceMode) return;
    
    document.execCommand(command, false, arg);
    
    // Trigger update
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Link Prompt Helper
  const addLink = () => {
    if (isSourceMode) return;
    
    const url = prompt("Enter the link URL (e.g., https://example.com):");
    if (url !== null) {
      execCmd("createLink", url);
    }
  };

  return (
    <div className="rich-text-editor-container">
      {/* TOOLBAR */}
      <div className="rte-toolbar">
        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          className={`rte-btn rte-mode-btn ${isSourceMode ? 'active' : ''}`}
          title={isSourceMode ? "Switch to WYSIWYG Editor" : "Switch to Source HTML"}
        >
          {isSourceMode ? <FaEye /> : <FaCode />}
          <span>{isSourceMode ? "Visual" : "HTML"}</span>
        </button>

        <span className="rte-separator"></span>

        {/* Text Formats */}
        <select 
          onChange={(e) => execCmd("formatBlock", e.target.value)}
          disabled={isSourceMode}
          className="rte-select"
          defaultValue="P"
        >
          <option value="P">Paragraph</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="BLOCKQUOTE">Quote</option>
        </select>

        <span className="rte-separator"></span>

        {/* Styling buttons */}
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("bold")}
          className="rte-btn"
          title="Bold"
        >
          <FaBold />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("italic")}
          className="rte-btn"
          title="Italic"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("underline")}
          className="rte-btn"
          title="Underline"
        >
          <FaUnderline />
        </button>

        <span className="rte-separator"></span>

        {/* Alignment */}
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("justifyLeft")}
          className="rte-btn"
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("justifyCenter")}
          className="rte-btn"
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("justifyRight")}
          className="rte-btn"
          title="Align Right"
        >
          <FaAlignRight />
        </button>

        <span className="rte-separator"></span>

        {/* Lists */}
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("insertUnorderedList")}
          className="rte-btn"
          title="Bullet List"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("insertOrderedList")}
          className="rte-btn"
          title="Numbered List"
        >
          <FaListOl />
        </button>

        <span className="rte-separator"></span>

        {/* Links & Clear formatting */}
        <button
          type="button"
          disabled={isSourceMode}
          onClick={addLink}
          className="rte-btn"
          title="Insert Link"
        >
          <FaLink />
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => execCmd("removeFormat")}
          className="rte-btn"
          title="Clear Formatting"
        >
          <FaEraser />
        </button>
      </div>

      {/* EDITOR AREA */}
      <div className="rte-editor-area">
        {isSourceMode ? (
          <textarea
            value={value || ''}
            onChange={handleSourceChange}
            placeholder="Write raw HTML code here..."
            className="rte-source-textarea"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            placeholder={placeholder}
            className="rte-wysiwyg-editor"
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
