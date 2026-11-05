import { DRONE_PRINCIPLES, PRINCIPLES_SECTION } from '../content'
import { Companies } from '../sections/Companies'
import { DroneSequence } from '../sections/DroneSequence'
import { Hero } from '../sections/Hero'
import { Principles } from '../sections/Principles'

export function DronePage() {
  return (
    <>
      <Hero route="drone" />
      <DroneSequence />
      <Principles section={PRINCIPLES_SECTION} items={DRONE_PRINCIPLES} />
      <Companies excludeCompany="drone" />
    </>
  )
}
