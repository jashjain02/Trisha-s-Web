import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { CATEGORIES } from '../../utils/constants'
import type { Wish, WishCategory } from '../../types'

interface WishFormProps {
  initial?: Partial<Wish>
  onSubmit: (data: { title: string; description: string; category: WishCategory | string }) => Promise<void>
  onCancel: () => void
}

export function WishForm({ initial, onSubmit, onCancel }: WishFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<string>(initial?.category ?? '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.label,
    label: `${c.emoji} ${c.label}`,
  }))

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!category) e.category = 'Category is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Wish Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="I want Belgian Chocolate Ice Cream 🍦"
        error={errors.title}
        maxLength={100}
        autoFocus
      />
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Any extra details..."
        maxLength={300}
      />
      <Select
        label="Category"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
        placeholder="Pick a category..."
        error={errors.category}
      />
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<Sparkles size={14} />}
          fullWidth
        >
          {initial?.id ? 'Update Wish' : 'Post Wish'}
        </Button>
      </div>
    </form>
  )
}
