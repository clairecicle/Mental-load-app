import { CreateEditDomain } from "@/components/create-edit-domain"

interface EditDomainPageProps {
  params: {
    id: string
  }
}

export default function EditDomainPage({ params }: EditDomainPageProps) {
  return <CreateEditDomain mode="edit" domainId={params.id} />
}

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}
