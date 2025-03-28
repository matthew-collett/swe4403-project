import { useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ResourceType, ResourceCategory, StatusType } from '@/types/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockResources = [
  {
    id: '1',
    type: 'Ambulance',
    category: 'Medical',
    status: 'Available',
    averageSpeed: 80,
    currentLocation: {
      currentAddress: '123 Health Ave',
      coordinates: { latitude: 45.42, longitude: -75.69 },
    },
    isAssigned: false,
    incidentId: null,
    lastUpdatedAt: '2025-03-28T08:00:00Z',
  },
  {
    id: '2',
    type: 'Fire Truck',
    category: 'Support',
    status: 'En Route',
    averageSpeed: 60,
    currentLocation: {
      currentAddress: '456 Flame Rd',
      coordinates: { latitude: 45.45, longitude: -75.6 },
    },
    isAssigned: true,
    incidentId: 'INC123',
    lastUpdatedAt: '2025-03-28T08:30:00Z',
  },
  {
    id: '3',
    type: 'Drone',
    category: 'Transport',
    status: 'Available',
    averageSpeed: 100,
    currentLocation: {
      currentAddress: 'HQ Drone Port',
      coordinates: { latitude: 45.48, longitude: -75.7 },
    },
    isAssigned: false,
    incidentId: null,
    lastUpdatedAt: '2025-03-28T07:30:00Z',
  },
  {
    id: '4',
    type: 'Medical Tent',
    category: 'Medical',
    status: 'Deployed',
    averageSpeed: 0,
    currentLocation: {
      currentAddress: 'Incident Site Alpha',
      coordinates: { latitude: 45.5, longitude: -75.72 },
    },
    isAssigned: true,
    incidentId: 'INC345',
    lastUpdatedAt: '2025-03-28T09:15:00Z',
  },
]

const ResourcesPage = () => {
  const location = useLocation()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    status: '',
    averageSpeed: '',
    currentAddress: '',
    isAssigned: false,
    incidentId: '',
  })
  const enumToOptions = (enumObj: Record<string, string>) =>
    Object.values(enumObj).map(value => ({
      label: value,
      value,
    }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setFormData(prev => ({ ...prev, isAssigned: !prev.isAssigned }))
  }

  const resourcesByCategory = useMemo(() => {
    return mockResources.reduce((grouped: Record<string, typeof mockResources>, resource) => {
      if (!grouped[resource.category]) grouped[resource.category] = []
      grouped[resource.category].push(resource)
      return grouped
    }, {})
  }, [])

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />

      <div className="px-4 mt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Resources</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Resource'}
          </Button>
        </div>

        {showForm && (
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
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}
                >
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

              <div>
                <Label>Average Speed (km/h)</Label>
                <Input
                  name="averageSpeed"
                  type="number"
                  value={formData.averageSpeed}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                />
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
                <Button type="submit" disabled>
                  Submit (coming soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {Object.entries(resourcesByCategory).map(([category, resources]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category} Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Type</TableHead>
                    <TableHead className="w-[20%]">Status</TableHead>
                    <TableHead className="w-[30%]">Location</TableHead>
                    <TableHead className="w-[20%]">Assigned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map(res => (
                    <TableRow key={res.id}>
                      <TableCell>{res.type}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            res.status === 'Available'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : res.status === 'En Route'
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                : 'bg-slate-200 text-slate-800 hover:bg-slate-800'
                          }
                        >
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {res.currentLocation.currentAddress}
                      </TableCell>
                      <TableCell>
                        {res.isAssigned ? (
                          <span className="text-sm text-blue-700">{res.incidentId}</span>
                        ) : (
                          <span className="text-sm italic text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default ResourcesPage
