import { readFile } from 'node:fs/promises';
import path from 'node:path';
import bibtex from '@orcid/bibtex-parse-js';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  pages: string;
  publisher: string;
  href: string | null;
}

// Display common BibTeX grouping/formatting without exposing TeX markup.
function displayText(value = ''): string {
  return value
    .replace(/\\(?:textit|textbf|emph|textnormal)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\([&%_#$])/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function authorsFromBibtex(value: string): string[] {
  const authors: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index++) {
    if (value[index] === '{') depth++;
    if (value[index] === '}') depth--;
    const separator = depth === 0 && value.slice(index).match(/^\s+and\s+/i);
    if (separator) {
      authors.push(displayText(value.slice(start, index)));
      index += separator[0].length - 1;
      start = index + 1;
    }
  }
  authors.push(displayText(value.slice(start)));
  return authors.filter(Boolean);
}

function paperLink(fields: Record<string, string>): string | null {
  const doi = (fields.doi || '').trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
  return /^10\.\d{4,9}\/\S+$/i.test(doi) ? `https://doi.org/${doi}` : null;
}

export function parsePublications(source: string): Publication[] {
  let entries: ReturnType<typeof bibtex.toJSON>;
  try {
    entries = bibtex.toJSON(source);
  } catch (error) {
    throw new Error('Could not parse content/publications.bib. Check the BibTeX syntax.', { cause: error });
  }
  const seen = new Set<string>();
  return entries
    .filter((entry) => !['COMMENT', 'PREAMBLE', 'STRING'].includes(entry.entryType.toUpperCase()))
    .map((entry) => {
      const fields = Object.fromEntries(Object.entries(entry.entryTags || {}).map(([key, value]) => [key.toLowerCase(), value]));
      const id = entry.citationKey?.trim();
      if (!id || seen.has(id.toLowerCase())) throw new Error(`Missing or duplicate citation key in publications.bib: ${id || '(empty)'}`);
      seen.add(id.toLowerCase());
      const title = displayText(fields.title);
      const authors = authorsFromBibtex(fields.author || '');
      const yearText = displayText(fields.year);
      if (!title || authors.length === 0 || !/^\d{4}$/.test(yearText)) {
        throw new Error(`Publication "${id}" must have title, author, and a four-digit year.`);
      }
      return {
        id,
        title,
        authors,
        year: Number(yearText),
        venue: displayText(fields.booktitle || fields.journal || fields.school || fields.institution),
        pages: displayText(fields.pages).replace(/--+/g, '–'),
        publisher: displayText(fields.publisher),
        href: paperLink(fields),
      };
    })
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export async function getPublications(): Promise<Publication[]> {
  const source = await readFile(path.join(process.cwd(), 'content', 'publications.bib'), 'utf8');
  return parsePublications(source);
}
