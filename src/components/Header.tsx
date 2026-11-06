"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { Icon } from "./Icon";

export function Brand() {
  return <span className="brand"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="m12 7-9 11 9 11M24 7l9 11-9 11M21 5l-6 26" stroke="currentColor" strokeWidth="3" strokeLinecap="square" /></svg><span>DigiGeeks<span className="brand-dot">.</span></span></span>;
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" aria-label="DigiGeeks home" onClick={() => setOpen(false)}><Brand /></Link>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}><span className={open ? "menu-lines is-open" : "menu-lines"} /></button>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? "navigation is-open" : "navigation"}>
      {navigation.filter(({ href }) => href !== "/#contact").map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link className="button button-small nav-cta" href="/#contact" onClick={() => setOpen(false)}>Contact Us <Icon /></Link>
    </nav>
  </div></header>;
}
