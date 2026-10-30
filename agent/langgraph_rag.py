"""
RAG construit avec LangGraph, à la main (sans create_react_agent).

Graphe :

    START -> retrieve -> generate --(réponse suffisante)--> END
                ^            |
                |            +--(INSUFFISANT et essais restants)--> rewrite_query
                +--------------------------------------------------------+

- retrieve      : cherche les passages les plus pertinents dans le corpus (BM25)
- generate      : le LLM répond à partir des passages seulement, avec citations [n]
- rewrite_query : le LLM reformule la question en requête de recherche
- arête conditionnelle "route_after_generate" : relance la recherche si la réponse
  est INSUFFISANT, dans la limite de MAX_ATTEMPTS

Corpus : fichiers .txt ou .md dans le dossier RAG_DOCS_DIR (défaut : agent/docs).
Les paragraphes sont séparés par une ligne vide.

Dépendances :
    pip install langgraph langchain-anthropic langchain-core python-dotenv

Variables d'environnement (fichier .env à la racine, ou environnement) :
    ANTHROPIC_API_KEY=...                    (obligatoire)
    ANTHROPIC_MODEL=claude-sonnet-4-5        (optionnel)
    RAG_DOCS_DIR=agent/docs                  (optionnel)

Usage :
    python agent/langgraph_rag.py "Qui était Camille Bernard ?"
"""

from __future__ import annotations

import math
import os
import re
import sys
import traceback
import unicodedata
from collections import Counter
from dataclasses import dataclass, field
from typing import Any, TypedDict

from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

load_dotenv()

if not os.getenv("ANTHROPIC_API_KEY"):
    sys.exit(
        "Erreur : ANTHROPIC_API_KEY est absente.\n"
        "Ajoute-la dans le fichier .env à la racine du projet : ANTHROPIC_API_KEY=sk-ant-..."
    )

DOCS_DIR = os.getenv("RAG_DOCS_DIR", os.path.join(os.path.dirname(__file__), "docs"))
CHUNK_CHARS = 800  # taille cible d'un passage
TOP_K = 4  # nombre de passages donnés au LLM
MAX_ATTEMPTS = 2  # nombre de reformulations maximum
INSUFFISANT = "INSUFFISANT"

# ---------------------------------------------------------------------------
# 1. Corpus : chargement et découpage en passages
# ---------------------------------------------------------------------------


@dataclass
class Chunk:
    id: int
    source: str
    text: str
    tokens: list[str] = field(default_factory=list)


STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "en", "au", "aux",
    "à", "a", "est", "sont", "qui", "que", "quoi", "dans", "par", "pour", "sur", "il",
    "elle", "ils", "elles", "son", "sa", "ses", "se", "ce", "cette", "ces", "pas", "plus",
}


def tokenize(text: str) -> list[str]:
    """Minuscules, sans accents, mots seuls : « Liévin » -> ['lievin']."""
    text = unicodedata.normalize("NFKD", text.lower())
    text = "".join(c for c in text if not unicodedata.combining(c))
    return [t for t in re.findall(r"[a-z0-9]+", text) if t not in STOPWORDS and len(t) > 1]


def load_chunks(docs_dir: str) -> list[Chunk]:
    chunks: list[Chunk] = []
    if not os.path.isdir(docs_dir):
        return chunks

    def add(source: str, text: str) -> None:
        chunks.append(Chunk(id=len(chunks) + 1, source=source, text=text, tokens=tokenize(text)))

    for name in sorted(os.listdir(docs_dir)):
        if not name.endswith((".txt", ".md")):
            continue
        with open(os.path.join(docs_dir, name), encoding="utf-8") as f:
            paragraphs = [p.strip() for p in f.read().split("\n\n") if p.strip()]

        buffer = ""
        for paragraph in paragraphs:
            if buffer and len(buffer) + len(paragraph) > CHUNK_CHARS:
                add(name, buffer)
                buffer = ""
            buffer = f"{buffer}\n\n{paragraph}" if buffer else paragraph
        if buffer:
            add(name, buffer)
    return chunks


# ---------------------------------------------------------------------------
# 2. Recherche BM25 (écrite à la main, sans dépendance)
# ---------------------------------------------------------------------------


def bm25_search(query: str, chunks: list[Chunk], k: int = TOP_K) -> list[Chunk]:
    query_terms = set(tokenize(query))
    if not query_terms or not chunks:
        return []

    n = len(chunks)
    avg_len = sum(len(c.tokens) for c in chunks) / n
    doc_freq = Counter(term for c in chunks for term in set(c.tokens))
    k1, b = 1.5, 0.75

    scored: list[tuple[float, Chunk]] = []
    for chunk in chunks:
        freqs = Counter(chunk.tokens)
        score = 0.0
        for term in query_terms:
            if term not in freqs:
                continue
            idf = math.log(1 + (n - doc_freq[term] + 0.5) / (doc_freq[term] + 0.5))
            tf = freqs[term]
            score += idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * len(chunk.tokens) / avg_len))
        if score > 0:
            scored.append((score, chunk))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for _, chunk in scored[:k]]


CHUNKS = load_chunks(DOCS_DIR)

# ---------------------------------------------------------------------------
# 3. État du graphe
# ---------------------------------------------------------------------------


class RagState(TypedDict):
    question: str
    search_query: str
    documents: list[Chunk]
    answer: str
    attempts: int


# ---------------------------------------------------------------------------
# 4. Nœuds
# ---------------------------------------------------------------------------

llm = ChatAnthropic(model=os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5"), temperature=0)


def _text(message: AIMessage) -> str:
    """Récupère le texte d'une réponse, qu'elle soit une chaîne ou une liste de blocs."""
    if isinstance(message.content, str):
        return message.content
    return "".join(block.get("text", "") for block in message.content if isinstance(block, dict))


def retrieve(state: RagState) -> dict[str, Any]:
    """Nœud retrieve : cherche les passages pertinents pour la requête courante."""
    query = state["search_query"] or state["question"]
    return {"search_query": query, "documents": bm25_search(query, CHUNKS)}


def generate(state: RagState) -> dict[str, Any]:
    """Nœud generate : répond uniquement à partir des passages, avec citations."""
    if not state["documents"]:
        return {"answer": INSUFFISANT}

    context = "\n\n".join(
        f"[{i}] (source : {doc.source})\n{doc.text}" for i, doc in enumerate(state["documents"], 1)
    )
    system = SystemMessage(
        content=(
            "Tu réponds en français en t'appuyant UNIQUEMENT sur les extraits fournis. "
            "Cite tes sources sous la forme [n]. "
            f"Si les extraits ne permettent pas de répondre, réponds exactement : {INSUFFISANT}."
        )
    )
    human = HumanMessage(content=f"Extraits :\n\n{context}\n\nQuestion : {state['question']}")
    response = llm.invoke([system, human])
    return {"answer": _text(response).strip()}


def rewrite_query(state: RagState) -> dict[str, Any]:
    """Nœud rewrite_query : reformule la question en mots-clés pour une nouvelle recherche."""
    prompt = HumanMessage(
        content=(
            "Reformule cette question en une requête de recherche courte, par mots-clés, "
            "en français. Réponds uniquement avec la requête.\n\n"
            f"Question : {state['question']}\n"
            f"Requête précédente (n'a rien donné) : {state['search_query']}"
        )
    )
    response = llm.invoke([prompt])
    return {"search_query": _text(response).strip(), "attempts": state["attempts"] + 1}


# ---------------------------------------------------------------------------
# 5. Arête conditionnelle
# ---------------------------------------------------------------------------


def route_after_generate(state: RagState) -> str:
    """Relance la recherche si la réponse est insuffisante et qu'il reste des essais."""
    if INSUFFISANT in state["answer"] and state["attempts"] < MAX_ATTEMPTS:
        return "rewrite_query"
    return END


# ---------------------------------------------------------------------------
# 6. Assemblage du graphe
# ---------------------------------------------------------------------------

builder = StateGraph(RagState)
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.add_node("rewrite_query", rewrite_query)

builder.add_edge(START, "retrieve")
builder.add_edge("retrieve", "generate")
builder.add_conditional_edges(
    "generate", route_after_generate, {"rewrite_query": "rewrite_query", END: END}
)
builder.add_edge("rewrite_query", "retrieve")

graph = builder.compile()

# ---------------------------------------------------------------------------
# 7. Lancement en ligne de commande
# ---------------------------------------------------------------------------


def run() -> None:
    if not CHUNKS:
        sys.exit(f"Erreur : aucun document .txt ou .md trouvé dans {DOCS_DIR}")

    question = " ".join(sys.argv[1:]) or "De quoi parle le corpus ?"
    print(f"Question : {question}\n")

    initial: RagState = {
        "question": question,
        "search_query": "",
        "documents": [],
        "answer": "",
        "attempts": 0,
    }
    for step in graph.stream(initial, stream_mode="updates"):
        for node_name, update in step.items():
            if node_name == "retrieve":
                sources = ", ".join(f"{d.source}#{d.id}" for d in update["documents"]) or "aucun"
                print(f"[retrieve] requête « {update['search_query']} » -> {sources}")
            elif node_name == "generate":
                if INSUFFISANT in update["answer"]:
                    print("[generate] réponse insuffisante -> nouvelle recherche")
                else:
                    print(f"[generate] réponse :\n\n{update['answer']}")
            elif node_name == "rewrite_query":
                print(f"[rewrite_query] nouvelle requête : « {update['search_query']} »")


def _print_short_error(exc: BaseException) -> None:
    """Affiche le type, le message et la ligne de CE fichier qui a déclenché l'erreur."""
    this_file = os.path.abspath(__file__)
    frames = [
        f for f in traceback.extract_tb(exc.__traceback__)
        if os.path.abspath(f.filename) == this_file
    ]
    print(f"{type(exc).__name__}: {exc}", file=sys.stderr)
    if frames:
        last = frames[-1]
        print(f"  -> {os.path.basename(this_file)}, ligne {last.lineno} : {last.line}", file=sys.stderr)


def main() -> None:
    """Affiche seulement le type, le message et la ligne fautive, sauf si AGENT_DEBUG=1."""
    try:
        run()
    except KeyboardInterrupt:
        print("\nInterrompu.", file=sys.stderr)
        sys.exit(130)
    except Exception as exc:
        if os.getenv("AGENT_DEBUG") == "1":
            raise
        _print_short_error(exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
