"""PAUSE v9 — contenuti per riportare in pari le categorie (argomenti in v9_topics.py, testi in
v9_content.json scritti da generate_v9.py). Stessa gerarchia del catalogo: kind, objective (lezioni),
translations.en, chapters_v6. Finché il JSON non esiste il pack è vuoto e il seed non cambia."""
import json
from pathlib import Path

from seed_pack_v8 import build_pack

_JSON = Path(__file__).parent / "v9_content.json"
_CONTENT = json.loads(_JSON.read_text()) if _JSON.exists() else {}

STORIES, LESSONS = build_pack(_CONTENT)
