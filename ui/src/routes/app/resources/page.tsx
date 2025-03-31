import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import ResourceForm from '@/components/resource-form'
import ResourceTable from '@/components/resource-table'
import { Button } from '@/components/ui/button'
import { getAppRoute } from '@/config'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { Resource, ResourceCategory } from '@/types/api'

const ResourcesPage = () => {
  const location = useLocation()
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        const response = await api.get('/resources', token)
        if (response.status === 200) {
          setResources(response.data as Resource[])
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error)
      }
    }

    fetchResources()
  }, [])

  const groupedResources = resources.reduce(
    (acc, res) => {
      if (!acc[res.category]) acc[res.category] = []
      acc[res.category].push(res)
      return acc
    },
    {} as Record<ResourceCategory, Resource[]>,
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

        {showForm && (
          <ResourceForm
            onCancel={() => setShowForm(false)}
            onCreate={resource => {
              setResources(prev => [...prev, resource])
              setShowForm(false)
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedResources).map(([category, resList]) => (
            <ResourceTable key={category} title={category} resources={resList} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ResourcesPage
