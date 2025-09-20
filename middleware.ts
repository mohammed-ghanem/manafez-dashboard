import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "./constants/locales";
import { i18n } from "@/i18n-config";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check if the pathname starts with any of the locales in the config
  const localeInPath = i18n.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  // If no locale is in the path and it's not an API or static file, apply the default locale
  if (!localeInPath && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    // Rewrite to include the default locale, but without showing it in the URL
    return NextResponse.rewrite(
      new URL(
        `/${defaultLocale}${pathname}${searchParams ? `?${searchParams}` : ""}`,
        request.url
      )
    );
  }

  // If the request contains the default locale (e.g., /ar), remove it from the URL
  if (localeInPath === defaultLocale) {
    return NextResponse.redirect(
      new URL(
        pathname.replace(`/${defaultLocale}`, "") || "/",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all paths except API and static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
