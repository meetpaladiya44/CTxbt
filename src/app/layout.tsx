'use client'
import { Providers } from "./providers";
import { CreditsProvider } from "@/context/CreditsContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="techwave_fn_wrapper">
            <div className="techwave_fn_wrap"><CreditsProvider>{children}</CreditsProvider></div>
          </div>
          <script type="text/javascript" src="js/jquery.js?ver=1.0.0"></script>
          <script type="text/javascript" src="js/plugins.js?ver=1.0.0"></script>
          <script type="text/javascript" src="js/init.js?ver=1.0.0"></script>
        </Providers>
      </body>
    </html>
  );
}
