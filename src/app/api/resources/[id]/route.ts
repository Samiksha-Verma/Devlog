import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resourceSchema } from '@/lib/validations'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(resource)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = resourceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { url, title, category, notes, tags } = parsed.data

    const tagConnections = await Promise.all(
      (tags ?? []).map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    )

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        url,
        title,
        category,
        notes: notes ?? null,
        tags: { set: tagConnections.map((t) => ({ id: t.id })) },
      },
      include: { tags: true },
    })

    return NextResponse.json(resource)
  } catch {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.resource.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const resource = await prisma.resource.update({
      where: { id },
      data: body,
      include: { tags: true },
    })
    return NextResponse.json(resource)
  } catch {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}
