import { ProjectStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  Idea: { label: '💡 Idea', className: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400' },
  Building: { label: '🔨 Building', className: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400' },
  Shipped: { label: '🚀 Shipped', className: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' },
  Paused: { label: '⏸ Paused', className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] ?? statusConfig['Idea']
  return (
    <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', config.className)}>
      {config.label}
    </span>
  )
}
