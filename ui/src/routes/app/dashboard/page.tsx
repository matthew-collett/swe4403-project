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
  const [pendingIncidents, setPendingIncidents] = useState<Incident[]>([])
  const [showForm, setShowForm] = useState(false)
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        const response = await api.get('/incidents', token)

        if (response.status === 200) {
          const allIncidents = response.data as Incident[]

          setOpenIncidents(allIncidents.filter(i => i.status === 'Open'))
          setClosedIncidents(allIncidents.filter(i => i.status === 'Closed'))
          setPendingIncidents(allIncidents.filter(i => i.status === 'Pending'))
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
          <h2 className="text-xl font-semibold">Incidents</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Incident'}
          </Button>
        </div>

        {showForm && <IncidentForm />}
        <DashboardSection title="Active Incidents">
          {openIncidents.length > 0 ? (
            <IncidentTable
              incidents={openIncidents}
              expandedRowId={expandedRowId}
              toggleExpandedRow={toggleExpandedRow}
            />
          ) : (
            <p className="text-muted-foreground italic text-sm">No active incidents found.</p>
          )}
        </DashboardSection>

        <DashboardSection title="Pending Incidents">
          {pendingIncidents.length > 0 ? (
            <IncidentTable
              incidents={pendingIncidents}
              expandedRowId={expandedRowId}
              toggleExpandedRow={toggleExpandedRow}
            />
          ) : (
            <p className="text-muted-foreground italic text-sm">No pending incidents.</p>
          )}
        </DashboardSection>

        <DashboardSection title="Recent Resolved Incidents" titleRight="shows last 10">
          {closedIncidents.length > 0 ? (
            <IncidentTable
              incidents={closedIncidents}
              expandedRowId={expandedRowId}
              toggleExpandedRow={toggleExpandedRow}
            />
          ) : (
            <p className="text-muted-foreground italic text-sm">No resolved incidents found.</p>
          )}
        </DashboardSection>
      </div>
    </>
  )
}

export default DashboardPage
