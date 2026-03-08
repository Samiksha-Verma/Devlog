'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Resource } from '@/types'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { ResourceForm } from '@/components/resources/ResourceForm'
import { useState } from 'react'
import { Plus, Bookmark } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'Article', 'Video', 'Docs', 'Course', 'Other']

export default function ResourcesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [filter, setFilter] = useState('All')
  const [showFavOnly, setShowFavOnly] = useState(false)
  const queryClient = useQueryClient()

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: () => axios.get('/api/resources').then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/resources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Resource deleted')
    },
    onError: () => toast.error('Failed to delete resource'),
  })

  const filtered = resources?.filter((r) => {
    if (filter !== 'All' && r.category !== filter) return false
    if (showFavOnly && !r.isFavourite) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {resources?.length ?? 0} saved
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Save Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              filter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
            )}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setShowFavOnly(!showFavOnly)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors ml-2',
            showFavOnly
              ? 'bg-yellow-400 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-yellow-300'
          )}
        >
          ★ Favourites
        </button>
      </div>

      {(showForm || editingResource) && (
        <ResourceForm
          resource={editingResource ?? undefined}
          onClose={() => { setShowForm(false); setEditingResource(null) }}
          onSuccess={() => {
            setShowForm(false)
            setEditingResource(null)
            queryClient.invalidateQueries({ queryKey: ['resources'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast.success(editingResource ? 'Resource updated!' : 'Resource saved!')
          }}
        />
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      )}

      {!isLoading && filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
          <Bookmark size={52} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No resources found</p>
          <p className="text-sm mt-1">
            {filter !== 'All' || showFavOnly ? 'Try changing your filters' : 'Save your first resource!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered?.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onEdit={() => setEditingResource(resource)}
            onDelete={() => deleteMutation.mutate(resource.id)}
          />
        ))}
      </div>
    </div>
  )
}
