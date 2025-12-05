import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis-client"

const REDIS_KEY = "proxy_files"

export interface ProxyFile {
  id: string
  date: string
  fileName: string
  downloadUrl: string
  status: "active" | "expired" | "updating"
}

export async function GET() {
  try {
    const data = await redis.get(REDIS_KEY)
    const files = (data as ProxyFile[]) || []
    return NextResponse.json(files)
  } catch (error) {
    console.error("[v0] Redis GET error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newFile = await request.json()
    const data = await redis.get(REDIS_KEY)
    const files = (data as ProxyFile[]) || []

    const file: ProxyFile = {
      ...newFile,
      id: Date.now().toString(),
    }

    files.unshift(file)
    await redis.set(REDIS_KEY, files)

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error("[v0] Redis POST error:", error)
    return NextResponse.json({ error: "Failed to add file" }, { status: 500 })
  }
}
