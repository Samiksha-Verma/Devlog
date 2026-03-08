import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
  hint?: string
}

export function FormField({ label, error, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export const inputClass = cn(
  'w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm',
  'bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  'disabled:opacity-50 placeholder:text-gray-400'
)
