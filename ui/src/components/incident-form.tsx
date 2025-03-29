import { ChangeEvent, FormEvent, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMqtt } from '@/context'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { IncidentType, SeverityType, StatusType } from '@/types/api'

const IncidentForm = () => {
  const { createIncident } = useMqtt()
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    status: '',
    address: '',
    description: '',
    reportedAt: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const incident = {
      id: uuidv4(),
      type: formData.type,
      severity: formData.severity,
      status: StatusType.PENDING,
      address: formData.address,
      description: formData.description,
      reportedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    }
    const incidentJson = JSON.stringify(incident)

    try {
      const token = await auth.currentUser?.getIdToken()
      const response = await api.post('/incidents', token, incidentJson)
      createIncident({
        id: incident.id,
        status: incident.status,
        updatedAt: incident.lastUpdatedAt,
      })
      window.location.reload()

      console.log('Incident created:', response)
    } catch (error) {
      console.error('Error submitting incident:', error)
    }
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
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} />
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
