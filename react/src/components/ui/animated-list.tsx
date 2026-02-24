import React, { type ComponentPropsWithoutRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MotionProps } from 'motion/react'

import { cn } from '@/lib/utils'

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.16, ease: 'easeOut' },
  }

  return (
    <motion.div {...animations} layout className="w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode
}

export const AnimatedList = React.memo(({ children, className, ...props }: AnimatedListProps) => {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={cn('flex flex-col items-center gap-1', className)} {...props}>
      <AnimatePresence initial={false}>
        {childrenArray.map((item, index) => {
          const key = React.isValidElement(item) && item.key != null ? item.key : index

          return <AnimatedListItem key={key}>{item}</AnimatedListItem>
        })}
      </AnimatePresence>
    </div>
  )
})

AnimatedList.displayName = 'AnimatedList'
