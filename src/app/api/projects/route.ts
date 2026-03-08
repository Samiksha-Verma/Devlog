import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { projectSchema } from '@/lib/validations'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { tags: true, entries: { include: { tags: true } }, resources: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
      },
      include: { tags: true, entries: true, resources: true },
    })

    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
