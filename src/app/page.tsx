import { Pokemon, PageContent } from "./content";

export default async function Home() {
  const temp = (await (await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302", { cache: "force-cache" })).json()).results
    .map((pokemon: any) => ({ name: pokemon.name, number: pokemon.url.split("/").slice(-2)[0], url: pokemon.url })).slice(0, 493);

  const allPokemon: Pokemon[] = await Promise.all(temp.map(async (pokemon: any) => {
    const data = await (await fetch(pokemon.url, { cache: "force-cache" })).json();

    return {
      name: data.name,
      number: parseInt(pokemon.number),
      types: data.types.map((type: any) => type.type.name),
      abilities: data.abilities.map((ability: any) => ability.ability.name),
      stats: Object.fromEntries(data.stats.map((stat: any) => [stat.stat.name, stat.base_stat])),
    };
  }));

  return (
    <PageContent allPokemon={allPokemon} />
  );
}