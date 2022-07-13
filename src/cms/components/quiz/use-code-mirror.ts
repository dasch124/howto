import type { EditorView } from 'codemirror'
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

import { usePreview as useCmsPreview } from '@/cms/previews/preview.context'

export function useCodeMirror(
  ref: RefObject<HTMLElement>,
  initialValue?: string,
): {
  editor: EditorView | null
  getDocument: () => string
  getSelection: () => string
} {
  /** We need to provide root `document` when in preview iframe, so styles are injected correctly. */
  const { document: root } = useCmsPreview()
  const [editor, setEditor] = useState<EditorView | null>(null)

  function getDocument(): string {
    if (editor === null) return ''

    const doc = editor.state.doc.toString()

    return doc
  }

  function getSelection(): string {
    if (editor === null) return ''

    const selection = editor.state
      .sliceDoc(editor.state.selection.main.from, editor.state.selection.main.to)
      .toString()

    return selection
  }

  useEffect(() => {
    let view: EditorView | null = null
    let canceled = false

    async function setup() {
      const { basicSetup, EditorView } = await import('codemirror')
      const { xml } = await import('@codemirror/lang-xml')

      if (canceled) return

      const styles = EditorView.theme({
        '.cm-focused': { outline: 'none' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-gutters': { fontSize: '0.875rem' },
        '.cm-content': {
          fontFamily: '"Fira Code", "Source Code Pro", ui-monospace, monospace',
          fontSize: '0.875rem',
        },
      })

      view = new EditorView({
        extensions: [styles, basicSetup, xml()],
        doc: initialValue,
        root: root ?? document,
        parent: ref.current ?? undefined,
      })

      setEditor(view)
    }

    if (ref.current === null) return

    setup()

    return () => {
      canceled = true
      view?.destroy()
    }
  }, [ref, root, initialValue])

  return {
    editor,
    getDocument,
    getSelection,
  }
}
