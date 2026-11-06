"use client";

import Link from "next/link";
import { useEffect } from "react";
import { basePath } from "@/lib/paths";

export default function Contact() {
  useEffect(() => {
    window.location.replace(`${basePath}/#contact`);
  }, []);

  return <p className="container">Taking you to our <Link href="/#contact">contact details</Link>.</p>;
}
