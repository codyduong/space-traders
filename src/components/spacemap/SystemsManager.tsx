import { useContext } from "react"
import { System } from "spacetraders-sdk/dist/types"
import { systemsContext } from "../../context/systemsContext"
import SpaceMap from "./SpaceMap"

const SystemsManager = () => {
	const { systems } = useContext(systemsContext)

	const Systems = systems?.systems.map((system: System, index: number) => {
		return <SpaceMap key={system.symbol} system={system} index={index}/>
	})

	return (
		<>
		{Systems}
		</>
	)
}

export default SystemsManager