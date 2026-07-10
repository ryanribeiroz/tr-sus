import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Unknown" },
      { name: "description", content: "Mobile app for structured, georeferenced field data collection." },
      { property: "og:title", content: "Unknown" },
      { name: "twitter:title", content: "Unknown" },
      { property: "og:description", content: "Mobile app for structured, georeferenced field data collection." },
      { name: "twitter:description", content: "Mobile app for structured, georeferenced field data collection." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/58f3f6c0-dcc0-482e-baec-c4bd29e0f6ab/id-preview-0bf3fcd3--aec5cdb4-079d-4807-b800-5994edaa7da5.lovable.app-1777930448372.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/58f3f6c0-dcc0-482e-baec-c4bd29e0f6ab/id-preview-0bf3fcd3--aec5cdb4-079d-4807-b800-5994edaa7da5.lovable.app-1777930448372.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (
    <StoreProvider>
      <Outlet />
      <Toaster position="top-center" richColors />
    </StoreProvider>
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
