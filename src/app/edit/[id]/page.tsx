"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import RichtextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"

const contentSchema = z.object({
    contentHtml: z.string().min(1, "กรุณากรอกเนื้อหา"),
    contentJson: z.string().min(1, "กรุณากรอกเนื้อหา")
})

type ContentFormData = z.infer<typeof contentSchema>

export default function EditPage() {
    const params = useParams()
    const id = params.id
    console.log(id)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [initialContent, setInitialContent] = useState(null)  // ⬅️ เก็บ parsed object

    const { setValue, handleSubmit, watch, formState: { errors } } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            contentHtml: "",
            contentJson: ""
        }
    })

    // 🔍 ดึงข้อมูลจาก database ตอน component mount
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsFetching(true)
                const response = await axios.get(`/api/content/${id}`)
                console.log("axios fetch this id" ,id)

                const parsedContent = JSON.parse(response.data.contentJson)
                console.log("✅ Parsed content:", parsedContent)


                // ⚠️ สำคัญ: ใช้ contentJson เพื่อโหลดเข้า Editor
                setValue("contentJson", response.data.contentJson)
                setValue("contentHtml", response.data.contentHtml)
                console.log("contenta json is",response.data.contentJson)

                setInitialContent(parsedContent)
            } catch (error) {
                console.error("Error fetching content:", error)
                alert("ไม่สามารถโหลดข้อมูลได้")
            } finally {
                setIsFetching(false)
            }
        }

        if (id) {
            fetchContent()
        }
    }, [id, setValue])

    const handleEditorChange = (html: string, json: string) => {
        setValue("contentHtml", html)
        setValue("contentJson", json)
    }

    const onSubmit = async (data: ContentFormData) => {
        try {
            setIsLoading(true)
            // 🔄 Update แทน Create
            await axios.put(`/api/content/${id}`, {
                contentHtml: data.contentHtml,
                contentJson: data.contentJson
            })
            alert("แก้ไขสำเร็จ!")
        } catch (error) {
            console.error("Error updating content:", error)
            alert("เกิดข้อผิดพลาด!")
        } finally {
            setIsLoading(false)
        }
    }

    // แสดง loading ขณะดึงข้อมูล
    if (isFetching) {
        return <div className="flex justify-center py-8">กำลังโหลด...</div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-3xl mx-auto py-4">
                <h1 className="text-2xl font-bold mb-4">Edit page</h1>
                
                <RichtextEditor 
                    initialContent={initialContent}
                    value={watch("contentJson")}  // ⬅️ ส่ง JSON เข้าไป
                    onChange={handleEditorChange}
                />
                {(errors.contentHtml || errors.contentJson) && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.contentHtml?.message || errors.contentJson?.message}
                    </p>
                )}
            </div>
            
            <div className="flex justify-center gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    ยกเลิก
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </Button>
            </div>
        </form>
    )
}