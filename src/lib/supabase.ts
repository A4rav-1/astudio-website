import type { SupabaseTarget } from './webEnquiry'

/**
 * The astudio-website Supabase project. The publishable key is meant to ship in the
 * browser: row level security only lets it insert new web enquiries.
 */
export const SUPABASE: SupabaseTarget = {
  url: 'https://foulkresnkgrmsbftjyo.supabase.co',
  publishableKey: 'sb_publishable_qyUycUPMV2yiw-admpu0CA_gH6T4iA7',
}
