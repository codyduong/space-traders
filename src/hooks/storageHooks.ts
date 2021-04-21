import { useEffect, useState } from "react"

function getLocalStorage(name: string): any {
  return localStorage.getItem(name)
}

export function useLocalStorage<S>(name: string) {
  const t:[S, React.Dispatch<React.SetStateAction<S>>] = useState(getLocalStorage(name))

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(t[0]))
  }, [name, t]);

  return t
}
