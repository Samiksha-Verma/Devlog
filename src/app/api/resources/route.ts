import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resourceSchema } from '@/lib/validations'

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(resources)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = resourceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { url, title, category, notes, tags, entryIds, projectIds } = parsed.data

    const tagConnections = await Promise.all(
      (tags ?? []).map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    )

    const resource = await prisma.resource.create({
      data: {
        url,
        title,
        category,
        notes: notes ?? null,
        tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
        entries: { connect: (entryIds ?? []).map((id) => ({ id })) },
        projects: { connect: (projectIds ?? []).map((id) => ({ id })) },
      },
      include: { tags: true },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
