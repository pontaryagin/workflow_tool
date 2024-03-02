'use client'

import React from 'react'
import { UserContext, UserContextType } from './context'

export const ContextProvider = <ContextType,>(
  { contextValue, children, }
    : {
      contextValue: UserContextType,
      children: Readonly<React.ReactNode>
    }
) => {
  if (contextValue == null) {
    return null
  }
  return <UserContext.Provider value={ contextValue }>{ children }</UserContext.Provider>
}