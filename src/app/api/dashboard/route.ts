import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns'

export async function GET() {
  try {
    const [totalEntries, totalProjects, totalResources, allEntries, allTags] =
      await Promise.all([
        prisma.entry.count(),
        prisma.project.count(),
        prisma.resource.count(),
        prisma.entry.findMany({ select: { date: true }, orderBy: { date: 'asc' } }),
        prisma.tag.findMany({
          include: {
            _count: { select: { entries: true, projects: true, resources: true } },
          },
        }),
      ])

    // Streak calculation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    const entryDates = new Set(allEntries.map((e) => new Date(e.date).toDateString()))
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (entryDates.has(d.toDateString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    // Weekly activity — last 8 weeks
    const weeklyActivity = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 7 - i))
      const weekEnd = endOfWeek(weekStart)
      const count = allEntries.filter((e) => {
        const d = new Date(e.date)
        return d >= weekStart && d <= weekEnd
      }).length
      return { week: format(weekStart, 'MMM d'), count }
    })

    // Top 5 tags
    const topTags = allTags
      .map((t) => ({
        name: t.name,
        count: t._count.entries + t._count.projects + t._count.resources,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({ totalEntries, totalProjects, totalResources, streak, weeklyActivity, topTags })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
