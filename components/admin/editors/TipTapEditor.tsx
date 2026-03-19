'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

interface ToolbarButton {
  label: string
  command: () => void
  active: boolean
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Write content here…',
  minHeight = '220px',
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-dark tiptap-content',
      },
    },
  })

  // Sync when content changes externally (e.g. switching EN/ES tab)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL:', editor.getAttributes('link').href ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const buttons: ToolbarButton[] = [
    { label: 'B',      command: () => editor.chain().focus().toggleBold().run(),                    active: editor.isActive('bold') },
    { label: 'I',      command: () => editor.chain().focus().toggleItalic().run(),                  active: editor.isActive('italic') },
    { label: 'S',      command: () => editor.chain().focus().toggleStrike().run(),                  active: editor.isActive('strike') },
    { label: 'Code',   command: () => editor.chain().focus().toggleCode().run(),                    active: editor.isActive('code') },
    { label: 'H2',     command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),     active: editor.isActive('heading', { level: 2 }) },
    { label: 'H3',     command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),     active: editor.isActive('heading', { level: 3 }) },
    { label: '• List', command: () => editor.chain().focus().toggleBulletList().run(),              active: editor.isActive('bulletList') },
    { label: '1. List',command: () => editor.chain().focus().toggleOrderedList().run(),             active: editor.isActive('orderedList') },
    { label: 'Quote',  command: () => editor.chain().focus().toggleBlockquote().run(),              active: editor.isActive('blockquote') },
    { label: 'Code Block', command: () => editor.chain().focus().toggleCodeBlock().run(),           active: editor.isActive('codeBlock') },
    { label: 'Link',   command: setLink,                                                            active: editor.isActive('link') },
    { label: 'Image',  command: addImage,                                                           active: false },
  ]

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {buttons.map(({ label, command, active }) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              command()
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: active ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
              color: active ? 'var(--accent-light)' : 'var(--text-muted)',
              transition: 'all 150ms ease',
            }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            cursor: 'pointer',
            border: 'none',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
            marginLeft: 'auto',
          }}
          title="Clear formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor area */}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap-content { min-height: ${minHeight}; padding: 16px; outline: none; }
        .tiptap-content p.is-editor-empty:first-child::before {
          color: var(--text-muted);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
