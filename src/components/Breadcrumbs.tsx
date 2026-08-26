"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";

type Crumb = { href: string; label: string };

function buildCrumbs(pathname: string, labels: Record<string, string>): Crumb[] {
  if (pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ href: "/", label: labels.home }];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    if (path.startsWith("/cases/") && segment !== "cases") {
      crumbs.push({ href: path, label: decodeURIComponent(segment) });
      continue;
    }
    const key = segment as keyof typeof labels;
    const label = labels[key] ?? segment;
    crumbs.push({ href: path, label });
  }

  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const { t } = useLocale();

  const labels = {
    home: t.breadcrumbs.home,
    cases: t.nav.cases,
    criteria: t.nav.criteria,
    marketplace: t.nav.marketplace,
  };

  const crumbs = buildCrumbs(pathname, labels);
  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs mb-5 sm:mb-6" aria-label={t.breadcrumbs.aria}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="inline-flex items-center gap-1.5">
              {i > 0 ? (
                <span className="text-zinc-600 select-none" aria-hidden>
                  /
                </span>
              ) : null}
              {last ? (
                <span className="font-medium text-teal-300/90 truncate max-w-[14rem] sm:max-w-none">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="breadcrumb-link truncate max-w-[10rem] sm:max-w-none"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
