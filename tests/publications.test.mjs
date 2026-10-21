import assert from 'node:assert/strict';
import test from 'node:test';
import { getPublications, parsePublications } from '../src/lib/publications.ts';

test('loads the bibliography with unique keys and newest-first ordering', async () => {
  const papers = await getPublications();
  assert.ok(papers.length > 0);
  assert.equal(new Set(papers.map((paper) => paper.id)).size, papers.length);
  assert.deepEqual(papers.map((paper) => paper.year), papers.map((paper) => paper.year).sort((a, b) => b - a));
  for (const paper of papers) {
    assert.ok(paper.title);
    assert.ok(paper.authors.length > 0);
    if (paper.href) assert.equal(new URL(paper.href).hostname, 'doi.org');
  }
});

test('reads journal and conference exports, nested braces, quoted values, and corporate authors', () => {
  const papers = parsePublications(`
    @comment{Exported from a reference manager}
    @article{journal2024,
      TITLE = {Research on {Civic Tech} \\& communities},
      AUTHOR = {Tran, Duc Thinh and {Research and Development Group}},
      JOURNAL = "A Research Journal",
      YEAR = 2024,
      DOI = {https://doi.org/10.1234/example},
      URL = {https://example.org/ignored}
    }
    @inproceedings{conference2026,
      title = {New findings}, author = {Sańko, Wojciech and Tran, Duc Thinh},
      booktitle = {Example Conference}, year = {2026},
      url = {https://example.org/paper}, pages = {12--18}
    }`);
  assert.equal(papers[0].id, 'conference2026');
  assert.equal(papers[0].venue, 'Example Conference');
  assert.deepEqual(papers[0].authors, ['Sańko, Wojciech', 'Tran, Duc Thinh']);
  assert.equal(papers[0].pages, '12–18');
  assert.equal(papers[0].href, null);
  assert.equal(papers[1].title, 'Research on Civic Tech & communities');
  assert.deepEqual(papers[1].authors, ['Tran, Duc Thinh', 'Research and Development Group']);
  assert.equal(papers[1].venue, 'A Research Journal');
  assert.equal(papers[1].href, 'https://doi.org/10.1234/example');
});

test('normalizes DOI fields and never substitutes a Scholar or arbitrary URL', () => {
  for (const doi of ['10.1234/example', 'doi: 10.1234/example', 'https://doi.org/10.1234/example', 'http://dx.doi.org/10.1234/example']) {
    const [paper] = parsePublications(`@misc{paper, title={A paper}, author={A Person}, year={2026}, doi={${doi}}}`);
    assert.equal(paper.href, 'https://doi.org/10.1234/example');
  }
  for (const doi of ['', 'not a DOI', 'javascript:alert(1)']) {
    const [paper] = parsePublications(`@misc{paper, title={A paper}, author={A Person}, year={2026}, doi={${doi}}, url={https://example.org/paper}}`);
    assert.equal(paper.href, null);
  }
});

test('reports malformed entries and duplicate keys during the build', () => {
  assert.throws(() => parsePublications('@article{broken,title={Unclosed}'), /Could not parse/);
  assert.throws(() => parsePublications('@article{missing,title={A title}}'), /must have title, author/);
  const entry = '@misc{duplicate,title={A title},author={A Person},year={2026}}';
  assert.throws(() => parsePublications(entry + entry), /duplicate citation key/);
});
