import { lazy } from 'react'

export const RootLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.RootLayout }
})

export const AppLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.AppLayout }
})
