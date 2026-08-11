'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type Eintrag = { id: number | string; name: string; ort?: string; lat: number; lng: number }

function AutoFit({ eintraege }: { eintraege: Eintrag[] }) {
  const map = useMap()
  useEffect(() => {
    if (eintraege.length === 0) return
    if (eintraege.length === 1) {
      map.setView([eintraege[0].lat, eintraege[0].lng], 12)
      return
    }
    const bounds = L.latLngBounds(eintraege.map(e => [e.lat, e.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [eintraege, map])
  return null
}

export default function DienstleisterKarte({ eintraege }: { eintraege: Eintrag[] }) {
  const mitKoordinaten = eintraege.filter(e => typeof e.lat === 'number' && typeof e.lng === 'number')

  if (mitKoordinaten.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5A5550', fontSize: 13, background: '#111' }}>
        Für diese Treffer liegen noch keine Standortdaten vor.
      </div>
    )
  }

  return (
    <MapContainer center={[mitKoordinaten[0].lat, mitKoordinaten[0].lng]} zoom={11} style={{ width: '100%', height: 480 }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AutoFit eintraege={mitKoordinaten} />
      {mitKoordinaten.map(e => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={markerIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: 13 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{e.name}</div>
              {e.ort && <div style={{ color: '#666', marginBottom: 8 }}>{e.ort}</div>}
              <a href={`/profil/${e.id}`} style={{ color: '#b87333', fontWeight: 600 }}>Profil ansehen →</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
