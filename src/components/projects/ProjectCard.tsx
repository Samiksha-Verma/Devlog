'use client'

import { Project } from '@/types'
import { ExternalLink, Github, Trash2, Pencil, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { TagChip } from '@/components/ui/TagChip'
import { StatusBadge } from './StatusBadge'
import { truncate } from '@/lib/utils'

interface Props {
  project: Project
  onDelete: () => void
  onEdit: () => void
}

export function ProjectCard({ project, onDelete, onEdit }: Props) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white dark:bg-gray-900 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all group flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-semibold text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
              {project.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {truncate(project.description, 120)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
            <Pencil size={14} className="text-gray-400" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-md">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={project.status} />
        {project.tags.map((tag) => (
          <TagChip key={tag.id} tag={tag} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <BookOpen size={13} />
          <span>{project.entries.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <Github size={14} className="text-gray-500" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <ExternalLink size={14} className="text-gray-500" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
