import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  AlertTriangle,
  Car,
  Crosshair,
  ExternalLink,
  Layers,
  Loader2,
  Navigation,
  Route as RouteIcon,
  X,
} from 'lucide-react';

type LatLng = { lat: number; lng: number };

type RouteStep = {
  instruction: string;
  distance: number;
};

type RouteResult = {
  points: [number, number][];
  distanceKm: number;
  durationMin: number;
  steps: RouteStep[];
  straightLine: boolean;
};

export type NearbySchool = {
  id: string;
  name: string;
  coordinates: LatLng;
  /** True when the position is a district fallback, not a surveyed fix. */
  approximate: boolean;
};

type Props = {
  coordinates: LatLng;
  schoolName: string;
  address?: string;
  className?: string;
  /** Every other institution in the same district, for the "All schools" layer. */
  nearby?: NearbySchool[];
  nearbyLoading?: boolean;
  onSelectNearby?: (id: string) => void;
};

const SATELLITE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const STREETS_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const EARTH_RADIUS_KM = 6371;

const haversineKm = (from: LatLng, to: LatLng) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] as string)
  );

// Leaflet injects this markup outside React, and the project runs the Tailwind
// Play CDN, so pins are styled inline to guarantee they render.
const PIN_WRAP = 'display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);white-space:nowrap;';
const PIN_DOT = 'margin-top:6px;display:flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:9999px;';

// Floating label that travels with the marker instead of a click-to-open
// popup — the school name should always be readable over satellite imagery.
const buildSchoolIcon = (name: string) =>
  L.divIcon({
    className: 'school-map-pin',
    html: `
      <div style="${PIN_WRAP}">
        <div style="max-width:240px;overflow:hidden;text-overflow:ellipsis;border-radius:9999px;border:1px solid rgba(255,255,255,0.4);background:rgba(15,23,42,0.88);padding:6px 12px;font-size:11px;font-weight:900;letter-spacing:0.02em;text-transform:uppercase;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.45);backdrop-filter:blur(6px);">
          ${escapeHtml(name)}
        </div>
        <span style="margin-top:-3px;width:10px;height:10px;transform:rotate(45deg);border-bottom:1px solid rgba(255,255,255,0.4);border-right:1px solid rgba(255,255,255,0.4);background:rgba(15,23,42,0.88);"></span>
        <span style="${PIN_DOT}background:#22d3ee;box-shadow:0 0 0 4px rgba(34,211,238,0.35);">
          <span style="width:6px;height:6px;border-radius:9999px;background:#0f172a;"></span>
        </span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

// Smaller, quieter pin for the surrounding schools so the subject of the page
// still reads as the primary marker.
const buildNearbyIcon = (name: string) =>
  L.divIcon({
    className: 'school-map-pin',
    html: `
      <div style="${PIN_WRAP}">
        <div style="max-width:180px;overflow:hidden;text-overflow:ellipsis;border-radius:9999px;border:1px solid rgba(255,255,255,0.28);background:rgba(15,23,42,0.72);padding:3px 9px;font-size:9px;font-weight:800;text-transform:uppercase;color:#e2e8f0;backdrop-filter:blur(4px);">
          ${escapeHtml(name)}
        </div>
        <span style="margin-top:3px;display:flex;align-items:center;justify-content:center;width:10px;height:10px;border-radius:9999px;background:#f8fafc;box-shadow:0 0 0 3px rgba(248,250,252,0.25);"></span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const userIcon = L.divIcon({
  className: 'school-map-pin',
  html: `
    <div style="${PIN_WRAP}">
      <div style="border-radius:9999px;border:1px solid rgba(255,255,255,0.4);background:#10b981;padding:4px 10px;font-size:10px;font-weight:900;text-transform:uppercase;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.35);">You</div>
      <span style="${PIN_DOT}background:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,0.35);"><span style="width:6px;height:6px;border-radius:9999px;background:#fff;"></span></span>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Keeps the viewport framed on whatever is currently relevant: the school
// alone, or the whole route once one has been calculated.
const MapFramer: React.FC<{ target: LatLng; route: RouteResult | null }> = ({ target, route }) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.points.length > 1) {
      map.fitBounds(L.latLngBounds(route.points), { padding: [56, 56], maxZoom: 16 });
    } else {
      map.setView([target.lat, target.lng], 16, { animate: true });
    }
  }, [map, route, target.lat, target.lng]);

  return null;
};

export const SchoolMap: React.FC<Props> = ({ coordinates, schoolName, address, className = '' }) => {
  const [basemap, setBasemap] = useState<'satellite' | 'streets'>('satellite');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'routing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const schoolIcon = useMemo(() => buildSchoolIcon(schoolName), [schoolName]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Reset any calculated journey when we switch to a different school.
  useEffect(() => {
    setRoute(null);
    setOrigin(null);
    setError(null);
    setShowSteps(false);
  }, [coordinates.lat, coordinates.lng]);

  const fetchRoute = useCallback(
    async (from: LatLng) => {
      setStatus('routing');
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${coordinates.lng},${coordinates.lat}?overview=full&geometries=geojson&steps=true`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Routing service unavailable');
        const data = await response.json();
        const leg = data?.routes?.[0];
        if (!leg) throw new Error('No road route found');

        setRoute({
          points: (leg.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng]),
          distanceKm: leg.distance / 1000,
          durationMin: leg.duration / 60,
          steps: (leg.legs?.[0]?.steps || [])
            .map((step: any) => ({
              instruction: [step.maneuver?.modifier, step.maneuver?.type, step.name]
                .filter(Boolean)
                .join(' ')
                .replace(/\b\w/g, (char: string) => char.toUpperCase()),
              distance: step.distance,
            }))
            .filter((step: RouteStep) => step.instruction.trim().length > 2),
          straightLine: false,
        });
        setError(null);
      } catch (routeError) {
        if ((routeError as Error).name === 'AbortError') return;
        // Still give the user the distance even when the routing host is down.
        setRoute({
          points: [
            [from.lat, from.lng],
            [coordinates.lat, coordinates.lng],
          ],
          distanceKm: haversineKm(from, coordinates),
          durationMin: 0,
          steps: [],
          straightLine: true,
        });
        setError('Live road routing is unavailable — showing direct distance instead.');
      } finally {
        setStatus('idle');
      }
    },
    [coordinates]
  );

  const handleDirections = useCallback(() => {
    if (route) {
      setRoute(null);
      setOrigin(null);
      setShowSteps(false);
      return;
    }
    if (!navigator.geolocation) {
      setError('This browser cannot share your location.');
      return;
    }

    setStatus('locating');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const from = { lat: position.coords.latitude, lng: position.coords.longitude };
        setOrigin(from);
        void fetchRoute(from);
      },
      () => {
        setStatus('idle');
        setError('Location permission denied. Allow location access to get directions.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [fetchRoute, route]);

  const busy = status !== 'idle';

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 dark:border-white/10 ${className}`}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-[340px] w-full md:h-[440px]"
      >
        {basemap === 'satellite' ? (
          <>
            <TileLayer url={SATELLITE_URL} maxZoom={19} attribution="Imagery &copy; Esri" />
            <TileLayer url={LABELS_URL} maxZoom={19} />
          </>
        ) : (
          <TileLayer url={STREETS_URL} maxZoom={19} attribution="&copy; OpenStreetMap contributors" />
        )}

        <Marker position={[coordinates.lat, coordinates.lng]} icon={schoolIcon} />
        {origin && <Marker position={[origin.lat, origin.lng]} icon={userIcon} />}
        {route && (
          <>
            <Polyline positions={route.points} pathOptions={{ color: '#0f172a', weight: 9, opacity: 0.5 }} />
            <Polyline
              positions={route.points}
              pathOptions={{
                color: '#22d3ee',
                weight: 5,
                dashArray: route.straightLine ? '10 10' : undefined,
              }}
            />
          </>
        )}

        <MapFramer target={coordinates} route={route} />
      </MapContainer>

      {/* Toolbar sits above the map rather than beside it, so the journey
          controls stay reachable on narrow screens. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-wrap items-center gap-2 bg-gradient-to-b from-slate-950/80 to-transparent p-3">
        <button
          onClick={handleDirections}
          disabled={busy}
          className="pointer-events-auto flex items-center gap-2 rounded-[12px] bg-cyan-500 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-lg transition hover:bg-cyan-400 disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : route ? <X size={15} /> : <Navigation size={15} />}
          {status === 'locating' ? 'Locating you' : status === 'routing' ? 'Building route' : route ? 'Clear route' : 'Directions'}
        </button>

        {route && (
          <>
            <span className="pointer-events-auto flex items-center gap-1.5 rounded-[12px] bg-slate-950/80 px-3 py-2.5 text-[11px] font-black text-white backdrop-blur-md">
              <RouteIcon size={14} className="text-cyan-400" />
              {route.distanceKm.toFixed(1)} km away
            </span>
            {route.durationMin > 0 && (
              <span className="pointer-events-auto flex items-center gap-1.5 rounded-[12px] bg-slate-950/80 px-3 py-2.5 text-[11px] font-black text-white backdrop-blur-md">
                <Car size={14} className="text-cyan-400" />
                {route.durationMin < 60
                  ? `${Math.round(route.durationMin)} min`
                  : `${Math.floor(route.durationMin / 60)} h ${Math.round(route.durationMin % 60)} min`}
              </span>
            )}
            {route.steps.length > 0 && (
              <button
                onClick={() => setShowSteps((open) => !open)}
                className="pointer-events-auto rounded-[12px] bg-white/90 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-800 backdrop-blur-md transition hover:bg-white"
              >
                {showSteps ? 'Hide steps' : `${route.steps.length} steps`}
              </button>
            )}
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setBasemap((current) => (current === 'satellite' ? 'streets' : 'satellite'))}
            className="pointer-events-auto flex items-center gap-1.5 rounded-[12px] bg-slate-950/80 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-slate-900"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">{basemap === 'satellite' ? 'Satellite' : 'Streets'}</span>
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto flex items-center gap-1.5 rounded-[12px] bg-slate-950/80 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-slate-900"
            title="Open turn-by-turn navigation"
          >
            <ExternalLink size={14} />
            <span className="hidden md:inline">Navigate</span>
          </a>
        </div>
      </div>

      {showSteps && route && route.steps.length > 0 && (
        <div className="absolute bottom-3 left-3 z-[500] max-h-[55%] w-[min(340px,calc(100%-1.5rem))] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/90 p-3 text-white backdrop-blur-md">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
            <Crosshair size={12} /> Journey to {schoolName}
          </p>
          <ol className="space-y-2">
            {route.steps.map((step, index) => (
              <li key={`${step.instruction}-${index}`} className="flex gap-2.5 text-[11px] leading-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-black">
                  {index + 1}
                </span>
                <span className="flex-1">
                  <span className="font-bold">{step.instruction}</span>
                  <span className="ml-1.5 text-white/45">
                    {step.distance >= 1000 ? `${(step.distance / 1000).toFixed(1)} km` : `${Math.round(step.distance)} m`}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {error && (
        <div className="absolute inset-x-3 bottom-3 z-[500] flex items-start gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/90 px-3 py-2.5 text-[11px] font-bold text-slate-950">
          <AlertTriangle size={14} className="mt-px shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0"><X size={13} /></button>
        </div>
      )}

      {address && !showSteps && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-[400] hidden max-w-[60%] rounded-xl bg-slate-950/75 px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur-md md:block">
          {address}
        </div>
      )}
    </div>
  );
};
