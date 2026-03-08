'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, ProjectInput } from '@/lib/validations'
import axios from 'axios'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Project } from '@/types'

interface Props {
  project?: Project
  onClose: () => void
  onSuccess: () => void
}

export function ProjectForm({ project, onClose, onSuccess }: Props) {
  const [tagInput, setTagInput] = useState(project?.tags.map((t) => t.name).join(', ') ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? { name: project.name, description: project.description, status: project.status, liveUrl: project.liveUrl ?? '', repoUrl: project.repoUrl ?? '' }
      : { status: 'Idea' },
  })

  const onSubmit = async (data: ProjectInput) => {
    setIsSubmitting(true)
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean)
    try {
      if (project) {
        await axios.put(`/api/projects/${project.id}`, { ...data, tags })
      } else {
        await axios.post('/api/projects', { ...data, tags })
      }
      onSuccess()
    } catch {
      console.error('Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={project ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Name" error={errors.name?.message}>
          <input {...register('name')} className={inputClass} placeholder="My awesome project" />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register('description')} rows={3} className={inputClass + ' resize-none'} placeholder="What are you building?" />
        </FormField>

        <FormField label="Status">
          <select {...register('status')} className={inputClass}>
            {['Idea', 'Building', 'Shipped', 'Paused'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Repo URL" hint="(optional)" error={errors.repoUrl?.message}>
          <input {...register('repoUrl')} className={inputClass} placeholder="https://github.com/..." />
        </FormField>

        <FormField label="Live URL" hint="(optional)" error={errors.liveUrl?.message}>
          <input {...register('liveUrl')} className={inputClass} placeholder="https://myproject.com" />
        </FormField>

        <FormField label="Tags" hint="(comma separated)">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className={inputClass} placeholder="React, TypeScript" />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
            {isSubmitting ? 'Saving...' : project ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
