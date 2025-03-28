import { IncidentType, SeverityType, StatusType } from '@/types/api'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    status: '',
    address: '',
    description: '',
    reportedAt: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New Incident Submitted:', formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Incident Type</Label>
            <Select onValueChange={val => handleSelectChange('type', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IncidentType).map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Severity</Label>
            <Select onValueChange={val => handleSelectChange('severity', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Severity" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SeverityType).map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select onValueChange={val => handleSelectChange('status', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(StatusType).map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Reported At</Label>
            <Input
              type="datetime-local"
              name="reportedAt"
              value={formData.reportedAt}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="mt-2">
            Submit Incident
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default IncidentForm
