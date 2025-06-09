"use client"

import { DiscussionDetail } from "@/components/discussion-detail"
import { useParams } from "next/navigation"

export default function DiscussionDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  return <DiscussionDetail id={id} />
} 