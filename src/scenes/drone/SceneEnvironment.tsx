import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { PMREMGenerator, type Texture } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

function renderRoomEnvironment(generator: PMREMGenerator): Texture {
  const room = new RoomEnvironment()
  const texture = generator.fromScene(room, 0.04).texture
  room.dispose()
  return texture
}

/**
 * Studio reflections for the metal and clearcoat surfaces, set as scene.environment without a visible background.
 * Built inside the effect because a disposed render-target texture cannot be re-uploaded.
 */
export function SceneEnvironment() {
  const getThreeState = useThree((state) => state.get)

  useEffect(() => {
    const { gl, scene } = getThreeState()
    const generator = new PMREMGenerator(gl)
    const texture = renderRoomEnvironment(generator)
    generator.dispose()
    scene.environment = texture
    return () => {
      if (scene.environment === texture) scene.environment = null
      texture.dispose()
    }
  }, [getThreeState])

  return null
}
