import { Badge } from '@/components/ui/badge'

interface SeverityBadgeProps {
  severity: string
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  switch (severity) {
    case 'High':
      return <Badge className="bg-red-100 text-red-500 hover:bg-red-100">High</Badge>
    case 'Medium':
      return <Badge className="bg-orange-100 text-orange-500 hover:bg-orange-100">Medium</Badge>
    case 'Low':
      return <Badge className="bg-yellow-100 text-yellow-500 hover:bg-yellow-100">Low</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}
