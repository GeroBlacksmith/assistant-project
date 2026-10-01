import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API = "https://pokeapi.co/api/v2"; // free tier: no API key needed
const PAGE_SIZE = 24;
const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const COLORS = ["black", "blue", "brown", "gray", "green", "pink", "purple", "red", "white", "yellow"];
const TYPE_COLORS = {
  normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c", grass: "#7ac74c",
  ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1", ground: "#e2bf65", flying: "#a98ff3",
  psychic: "#f95587", bug: "#a6b91a", rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc",
  dark: "#705746", steel: "#b7b7ce", fairy: "#d685ad",
};

const getJson = async (path) => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`PokéAPI responded ${res.status} for ${path}`);
  return res.json();
};

/* ---------- Data hooks (React Query) ---------- */

const useTypes = () =>
  useQuery({
    queryKey: ["types"],
    queryFn: async () => (await getJson("/type")).results.map((t) => t.name).filter((n) => n !== "unknown" && n !== "stellar"),
  });

// Resolves the list of Pokémon names matching every active filter.
const usePokemonSearch = (filters) =>
  useQuery({
    queryKey: ["search", filters],
    queryFn: async () => {
      const all = (await getJson("/pokemon?limit=1025")).results.map((p) => p.name);
      const sets = [];
      if (filters.type) sets.push((await getJson(`/type/${filters.type}`)).pokemon.map((p) => p.pokemon.name));
      if (filters.generation) sets.push((await getJson(`/generation/${filters.generation}`)).pokemon_species.map((s) => s.name));
      if (filters.color) sets.push((await getJson(`/pokemon-color/${filters.color}`)).pokemon_species.map((s) => s.name));

      let names = all;
      for (const set of sets) {
        const lookup = new Set(set);
        names = names.filter((n) => lookup.has(n));
      }
      const term = filters.name.trim().toLowerCase();
      if (term) names = names.filter((n) => n.includes(term));
      return names;
    },
  });

const usePokemon = (name) =>
  useQuery({ queryKey: ["pokemon", name], queryFn: () => getJson(`/pokemon/${name}`) });

/* ---------- Components ---------- */

function SearchForm({ onSearch }) {
  const { data: types = [], isLoading } = useTypes();
  const [form, setForm] = useState({ name: "", type: "", generation: "", color: "" });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSearch(form);
  };
  const reset = () => {
    const empty = { name: "", type: "", generation: "", color: "" };
    setForm(empty);
    onSearch(empty);
  };

  return (
    <form className="search" onSubmit={submit}>
      <label>
        Name
        <input value={form.name} onChange={set("name")} placeholder="e.g. char" />
      </label>
      <label>
        Type
        <select value={form.type} onChange={set("type")} disabled={isLoading}>
          <option value="">Any type</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label>
        Generation
        <select value={form.generation} onChange={set("generation")}>
          <option value="">Any generation</option>
          {GENERATIONS.map((g) => <option key={g} value={g}>Generation {g}</option>)}
        </select>
      </label>
      <label>
        Color
        <select value={form.color} onChange={set("color")}>
          <option value="">Any color</option>
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <div className="actions">
        <button type="submit">Search</button>
        <button type="button" className="ghost" onClick={reset}>Clear</button>
      </div>
    </form>
  );
}

function PokemonCard({ name }) {
  const { data: p, isLoading, isError, refetch } = usePokemon(name);

  if (isLoading) return <article className="card skeleton" aria-busy="true"><span className="sr">Loading {name}</span></article>;
  if (isError)
    return (
      <article className="card">
        <p className="card-error">Couldn't load {name}.</p>
        <button className="ghost" onClick={() => refetch()}>Retry</button>
      </article>
    );

  const img = p.sprites.other["official-artwork"].front_default || p.sprites.front_default;
  const stat = (s) => p.stats.find((x) => x.stat.name === s)?.base_stat;

  return (
    <article className="card">
      <span className="dex">#{String(p.id).padStart(4, "0")}</span>
      <img src={img} alt={p.name} loading="lazy" width="160" height="160" />
      <h2>{p.name}</h2>
      <div className="chips">
        {p.types.map(({ type }) => (
          <span key={type.name} className="chip" style={{ background: TYPE_COLORS[type.name] || "#888" }}>{type.name}</span>
        ))}
      </div>
      <dl className="facts">
        <div><dt>Height</dt><dd>{p.height / 10} m</dd></div>
        <div><dt>Weight</dt><dd>{p.weight / 10} kg</dd></div>
        <div><dt>HP</dt><dd>{stat("hp")}</dd></div>
        <div><dt>Attack</dt><dd>{stat("attack")}</dd></div>
      </dl>
    </article>
  );
}

export default function App() {
  const [filters, setFilters] = useState({ name: "", type: "", generation: "", color: "" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { data: names, isLoading, isError, error, refetch } = usePokemonSearch(filters);

  const handleSearch = (next) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <main>
      <header>
        <h1>Pokédex</h1>
        <p>Find Pokémon by name, type, generation or color.</p>
      </header>

      <SearchForm onSearch={handleSearch} />

      {isLoading && <p className="status" role="status">Searching…</p>}
      {isError && (
        <div className="status error" role="alert">
          <p>Search failed: {error.message}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      )}
      {names && names.length === 0 && <p className="status">No Pokémon match those filters. Try removing one.</p>}

      {names && names.length > 0 && (
        <>
          <p className="count">Showing {Math.min(visible, names.length)} of {names.length}</p>
          <section className="grid">
            {names.slice(0, visible).map((n) => <PokemonCard key={n} name={n} />)}
          </section>
          {visible < names.length && (
            <button className="more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more</button>
          )}
        </>
      )}
    </main>
  );
}
