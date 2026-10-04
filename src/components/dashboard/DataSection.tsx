import type { ReactNode } from "react";

export function DataSection({ eyebrow, title, action, children }: { eyebrow?: string; title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="data-section"><div className="section-heading"><div>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2>{title}</h2></div>{action}</div>{children}</section>;
}
