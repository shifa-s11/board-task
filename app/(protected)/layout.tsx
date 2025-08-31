import type { ReactNode } from "react"
import { ProtectedShell } from "@/components/other/protected-comp"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>
}
