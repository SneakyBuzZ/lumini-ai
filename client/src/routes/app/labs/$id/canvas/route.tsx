import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/labs/$id/canvas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/labs/$id/canvas"!</div>
}
