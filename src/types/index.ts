export type ProjectStatus = 'Idea' | 'Building' | 'Shipped' | 'Paused'
export type ResourceCategory = 'Article' | 'Video' | 'Docs' | 'Course' | 'Other'

export interface Tag {
  id: string
  name: string
}

export interface Entry {
  id: string
  title: string
  body: string
  date: string
  tags: Tag[]
  resources: Resource[]
  projectId?: string | null
  project?: Project | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  liveUrl?: string | null
  repoUrl?: string | null
  tags: Tag[]
  entries: Entry[]
  resources: Resource[]
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  url: string
  title: string
  category: ResourceCategory
  notes?: string | null
  isRead: boolean
  isFavourite: boolean
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalEntries: number
  totalProjects: number
  totalResources: number
  streak: number
  weeklyActivity: { week: string; count: number }[]
  topTags: { name: string; count: number }[]
}
