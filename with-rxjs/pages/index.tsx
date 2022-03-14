/* eslint-disable @next/next/no-img-element */
import { useMemo, useEffect } from "react";
import Head from "next/head";
import { BehaviorSubject } from "rxjs";
import { useObservableState } from "observable-hooks";

import styles from "../styles/Home.module.css";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const pokemon$ = new BehaviorSubject<Pokemon[]>([]);
const filter$ = new BehaviorSubject<string>("");

export async function getServerSideProps() {
  const resp = await fetch(
    "https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json"
  );
  pokemon$.next(await resp.json());
  return {
    props: {
      initialPokemon: pokemon$.value,
    },
  };
}

export default function Home({ initialPokemon }) {
  useEffect(() => {
    pokemon$.next(initialPokemon);
  }, [initialPokemon]);

  const pokemon = useObservableState(pokemon$);
  const filter = useObservableState(filter$);

  const filteredPokemon = useMemo(
    () =>
      pokemon.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, pokemon]
  );

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
          value={filter$.value}
          onChange={(e) => filter$.next(e.target.value)}
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
