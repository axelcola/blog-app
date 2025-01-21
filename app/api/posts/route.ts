import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch posts: ${error}` },
      { status: 500 }
    )
  }
}
