import { Outlet, useLocation } from 'react-router-dom'

import { getTitle } from '@/config'

export const RootLayout = () => {
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <>
      <title>{`Company | ${title}`}</title>
      <Outlet />
    </>
  )
}
