import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "./constants/locales";
import { i18n } from "@/i18n-config";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // skip next/static, api and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const localeInPath = i18n.locales.find((l) =>
    pathname.startsWith(`/${l}`)
  );

  // set lang cookie
  const setLangCookie = (res: NextResponse, lang: string) => {
    res.cookies.set("lang", lang, { path: "/" });
    return res;
  };
  

  const accessToken = request.cookies.get("access_token")?.value;
  const resetToken = request.cookies.get("reset_token")?.value;

  // If URL explicitly contains the default locale (/ar/...) redirect to the clean path (/...)
  
  // if (localeInPath === defaultLocale) {
  //   const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
  //   return NextResponse.redirect(new URL(`${dest}${search}`, request.url));
  // }

  if (localeInPath === defaultLocale) {
    const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
    const res = NextResponse.redirect(new URL(`${dest}${search}`, request.url));
    return setLangCookie(res, defaultLocale);
  }
  


  // No locale in URL (root or non-localized routes). Treat as defaultLocale but keep URL clean.
  if (!localeInPath) {
    const publicDefault = [
      "/login",
      "/forget-password",
      
      
    ];
    const isPublicDefault = publicDefault.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );

    // If user is in reset flow (has reset_token) allow only reset-related public pages.
    if (resetToken) {
      const allowed = publicDefault.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
      if (!allowed) {
        // force them to the reset-password page while in reset flow
        return NextResponse.redirect(new URL(`/reset-password${search}`, request.url));
      }
      // serve the default-locale page
      return NextResponse.rewrite(
        new URL(`/${defaultLocale}${pathname}${search}`, request.url)
      );
    }

    // Not authenticated and not on a public default route -> redirect to login
    if (!accessToken && !isPublicDefault) {
      return NextResponse.redirect(new URL(`/login${search}`, request.url));
    }

    // Authenticated and visiting default public route -> send to home
    if (accessToken && isPublicDefault) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // Otherwise serve the default-locale pages internally while keeping URL clean
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url)
    );
  }

  // Locale is present and not default (e.g., /en). Normal auth logic for localized routes.
  const locale = localeInPath;
  const publicRoutes = [
    `/${locale}/login`,
    `/${locale}/forget-password`,
    `/${locale}/reset-password`,
    `/${locale}/verify-code`,
  ];
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  // If user is in reset flow (reset_token), allow only reset-related pages for this locale
  if (resetToken) {
    const allowed = publicRoutes.some((r) => pathname.startsWith(r));
    if (!allowed) {
      return NextResponse.redirect(new URL(`/${locale}/reset-password${search}`, request.url));
    }
    return setLangCookie(NextResponse.next(), locale);
  }

  // Logged-in users should not see public auth pages
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Protected pages require login
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return setLangCookie(NextResponse.next(), locale);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
























// import { NextResponse, type NextRequest } from "next/server";
// import { defaultLocale } from "./constants/locales";
// import { i18n } from "@/i18n-config";

// export function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;

//   // skip next/static, api and assets
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const localeInPath = i18n.locales.find((l) =>
//     pathname.startsWith(`/${l}`)
//   );

//   const accessToken = request.cookies.get("access_token")?.value;
//   const resetToken = request.cookies.get("reset_token")?.value;

//   // If URL explicitly contains the default locale (/ar/...) redirect to the clean path (/...)
//   if (localeInPath === defaultLocale) {
//     const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
//     return NextResponse.redirect(new URL(`${dest}${search}`, request.url));
//   }

//   // No locale in URL (root or non-localized routes). Treat as defaultLocale but keep URL clean.
//   if (!localeInPath) {
//     const publicDefault = [
//       "/login",
//       "/forget-password",
      
      
//     ];
//     const isPublicDefault = publicDefault.some(
//       (p) => pathname === p || pathname.startsWith(p + "/")
//     );

//     // If user is in reset flow (has reset_token) allow only reset-related public pages.
//     if (resetToken) {
//       const allowed = publicDefault.some(
//         (p) => pathname === p || pathname.startsWith(p + "/")
//       );
//       if (!allowed) {
//         // force them to the reset-password page while in reset flow
//         return NextResponse.redirect(new URL(`/reset-password${search}`, request.url));
//       }
//       // serve the default-locale page
//       return NextResponse.rewrite(
//         new URL(`/${defaultLocale}${pathname}${search}`, request.url)
//       );
//     }

//     // Not authenticated and not on a public default route -> redirect to login
//     if (!accessToken && !isPublicDefault) {
//       return NextResponse.redirect(new URL(`/login${search}`, request.url));
//     }

//     // Authenticated and visiting default public route -> send to home
//     if (accessToken && isPublicDefault) {
//       return NextResponse.redirect(new URL(`/`, request.url));
//     }

//     // Otherwise serve the default-locale pages internally while keeping URL clean
//     return NextResponse.rewrite(
//       new URL(`/${defaultLocale}${pathname}${search}`, request.url)
//     );
//   }

//   // Locale is present and not default (e.g., /en). Normal auth logic for localized routes.
//   const locale = localeInPath;
//   const publicRoutes = [
//     `/${locale}/login`,
//     `/${locale}/forget-password`,
//     `/${locale}/reset-password`,
//     `/${locale}/verify-code`,
//   ];
//   const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

//   // If user is in reset flow (reset_token), allow only reset-related pages for this locale
//   if (resetToken) {
//     const allowed = publicRoutes.some((r) => pathname.startsWith(r));
//     if (!allowed) {
//       return NextResponse.redirect(new URL(`/${locale}/reset-password${search}`, request.url));
//     }
//     return NextResponse.next();
//   }

//   // Logged-in users should not see public auth pages
//   if (isPublicRoute && accessToken) {
//     return NextResponse.redirect(new URL(`/${locale}`, request.url));
//   }

//   // Protected pages require login
//   if (!isPublicRoute && !accessToken) {
//     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };




