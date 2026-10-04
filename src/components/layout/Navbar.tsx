"use client";

import Link from "next/link";
import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="nav-wrap"><Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><BarChart3 size={18} /></span><span>SelfDashboard</span></Link><button className="mobile-menu-button" aria-label={open ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Principal"><Link href="/" onClick={() => setOpen(false)}>Resumen</Link><Link href="/etoro" onClick={() => setOpen(false)}>eToro</Link></nav></div></header>;
}
