import { config as dotenvConfig } from "dotenv";
import { NextRequest, NextResponse } from "next/server"
import db from "../../../../database/drizzle"
import { contents } from "../../../../database/schema"
import { eq } from "drizzle-orm"

// GET - ดึงข้อมูล 1 รายการ
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const result = await db
            .select()
            .from(contents)
            .where(eq(contents.id, parseInt(id)))
            .limit(1)
        
        if (result.length === 0) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูล" },
                { status: 404 }
            )
        }
        
        return NextResponse.json(result[0])
    } catch (error) {
        console.error("Error fetching content:", error)
        return NextResponse.json(
            { error: "Got an error at query" },
            { status: 500 }
        )
    }
}

// PUT - อัพเดทข้อมูล
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const body = await request.json()
        
        const { contentHtml, contentJson } = body
        
        if (!contentHtml || !contentJson) {
            return NextResponse.json(
                { error: "ข้อมูลไม่ครบถ้วน" },
                { status: 400 }
            )
        }
        
        const result = await db
            .update(contents)
            .set({
                contentHtml,
                contentJson
            })
            .where(eq(contents.id, parseInt(id)))
            .returning()
        
        if (result.length === 0) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูล" },
                { status: 404 }
            )
        }
        
        return NextResponse.json({ 
            success: true, 
            data: result[0] 
        })
    } catch (error) {
        console.error("Error updating content:", error)
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาด" },
            { status: 500 }
        )
    }
}