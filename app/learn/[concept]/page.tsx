import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { concepts, getConcept } from "@/lib/concepts"
import LearnClient from "./LearnClient"

// Prerender every concept route so each lesson ships as static HTML with its
// own metadata. Drafts are included (reachable by direct URL) but marked
// noindex below so they stay out of search results until published.
export function generateStaticParams() {
  return concepts.map((c) => ({ concept: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ concept: string }>
}): Promise<Metadata> {
  const { concept: id } = await params
  const concept = getConcept(id)
  if (!concept) return { title: "Concept not found" }

  const url = `/learn/${id}`
  const fullTitle = `${concept.title} · How React Native Works`
  return {
    // the root layout's title template appends "· How React Native Works"
    title: concept.title,
    description: concept.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: fullTitle,
      description: concept.description,
      url,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: concept.description },
    // keep unpublished drafts out of the index even if someone hits the URL
    ...(concept.published ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ concept: string }>
}) {
  const { concept: id } = await params
  if (!getConcept(id)) notFound()
  return <LearnClient conceptId={id} />
}
