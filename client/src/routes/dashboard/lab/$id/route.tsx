import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/lab/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/lab/$id"!</div>
}
