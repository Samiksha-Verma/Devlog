'use client'

import { Entry } from '@/types'
import { formatDate, truncate } from '@/lib/utils'
import { Trash2, Pencil, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { TagChip } from '@/components/ui/TagChip'

interface Props {
  entry: Entry
  onDelete: () => void
  onEdit: () => void
}

export function EntryCard({ entry, onDelete, onEdit }: Props) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all bg-white dark:bg-gray-900 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/log/${entry.id}`}>
              <h3 className="font-semibold text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {entry.title}
              </h3>
            </Link>
            <Link href={`/log/${entry.id}`}>
              <ExternalLink size={13} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {truncate(entry.body, 180)}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
            {entry.project && (
              <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                {entry.project.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <Pencil size={14} className="text-gray-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
