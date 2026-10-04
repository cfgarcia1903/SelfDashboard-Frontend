import type { Metadata } from "next";
import { EtoroPage as EtoroFeaturePage } from "@/features/etoro/EtoroPage";

export const metadata: Metadata = { title: "eToro" };

export default function EtoroPage() {
  return <EtoroFeaturePage />;
}
