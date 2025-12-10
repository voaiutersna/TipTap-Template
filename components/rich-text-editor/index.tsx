"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit" //รวม extensions พื้นฐาน
import Menubar from "./menu-bar"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { useEffect } from "react"

//EditorContent คือ React component ที่เอา editor มาวางบน DOM
interface RichtextEditorProps {
    value?: string
    onChange?: (value: string) => void
}

export default function RichtextEditor() {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc ml-3',
                }
            },
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal ml-3',
                },
            },
        }),
        Highlight,
        TextAlign.configure({
            types: ["heading", "paragraph"]
        })],
        content: '<p>Hello World!</p>',
        immediatelyRender: false, //กัน render โดยที่ไม่มีdom

        //styling Editor
        editorProps: {
            attributes: {
                class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3"
            }
        }
    })

    return (
        <div>
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>

    )
}