import { useEffect, useState } from "react"

function getLocalStorage<S>(name: string): any {
	// @ts-ignore : JSON.parse only accepts string, but nothing bad happens if null is passed, hence this.
	const _: S = JSON.parse(localStorage.getItem(name))
	return _
}

export function useLocalStorage<S>(name: string) {
	const t: [S, React.Dispatch<React.SetStateAction<S>>] = useState(getLocalStorage<S>(name))

	useEffect(() => {
		localStorage.setItem(name, JSON.stringify(t[0]))
	}, [name, t]);

	return t
}

function getSessionStorage<S>(name: string): any {
	// @ts-ignore : JSON.parse only accepts string, but nothing bad happens if null is passed, hence this.
	const _: S = JSON.parse(sessionStorage.getItem(name))
	return _
}

export function useSessionStorage<S>(name: string) {
	const t: [S, React.Dispatch<React.SetStateAction<S>>] = useState(getSessionStorage<S>(name))

	useEffect(() => {
		sessionStorage.setItem(name, JSON.stringify(t[0]))
	}, [name, t]);

	return t
}
