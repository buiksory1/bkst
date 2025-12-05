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

export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json()
    const data = await redis.get(REDIS_KEY)
    const files = (data as ProxyFile[]) || []

    const index = files.findIndex((f) => f.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    files[index] = { ...files[index], ...updates }
    await redis.set(REDIS_KEY, files)

    return NextResponse.json(files[index])
  } catch (error) {
    console.error("[v0] Redis PUT error:", error)
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const data = await redis.get(REDIS_KEY)
    const files = (data as ProxyFile[]) || []

    const filtered = files.filter((f) => f.id !== id)
    await redis.set(REDIS_KEY, filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Redis DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
