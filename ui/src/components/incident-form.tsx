import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'
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

interface IncidentFormProps {
  onSuccess?: () => void
}

const IncidentForm = ({ onSuccess }: IncidentFormProps) => {
  const { createIncident } = useMqtt()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const validateForm = () => {
    if (!formData.type) {
      toast.error('Please select an incident type')
      return false
    }
    if (!formData.severity) {
      toast.error('Please select a severity level')
      return false
    }
    if (!formData.address) {
      toast.error('Please enter an address')
      return false
    }
    if (!formData.description) {
      toast.error('Please enter a description')
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const incident = {
      id: uuidv4(),
      type: formData.type as IncidentType,
      severity: formData.severity as SeverityType,
      status: StatusType.PENDING,
      address: formData.address,
      description: formData.description,
      reportedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      stillPending: false,
    }

    const incidentJson = JSON.stringify(incident)

    try {
      const token = await auth.currentUser?.getIdToken()
      await api.post('/incidents', token, incidentJson)

      // Wait for the MQTT message to process
      await createIncident({
        id: incident.id,
        status: incident.status,
        updatedAt: incident.lastUpdatedAt,
      })

      toast.success('Incident submitted successfully')

      // Clear form
      setFormData({
        type: '',
        severity: '',
        status: '',
        address: '',
        description: '',
        reportedAt: '',
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error submitting incident:', error)
      toast.error('Error submitting incident. Please try again.')
    } finally {
      setIsSubmitting(false)
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
            <Select onValueChange={val => handleSelectChange('type', val)} value={formData.type}>
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
            <Select
              onValueChange={val => handleSelectChange('severity', val)}
              value={formData.severity}
            >
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
          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Incident'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default IncidentForm
