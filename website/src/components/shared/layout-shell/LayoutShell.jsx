"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header/Header";
import Footer from "@/components/ui/footer/Footer";
import WhatsappIcon from "@/components/shared/whatsapp-icon/WhatsappIcon";
import { hideHeaderAndFooter } from "@/lib/utils/helpers/hideHeaderAndFooter";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isHide = hideHeaderAndFooter(pathname);

  return (
    <>
      {!isHide && <Header />}
      <main>{children}</main>
      {!isHide && <Footer />}
      {!isHide && <WhatsappIcon />}
    </>
  );
}
