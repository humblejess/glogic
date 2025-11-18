# Gender Logic (glogic)

A website to help people think logically about gender identification.

## Tech Stack

- **Astro** - Static site generation
- **Vue 3** - Interactive components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Cloudflare Pages** - Hosting
- **Cloudflare D1** - Database

## Development

### Install dependencies

```bash
yarn install
```

### Run development server

```bash
yarn dev
```

The site will be available at `http://localhost:4321`

### Build for production

```bash
yarn build
```

### Preview production build

```bash
yarn preview
```

## Project Structure

```
src/
  components/     # Vue components (interactive parts)
  layouts/        # Astro layouts
  locales/        # Translation files (5 languages)
  pages/          # Astro pages
  styles/         # Global styles
  utils/          # Utility functions
```

## Features

- ✅ Multi-language support (English, 中文简体, 中文繁体, French, Spanish)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Drag-and-drop ranking (desktop)
- ✅ Tap-to-select ranking (mobile)
- ✅ Scenario challenge pages
- ✅ Conclusion and call-to-action pages

## Pages

1. **Introduction** (`/` or `/[lang]`) - Opening statement
2. **Ranking** (`/[lang]/ranking`) - User ranks 6 gender identification criteria
3. **Scenario** (`/[lang]/scenario`) - Real-world scenarios challenge user's choices
4. **Conclusion** (`/[lang]/conclusion`) - Summary of key points
5. **Call to Action** (`/[lang]/action`) - Information about transgender challenges and Discord link

## Deployment

The project is configured for Cloudflare Pages deployment.

### Build Configuration

- **Build command**: `yarn build`
- **Output directory**: `dist`
- **Node version**: 18 or 20

## License

Private project
