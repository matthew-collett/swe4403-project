import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IncidentBadge } from '@/components/ui/incident-badge'
import { SeverityBadge } from '@/components/ui/severity-badge'
import IncidentExpandedRow from './incident-expanded-row'

interface IncidentTableProps {
  incidents: any[]
  expandedRowId: string | null
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
          <>
            <TableRow
              key={incident.id}
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
                {incident.location.address}
              </TableCell>
            </TableRow>

            {expandedRowId === incident.id && <IncidentExpandedRow incident={incident} />}
          </>
        ))}
      </TableBody>
    </Table>
  )
}

export default IncidentTable
