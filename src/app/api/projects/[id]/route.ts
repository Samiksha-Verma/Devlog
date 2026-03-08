import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { projectSchema } from '@/lib/validations'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tags: true, entries: { include: { tags: true } }, resources: true },
    })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = projectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { name, description, status, liveUrl, repoUrl, tags } = parsed.data

    const tagConnections = await Promise.all(
      (tags ?? []).map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    )

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        tags: { set: tagConnections.map((t) => ({ id: t.id })) },
      },
      include: { tags: true, entries: true, resources: true },
    })

    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
