// resource-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Resource } from '@/types/api'

type Props = {
  title: string
  resources: Resource[]
}

const ResourceTable = ({ title, resources }: Props) => {
  // Group by type
  const groupedByType: Record<string, { total: number; inUse: number }> = {}

  for (const res of resources) {
    const key = res.type
    if (!groupedByType[key]) {
      groupedByType[key] = { total: 0, inUse: 0 }
    }

    groupedByType[key].total += 1
    if (res.isAllocated) {
      groupedByType[key].inUse += 1
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">{title} Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[75%] text-secondary">Type</TableHead>
              <TableHead className="w-[25%] text-center text-secondary">In Use</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedByType).map(([type, stats]) => (
              <TableRow key={type}>
                <TableCell>{type}</TableCell>
                <TableCell className="text-center">{`${stats.inUse}/${stats.total}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ResourceTable
