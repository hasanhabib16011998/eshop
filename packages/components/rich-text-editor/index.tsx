import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from "react-quill-new";
// 1. CRITICAL: Import the default Quill CSS theme
import "react-quill-new/dist/quill.snow.css"; 

const RichTextEditor = ({
    value,
    onChange
}: {
    value: string;
    onChange: (content: string) => void;
}) => {
    const [editorValue, setEditorValue] = useState(value || "");

    // Sync external changes safely without resetting typing cursor position
    useEffect(() => {
        if (value !== editorValue) {
            setEditorValue(value || "");
        }
    }, [value]);

    return (
        <div className="relative rich-text-editor-dark">
            <ReactQuill
                theme='snow'
                value={editorValue}
                onChange={(content) => {
                    setEditorValue(content);
                    onChange(content);
                }}
                modules={{
                    toolbar: [
                        [{ font: [] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ size: ["small", false, "large", "huge"] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ script: "sub" }, { script: "super" }], // FIXED: Typo fixed here 'ssuper' -> 'super'
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ align: [] }],
                        ["blockquote", "code-block"],
                        ["link", "image", "video"],
                        ["clean"],
                    ]
                }}
                placeholder='Write here...'
            />

            {/* 2. Seamless dark mode styling overrides */}
            <style>
                {`
                    /* Target our component wrapper specifically */
                    .rich-text-editor-dark .ql-toolbar.ql-snow,
                    .rich-text-editor-dark .ql-container.ql-snow {
                        border: 1px solid #374151 !important; /* Matches border-gray-700 */
                        background-color: transparent;
                    }
                    
                    /* Connect the toolbar and container fluidly */
                    .rich-text-editor-dark .ql-toolbar.ql-snow {
                        border-bottom: none !important;
                        border-top-left-radius: 0.375rem;
                        border-top-right-radius: 0.375rem;
                    }
                    
                    .rich-text-editor-dark .ql-container.ql-snow {
                        border-bottom-left-radius: 0.375rem;
                        border-bottom-right-radius: 0.375rem;
                        min-height: 250px;
                        font-size: 1rem;
                    }

                    /* Make text inside the editor readable */
                    .rich-text-editor-dark .ql-editor {
                        color: #ffffff;
                    }

                    .rich-text-editor-dark .ql-editor.ql-blank::before {
                        color: #9ca3af; /* Placeholder color matches gray-400 */
                        font-style: normal;
                    }

                    /* Style SVG toolbar icons white for visibility on dark theme */
                    .rich-text-editor-dark .ql-snow .ql-stroke {
                        stroke: #ffffff !important;
                    }
                    .rich-text-editor-dark .ql-snow .ql-fill {
                        fill: #ffffff !important;
                    }
                    .rich-text-editor-dark .ql-snow .ql-picker {
                        color: #ffffff !important;
                    }
                    
                    /* Dropdowns selection adjustments */
                    .rich-text-editor-dark .ql-snow .ql-picker-options {
                        background-color: #1f2937 !important; /* Dark slate background */
                        border-color: #374151 !important;
                    }
                    .rich-text-editor-dark .ql-snow .ql-picker-item {
                        color: #ffffff !important;
                    }
                    .rich-text-editor-dark .ql-snow .ql-picker-item:hover {
                        color: #3b82f6 !important; /* Blue text highlight on hover */
                    }
                `}
            </style>
        </div>
    )
}

export default RichTextEditor;