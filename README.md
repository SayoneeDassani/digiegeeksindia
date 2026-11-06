# DigiGeeks

A static Next.js website for DigiGeeks, with AI and software services, a founder story, and direct email and telephone contact links.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Local development uses the domain root unless `NEXT_PUBLIC_BASE_PATH` is set.

## GitHub Pages

Repository: https://github.com/SayoneeDassani/digiegeeksindia

Website: https://sayoneedassani.github.io/digiegeeksindia/

The workflow in `.github/workflows/deploy.yml` builds, checks, and publishes the static `out` directory whenever `main` changes. In the repository's Settings → Pages, the publishing source must be **GitHub Actions**.

The workflow supplies these public build settings:

| Variable | GitHub Pages value |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | `/digiegeeksindia` |
| `NEXT_PUBLIC_SITE_URL` | `https://sayoneedassani.github.io/digiegeeksindia` |
| `NEXT_PUBLIC_ENABLE_INDEXING` | `false` while this is a temporary site |

No API tokens or email-provider credentials are needed by the website. The deployment workflow uses GitHub's automatic token.

### Build the Pages version locally

PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/digiegeeksindia'
$env:NEXT_PUBLIC_SITE_URL = 'https://sayoneedassani.github.io/digiegeeksindia'
$env:NEXT_PUBLIC_ENABLE_INDEXING = 'false'
npm run build
npm run check:export
```

The check verifies exported pages, internal links, anchors, contact details, images, scripts, stylesheets, and fonts at the repository subpath. `npm run typecheck` is available separately.

For a normal local static build, leave `NEXT_PUBLIC_BASE_PATH` empty, run `npm run build`, and serve `out` with a static server. `next start` is not supported with static export.

## Content and images

- Homepage: `src/app/page.tsx`.
- Founder story: `src/app/about/page.tsx`.
- Services: `src/lib/services.ts` and `src/app/services/page.tsx`.
- Earlier experience: `src/app/our-work/page.tsx`.
- Contact details and business configuration: `src/config/site.ts`.
- Founder photo: `public/images/founder.jpeg`.
- Conference photo: `public/images/conference_speech.jpeg`.
- Styles: `src/app/globals.css`.

Contact links lead to the homepage contact section. The old `/contact/` page redirects there in the browser. There is no active form or server API. The unused form-related source remains available for a future server-backed version.

Privacy and terms pages are marked as drafts. Search indexing remains disabled until explicitly enabled in the workflow.

## Adding a custom domain later

1. Configure the domain and DNS in GitHub Pages.
2. Set `NEXT_PUBLIC_SITE_URL` in the workflow to the new HTTPS origin.
3. Set `NEXT_PUBLIC_BASE_PATH` to an empty string for hosting at the domain root.
4. Push the changes to rebuild links, images, and metadata for the new address.

Do not commit `node_modules`, `.next`, `out`, local environment files, or credentials. The repository's `.gitignore` excludes them.
