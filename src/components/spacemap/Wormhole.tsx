import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3, Mesh, FrontSide, AdditiveBlending, BackSide, Color } from "three"


//https://onion2k.github.io/r3f-by-example/#effects
//http://stemkoski.github.io/Three.js/Shader-Glow.html
const GlowShaderMaterial = {
	uniforms:
	{
		"c": { type: "f", value: .5 },
		"p": { type: "f", value: 2 },
		glowColor: { type: "c", value: new Color(0xE7E0CC) },
		viewVector: { type: "v3", value: new Vector3(0, 0, 0) },
	},
  vertexShader: `
		uniform vec3 viewVector;
		uniform float c;
		uniform float p;
		varying float intensity;
		void main() 
		{
			vec3 vNormal = normalize( normalMatrix * normal );
			vec3 vNormel = normalize( normalMatrix * viewVector );
			intensity = pow( c - dot(vNormal, vNormel), p );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
  `,
  fragmentShader: `
		uniform vec3 glowColor;
		varying float intensity;
		void main() 
		{
			vec3 glow = glowColor * intensity;
			gl_FragColor = vec4( glow, 1.0 );
		}
  `,
	side: FrontSide,
	blending: AdditiveBlending,
	transparent: true
};


const Wormhole = (props: any) => {
	const glow = useRef<Mesh>(null!)
	const disk = useRef<Mesh>(null!)
	const diskglow = useRef<Mesh>(null!)
	
	useFrame(({ camera }) => {
		//disk.current.rotation.x += .1
		const viewVector = new Vector3().subVectors(camera.position, new Vector3());
		// @ts-ignore: idk it worked in the demo
		glow.current.material.uniforms.viewVector.value = viewVector;
		// @ts-ignore: ditto
		// diskglow.current.material.uniforms.viewVector.value = viewVector;
		// diskglow.current.rotation.z += .1
	})

	useEffect(() => {
		// @ts-ignore: UNIFORMS totally does exit on this
		glow.current.material.uniforms["c"] = {type: "f", value: .7}
		// @ts-ignore: ditto
		glow.current.material.uniforms["p"] = {type: "f", value: 5}
	})

	return (
		<>
			<pointLight
				{...props}
				intensity = {.25}
			/>

			{/* Blackhole */}
			<mesh
				{...props}
			>
				<sphereGeometry args={[2, 32, 32]} />
				<meshStandardMaterial attach="material" roughness={0.5} color={'rgb(0,0,0)'} />
			</mesh>

			{/* Glow */}
			<mesh
				{...props}
				ref={glow}
			>
				<sphereGeometry args={[6, 32, 32]} />
				<shaderMaterial
					attach="material"
					args={[GlowShaderMaterial]}
					side={BackSide}
					blending={AdditiveBlending}
					transparent={true}
				/>
			</mesh>

			{/* Disk */}
			{/* <mesh
				{...props}
				ref={disk}
				rotation={[1.5, 0, 0]}
				scale={[1.01, 1, 1]}
			>
				<cylinderGeometry args={[12, 12, .1, 32]}/>
				<meshStandardMaterial attach="material" roughness={0.5} color={'rgb(255,229,146)'} />
			</mesh> */}

			{/* Disk Glow */}

			{/* <mesh
				{...props}
				ref={diskglow}
				rotation={[-.7, 0, 0]}
				scale={1}
			>
				<torusGeometry args={[12, 4, 32, 100]}/>
				<shaderMaterial
					attach="material"
					args={[GlowShaderMaterial]}
					side={BackSide}
					blending={AdditiveBlending}
					transparent={true}
				/>
			</mesh>*/}
		</> 
	)
}

export default Wormhole