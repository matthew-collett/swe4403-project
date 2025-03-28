import { LucideIcon, LayoutDashboard, Hammer } from 'lucide-react'
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

const authRoutes: Route[] = [
  {
    title: 'Login',
    path: 'login',
    component: () => import('@/routes/login'),
  },
  {
    title: 'Register',
    path: 'register',
    component: () => import('@/routes/register'),
  },
]

const publicRoutes: Route[] = [
  {
    title: '404 Not Found',
    path: '*',
    component: () => import('@/routes/not-found'),
  },
]

const protectedRoutes: AppRoute[] = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: LayoutDashboard,
    description: 'Idk Yet',
    component: () => import('@/routes/app/dashboard'),
  },
  {
    title: 'Resources',
    path: 'resources',
    icon: Hammer,
    description: 'Idk yet',
    component: () => import('@/routes/app/resources'),
  },
]

export const routes = [...publicRoutes, ...protectedRoutes, ...authRoutes]

export const getTitle = (pathname: string): string | undefined => {
  const path = pathname.includes('app') ? pathname.split('/app/')[1] : pathname.replace('/', '')
  const route = routes.find(route => route.path === path)
  return route?.title
}

export const isActiveRoute = (path: string, location: Location): boolean => {
  const appPath = location.pathname.split('/app/')[1]
  return appPath === path
}

export const isAppRoute = (route: Route): route is AppRoute =>
  'icon' in route && 'component' in route && 'description' in route

export const getAppRoute = (pathname: string): AppRoute | undefined => {
  const path = pathname.includes('app') ? pathname.split('/app/')[1] : pathname.replace('/', '')
  return [...protectedRoutes].find(route => route.path === path)
}

export const getAppRoutes = (): AppRoute[] => routes.filter(isAppRoute)

export const getAppPath = (route: AppRoute) => `/app/${route.path}`

export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route, AppRoute }
export { protectedRoutes, publicRoutes, authRoutes }
