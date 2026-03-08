import { z } from 'zod'

export const entrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1, 'Body is required'),
  date: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  projectId: z.string().optional().nullable(),
  resourceIds: z.array(z.string()).optional().default([]),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Idea', 'Building', 'Shipped', 'Paused']).default('Idea'),
  liveUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  repoUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
})

export const resourceSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  title: z.string().min(1, 'Title is required').max(200),
  category: z.enum(['Article', 'Video', 'Docs', 'Course', 'Other']).default('Article'),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  entryIds: z.array(z.string()).optional().default([]),
  projectIds: z.array(z.string()).optional().default([]),
})

export type EntryInput = z.infer<typeof entrySchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type ResourceInput = z.infer<typeof resourceSchema>
