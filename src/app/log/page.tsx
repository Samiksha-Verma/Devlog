'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Entry } from '@/types'
import { EntryCard } from '@/components/entries/EntryCard'
import { EntryForm } from '@/components/entries/EntryForm'
import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/toast'

export default function LogPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const queryClient = useQueryClient()

  const { data: entries, isLoading } = useQuery<Entry[]>({
    queryKey: ['entries'],
    queryFn: () => axios.get('/api/entries').then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Entry deleted')
    },
    onError: () => toast.error('Failed to delete entry'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Learning Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {entries?.length ?? 0} entries
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {(showForm || editingEntry) && (
        <EntryForm
          entry={editingEntry ?? undefined}
          onClose={() => { setShowForm(false); setEditingEntry(null) }}
          onSuccess={() => {
            setShowForm(false)
            setEditingEntry(null)
            queryClient.invalidateQueries({ queryKey: ['entries'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast.success(editingEntry ? 'Entry updated!' : 'Entry created!')
          }}
        />
      )}

      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      )}

      {!isLoading && entries?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
          <BookOpen size={52} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No entries yet</p>
          <p className="text-sm mt-1">Start logging your learnings!</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Add your first entry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {entries?.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onEdit={() => setEditingEntry(entry)}
            onDelete={() => deleteMutation.mutate(entry.id)}
          />
        ))}
      </div>
    </div>
  )
}
