import { WEB_FEATURES, WEB_FEATURES_SECTION } from '../content'
import { Companies } from '../sections/Companies'
import { Hero } from '../sections/Hero'
import { Principles } from '../sections/Principles'
import { Work } from '../sections/Work'

export function WebPage() {
  return (
    <>
      <Hero route="web" />
      <Work />
      <Principles id="features" section={WEB_FEATURES_SECTION} items={WEB_FEATURES} />
      <Companies excludeCompany="web" />
    </>
  )
}
