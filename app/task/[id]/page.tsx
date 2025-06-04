import { TaskDetail } from "@/components/task-detail"

interface TaskPageProps {
  params: {
    id: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  return <TaskDetail taskId={params.id} />
}

// Generate static params for common task IDs to prevent routing issues
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}
