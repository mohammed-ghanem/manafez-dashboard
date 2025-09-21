import { ReactNode } from "react";
import '../../../app/[lang]/globals.css'
import { Providers } from "@/providers/Providers";


export default async function AuthLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>; // 👈 params is a Promise now
}) {

    const { lang } = await params; // 👈 await it
    const dir = lang === "ar" ? "rtl" : "ltr";
    return (
        <html lang={lang} dir={dir}>
            <body>
                <Providers>
                    <div>
                        {children}
                    </div>
                </Providers>

            </body>
        </html>
    );
}