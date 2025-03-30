import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CategoryToTypesMap, Resource, ResourceCategory, ResourceType } from '@/types/api'
import { auth } from '@/lib'
import { api } from '@/lib/api'

type Props = {
  onCancel: () => void
  onCreate: (resource: Resource) => void
}

const ResourceForm = ({ onCancel, onCreate }: Props) => {
  const [category, setCategory] = useState<ResourceCategory | undefined>()
  const [type, setType] = useState<ResourceType | undefined>()

  const handleCreate = async () => {
    if (!category || !type) return

    try {
      const token = await auth.currentUser?.getIdToken()

      const newResource: Resource = {
        id: uuidv4(),
        category,
        type,
        isAllocated: false,
      }

      const response = await api.post('/resources', token, newResource)

      if (response.status === 201) {
        onCreate(response.data as Resource)
      }
    } catch (error) {
      console.error('Failed to create resource:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Resource</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={category}
          onValueChange={val => {
            setCategory(val as ResourceCategory)
            setType(undefined)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ResourceCategory).map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {category && (
          <Select value={type} onValueChange={val => setType(val as ResourceType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Resource Type" />
            </SelectTrigger>
            <SelectContent>
              {CategoryToTypesMap[category].map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <Button onClick={handleCreate}>Create Resource</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceForm
