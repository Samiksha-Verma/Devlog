'use client'

import { Resource } from '@/types'
import { ExternalLink, Trash2, Pencil, Star, BookCheck, Book } from 'lucide-react'
import { TagChip } from '@/components/ui/TagChip'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/lib/toast'

const categoryColors: Record<string, string> = {
  Article: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
  Video: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
  Docs: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
  Course: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
  Other: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

interface Props {
  resource: Resource
  onDelete: () => void
  onEdit: () => void
}

export function ResourceCard({ resource, onDelete, onEdit }: Props) {
  const queryClient = useQueryClient()

  const toggle = async (field: 'isRead' | 'isFavourite') => {
  // Optimistically update the cache IMMEDIATELY before API call
  queryClient.setQueryData(['resources'], (old: Resource[] | undefined) => {
    if (!old) return old
    return old.map((r) =>
      r.id === resource.id ? { ...r, [field]: !r[field] } : r
    )
  })

  try {
    await axios.patch(`/api/resources/${resource.id}`, { [field]: !resource[field] })
    toast.success(
      field === 'isRead'
        ? resource.isRead ? 'Marked unread' : 'Marked read'
        : resource.isFavourite ? 'Removed from favourites' : 'Added to favourites'
    )
  } catch {
    // If API fails, roll back
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    toast.error('Failed to update')
  }
}

  return (
    <div className={cn(
      'border rounded-xl p-4 bg-white dark:bg-gray-900 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all group',
      resource.isRead ? 'border-gray-200 dark:border-gray-800' : 'border-indigo-200 dark:border-indigo-900'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', categoryColors[resource.category] ?? categoryColors['Other'])}>
              {resource.category}
            </span>
            {!resource.isRead && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">New</span>
            )}
          </div>
          <a href={resource.url} target="_blank" rel="noopener noreferrer"
            className="font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            {resource.title}
            <ExternalLink size={12} className="text-gray-400 shrink-0" />
          </a>
          {resource.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{resource.notes}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {resource.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Pencil size={13} className="text-gray-400" />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-md">
              <Trash2 size={13} className="text-red-400" />
            </button>
          </div>
          <button onClick={() => toggle('isFavourite')} className="p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-950 rounded-md transition-colors">
            <Star size={14} className={resource.isFavourite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
          </button>
          <button onClick={() => toggle('isRead')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            {resource.isRead
              ? <BookCheck size={14} className="text-emerald-500" />
              : <Book size={14} className="text-gray-300" />}
          </button>
        </div>
      </div>
    </div>
  )
}
