import { CreateTaskFromDiscussion } from "@/components/create-task-from-discussion"

interface CreateTaskPageProps {
  params: {
    id: string
  }
}

export default function CreateTaskPage({ params }: CreateTaskPageProps) {
  return <CreateTaskFromDiscussion discussionId={params.id} />
}

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}
