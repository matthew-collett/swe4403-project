import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import DashboardSection from '@/components/dashboard-section'
import IncidentTable from '@/components/incident-table'
import { getAppRoute } from '@/config'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { Incident } from '@/types'
import IncidentForm from '@/components/incident-form'
import { Button } from '@/components/ui/button'
const DashboardPage = () => {
  const location = useLocation()
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [openIncidents, setOpenIncidents] = useState<Incident[]>([])
  const [closedIncidents, setClosedIncidents] = useState<Incident[]>([])
  const [showForm, setShowForm] = useState(false)
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        const [openResponse, closedResponse] = await Promise.all([
          api.get('/incidents/status?status=open', token),
          api.get('/incidents/status?status=closed', token),
        ])

        if (openResponse.status === 200) {
          setOpenIncidents(openResponse.data as Incident[])
        }

        if (closedResponse.status === 200) {
          setClosedIncidents(closedResponse.data as Incident[])
        }
      } catch (error) {
        console.error('Failed to fetch incidents:', error)
      }
    }

    fetchIncidents()
  }, [])

  const toggleExpandedRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id))
  }

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Resources</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Resource'}
          </Button>
        </div>

        {showForm && <IncidentForm />}
        <DashboardSection title="Active Incidents">
          <IncidentTable
            incidents={openIncidents}
            expandedRowId={expandedRowId}
            toggleExpandedRow={toggleExpandedRow}
          />
        </DashboardSection>
        <DashboardSection title="Recent Resolved Incidents" titleRight="shows last 10">
          <IncidentTable
            incidents={closedIncidents}
            expandedRowId={expandedRowId}
            toggleExpandedRow={toggleExpandedRow}
          />
        </DashboardSection>
      </div>
    </>
  )
}

export default DashboardPage
