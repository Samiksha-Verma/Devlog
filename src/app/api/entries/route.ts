import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { entrySchema } from '@/lib/validations'

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      include: { tags: true, resources: true, project: true },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const entry = await prisma.entry.create({
      data: {
        title,
        body: entryBody,
        date: date ? new Date(date) : new Date(),
        projectId: projectId ?? null,
        tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
        resources: { connect: (resourceIds ?? []).map((id) => ({ id })) },
      },
      include: { tags: true, resources: true, project: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
