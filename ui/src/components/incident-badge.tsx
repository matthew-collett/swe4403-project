import { Badge } from '@/components/ui/badge'
import { IncidentType } from '@/types'

interface IncidentBadgeProps {
  type: IncidentType
}

export const IncidentBadge = ({ type }: IncidentBadgeProps) => {
  switch (type) {
    case IncidentType.FIRE:
      return <Badge className="bg-red-100 border-red-700 text-red-700 hover:bg-red-100">Fire</Badge>
    case IncidentType.MEDICAL:
      return (
        <Badge className="bg-pink-100 border-pink-700 text-pink-700 hover:bg-pink-100">
          Medical
        </Badge>
      )
    case IncidentType.INFRASTRUCTURE:
      return (
        <Badge className="bg-blue-100 border-blue-700 text-blue-700 hover:bg-blue-100">
          Infrastructure
        </Badge>
      )
    case IncidentType.NATURAL_DISASTER:
      return (
        <Badge className="bg-green-100 border-green-700 text-green-700 hover:bg-green-100">
          Natural Disaster
        </Badge>
      )
    case IncidentType.HAZMAT:
      return (
        <Badge className="bg-purple-100 border-purple-700 text-purple-700 hover:bg-purple-100">
          Hazmat
        </Badge>
      )
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}
