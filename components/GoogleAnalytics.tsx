"use client";
// components/GoogleAnalytics.tsx

import { useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-6Z4QHP5KR2";

export default function GoogleAnalytics() {
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied'
          });
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
