import { useState, useEffect } from "react";

interface IbgeMunicipio {
  id: number;
  nome: string;
}

export function useCidades(uf: string) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!uf) {
      setCidades([]);
      setError(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<IbgeMunicipio[]>;
      })
      .then((data) => setCidades(data.map((c) => c.nome)))
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [uf]);

  return { cidades, loading, error };
}
