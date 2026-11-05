import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

import type { GradientColors } from '../content'

interface GradientBackgroundProps {
  pixelDensity: number
  colors: GradientColors
}

export function GradientBackground({ pixelDensity, colors }: GradientBackgroundProps) {
  return (
    <ShaderGradientCanvas
      pixelDensity={pixelDensity}
      fov={45}
      pointerEvents="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        animate="on"
        uTime={0}
        uSpeed={0.12}
        uStrength={2.6}
        uDensity={1.2}
        uFrequency={5.5}
        uAmplitude={0}
        color1={colors.color1}
        color2={colors.color2}
        color3={colors.color3}
        reflection={0.12}
        lightType="3d"
        brightness={1.15}
        grain="off"
        cAzimuthAngle={180}
        cPolarAngle={115}
        cDistance={3.9}
        cameraZoom={1}
        positionX={-0.5}
        positionY={0.1}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={235}
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  )
}
