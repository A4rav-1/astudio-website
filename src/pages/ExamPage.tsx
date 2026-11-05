import { EXAM_STEPS, EXAM_STEPS_SECTION } from '../content'
import { Companies } from '../sections/Companies'
import { Hero } from '../sections/Hero'
import { Principles } from '../sections/Principles'

export function ExamPage() {
  return (
    <>
      <Hero route="exam" />
      <Principles id="how" section={EXAM_STEPS_SECTION} items={EXAM_STEPS} />
      <Companies excludeCompany="exam" />
    </>
  )
}
