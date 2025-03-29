import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ResourceCategory, ResourceType, StatusType } from '@/types/api'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/lib/firebase'
import { api } from '@/lib/api'

const AddResourceForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    status: '',
    averageSpeed: '',
    currentAddress: '',
    isAssigned: false,
    incidentId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setFormData(prev => ({ ...prev, isAssigned: !prev.isAssigned }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = await auth.currentUser?.getIdToken()

      const newResource = {
        id: uuidv4(),
        type: formData.type,
        category: formData.category,
        status: formData.status,
        averageSpeed: parseInt(formData.averageSpeed, 10),
        currentLocation: {
          address: formData.currentAddress,
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        isAssigned: formData.isAssigned,
        incidentId: formData.isAssigned ? formData.incidentId : null,
        capabilities: [],
        lastUpdatedAt: new Date().toISOString(),
      }
      const resourceString = JSON.stringify(newResource)
      const response = await api.post('/resources', token, resourceString)
      console.log('Resource created:', response)
      // Reset form if needed
    } catch (error) {
      console.error('Error submitting resource:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Add New Resource</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ResourceType).map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ResourceCategory).map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Address</Label>
            <Input name="currentAddress" value={formData.currentAddress} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <Checkbox
              id="isAssigned"
              checked={formData.isAssigned}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isAssigned">Assigned to Incident?</Label>
          </div>

          {formData.isAssigned && (
            <div className="md:col-span-2">
              <Label>Incident ID</Label>
              <Input name="incidentId" value={formData.incidentId} onChange={handleChange} />
            </div>
          )}

          <div className="md:col-span-2">
            <Button type="submit">Submit</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default AddResourceForm
