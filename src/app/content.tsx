"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

const generationSorter = ((a: Pokemon, b: Pokemon) => a.number - b.number);
const alphabeticalSorter = ((a: Pokemon, b: Pokemon) => (a.name < b.name ? -1 : 1));
const BSTSorter = ((a: Pokemon, b: Pokemon) => Object.values(b.stats).reduce((x, y) => x + y, 0) - Object.values(a.stats).reduce((x, y) => x + y, 0));
const allTeams: Team[] = [];
const photoURLBase = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

export type Pokemon = {
  name: string
  number: number
  types: string[]
  abilities: string[]
  stats: Record<"hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed", number>
};

export type Team = {
  name: string
  lineup: Pokemon[]
};

export type Sorter = {
  fn: typeof generationSorter
  label: string
}

export type Filter = {
  fn: (p: Pokemon) => boolean
  label: string
}

export function PageContent({ allPokemon }: { allPokemon: Pokemon[] }) {
  const [team, setTeam] = useState<Team>({ name: "Team 1", lineup: [] });
  const [query, setQuery] = useState("");
  const [sorter, setSorter] = useState({ fn: generationSorter, label: "Generation" });
  const [filters, setFilters] = useState<Filter[]>([]);

  return (
    <div className="grid grid-cols-[1fr_auto] p-48 gap-36">
      <main>
        <h1 className="font-bold text-36 text-center"> Pokémon Team Builder </h1>
        <div className="row justify-between">
          <input className="border-light-gray p-8 m-16 rounded text-14" placeholder="Search..." onChange={(e) => setQuery(e.target.value)} />
          <SorterDropdown sorter={sorter} setSorter={setSorter} filters={filters} setFilters={setFilters} />
        </div>

        <div className="row flex-wrap gap-24 justify-center">
          { allPokemon
            // .slice(0, 50)
            .filter((pokemon) => !query || pokemon.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            .filter((pokemon) => filters.length === 0 || filters.map((f) => f.fn(pokemon)).some((v) => v))
            .sort(sorter.fn)
            .map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                isSelected={team.lineup.filter(({ name }) => name === pokemon.name).length > 0}
                handleClick={() => {
                  if (team.lineup.filter(({ name }) => name === pokemon.name).length > 0) {
                    setTeam({ lineup: team.lineup.filter(({ name }) => name !== pokemon.name), name: team.name });
                  } else if (team.lineup.length < 6) {
                    setTeam({ lineup: [...team.lineup, pokemon], name: team.name });
                  } else {
                    alert("Teams can only have up to 6 Pokemon");
                  }
                }}
              />
            ))}
        </div>
      </main>

      <section>
        <Team team={team} setTeam={setTeam} />
      </section>
    </div>
  );
}

function Team({ team, setTeam }: { team: Team, setTeam: Dispatch<SetStateAction<Team>> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState(team.name);

  return (
    <div className="l-column gap-24">
      <div className="row justify-between gap-24">
        <input className="text-24 font-bold rounded px-8 py-[4px]" value={teamName} onChange={(e) => setTeamName(e.target.value)} />

        <div className="self-center relative">
          <button
            className="text-14 p-[4px] hover:opacity-50 align-bottom"
            onClick={() => setIsOpen(!isOpen)}
          >
            Load Saved Team ▼
          </button>

          { isOpen &&
            <div className="absolute bg-white p-12 mt-[4px] border border-black w-full">
              { allTeams.length === 0 && <p className="text-12"> No teams saved. </p> }
              { allTeams.length > 0 && allTeams.map((t) => (
                <div key={t.name}>
                  <button className="text-12" onClick={() => { setTeam(t); setTeamName(t.name); setIsOpen(false); } }>
                    { t.name }
                  </button>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12">
        { [0, 1, 2, 3, 4, 5].map((i) => (team.lineup[i]
          ? <img key={i} className="bg-light-gray rounded-full p-8" src={`${photoURLBase}/${team.lineup[i].number}.png`} width={160} height={160} />
          : <div key={i} className="bg-light-gray w-[160px] h-[160px] rounded-full" />))}
      </div>

      <button
        className="text-16 p-8 rounded-xl bg-table-green"
        onClick={() => {
          if (team.lineup.length === 0) {
            return alert("Empty teams not allowed!");
          }

          if (allTeams.some((team) => team.name === teamName)) {
            allTeams.find((team) => team.name === teamName)!.lineup = team.lineup;
          } else {
            allTeams.push({ ...team, name: teamName });
          }

          const newName = `Team ${allTeams.length + 1}`;
          setTeam({ name: newName, lineup: [] });
          setTeamName(newName);
          alert("Team saved successfully!");
        }}
      >
        Save Team
      </button>

      <button
        className="text-16 p-8 rounded-xl bg-table-red"
        onClick={() => {
          const newName = `Team ${allTeams.length + 1}`;
          setTeam({ name: newName, lineup: [] });
          setTeamName(newName);
        }}
      >
        Create New Team
      </button>

      <div className="border border-black h-1" />
      <h1 className="text-24 font-bold"> Team Overview </h1>

      <div className="text-16 l-column gap-8">
        <h2>
          { `Highest HP: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats.hp), 0)}`}
        </h2>
        <h2>
          { `Highest Attack: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats.attack), 0)}`}
        </h2>
        <h2>
          { `Highest Defense: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats.defense), 0)}`}
        </h2>
        <h2>
          { `Highest Special Attack: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats["special-attack"]), 0)}`}
        </h2>
        <h2>
          { `Highest Special Defense: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats["special-defense"]), 0)}`}
        </h2>
        <h2>
          { `Highest Speed: ${team.lineup.reduce((acc, curr) => Math.max(acc, curr.stats.speed), 0)}`}
        </h2>
      </div>
    </div>
  );
}

function PokemonCard({ pokemon, isSelected, handleClick }: { pokemon: Pokemon, isSelected: boolean, handleClick: () => void }) {
  const capitalize = (s: string) => s.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="l-column bg-edited-yellow p-12 rounded-xl">
      <h2 className="text-16">
        { capitalize(pokemon.name) }
      </h2>
      <h2>
        { capitalize(pokemon.types.join(" ")) }
      </h2>

      <img src={`${photoURLBase}/${pokemon.number}.png`} width={150} height={150} />

      <button className={`text-14 p-[4px] rounded-xl bg-table-${isSelected ? "red" : "green"}`} onClick={handleClick}>
        { isSelected ? "Remove from Team" : "Add to Team" }
      </button>
    </div>
  );
}

function SorterDropdown({
  sorter, setSorter, filters, setFilters,
}: { 
  sorter: Sorter, setSorter: Dispatch<SetStateAction<Sorter>>, filters: Filter[], setFilters: Dispatch<SetStateAction<Filter[]>>,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="self-center p-8">
      <button className="text-14 hover:opacity-50" onClick={() => setIsOpen(!isOpen)}> Sort / Filter By: </button>
      <div className="relative">
        { isOpen && (
            <div className="absolute top-6 z-20 p-16 bg-white w-[200px] right-0 border border-black rounded">
              <div className="mb-12">
                <p className="text-14"> Sort By: </p>
                <div className="row gap-[4px]">
                  <input type="radio" name="sorter" checked={sorter.label === "Generation"} onClick={() => setSorter({ fn: generationSorter, label: "Generation" })} />
                  <p className="text-14"> Generation </p>
                </div>

                <div className="row gap-[4px]">
                  <input type="radio" name="sorter" checked={sorter.label === "Alphabetical"} onClick={() => setSorter({ fn: alphabeticalSorter, label: "Alphabetical" })} />
                  <p className="text-14"> Alphabetical </p>
                </div>

                <div className="row gap-[4px]">
                  <input type="radio" name="sorter" checked={sorter.label === "Base Stat Total"} onClick={() => setSorter({ fn: BSTSorter, label: "Base Stat Total" })} />
                  <p className="text-14"> Base Stat Total </p>
                </div>
              </div>

              <div>
                <p className="text-14"> Filter By: </p>
                <div className="row gap-[4px]">
                  <input
                    type="checkbox"
                    checked={filters.some((f) => f.label === "I")}
                    onChange={() => {
                      if (filters.some((f) => f.label === "I")) {
                        setFilters(filters.filter((f) => f.label !== "I"));
                      } else {
                        setFilters([...filters, { fn: (p) => p.number <= 151, label: "I" }]);
                      }
                    }}
                  />
                  <p className="text-14"> Generation I </p>
                </div>

                <div className="row gap-[4px]">
                  <input
                    type="checkbox"
                    checked={filters.some((f) => f.label === "II")}
                    onChange={() => {
                      if (filters.some((f) => f.label === "II")) {
                        setFilters(filters.filter((f) => f.label !== "II"));
                      } else {
                        setFilters([...filters, { fn: (p) => p.number >= 152 && p.number <= 251, label: "II" }]);
                      }
                    }}
                  />
                  <p className="text-14"> Generation II </p>
                </div>

                <div className="row gap-[4px]">
                  <input
                    type="checkbox"
                    checked={filters.some((f) => f.label === "III")}
                    onChange={() => {
                      if (filters.some((f) => f.label === "III")) {
                        setFilters(filters.filter((f) => f.label !== "III"));
                      } else {
                        setFilters([...filters, { fn: (p) => p.number >= 252 && p.number <= 386, label: "III" }]);
                      }
                    }}
                  />
                  <p className="text-14"> Generation III </p>
                </div>

                <div className="row gap-[4px]">
                  <input
                    type="checkbox"
                    checked={filters.some((f) => f.label === "IV")}
                    onChange={() => {
                      if (filters.some((f) => f.label === "IV")) {
                        setFilters(filters.filter((f) => f.label !== "IV"));
                      } else {
                        setFilters([...filters, { fn: (p) => p.number >= 387 && p.number <= 493, label: "IV" }]);
                      }
                    }}
                  />
                  <p className="text-14"> Generation IV </p>
                </div>
              </div>

              <button
                className="bg-button-blue text-white p-8 rounded mt-8 text-14"
                onClick={() => {
                  setSorter({ fn: generationSorter, label: "Generation" });
                  setFilters([]);
                  alert("All filters and sorting is reset!");
                }}
              >
                Reset All
              </button>
            </div>
          )}
      </div>
    </div>
  );
}