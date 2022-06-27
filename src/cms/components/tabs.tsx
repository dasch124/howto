import { Tab } from '@headlessui/react'
import cx from 'clsx'
import type { ReactNode } from 'react'

interface TabsProps {
  children: ReactNode
}

export function Tabs(props: TabsProps): JSX.Element {
  const { children } = props

  return <Tab.Group>{children}</Tab.Group>
}

interface TabsListProps {
  children: ReactNode
}

function TabsList(props: TabsListProps): JSX.Element {
  const { children } = props

  return (
    <Tab.List className="mt-4 mb-2 flex items-center gap-4 border-b border-gray-500">
      {children}
    </Tab.List>
  )
}

interface TabsTabProps {
  children: ReactNode
}

function TabsTab(props: TabsTabProps): JSX.Element {
  const { children } = props

  return (
    <Tab
      className={({ selected }) => {
        return cx('-mb-px p-1', selected && 'border-b')
      }}
    >
      {children}
    </Tab>
  )
}

interface TabsPanelsProps {
  children: ReactNode
}

function TabsPanels(props: TabsPanelsProps): JSX.Element {
  const { children } = props

  return <Tab.Panels className="mb-4">{children}</Tab.Panels>
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panels = TabsPanels
Tabs.Panel = Tab.Panel
