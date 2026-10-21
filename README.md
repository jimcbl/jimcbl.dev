This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## About

This is my personal website, built with Next.js for the framework and Tailwind CSS for quick styling.

## Features

- Dark mode: toggle between light and dark mode by clicking the moon icon in the top right corner.
- Responsive design: the website is fully responsive and looks great on all devices.
- Custom hooks: use custom hooks to get scroll position, scroll direction for animations.
- Easy customization: Tailwind CSS's utility-first approach makes it simple to change styles without writing custom CSS.
- Google Fonts: use Google Fonts to load Lato, a custom font for the website.
- Deployed on Vercel: the website is deployed on Vercel and is live at a custom domain [jimcbl.dev](https://jimcbl.dev).

## Running Locally

Use Node.js 24 (`nvm use` reads `.nvmrc`). The `engines.node` setting in
`package.json` selects Node.js 24.x for Vercel deployments; GitHub Actions uses
the same major version through `.nvmrc`.

1. First, clone the repository:

```bash
git clone https://github.com/jimodayne/jimcbl.dev.git
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Updating publications

The homepage reads **`content/publications.bib`** on the server when Next.js builds the page.
This is the single source of truth: no generated JSON or Markdown list needs to be edited.
Paste BibTeX entries exported from Google Scholar, Zotero, or your reference manager into this file:

```bibtex
@inproceedings{tran2026example,
  title = {An Example Paper About {Civic Tech}},
  author = {Tran, Duc Thinh and Smith, Jane},
  booktitle = {Proceedings of the Example Conference},
  year = {2026},
  pages = {12--20},
  doi = {10.1234/example},
}
```

- Give each entry a unique citation key and include `title`, `author`, and a four-digit `year`.
- Separate authors with `and`. UTF-8 names are supported; use Unicode characters for accents.
- Use `booktitle` for conference papers or `journal` for journal articles.
- `publisher` and `pages` are optional. Add a `doi` to make the publication title open
  the paper via `https://doi.org/` in a new tab. Without a valid DOI, the title remains
  plain text; there is no Google Scholar button or URL fallback.
- Papers sort newest first, then alphabetically by title within each year. The paper count updates automatically.
- Use ordinary braced or quoted field values. Common grouping/formatting is cleaned for display;
  this is not a full LaTeX renderer. Prefer self-contained exports without BibTeX string macros or cross-references.
- Rebuild/redeploy after editing the bibliography (`npm run build`). For a running dev server,
  refresh the page to read the file again.

Run `npm run test:publications` to check parsing and field mapping (Node.js 22.18+),
and `npm run build` to verify the homepage. Invalid entries fail with an error naming the citation key.
