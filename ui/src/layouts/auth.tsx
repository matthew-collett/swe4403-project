import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import Cuate from '@/assets/storyset/cuate.svg'
import Rafiki from '@/assets/storyset/rafiki.svg'
import { Card, CardContent, Image } from '@/components/ui'

export const AuthLayout = () => {
  const location = useLocation()
  const isRegister = location.pathname.includes('register')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6">
      <div className={`w-full max-w-sm`}>
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden flex flex-col min-h-[606px] p-6">
            <CardContent className="grid p-0 md:grid-cols-2 flex-grow relative">
              <div className="flex flex-col h-full bg-background md:hidden">
                <Outlet />
              </div>
              <motion.div
                className="hidden md:flex md:flex-col h-full bg-background"
                initial={false}
                animate={{
                  x: isRegister ? '100%' : 0,
                  zIndex: 10,
                }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-border -translate-x-1/2" />
              <motion.div
                className="absolute inset-0 md:relative hidden md:block h-full"
                initial={false}
                animate={{
                  x: isRegister ? '-100%' : 0,
                }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <Image
                  src={isRegister ? Cuate : Rafiki}
                  alt="Electric Vehicle"
                  className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.8]"
                />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
