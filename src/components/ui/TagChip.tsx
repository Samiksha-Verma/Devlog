import { Tag } from '@/types'

export function TagChip({ tag }: { tag: Tag }) {
  return (
    <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
      {tag.name}
    </span>
  )
}

export function TagInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags <span className="text-gray-400 font-normal">(comma separated)</span>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="React, TypeScript, DSA"
      />
    </div>
  )
}
