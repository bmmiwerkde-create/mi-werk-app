import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: dienstleister } = await supabase
    .from('dienstleister')
    .select('id, created_at')
    .eq('abo_aktiv', true)

  const profileUrls = (dienstleister || []).map(d => ({
    url: `https://mi-werk.de/profil/${d.id}`,
    lastModified: new Date(d.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://mi-werk.de',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mi-werk.de/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...profileUrls,
  ]
}
