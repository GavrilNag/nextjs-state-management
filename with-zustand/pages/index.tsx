import { useEffect } from "react";
import Head from "next/head";
import create from "zustand";

import styles from "../styles/Home.module.css";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const usePokemonStore = create<{
  pokemon: Pokemon[];
  setPokemon: (pokemon: Pokemon[]) => void;
  filteredPokemon: Pokemon[];
  filter: string;
  setFilter: (filter: string) => void;
}>((set) => ({
  pokemon: [],
  filteredPokemon: [],
  filter: "",

  setPokemon: (pokemon: Pokemon[]) =>
    set({ pokemon, filteredPokemon: pokemon }),
  setFilter: (filter: string) =>
    set((state) => ({
      filter,
      filteredPokemon: state.pokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(filter.toLowerCase())
      ),
    })),
}));

export async function getServerSideProps() {
  const resp = await fetch(
    "https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json"
  );

  usePokemonStore.getState().setPokemon(await resp.json());

  return {
    props: {
      pokemon: usePokemonStore.getState().pokemon,
    },
  };
}

export default function Home({ pokemon }: { pokemon: Pokemon[] }) {
  const { filter, filteredPokemon, setFilter } = usePokemonStore();

  useEffect(() => {
    usePokemonStore.getState().setPokemon(pokemon);
  }, [pokemon]);

  return (
    <div className={styles.main}>
      <Head>
        <title>Pokemon</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.search}
        />
      </div>
      <div className={styles.container}>
        {filteredPokemon.slice(0, 20).map((p) => (
          <div key={p.id} className={styles.image}>
            <img
              alt={p.name}
              src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${p.image}`}
            />
            <h2>{p.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
