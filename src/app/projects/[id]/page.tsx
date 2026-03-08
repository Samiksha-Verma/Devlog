'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Project } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { TagChip } from '@/components/ui/TagChip'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { StatusBadge } from '@/components/projects/StatusBadge'
import { useState } from 'react'
import { ArrowLeft, Pencil, Trash2, ExternalLink, Github, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/lib/toast'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => axios.get(`/api/projects/${id}`).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted')
      router.push('/projects')
    },
  })

  if (isLoading) return (
    <div className="space-y-4 max-w-3xl">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )

  if (!project) return <p className="text-gray-500">Project not found.</p>

  return (
    <div className="max-w-3xl">
      {editing && (
        <ProjectForm
          project={project}
          onClose={() => setEditing(false)}
          onSuccess={() => {
            setEditing(false)
            queryClient.invalidateQueries({ queryKey: ['project', id] })
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            toast.success('Project updated!')
          }}
        />
      )}

      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Pencil size={16} className="text-gray-400" />
            </button>
            <button onClick={() => deleteMutation.mutate()} className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <StatusBadge status={project.status} />
          {project.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)}
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{project.description}</p>

        <div className="flex items-center gap-3">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Github size={16} /> Repository
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ExternalLink size={16} /> Live Site
            </a>
          )}
        </div>
      </div>

      {/* Linked Entries */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={16} />
          Log Entries
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{project.entries.length}</span>
        </h2>
        {project.entries.length === 0 ? (
          <p className="text-sm text-gray-400">No entries linked to this project yet.</p>
        ) : (
          <div className="space-y-3">
            {project.entries.map((entry) => (
              <Link key={entry.id} href={`/log/${entry.id}`}>
                <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{entry.title}</p>
                    <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {entry.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
