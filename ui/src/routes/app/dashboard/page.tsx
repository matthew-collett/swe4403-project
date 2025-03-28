import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import DashboardSection from '@/components/dashboard-section'
import IncidentTable from '@/components/incident-table'
import { getAppRoute } from '@/config'
import { IncidentType, SeverityType, StatusType } from '@/types'

const DashboardPage = () => {
  const location = useLocation()
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const toggleExpandedRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id))
  }

  const mockIncidents = [
    {
      id: '1',
      type: IncidentType.FIRE,
      severity: SeverityType.HIGH,
      status: StatusType.OPEN,
      address: '123 River Rd',
      description:
        'A large warehouse fire involving multiple units. Hazmat response is required due to chemical materials stored on-site.',
      reportedAt: new Date('2025-03-28T08:00:00Z'),
      lastUpdatedAt: new Date('2025-03-28T09:00:00Z'),
    },
    {
      id: '2',
      type: IncidentType.NATURAL_DISASTER,
      severity: SeverityType.MEDIUM,
      status: StatusType.RESOLVED,
      address: '456 Lakeview Dr',
      description:
        'Flooding in residential basements caused by excessive rainfall and sewer backup. Pumping complete.',
      reportedAt: new Date('2025-03-25T10:00:00Z'),
      lastUpdatedAt: new Date('2025-03-26T12:00:00Z'),
    },
    {
      id: '3',
      type: IncidentType.NATURAL_DISASTER,
      severity: SeverityType.HIGH,
      status: StatusType.RESOLVED,
      address: '789 Mountain Rd',
      description:
        'Minor earthquake with aftershocks. No structural damage but temporary evacuation issued.',
      reportedAt: new Date('2025-03-22T14:00:00Z'),
      lastUpdatedAt: new Date('2025-03-23T08:00:00Z'),
    },
    {
      id: '4',
      type: IncidentType.FIRE,
      severity: SeverityType.LOW,
      status: StatusType.OPEN,
      address: '12 Hillcrest Ave',
      description: 'A brush fire in a vacant lot. Contained quickly with no property damage.',
      reportedAt: new Date('2025-03-28T07:45:00Z'),
      lastUpdatedAt: new Date('2025-03-28T08:30:00Z'),
    },
    {
      id: '5',
      type: IncidentType.HAZMAT,
      severity: SeverityType.HIGH,
      status: StatusType.RESOLVED,
      address: '99 Rainy Ln',
      description: 'Nuclear meltdown',
      reportedAt: new Date('2025-03-20T09:00:00Z'),
      lastUpdatedAt: new Date('2025-03-21T11:00:00Z'),
    },
  ]

  const activeIncidents = mockIncidents.filter(i => i.status === StatusType.OPEN)
  const resolvedIncidents = mockIncidents
    .filter(i => i.status === 'Resolved')
    .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
    .slice(0, 10)

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="space-y-5">
        <DashboardSection title="Active Incidents">
          <IncidentTable
            incidents={activeIncidents}
            expandedRowId={expandedRowId}
            toggleExpandedRow={toggleExpandedRow}
          />
        </DashboardSection>
        <DashboardSection title="Recent Resolved Incidents" titleRight="shows last 10">
          <IncidentTable
            incidents={resolvedIncidents}
            expandedRowId={expandedRowId}
            toggleExpandedRow={toggleExpandedRow}
          />
        </DashboardSection>
      </div>
    </>
  )
}

export default DashboardPage
