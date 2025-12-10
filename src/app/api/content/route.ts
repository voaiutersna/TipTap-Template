// app/api/content/route.ts
import { NextRequest, NextResponse } from "next/server"
import  db  from "../../../database/drizzle"
import { contents } from "../../../database/schema"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        
        const { contentHtml, contentJson } = body
        
        if (!contentHtml || !contentJson) {
            return NextResponse.json(
                { error: "ข้อมูลไม่ครบถ้วน" },
                { status: 400 }
            )
        }
        
        // บันทึกลง database
        const result = await db.insert(contents).values({
            contentHtml,
            contentJson
        }).returning()
        
        return NextResponse.json({ 
            success: true, 
            data: result[0] 
        })
    } catch (error) {
        console.error("Error saving content:", error)
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
            { status: 500 }
        )
    }
}