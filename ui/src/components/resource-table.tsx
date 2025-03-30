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
import { Badge } from '@/components/ui/badge'
import { Resource } from '@/types/api'

type Props = {
  title: string
  resources: Resource[]
}

const ResourceTable = ({ title, resources }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>{title} Resources</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Name</TableHead>
            <TableHead className="w-[20%]">In Use</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map(res => (
            <TableRow key={res.id}>
              <TableCell>{res.type}</TableCell>
              <TableCell>
                <Badge
                  className={
                    res.isAllocated === true
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : res.isAllocated === false
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-800'
                  }
                >
                  {res.isAllocated?.toString() ?? 'Unknown'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

export default ResourceTable
