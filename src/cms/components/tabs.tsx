import { Tab } from '@headlessui/react'
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

  return <Tab.List className="mb-2 flex items-center gap-2 border-b pb-1">{children}</Tab.List>
}

interface TabsTabProps {
  children: ReactNode
}

function TabsTab(props: TabsTabProps): JSX.Element {
  const { children } = props

  return (
    <Tab
      className={({ selected }) => {
        return selected ? '' : 'text-gray-500'
      }}
    >
      {children}
    </Tab>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panels = Tab.Panels
Tabs.Panel = Tab.Panel
