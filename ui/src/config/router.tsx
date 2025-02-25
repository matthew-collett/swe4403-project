import { createBrowserRouter } from 'react-router-dom'

import { GenericError } from '@/components'
import { AppLayout, RootLayout } from '@/config/lazy'
import { baseRoutes, appRoutes, createRouteConfig } from '@/config/routes'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GenericError />,
    children: [
      ...baseRoutes.map(createRouteConfig),
      {
        element: <AppLayout />,
        children: appRoutes.map(createRouteConfig),
      },
    ],
  },
])
