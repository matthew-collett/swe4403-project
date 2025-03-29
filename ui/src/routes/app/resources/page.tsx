import { useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
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
import ResourceForm from '@/components/resource-form'
import { Resource, ResourceCategory } from '@/types/api'
import { auth } from '@/lib'
import { api } from '@/lib/api'

const ResourcesPage = () => {
  const location = useLocation()

  const [showForm, setShowForm] = useState(false)
  const [emergencyResources, setEmergencyResources] = useState<Resource[]>([])
  const [nonEmergencyResources, setNonEmergencyResources] = useState<Resource[]>([])
  const [supportResources, setSupportResources] = useState<Resource[]>([])
  const [administrativeResources, setAdministrativeResources] = useState<Resource[]>([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        const response = await api.get('/resources', token)

        if (response.status === 200) {
          const allResources = response.data as Resource[]
          setEmergencyResources(allResources.filter(r => r.category === ResourceCategory.EMERGENCY))
          setNonEmergencyResources(
            allResources.filter(r => r.category === ResourceCategory.NON_EMERGENCY),
          )
          setSupportResources(allResources.filter(r => r.category === ResourceCategory.SUPPORT))
          setAdministrativeResources(
            allResources.filter(r => r.category === ResourceCategory.ADMINISTRATIVE),
          )
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error)
      }
    }

    fetchResources()
  }, [])

  const renderResourceTable = (title: string, resources: Resource[]) => (
    <Card key={title}>
      <CardHeader>
        <CardTitle>{title} Resources</CardTitle>
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
                  {res.currentLocation?.address}
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
  )

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

        {showForm && <ResourceForm />}

        {renderResourceTable('Emergency', emergencyResources)}
        {renderResourceTable('Non-Emergency', nonEmergencyResources)}
        {renderResourceTable('Support', supportResources)}
        {renderResourceTable('Administrative', administrativeResources)}
      </div>
    </>
  )
}

export default ResourcesPage
