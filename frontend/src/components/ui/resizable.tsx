"use client"

import { GripVertical } from "lucide-react"
import * as Resizable from "react-resizable-panels"
import { cn } from "@/lib/utils"

// Runtime-safe component resolving (covers multiple package versions/builds)
const PanelGroup =
  (Resizable as any).PanelGroup ??
  (Resizable as any).ResizablePanelGroup ??
  (Resizable as any).default

const Panel = (Resizable as any).Panel
const PanelResizeHandle = (Resizable as any).PanelResizeHandle

// If any of these are still undefined at runtime, your install is broken.
if (!PanelGroup || !Panel || !PanelResizeHandle) {
  // eslint-disable-next-line no-console
  console.error("react-resizable-panels exports not found:", Resizable)
}

const ResizablePanelGroup = ({
  className,
  ...props
}: any) => (
  <PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = (props: any) => <Panel {...props} />

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: any) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }