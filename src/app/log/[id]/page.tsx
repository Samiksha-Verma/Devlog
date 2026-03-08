'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Entry } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { TagChip } from '@/components/ui/TagChip'
import { Skeleton } from '@/components/ui/Skeleton'
import { EntryForm } from '@/components/entries/EntryForm'
import { useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/lib/toast'

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const { data: entry, isLoading } = useQuery<Entry>({
    queryKey: ['entry', id],
    queryFn: () => axios.get(`/api/entries/${id}`).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      toast.success('Entry deleted')
      router.push('/log')
    },
  })

  if (isLoading) return (
    <div className="space-y-4 max-w-3xl">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )

  if (!entry) return <p className="text-gray-500">Entry not found.</p>

  return (
    <div className="max-w-3xl">
      {editing && (
        <EntryForm
          entry={entry}
          onClose={() => setEditing(false)}
          onSuccess={() => {
            setEditing(false)
            queryClient.invalidateQueries({ queryKey: ['entry', id] })
            queryClient.invalidateQueries({ queryKey: ['entries'] })
            toast.success('Entry updated!')
          }}
        />
      )}

      <Link href="/log" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Log
      </Link>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold leading-tight">{entry.title}</h1>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Pencil size={16} className="text-gray-400" />
            </button>
            <button onClick={() => deleteMutation.mutate()} className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</span>
          {entry.project && (
            <Link href={`/projects/${entry.project.id}`}>
              <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-full font-medium hover:opacity-80 transition-opacity">
                {entry.project.name}
              </span>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {entry.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.body}</p>
        </div>

        {entry.resources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold mb-3 text-sm">Linked Resources</h3>
            <div className="space-y-2">
              {entry.resources.map((r) => (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  {r.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
