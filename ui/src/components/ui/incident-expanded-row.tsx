import { TableRow, TableCell } from '@/components/ui/table'

const IncidentExpandedRow = ({ incident }: { incident: any }) => {
  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Description:</strong> {incident.description}
          </p>
          <p>
            <strong>Reported:</strong>{' '}
            {new Date(incident.reportedAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
          <p>
            <strong>Last Updated:</strong>{' '}
            {new Date(incident.lastUpdatedAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default IncidentExpandedRow
