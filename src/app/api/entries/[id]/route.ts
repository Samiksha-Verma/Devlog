import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { entrySchema } from '@/lib/validations'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: { tags: true, resources: true, project: true },
    })
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = entrySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { title, body: entryBody, date, tags, projectId, resourceIds } = parsed.data

    const tagConnections = await Promise.all(
      (tags ?? []).map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    )

    const entry = await prisma.entry.update({
      where: { id },
      data: {
        title,
        body: entryBody,
        date: date ? new Date(date) : undefined,
        projectId: projectId ?? null,
        tags: { set: tagConnections.map((t) => ({ id: t.id })) },
        resources: { set: (resourceIds ?? []).map((id) => ({ id })) },
      },
      include: { tags: true, resources: true, project: true },
    })

    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.entry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
