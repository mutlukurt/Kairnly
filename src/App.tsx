import { useEffect } from 'react'
import { EditorHeader } from './features/editor/EditorHeader'
import { WorkspaceEditor } from './features/editor/WorkspaceEditor'
import { CommandPalette } from './features/search/CommandPalette'
import { SettingsDialog } from './features/settings/SettingsDialog'
import { Sidebar } from './features/sidebar/Sidebar'
import { useWorkspaceStore } from './lib/store/workspace'

export default function App() {
  const initialize = useWorkspaceStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <EditorHeader />
        <WorkspaceEditor />
      </section>
      <CommandPalette />
      <SettingsDialog />
    </div>
  )
}
