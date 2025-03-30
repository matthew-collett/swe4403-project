import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import DashboardSection from '@/components/dashboard-section'
import IncidentForm from '@/components/incident-form'
import IncidentTable from '@/components/incident-table'
import { Button } from '@/components/ui/button'
import { getAppRoute } from '@/config'
import { useMqtt } from '@/context'
import { StatusType } from '@/types'

const DashboardPage = () => {
  const location = useLocation()
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { incidents } = useMqtt()

  const activeIncidents = useMemo(() => {
    return Object.values(incidents)
      .filter(incident => incident.status === StatusType.ACTIVE)
      .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
  }, [incidents])

  const pendingIncidents = useMemo(() => {
    return Object.values(incidents)
      .filter(incident => incident.status === StatusType.PENDING)
      .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
  }, [incidents])

  const closedIncidents = useMemo(() => {
    return Object.values(incidents)
      .filter(incident => incident.status === StatusType.RESOLVED)
      .sort((a, b) => {
        return (
          new Date(b.lastUpdatedAt || b.lastUpdatedAt).getTime() -
          new Date(a.lastUpdatedAt || a.lastUpdatedAt).getTime()
        )
      })
      .slice(0, 10) // Get only the 10 most recent
  }, [incidents])

  const toggleExpandedRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id))
  }

  const handleFormSuccess = () => {
    setShowForm(false)
  }

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Incident'}
          </Button>
        </div>

        {showForm && <IncidentForm onSuccess={handleFormSuccess} />}

        <DashboardSection title="Active Incidents">
          {activeIncidents.length > 0 ? (
            <IncidentTable
              incidents={activeIncidents}
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
