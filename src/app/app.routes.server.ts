import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Student story pages have an :id parameter, so they can't be
    // prerendered at build time. Render them when requested instead.
    path: 'students/:id',
    renderMode: RenderMode.Server,
  },
  // These pages depend on the browser (cookies and storage), so the server
  // does not draw them. The browser does. Explained in a later lab.
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  {
    // The wildcard MUST stay last: routes are matched top to bottom.
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
