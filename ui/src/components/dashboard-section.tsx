import { ReactNode } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface DashboardSectionProps {
  title: string
  titleRight?: ReactNode
  children: ReactNode
}

const DashboardSection = ({ title, titleRight, children }: DashboardSectionProps) => {
  return (
    <Card className="flex-1 ">
      <CardHeader>
        <CardTitle className="flex justify-between items-center w-full">
          <span className="text-lg">{title}</span>
          {titleRight && <span className="text-sm text-muted-foreground italic">{titleRight}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default DashboardSection
