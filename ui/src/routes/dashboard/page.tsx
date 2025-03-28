import { useState } from 'react'
import IncidentTable from '@/components/ui/incident-table'
import DashboardSection from '@/components/ui/dashboard-section'

const DashboardPage = () => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const toggleExpandedRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id))
  }

  const mockIncidents = [
    {
      id: '1',
      type: 'Fire',
      severity: 'High',
      status: 'Active',
      location: {
        address: '123 River Rd',
        coordinates: { latitude: 45.42, longitude: -75.69 },
      },
      description:
        'A large warehouse fire involving multiple units. Hazmat response is required due to chemical materials stored on-site.',
      reportedAt: '2025-03-28T08:00:00Z',
      lastUpdatedAt: '2025-03-28T09:00:00Z',
      tags: ['fire', 'hazmat'],
    },
    {
      id: '2',
      type: 'Natural Disaster',
      severity: 'Medium',
      status: 'Resolved',
      location: {
        address: '456 Lakeview Dr',
        coordinates: { latitude: 45.45, longitude: -75.6 },
      },
      description:
        'Flooding in residential basements caused by excessive rainfall and sewer backup. Pumping complete.',
      reportedAt: '2025-03-25T10:00:00Z',
      lastUpdatedAt: '2025-03-26T12:00:00Z',
      tags: ['water'],
    },
    {
      id: '3',
      type: 'Natural Disaster',
      severity: 'High',
      status: 'Resolved',
      location: {
        address: '789 Mountain Rd',
        coordinates: { latitude: 45.47, longitude: -75.7 },
      },
      description:
        'Minor earthquake with aftershocks. No structural damage but temporary evacuation issued.',
      reportedAt: '2025-03-22T14:00:00Z',
      lastUpdatedAt: '2025-03-23T08:00:00Z',
      tags: ['quake'],
    },
    {
      id: '4',
      type: 'Fire',
      severity: 'Low',
      status: 'Active',
      location: {
        address: '12 Hillcrest Ave',
        coordinates: { latitude: 45.48, longitude: -75.62 },
      },
      description: 'A brush fire in a vacant lot. Contained quickly with no property damage.',
      reportedAt: '2025-03-28T07:45:00Z',
      lastUpdatedAt: '2025-03-28T08:30:00Z',
      tags: ['fire'],
    },
    {
      id: '5',
      type: 'Hazmat',
      severity: 'High',
      status: 'Resolved',
      location: {
        address: '99 Rainy Ln',
        coordinates: { latitude: 45.43, longitude: -75.65 },
      },
      description: 'Nuclear meltdown',
      reportedAt: '2025-03-20T09:00:00Z',
      lastUpdatedAt: '2025-03-21T11:00:00Z',
      tags: ['water'],
    },
  ]
  const activeIncidents = mockIncidents.filter(i => i.status === 'Active')
  const resolvedIncidents = mockIncidents
    .filter(i => i.status === 'Resolved')
    .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6 m-4">
      <h1 className="text-2xl font-bold text-primary">Incidents Dashboard</h1>

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
  )
}

export default DashboardPage
