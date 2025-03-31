import { Fragment, MouseEvent } from 'react'

import IncidentExpandedRow from './incident-expanded-row'

import { IncidentBadge } from '@/components/incident-badge'
import { SeverityBadge } from '@/components/severity-badge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMqtt } from '@/context'
import { Incident, StatusType } from '@/types'

interface IncidentTableProps {
  incidents: Incident[]
  expandedRowId: string | null
  toggleExpandedRow: (id: string) => void
}

const IncidentTable = ({ incidents, expandedRowId, toggleExpandedRow }: IncidentTableProps) => {
  const { updateIncidentStatus, createIncident } = useMqtt()

  const handleResolveIncident = async (e: MouseEvent, incidentId: string) => {
    e.stopPropagation()
    await updateIncidentStatus(incidentId, StatusType.RESOLVED)
  }

  const handleTryAgain = async (e: MouseEvent, incidentId: string) => {
    e.stopPropagation()

    await createIncident({
      id: incidentId,
      status: StatusType.PENDING,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10%] text-secondary">Severity</TableHead>

          <TableHead className="w-[40%] text-secondary">Description</TableHead>
          <TableHead className="w-[15%] text-secondary">Incident Type</TableHead>
          <TableHead className="w-[20%] text-secondary">Location</TableHead>
          <TableHead className="w-[15%] text-secondary text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map(incident => (
          <Fragment key={incident.id}>
            <TableRow
              onClick={() => toggleExpandedRow(incident.id)}
              className="cursor-pointer hover:bg-muted/50 transition"
            >
              <TableCell>
                <SeverityBadge severity={incident.severity} />
              </TableCell>
              <TableCell className="font-medium">{incident.description.split('.')[0]}.</TableCell>
              <TableCell>
                <b>{incident.type}</b>
              </TableCell>

              <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">
                {incident.address}
              </TableCell>
              <TableCell className="text-center">
                {incident.status === StatusType.ACTIVE && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => handleResolveIncident(e, incident.id)}
                  >
                    Resolve
                  </Button>
                )}
                {incident.stillPending && (
                  <div className="space-y-1">
                    <p className="text-xs text-amber-600 font-medium">
                      Requested resources unavailable
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => handleTryAgain(e, incident.id)}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
            {expandedRowId === incident.id && <IncidentExpandedRow incident={incident} />}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

export default IncidentTable
