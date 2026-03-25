"""
Fetch the latest publications from Semantic Scholar and write data/publications.json.

Usage:
    python update_publications.py

The script queries the Semantic Scholar API for author 49277793 (M. Enis Leblebici),
filters to relevant chemical-engineering venues, takes the 10 most recent, and writes
the result to data/publications.json.

To auto-update on GitHub Pages, add a GitHub Actions workflow (see .github/workflows/update-pubs.yml).
"""

import urllib.request, json, os, sys

AUTHOR_ID = "49277793"
API_URL = (
    f"https://api.semanticscholar.org/graph/v1/author/{AUTHOR_ID}/papers"
    "?fields=title,year,venue,externalIds,publicationDate,journal,abstract"
    "&limit=50&offset=0"
)

# Venues / keywords that clearly do NOT belong to this author
EXCLUDE_KEYWORDS = [
    "heritage", "olfactory", "yoruba", "sensory", "tourism",
    "linguistic", "archaeology", "social",
]

OUTPUT = os.path.join(os.path.dirname(__file__), "data", "publications.json")
COUNT = 10


def fetch():
    req = urllib.request.Request(API_URL)
    req.add_header("User-Agent", "Academic-Website-Builder/1.0")
    resp = urllib.request.urlopen(req, timeout=20)
    return json.loads(resp.read()).get("data", [])


def is_relevant(paper):
    title = (paper.get("title") or "").lower()
    venue = (paper.get("venue") or "").lower()
    journal_name = ((paper.get("journal") or {}).get("name") or "").lower()
    combined = title + " " + venue + " " + journal_name
    return not any(kw in combined for kw in EXCLUDE_KEYWORDS)


def to_entry(paper):
    doi = (paper.get("externalIds") or {}).get("DOI", "")
    journal = (paper.get("journal") or {}).get("name", paper.get("venue", ""))
    return {
        "year": paper.get("year", ""),
        "venue": journal,
        "title": paper.get("title", ""),
        "summary": (paper.get("abstract") or "")[:300],
        "paperUrl": f"https://doi.org/{doi}" if doi else "",
        "doiUrl": f"https://doi.org/{doi}" if doi else "",
    }


def main():
    papers = fetch()
    papers = [p for p in papers if is_relevant(p)]
    papers.sort(
        key=lambda p: p.get("publicationDate") or str(p.get("year", 0)),
        reverse=True,
    )
    entries = [to_entry(p) for p in papers[:COUNT]]

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(entries)} publications to {OUTPUT}")
    for i, e in enumerate(entries, 1):
        print(f"  {i}. [{e['year']}] {e['title']}")


if __name__ == "__main__":
    main()
