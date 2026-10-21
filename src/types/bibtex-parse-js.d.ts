declare module '@orcid/bibtex-parse-js' {
  interface BibtexEntry {
    citationKey?: string;
    entryType: string;
    entryTags?: Record<string, string>;
  }
  const bibtex: { toJSON(source: string): BibtexEntry[] };
  export default bibtex;
}
