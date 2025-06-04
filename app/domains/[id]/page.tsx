import { DomainDetail } from "@/components/domain-detail"

interface DomainDetailPageProps {
  params: {
    id: string
  }
}

export default function DomainDetailPage({ params }: DomainDetailPageProps) {
  return <DomainDetail domainId={params.id} />
}

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}
