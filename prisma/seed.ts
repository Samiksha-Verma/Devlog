import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tagNames = ['React', 'TypeScript', 'Next.js', 'DSA', 'System Design', 'CSS', 'Node.js', 'Prisma']
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  )

  const project1 = await prisma.project.create({
    data: {
      name: 'DevLog',
      description: 'A developer learning journal built with Next.js 15, Prisma, and Tailwind CSS.',
      status: 'Building',
      repoUrl: 'https://github.com/yourusername/devlog',
      tags: { connect: [tags[0], tags[1], tags[2]].map((t) => ({ id: t.id })) },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Portfolio Site',
      description: 'Personal portfolio showcasing projects and skills.',
      status: 'Shipped',
      liveUrl: 'https://yourportfolio.dev',
      repoUrl: 'https://github.com/yourusername/portfolio',
      tags: { connect: [tags[0], tags[5]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.project.create({
    data: {
      name: 'DSA Practice Tracker',
      description: 'Track LeetCode and DSA problem solving progress.',
      status: 'Idea',
      tags: { connect: [tags[3]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.entry.create({
    data: {
      title: 'Learned React Query basics',
      body: 'React Query makes data fetching so much cleaner. No more manual useEffect for API calls! Key concepts: useQuery for fetching, useMutation for writes, and invalidateQueries to refresh data.',
      date: new Date(),
      tags: { connect: [tags[0], tags[1]].map((t) => ({ id: t.id })) },
      projectId: project1.id,
    },
  })

  await prisma.entry.create({
    data: {
      title: 'Understanding Next.js App Router',
      body: 'The App Router uses Server Components by default. You need "use client" directive for client components. Layouts wrap pages automatically. API routes go in app/api/.',
      date: new Date(Date.now() - 86400000),
      tags: { connect: [tags[2]].map((t) => ({ id: t.id })) },
      projectId: project1.id,
    },
  })

  await prisma.entry.create({
    data: {
      title: 'Prisma ORM with SQLite',
      body: 'Prisma makes DB work super easy. Define schema → migrate → use the generated client. Relations are handled beautifully with connect/disconnect syntax.',
      date: new Date(Date.now() - 2 * 86400000),
      tags: { connect: [tags[7], tags[1]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.entry.create({
    data: {
      title: 'Solved Binary Search problems',
      body: 'Completed 5 LeetCode binary search problems today. Key insight: always define what lo and hi represent precisely before writing the loop.',
      date: new Date(Date.now() - 3 * 86400000),
      tags: { connect: [tags[3]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.entry.create({
    data: {
      title: 'Tailwind CSS dark mode setup',
      body: 'Used next-themes with Tailwind class strategy for dark mode. Add suppressHydrationWarning to html tag to avoid hydration mismatch.',
      date: new Date(Date.now() - 5 * 86400000),
      tags: { connect: [tags[5], tags[2]].map((t) => ({ id: t.id })) },
      projectId: project2.id,
    },
  })

  await prisma.resource.create({
    data: {
      url: 'https://tanstack.com/query/latest',
      title: 'TanStack Query Docs',
      category: 'Docs',
      notes: 'Official docs for React Query v5',
      isRead: true,
      isFavourite: true,
      tags: { connect: [tags[0]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.resource.create({
    data: {
      url: 'https://www.prisma.io/docs',
      title: 'Prisma Documentation',
      category: 'Docs',
      notes: 'Full Prisma ORM reference',
      isRead: false,
      isFavourite: true,
      tags: { connect: [tags[7]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.resource.create({
    data: {
      url: 'https://nextjs.org/docs',
      title: 'Next.js 15 Docs',
      category: 'Docs',
      notes: 'App Router documentation',
      isRead: true,
      isFavourite: false,
      tags: { connect: [tags[2]].map((t) => ({ id: t.id })) },
    },
  })

  await prisma.resource.create({
    data: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'System Design Interview Course',
      category: 'Video',
      notes: 'Great intro to distributed systems concepts',
      isRead: false,
      isFavourite: false,
      tags: { connect: [tags[4]].map((t) => ({ id: t.id })) },
    },
  })

  console.log('✅ Database seeded successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
