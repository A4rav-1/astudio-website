import { Canvas } from '@react-three/fiber'
import type { RefObject } from 'react'
import type { RenderQuality } from '../../lib/renderQuality'
import { Atmosphere } from './Atmosphere'
import { DroneRig } from './DroneRig'
import { SceneEnvironment } from './SceneEnvironment'

interface DroneCanvasProps {
  progressRef: RefObject<number>
  calloutElements: RefObject<(HTMLElement | null)[]>
  quality: RenderQuality
  active: boolean
  staticFrame: boolean
}

export function DroneCanvas({ progressRef, calloutElements, quality, active, staticFrame }: DroneCanvasProps) {
  const frameloop = staticFrame ? 'demand' : active ? 'always' : 'never'
  return (
    <Canvas
      className="drone__canvas"
      dpr={[1, quality.maxDpr]}
      frameloop={frameloop}
      camera={{ fov: 30, near: 0.1, far: 80, position: [4, 2, 5] }}
      scene={{ environmentIntensity: 0.5 }}
      gl={{ antialias: quality.tier === 'high', alpha: true, powerPreference: 'high-performance' }}
      aria-label="3D model of the A Studio modular folding drone"
      role="img"
    >
      <SceneEnvironment />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#fff1dc" />
      <directionalLight position={[-5, 3, -6]} intensity={3.4} color="#3d86ff" />
      <directionalLight position={[0, -4, 2]} intensity={0.9} color="#155bbf" />
      <DroneRig
        progressRef={progressRef}
        calloutElements={calloutElements}
        radialSegments={quality.sphereSegments}
        snapToProgress={staticFrame}
      />
      <Atmosphere particleCount={quality.particleCount} />
    </Canvas>
  )
}
