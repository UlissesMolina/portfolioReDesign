import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const AUBURN_COORDS = [32.6099, -85.4808];

export default function MapCard({ isDark = true }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    import('leaflet').then(({ default: L }) => {
      if (mapInstanceRef.current || !mapRef.current) return;

      delete L.Icon.Default.prototype._getIconUrl;

      const map = L.map(mapRef.current, {
        center: AUBURN_COORDS,
        zoom: 10,
        dragging: false,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { subdomains: 'abcd', maxZoom: 20 }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: '<div class="map-pulse-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker(AUBURN_COORDS, { icon }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Swap tile layer when dark/light mode changes after mount
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    import('leaflet').then(({ default: L }) => {
      if (!mapInstanceRef.current) return;
      tileLayerRef.current.remove();
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current = L.tileLayer(tileUrl, { subdomains: 'abcd', maxZoom: 20 }).addTo(mapInstanceRef.current);
    });
  }, [isDark]);

  return (
    <div className="font-sans relative w-full h-full rounded-xl border border-surface-border bg-surface-card overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" style={{ zIndex: 0 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: 'linear-gradient(to top, rgb(var(--surface-card)) 0%, transparent 100%)' }}
        >
          <p className="text-sm font-medium text-ink">Auburn, AL</p>
          <p className="text-xs text-ink-dim mt-0.5">Open to relocation · Summer 2026</p>
        </div>
      </div>
    </div>
  );
}
