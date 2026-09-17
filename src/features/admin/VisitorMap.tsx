import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, LocateFixed, MapPinned, RefreshCw, Users, Radio, X } from 'lucide-react';
import { fetchUniqueVisitorLocations, type UniqueVisitorLocation } from '../../services/analyticsQueries';
import { auth } from '../../services/firebase';
import { getIdTokenResult } from 'firebase/auth';

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Harare',
});
const shortId = (value: string) => value ? `${value.slice(0, 8)}…${value.slice(-4)}` : 'Unknown';
const locationName = (row: UniqueVisitorLocation) =>
  row.placeName || row.locality || row.district || row.province || row.formattedAddress || 'Shared location';

export interface ProvinceTown {
  name: string;
  type: 'capital' | 'major_city' | 'town' | 'border_post' | 'district';
  lat: number;
  lon: number;
}

// Province directory and town coordinates used to focus the geographic map.
export interface ProvinceData {
  name: string;
  color: string;
  capital: string;
  towns: ProvinceTown[];
}

export const ZIMBABWE_PROVINCES: Record<string, ProvinceData> = {
  'Matabeleland North': {
    name: 'Matabeleland North',
    color: '#4338ca', // Indigo
    capital: 'Lupane',
    towns: [
      { name: 'Lupane', type: 'capital', lat: -18.9315, lon: 27.8070 },
      { name: 'Victoria Falls', type: 'major_city', lat: -17.9325, lon: 25.8307 },
      { name: 'Hwange', type: 'town', lat: -18.3647, lon: 26.5000 },
      { name: 'Binga', type: 'town', lat: -17.6203, lon: 27.3414 },
      { name: 'Tsholotsho', type: 'district', lat: -19.7667, lon: 27.7500 },
      { name: 'Nkayi', type: 'district', lat: -19.0000, lon: 28.9000 },
      { name: 'Dete', type: 'town', lat: -18.6167, lon: 26.8667 },
    ],
  },
  'Bulawayo': {
    name: 'Bulawayo',
    color: '#0891b2', // Cyan
    capital: 'Bulawayo',
    towns: [
      { name: 'Bulawayo CBD', type: 'capital', lat: -20.1500, lon: 28.5833 },
      { name: 'Luveve', type: 'district', lat: -20.1167, lon: 28.5167 },
      { name: 'Nkulumane', type: 'district', lat: -20.1833, lon: 28.5333 },
      { name: 'Pumula', type: 'district', lat: -20.1333, lon: 28.4667 },
      { name: 'Hillside', type: 'district', lat: -20.1833, lon: 28.6000 },
      { name: 'Cowdray Park', type: 'district', lat: -20.0833, lon: 28.4833 },
      { name: 'Mpopoma', type: 'district', lat: -20.1333, lon: 28.5500 },
    ],
  },
  'Matabeleland South': {
    name: 'Matabeleland South',
    color: '#a21caf', // Fuchsia / Magenta
    capital: 'Gwanda',
    towns: [
      { name: 'Gwanda', type: 'capital', lat: -20.9333, lon: 29.0000 },
      { name: 'Beitbridge', type: 'border_post', lat: -22.2167, lon: 30.0000 },
      { name: 'Plumtree', type: 'border_post', lat: -20.4833, lon: 27.8167 },
      { name: 'Filabusi', type: 'town', lat: -20.5333, lon: 29.2833 },
      { name: 'Esigodini', type: 'town', lat: -20.2833, lon: 28.9333 },
      { name: 'Maphisa', type: 'district', lat: -21.0167, lon: 28.4500 },
      { name: 'Kezi', type: 'district', lat: -20.8833, lon: 28.4333 },
    ],
  },
  'Midlands': {
    name: 'Midlands',
    color: '#4d7c0f', // Lime / Olive
    capital: 'Gweru',
    towns: [
      { name: 'Gweru', type: 'capital', lat: -19.4500, lon: 29.8167 },
      { name: 'Kwekwe', type: 'major_city', lat: -18.9281, lon: 29.8149 },
      { name: 'Zvishavane', type: 'town', lat: -20.3333, lon: 30.0667 },
      { name: 'Gokwe', type: 'town', lat: -18.2047, lon: 28.9347 },
      { name: 'Shurugwi', type: 'town', lat: -19.6700, lon: 30.0000 },
      { name: 'Redcliff', type: 'town', lat: -19.0333, lon: 29.7833 },
      { name: 'Mvuma', type: 'town', lat: -19.2833, lon: 30.5333 },
      { name: 'Mberengwa', type: 'district', lat: -20.4667, lon: 29.9167 },
    ],
  },
  'Mashonaland West': {
    name: 'Mashonaland West',
    color: '#0f766e', // Teal
    capital: 'Chinhoyi',
    towns: [
      { name: 'Chinhoyi', type: 'capital', lat: -17.3667, lon: 30.2000 },
      { name: 'Kadoma', type: 'major_city', lat: -18.3333, lon: 29.9167 },
      { name: 'Kariba', type: 'town', lat: -16.5167, lon: 28.8000 },
      { name: 'Chegutu', type: 'town', lat: -18.1303, lon: 30.1408 },
      { name: 'Norton', type: 'town', lat: -17.8833, lon: 30.7000 },
      { name: 'Karoi', type: 'town', lat: -16.8100, lon: 29.6900 },
      { name: 'Banket', type: 'town', lat: -17.3833, lon: 30.4000 },
      { name: 'Magunje', type: 'district', lat: -16.7167, lon: 29.4167 },
    ],
  },
  'Mashonaland Central': {
    name: 'Mashonaland Central',
    color: '#d97706', // Amber Gold
    capital: 'Bindura',
    towns: [
      { name: 'Bindura', type: 'capital', lat: -17.3000, lon: 31.3333 },
      { name: 'Mazowe', type: 'district', lat: -17.5167, lon: 30.9667 },
      { name: 'Shamva', type: 'town', lat: -17.1833, lon: 31.5667 },
      { name: 'Mount Darwin', type: 'town', lat: -16.7833, lon: 31.5833 },
      { name: 'Guruve', type: 'district', lat: -16.6667, lon: 30.7000 },
      { name: 'Glendale', type: 'town', lat: -17.3500, lon: 31.0500 },
      { name: 'Centenary', type: 'town', lat: -16.7167, lon: 31.1167 },
      { name: 'Rushinga', type: 'district', lat: -16.6667, lon: 32.0667 },
    ],
  },
  'Harare': {
    name: 'Harare',
    color: '#2563eb', // Royal Blue
    capital: 'Harare',
    towns: [
      { name: 'Harare CBD', type: 'capital', lat: -17.8292, lon: 31.0522 },
      { name: 'Chitungwiza', type: 'major_city', lat: -18.0127, lon: 31.0756 },
      { name: 'Epworth', type: 'town', lat: -17.8900, lon: 31.1475 },
      { name: 'Borrowdale', type: 'district', lat: -17.7539, lon: 31.0969 },
      { name: 'Highfield', type: 'district', lat: -17.8872, lon: 30.9890 },
      { name: 'Avondale', type: 'district', lat: -17.7960, lon: 31.0370 },
      { name: 'Mabvuku', type: 'town', lat: -17.8480, lon: 31.1960 },
      { name: 'Glen View', type: 'district', lat: -17.9150, lon: 30.9350 },
    ],
  },
  'Mashonaland East': {
    name: 'Mashonaland East',
    color: '#7c3aed', // Violet
    capital: 'Marondera',
    towns: [
      { name: 'Marondera', type: 'capital', lat: -18.1833, lon: 31.5500 },
      { name: 'Goromonzi', type: 'district', lat: -17.7833, lon: 31.4167 },
      { name: 'Murehwa', type: 'town', lat: -17.6500, lon: 31.7833 },
      { name: 'Mutoko', type: 'town', lat: -17.4000, lon: 32.2333 },
      { name: 'Ruwa', type: 'town', lat: -17.8897, lon: 31.2450 },
      { name: 'Wedza', type: 'district', lat: -18.6167, lon: 31.5667 },
      { name: 'Beatrice', type: 'town', lat: -18.2500, lon: 30.8500 },
      { name: 'Kotwa', type: 'district', lat: -16.9833, lon: 32.6667 },
    ],
  },
  'Manicaland': {
    name: 'Manicaland',
    color: '#059669', // Emerald
    capital: 'Mutare',
    towns: [
      { name: 'Mutare', type: 'capital', lat: -18.9728, lon: 32.6694 },
      { name: 'Rusape', type: 'town', lat: -18.5333, lon: 32.1333 },
      { name: 'Chipinge', type: 'town', lat: -20.1944, lon: 32.6228 },
      { name: 'Nyanga', type: 'town', lat: -18.2167, lon: 32.7500 },
      { name: 'Chimanimani', type: 'town', lat: -19.8000, lon: 32.8667 },
      { name: 'Penhalonga', type: 'town', lat: -18.8833, lon: 32.7000 },
      { name: 'Birchenough Bridge', type: 'town', lat: -19.9667, lon: 32.3333 },
    ],
  },
  'Masvingo': {
    name: 'Masvingo',
    color: '#e11d48', // Rose / Red
    capital: 'Masvingo',
    towns: [
      { name: 'Masvingo', type: 'capital', lat: -20.0833, lon: 30.8333 },
      { name: 'Chiredzi', type: 'town', lat: -21.0500, lon: 31.6667 },
      { name: 'Gutu', type: 'district', lat: -19.6500, lon: 31.1667 },
      { name: 'Zaka', type: 'district', lat: -20.3500, lon: 31.4500 },
      { name: 'Mwenezi', type: 'district', lat: -21.4167, lon: 30.7167 },
      { name: 'Bikita', type: 'district', lat: -20.0833, lon: 31.6167 },
      { name: 'Mashava', type: 'town', lat: -20.0667, lon: 30.4833 },
      { name: 'Triangle', type: 'town', lat: -21.0333, lon: 31.4500 },
    ],
  },
};


const ZIMBABWE_BOUNDS: L.LatLngBoundsExpression = [[-22.5, 25], [-15.5, 33.3]];
const STREETS_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SATELLITE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

type LocatedVisitor = UniqueVisitorLocation & { latitude: number; longitude: number };
const hasCoordinates = (row: UniqueVisitorLocation): row is LocatedVisitor =>
  typeof row.latitude === 'number' && Number.isFinite(row.latitude) && Math.abs(row.latitude) <= 90 &&
  typeof row.longitude === 'number' && Number.isFinite(row.longitude) && Math.abs(row.longitude) <= 180;
const isActive = (row: UniqueVisitorLocation) => {
  const seen = row.lastSeenAt || row.openedAt;
  return !!seen && seen.getTime() >= Date.now() - 10 * 60_000;
};

const MapViewport: React.FC<{
  province: string | null;
  visitors: LocatedVisitor[];
  selectedUser: UniqueVisitorLocation | null;
  reset: number;
}> = ({ province, visitors, selectedUser, reset }) => {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => {
    if (selectedUser && hasCoordinates(selectedUser)) {
      map.setView([selectedUser.latitude, selectedUser.longitude], 15);
      return;
    }
    if (!province) {
      map.fitBounds(ZIMBABWE_BOUNDS, { padding: [24, 24] });
      return;
    }
    const towns = ZIMBABWE_PROVINCES[province]?.towns || [];
    const points: L.LatLngTuple[] = [
      ...towns.map((town): L.LatLngTuple => [town.lat, town.lon]),
      ...visitors.filter((visitor) => visitor.province === province)
        .map((visitor): L.LatLngTuple => [visitor.latitude, visitor.longitude]),
    ];
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [35, 35], maxZoom: 11 });
  }, [map, province, visitors, selectedUser, reset]);
  return null;
};

export const VisitorMap: React.FC = () => {
  const [locations, setLocations] = useState<UniqueVisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('streets');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UniqueVisitorLocation | null>(null);
  const [reset, setReset] = useState(0);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLocations([]);
        setError('Sign in with an administrator account to view visitor locations.');
        return;
      }
      const token = await getIdTokenResult(currentUser);
      if (token.claims.admin !== true) {
        setLocations([]);
        setError('This account does not have the Firebase administrator claim required for precise visitor locations.');
        return;
      }
      setLocations(await fetchUniqueVisitorLocations());
    } catch (loadError) {
      console.error('visitor map load failed', loadError);
      setError('Could not load visitor locations.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const located = useMemo(() => locations.filter(hasCoordinates), [locations]);
  const visible = useMemo(() => selectedProvince
    ? locations.filter((row) => row.province === selectedProvince) : locations, [locations, selectedProvince]);
  const provinceStats = useMemo(() => Object.entries(ZIMBABWE_PROVINCES)
    .map(([name, data]) => ({ name, data, count: locations.filter(row => row.province === name).length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)), [locations]);
  const activeCount = useMemo(() => locations.filter(isActive).length, [locations, now]);
  // Keep exact recorded positions. Visitors sharing a coordinate are listed in one popup.
  const pinGroups = useMemo(() => {
    const groups = new Map<string, LocatedVisitor[]>();
    for (const row of located) {
      if (selectedProvince && row.province !== selectedProvince) continue;
      const key = `${row.latitude},${row.longitude}`;
      const group = groups.get(key) || [];
      group.push(row);
      groups.set(key, group);
    }
    return [...groups.entries()];
  }, [located, selectedProvince]);
  const chooseProvince = (name: string | null) => {
    setSelectedProvince(name);
    setSelectedUser(null);
  };
  const resetMap = () => {
    chooseProvince(null);
    setReset(value => value + 1);
  };
  const provinceData = selectedProvince ? ZIMBABWE_PROVINCES[selectedProvince] : null;

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-[540px] flex-col bg-slate-950 text-left text-white">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap gap-4 text-xs">
          {[
            { label: 'Visitors', value: locations.length, Icon: Users },
            { label: 'Active recently', value: activeCount, Icon: Radio },
            { label: 'Mapped', value: located.length, Icon: LocateFixed },
            { label: 'Visits', value: locations.reduce((total, row) => total + row.visitCount, 0), Icon: MapPinned },
          ].map(({ label, value, Icon }) => <div key={label} className="flex items-center gap-2"><Icon size={16} className="text-emerald-400" /><span><strong className="block text-base">{loading ? '—' : value}</strong><span className="text-slate-400">{label}</span></span></div>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/10 p-1">
            {(['streets', 'satellite'] as const).map(mode => <button key={mode} type="button" aria-pressed={basemap === mode} onClick={() => setBasemap(mode)} className={`rounded-md px-3 py-2 text-xs font-bold ${basemap === mode ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}>{mode === 'streets' ? 'Street map' : 'Satellite'}</button>)}
          </div>
          <button type="button" onClick={resetMap} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">Reset map</button>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10 disabled:opacity-50"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh</button>
        </div>
      </div>
      {error && <p role="alert" className="shrink-0 border-b border-red-500/30 bg-red-500/15 px-4 py-2 text-xs text-red-300">{error}</p>}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div role="region" aria-label="Visitor locations map" className="relative z-0 min-h-[280px] flex-1">
          <MapContainer bounds={ZIMBABWE_BOUNDS} scrollWheelZoom className="absolute inset-0 h-full w-full" style={{ background: '#e2e8f0' }}>
            {basemap === 'streets' ? <TileLayer url={STREETS_URL} maxZoom={19} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' /> : <>
              <TileLayer url={SATELLITE_URL} maxZoom={19} attribution="Imagery &copy; Esri" />
              <TileLayer url={LABELS_URL} maxZoom={19} attribution="Labels &copy; Esri" />
            </>}
            <MapViewport province={selectedProvince} visitors={located} selectedUser={selectedUser} reset={reset} />
            {pinGroups.map(([key, rows]) => {
              const row = rows[0];
              const active = rows.some(isActive);
              return <CircleMarker key={key} center={[row.latitude, row.longitude]} radius={rows.length > 1 ? 11 : 8} pathOptions={{ color: '#fff', weight: 2, fillColor: active ? '#10b981' : '#3b82f6', fillOpacity: 0.95 }}>
                <Tooltip>{locationName(row)}{rows.length > 1 ? ` · ${rows.length} visitors` : ''}</Tooltip>
                <Popup><div className="max-h-64 min-w-[180px] overflow-y-auto text-slate-900">
                  {rows.map(visitor => <div key={visitor.visitorId} className="border-b border-slate-200 py-2 last:border-0">
                    <strong>{locationName(visitor)}</strong><p>{shortId(visitor.visitorId)} · {visitor.visitCount} visits</p>
                    <button type="button" onClick={() => setSelectedUser(visitor)} className="font-semibold text-blue-700 underline">View visitor details</button>
                  </div>)}
                </div></Popup>
              </CircleMarker>;
            })}
            {provinceData?.towns.map(town => <CircleMarker key={town.name} center={[town.lat, town.lon]} radius={4} pathOptions={{ color: '#b45309', fillColor: '#fbbf24', fillOpacity: 1, weight: 1 }}><Tooltip>{town.name}{town.type === 'capital' ? ' · provincial capital' : ''}</Tooltip></CircleMarker>)}
          </MapContainer>
          <div className="pointer-events-none absolute bottom-7 left-3 z-[500] rounded-lg bg-slate-950/90 px-3 py-2 text-[11px] text-white shadow-lg">Green: active in the last 10 minutes · Blue: recorded visitor</div>
        </div>
        <aside className="flex max-h-[42%] shrink-0 flex-col overflow-y-auto border-t border-white/10 bg-slate-950 md:max-h-none md:w-80 md:border-l md:border-t-0">
          {selectedUser && <section className="border-b border-white/10 p-4">
            <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold">{locationName(selectedUser)}</h3><button type="button" onClick={() => setSelectedUser(null)} aria-label="Close visitor details" className="rounded p-1 hover:bg-white/10"><X size={16} /></button></div>
            <p className="mt-2 text-xs text-slate-400">{selectedUser.formattedAddress || [selectedUser.district, selectedUser.province].filter(Boolean).join(', ')}</p>
            <dl className="mt-3 space-y-2 text-xs">
              <div><dt className="text-slate-400">Visitor ID</dt><dd className="break-all font-mono">{selectedUser.visitorId || 'Unknown'}</dd></div>
              <div><dt className="text-slate-400">Visits</dt><dd>{selectedUser.visitCount}</dd></div>
              <div><dt className="text-slate-400">Last seen</dt><dd>{selectedUser.lastSeenAt || selectedUser.openedAt ? dateTime.format((selectedUser.lastSeenAt || selectedUser.openedAt)!) : 'Unknown'}</dd></div>
              <div><dt className="text-slate-400">Coordinates</dt><dd>{hasCoordinates(selectedUser) ? `${selectedUser.latitude.toFixed(6)}, ${selectedUser.longitude.toFixed(6)}` : 'No recorded coordinates'}</dd></div>
              {selectedUser.accuracy !== null && <div><dt className="text-slate-400">Location accuracy</dt><dd>{Math.round(selectedUser.accuracy)} m</dd></div>}
            </dl>
          </section>}
          <section className="border-b border-white/10 p-4">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">{selectedProvince || 'Provinces'}</h2>{selectedProvince && <button type="button" onClick={() => chooseProvince(null)} className="inline-flex items-center gap-1 text-xs text-emerald-400"><ArrowLeft size={13} />All provinces</button>}</div>
            {provinceData ? <><p className="mb-3 text-xs text-slate-400">Capital: {provinceData.capital} · {visible.length} visitors</p><div className="flex flex-wrap gap-1.5">{provinceData.towns.map(town => <span key={town.name} className="rounded bg-white/5 px-2 py-1 text-[11px] text-slate-300">{town.name}</span>)}</div></> : provinceStats.map(({ name, data, count }) => <button key={name} type="button" onClick={() => chooseProvince(name)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-xs hover:bg-white/5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: data.color }} /><span className="flex-1 font-semibold">{name}</span><span className="text-slate-400">{count}</span></button>)}
          </section>
          <section className="p-4">
            <h2 className="mb-2 text-sm font-bold">Visitors ({visible.length})</h2>
            <p className="mb-3 text-[11px] text-slate-400">{visible.filter(row => !hasCoordinates(row)).length} visitors without coordinates are listed here.</p>
            {!loading && !visible.length && <p className="text-xs text-slate-400">No visitor locations recorded{selectedProvince ? ` in ${selectedProvince}` : ''}.</p>}
            {visible.map(row => <button type="button" key={row.visitorId} onClick={() => setSelectedUser(row)} className={`mb-1 w-full rounded-lg border p-3 text-left ${selectedUser?.visitorId === row.visitorId ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-transparent hover:bg-white/5'}`}><span className="flex items-center gap-2 text-xs font-semibold"><span className={`h-2 w-2 shrink-0 rounded-full ${isActive(row) ? 'bg-emerald-400' : 'bg-blue-400'}`} />{locationName(row)}</span><span className="mt-1 block text-[11px] text-slate-400">{shortId(row.visitorId)} · {row.visitCount} visits{!hasCoordinates(row) ? ' · No coordinates' : ''}</span></button>)}
          </section>
        </aside>
      </div>
    </div>
  );
};
