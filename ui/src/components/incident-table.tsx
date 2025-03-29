import { Fragment } from 'react'

import IncidentExpandedRow from './incident-expanded-row'

import { IncidentBadge } from '@/components/incident-badge'
import { SeverityBadge } from '@/components/severity-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Incident } from '@/types'

interface IncidentTableProps {
  incidents: Incident[]
  expandedRowId: string | null
  // eslint-disable-next-line no-unused-vars
  toggleExpandedRow: (id: string) => void
}

const IncidentTable = ({ incidents, expandedRowId, toggleExpandedRow }: IncidentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[45%]">Incident</TableHead>
          <TableHead className="w-[10%]">Type</TableHead>
          <TableHead className="w-[10%]">Severity</TableHead>
          <TableHead className="w-[25%]">Location</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {incidents.map(incident => (
          <Fragment key={incident.id}>
            <TableRow
              onClick={() => toggleExpandedRow(incident.id)}
              className="cursor-pointer hover:bg-muted/50 transition"
            >
              <TableCell className="font-medium">{incident.description.split('.')[0]}.</TableCell>
              <TableCell>
                <IncidentBadge type={incident.type} />
              </TableCell>
              <TableCell>
                <SeverityBadge severity={incident.severity} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">
                {incident.address}
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
