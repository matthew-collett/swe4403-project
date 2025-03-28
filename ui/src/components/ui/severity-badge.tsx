import { Badge } from '@/components/ui/badge'

interface SeverityBadgeProps {
  severity: string
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  switch (severity) {
    case 'High':
      return <Badge className="bg-white border-red-500 text-red-500 hover:bg-white">High</Badge>
    case 'Medium':
      return (
        <Badge className="bg-white border-orange-500 text-orange-500 hover:bg-white">Medium</Badge>
      )
    case 'Low':
      return (
        <Badge className="bg-white border-yellow-500 text-yellow-500 hover:bg-white">Low</Badge>
      )
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}
