import type { Metadata } from "next";
import CvView from "@/components/CvView";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: `CV — ${profile.name}`,
  description: `${profile.name} — ${profile.role}. Experience, skills and education.`,
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  return <CvView />;
}
