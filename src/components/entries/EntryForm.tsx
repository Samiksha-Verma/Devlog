'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entrySchema, EntryInput } from '@/lib/validations'
import axios from 'axios'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Entry } from '@/types'

interface Props {
  entry?: Entry
  onClose: () => void
  onSuccess: () => void
}

export function EntryForm({ entry, onClose, onSuccess }: Props) {
  const [tagInput, setTagInput] = useState(entry?.tags.map((t) => t.name).join(', ') ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: entry
      ? {
          title: entry.title,
          body: entry.body,
          date: new Date(entry.date).toISOString().slice(0, 10),
        }
      : { date: new Date().toISOString().slice(0, 10) },
  })

  const onSubmit = async (data: EntryInput) => {
    setIsSubmitting(true)
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    try {
      if (entry) {
        await axios.put(`/api/entries/${entry.id}`, { ...data, tags })
      } else {
        await axios.post('/api/entries', { ...data, tags })
      }
      onSuccess()
    } catch {
      console.error('Failed to save entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={entry ? 'Edit Entry' : 'New Entry'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Title" error={errors.title?.message}>
          <input {...register('title')} className={inputClass} placeholder="What did you learn?" />
        </FormField>

        <FormField label="Date">
          <input type="date" {...register('date')} className={inputClass} />
        </FormField>

        <FormField label="Notes" error={errors.body?.message}>
          <textarea
            {...register('body')}
            rows={6}
            className={inputClass + ' resize-none'}
            placeholder="Write your notes here..."
          />
        </FormField>

        <FormField label="Tags" hint="(comma separated)">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className={inputClass}
            placeholder="React, TypeScript, DSA"
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Saving...' : entry ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
