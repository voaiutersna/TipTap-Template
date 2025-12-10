"use client"
import RichtextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { useState } from "react"

// Zod Schema
const contentSchema = z.object({
  contentHtml: z.string().min(1, "กรุณากรอกเนื้อหา"),
  contentJson: z.string().min(1, "กรุณากรอกเนื้อหา")
})

type ContentFormData = z.infer<typeof contentSchema>

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const { setValue, handleSubmit, watch, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentHtml: "",
      contentJson: ""
    }
  })

  const handleEditorChange = (html: string, json: string) => {
    setValue("contentHtml", html)
    setValue("contentJson", json)
  }

  const onSubmit = async (data: ContentFormData) => {
    try {
      setIsLoading(true)
      const response = await axios.post("/api/content", {
        contentHtml: data.contentHtml,
        contentJson: data.contentJson
      })
      console.log("บันทึกสำเร็จ:", response.data)
      alert("บันทึกสำเร็จ!")
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error)
      alert("เกิดข้อผิดพลาด!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto py-4">
        <RichtextEditor></RichtextEditor>
      </div>

      <div className="flex justify-center">
        <Button>Submit</Button>
      </div>

    </>
  )
}