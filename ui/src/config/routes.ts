import { LucideIcon, LayoutDashboard } from 'lucide-react'
import { Location, RouteObject } from 'react-router-dom'

interface Route {
  title: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

interface AppRoute extends Route {
  description: string
  icon: LucideIcon
}

const baseRoutes: Route[] = [
  {
    title: '404 Not Found',
    path: '*',
    component: () => import('@/routes/not-found'),
  },
]

const appRoutes: AppRoute[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'View key metrics and overview of your grid',
    component: () => import('@/routes/dashboard'),
  },
]

export const routes = [...baseRoutes, ...appRoutes]

export const getTitle = (pathname: string): string => {
  const route = routes.find(route => route.path === pathname)
  return route ? route.title : '404 Not Found'
}

export const isActiveRoute = (path: string, location: Location): boolean =>
  location.pathname.replace('/', '') === path

export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route, AppRoute }
export { baseRoutes, appRoutes }
