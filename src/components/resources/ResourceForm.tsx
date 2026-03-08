'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resourceSchema, ResourceInput } from '@/lib/validations'
import axios from 'axios'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Resource } from '@/types'

interface Props {
  resource?: Resource
  onClose: () => void
  onSuccess: () => void
}

export function ResourceForm({ resource, onClose, onSuccess }: Props) {
  const [tagInput, setTagInput] = useState(resource?.tags.map((t) => t.name).join(', ') ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResourceInput>({
    resolver: zodResolver(resourceSchema),
    defaultValues: resource
      ? { url: resource.url, title: resource.title, category: resource.category, notes: resource.notes ?? '' }
      : { category: 'Article' },
  })

  const onSubmit = async (data: ResourceInput) => {
    setIsSubmitting(true)
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean)
    try {
      if (resource) {
        await axios.put(`/api/resources/${resource.id}`, { ...data, tags })
      } else {
        await axios.post('/api/resources', { ...data, tags })
      }
      onSuccess()
    } catch {
      console.error('Failed to save resource')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={resource ? 'Edit Resource' : 'New Resource'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="URL" error={errors.url?.message}>
          <input {...register('url')} className={inputClass} placeholder="https://..." />
        </FormField>

        <FormField label="Title" error={errors.title?.message}>
          <input {...register('title')} className={inputClass} placeholder="Resource title" />
        </FormField>

        <FormField label="Category">
          <select {...register('category')} className={inputClass}>
            {['Article', 'Video', 'Docs', 'Course', 'Other'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Notes" hint="(optional)">
          <textarea {...register('notes')} rows={3} className={inputClass + ' resize-none'} placeholder="What's this about?" />
        </FormField>

        <FormField label="Tags" hint="(comma separated)">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className={inputClass} placeholder="React, Tutorial" />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
            {isSubmitting ? 'Saving...' : resource ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
