import React, { createContext, ReactNode, useContext } from 'react'

import { useMeasure } from 'react-use'
import { useInnerSize } from '@/utils/useInnerSize'

interface Props {
  children?: ReactNode
  backgroundColor?: string
}

export const useMobileContainerWidth = () => {
  return useContext(ScreenContext)
}

export const ScreenContext = createContext(480)

export const MobileContainer = (props: Props) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { children } = props
  const { innerHeight } = useInnerSize()

  return (
    <ScreenContext.Provider value={width}>
      <div
        ref={ref}
        style={{
          maxWidth: '480px',
          marginLeft: 'auto',
          marginRight: 'auto',
          minHeight: innerHeight ?? '100vh',
          backgroundColor: 'white',
        }}
      >
        {children}
      </div>
    </ScreenContext.Provider>
  )
}
