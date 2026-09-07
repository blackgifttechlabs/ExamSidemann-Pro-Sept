import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock3,
  LocateFixed,
  MapPinned,
  RefreshCw,
  Users,
  User,
  Compass,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Maximize2,
  ArrowLeft,
  Activity,
  Radio,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Star,
  Building2,
  Navigation,
  Move,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  fetchUniqueVisitorLocations,
  type UniqueVisitorLocation,
} from '../../services/analyticsQueries';
import { auth } from '../../services/firebase';
import { getIdTokenResult } from 'firebase/auth';

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Harare',
});

const shortId = (value: string) => (value ? `${value.slice(0, 8)}…${value.slice(-4)}` : 'Unknown');

const locationName = (row: UniqueVisitorLocation) =>
  row.placeName || row.locality || row.district || row.province || row.formattedAddress || 'Shared location';

// 10 Official Provinces of Zimbabwe with distinct, vibrant colors
export interface ProvinceTown {
  name: string;
  type: 'capital' | 'major_city' | 'town' | 'border_post' | 'district';
  lat: number;
  lon: number;
}

export interface ProvinceBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// 10 Official Provinces of Zimbabwe with distinct, vibrant colors, bounding boxes, and key districts/towns
export interface ProvinceData {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  borderColor: string;
  center: [number, number]; // [SVG X, SVG Y]
  capital: string;
  path: string;
  bounds: ProvinceBounds;
  towns: ProvinceTown[];
}

export const ZIMBABWE_PROVINCES: Record<string, ProvinceData> = {
  'Matabeleland North': {
    id: 'mat-north',
    name: 'Matabeleland North',
    color: '#4338ca', // Indigo
    hoverColor: '#6366f1',
    borderColor: '#312e81',
    center: [235, 295],
    capital: 'Lupane',
    path: 'M 57.0,235.5 L 105.4,229.7 L 166.9,213.1 L 228.5,188.3 L 285.7,163.4 L 320.8,146.9 L 351.6,209.0 L 373.6,258.7 L 386.8,291.9 L 373.6,358.1 L 356.0,395.4 L 334.0,406.2 L 325.2,416.1 L 281.3,407.9 L 228.5,383.0 L 175.7,333.3 L 114.2,283.6 L 57.0,235.5 Z',
    bounds: { minX: 57, minY: 147, maxX: 387, maxY: 416 },
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
    id: 'bulawayo',
    name: 'Bulawayo',
    color: '#0891b2', // Cyan
    hoverColor: '#06b6d4',
    borderColor: '#164e63',
    center: [350, 420],
    capital: 'Bulawayo',
    path: 'M 338.4,412.0 L 362.2,412.0 L 362.2,428.6 L 338.4,428.6 L 338.4,412.0 Z',
    bounds: { minX: 330, minY: 405, maxX: 370, maxY: 435 },
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
    id: 'mat-south',
    name: 'Matabeleland South',
    color: '#a21caf', // Fuchsia / Magenta
    hoverColor: '#d946ef',
    borderColor: '#701a75',
    center: [390, 490],
    capital: 'Gwanda',
    path: 'M 281.3,407.9 L 325.2,416.1 L 364.8,416.1 L 382.4,407.9 L 413.2,424.4 L 439.6,445.1 L 466.0,474.1 L 479.2,503.1 L 488.0,523.9 L 492.3,591.8 L 474.8,591.8 L 420.2,590.1 L 369.2,565.3 L 325.2,540.4 L 276.9,449.3 L 281.3,407.9 Z',
    bounds: { minX: 275, minY: 407, maxX: 495, maxY: 595 },
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
    id: 'midlands',
    name: 'Midlands',
    color: '#4d7c0f', // Lime / Olive
    hoverColor: '#65a30d',
    borderColor: '#365314',
    center: [450, 330],
    capital: 'Gweru',
    path: 'M 351.6,209.0 L 373.6,258.7 L 386.8,291.9 L 373.6,358.1 L 356.0,395.4 L 382.4,407.9 L 413.2,424.4 L 439.6,445.1 L 466.0,474.1 L 492.3,432.7 L 518.7,391.3 L 549.5,349.9 L 571.5,316.7 L 536.3,283.6 L 492.3,271.1 L 466.0,267.0 L 430.8,242.1 L 386.8,217.3 L 351.6,209.0 Z',
    bounds: { minX: 350, minY: 209, maxX: 572, maxY: 474 },
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
    id: 'mash-west',
    name: 'Mashonaland West',
    color: '#0f766e', // Teal
    hoverColor: '#14b8a6',
    borderColor: '#134e4a',
    center: [445, 165],
    capital: 'Chinhoyi',
    path: 'M 320.8,146.9 L 367.5,119.5 L 373.6,78.9 L 422.0,64.0 L 474.8,51.6 L 511.7,44.1 L 518.7,93.0 L 527.5,159.3 L 545.1,209.0 L 545.1,267.0 L 492.3,271.1 L 466.0,267.0 L 430.8,242.1 L 386.8,217.3 L 351.6,209.0 L 320.8,146.9 Z',
    bounds: { minX: 320, minY: 44, maxX: 546, maxY: 272 },
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
    id: 'mash-central',
    name: 'Mashonaland Central',
    color: '#d97706', // Amber Gold
    hoverColor: '#f59e0b',
    borderColor: '#92400e',
    center: [580, 130],
    capital: 'Bindura',
    path: 'M 511.7,44.1 L 562.7,59.9 L 615.5,93.0 L 668.3,126.1 L 685.8,167.6 L 633.1,180.0 L 597.9,192.4 L 562.7,209.0 L 545.1,209.0 L 527.5,159.3 L 518.7,93.0 L 511.7,44.1 Z',
    bounds: { minX: 511, minY: 44, maxX: 686, maxY: 209 },
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
    id: 'harare',
    name: 'Harare',
    color: '#2563eb', // Royal Blue
    hoverColor: '#3b82f6',
    borderColor: '#1e40af',
    center: [565, 228],
    capital: 'Harare',
    path: 'M 549.5,217.3 L 582.1,217.3 L 582.1,240.5 L 549.5,240.5 L 549.5,217.3 Z',
    bounds: { minX: 542, minY: 212, maxX: 588, maxY: 246 },
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
    id: 'mash-east',
    name: 'Mashonaland East',
    color: '#7c3aed', // Violet
    hoverColor: '#8b5cf6',
    borderColor: '#5b21b6',
    center: [610, 245],
    capital: 'Marondera',
    path: 'M 562.7,209.0 L 597.9,192.4 L 633.1,180.0 L 685.8,167.6 L 725.4,155.1 L 725.4,225.6 L 685.8,225.6 L 650.7,275.3 L 633.1,325.0 L 589.1,358.1 L 549.5,349.9 L 571.5,316.7 L 536.3,283.6 L 545.1,267.0 L 545.1,209.0 L 562.7,209.0 Z',
    bounds: { minX: 536, minY: 155, maxX: 726, maxY: 359 },
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
    id: 'manicaland',
    name: 'Manicaland',
    color: '#059669', // Emerald
    hoverColor: '#10b981',
    borderColor: '#065f46',
    center: [685, 340],
    capital: 'Mutare',
    path: 'M 725.4,225.6 L 734.2,262.9 L 714.0,323.3 L 738.6,391.3 L 707.8,457.6 L 677.0,515.6 L 637.5,474.1 L 633.1,391.3 L 633.1,325.0 L 650.7,275.3 L 685.8,225.6 L 725.4,225.6 Z',
    bounds: { minX: 630, minY: 225, maxX: 740, maxY: 516 },
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
    id: 'masvingo',
    name: 'Masvingo',
    color: '#e11d48', // Rose / Red
    hoverColor: '#f43f5e',
    borderColor: '#9f1239',
    center: [550, 455],
    capital: 'Masvingo',
    path: 'M 492.3,432.7 L 518.7,391.3 L 549.5,349.9 L 589.1,358.1 L 633.1,325.0 L 633.1,391.3 L 637.5,474.1 L 677.0,515.6 L 593.5,608.4 L 492.3,591.8 L 488.0,523.9 L 479.2,503.1 L 466.0,474.1 L 492.3,432.7 Z',
    bounds: { minX: 466, minY: 325, maxX: 677, maxY: 609 },
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

// Vibrant palette so users in each area have different spot colors
const SPOT_COLORS = [
  { hex: '#f43f5e', name: 'Coral Rose' },
  { hex: '#f97316', name: 'Bright Orange' },
  { hex: '#facc15', name: 'Electric Gold' },
  { hex: '#10b981', name: 'Neon Emerald' },
  { hex: '#06b6d4', name: 'Cyan Glow' },
  { hex: '#3b82f6', name: 'Vivid Blue' },
  { hex: '#8b5cf6', name: 'Purple Ray' },
  { hex: '#ec4899', name: 'Hot Pink' },
  { hex: '#14b8a6', name: 'Teal Flare' },
  { hex: '#84cc16', name: 'Lime Bright' },
  { hex: '#a855f7', name: 'Amethyst' },
  { hex: '#eab308', name: 'Golden Sun' },
];

const getVisitorSpotColor = (visitorId: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < visitorId.length; i++) {
    hash = (hash << 5) - hash + visitorId.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash + index * 7) % SPOT_COLORS.length;
  return SPOT_COLORS[idx];
};

// Map GPS coordinates into SVG viewBox (800 x 650)
const projectToMap = (lat: number | null, lon: number | null, provinceName?: string): { x: number; y: number } => {
  const minLon = 25.0;
  const maxLon = 33.3;
  const minLat = -22.5;
  const maxLat = -15.5;

  if (typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat) && Number.isFinite(lon)) {
    if (lon >= 24.5 && lon <= 34.0 && lat <= -15.0 && lat >= -23.0) {
      const x = 35 + ((lon - minLon) / (maxLon - minLon)) * 730;
      const y = 35 + ((maxLat - lat) / (maxLat - minLat)) * 580;
      return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(620, y)) };
    }
  }

  if (provinceName && ZIMBABWE_PROVINCES[provinceName]) {
    const [cx, cy] = ZIMBABWE_PROVINCES[provinceName].center;
    const pseudoRand = (provinceName.length * 13) % 20 - 10;
    return { x: cx + pseudoRand, y: cy + pseudoRand };
  }

  return { x: 565, y: 228 };
};

const StatChip: React.FC<{
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  tint: string;
}> = ({ label, value, Icon, tint }) => (
  <div className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-[9px] px-3 py-2.5 ${tint}`}>
    <Icon size={15} className="shrink-0 opacity-80" />
    <div className="min-w-0">
      <p className="truncate text-base font-black tabular-nums leading-none" title={String(value)}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wider opacity-70">
        {label}
      </p>
    </div>
  </div>
);

export const VisitorMap: React.FC = () => {
  const [locations, setLocations] = useState<UniqueVisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3D Ground tilted view vs 2D Top View
  const [viewMode, setViewMode] = useState<'3d' | 'top'>('3d');
  const [tiltAngle, setTiltAngle] = useState(52);
  const [rotateAngle, setRotateAngle] = useState(-14);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Main map viewport ref for mouse wheel scrolling
  const mainMapContainerRef = useRef<HTMLDivElement>(null);

  // Province focus & zoom
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // User pin hover & selection
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UniqueVisitorLocation | null>(null);

  // Province Panel Interactive Map State
  const provincePanelMapRef = useRef<HTMLDivElement>(null);
  const [panelZoom, setPanelZoom] = useState(1);
  const [panelPan, setPanelPan] = useState({ x: 0, y: 0 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [hoveredTown, setHoveredTown] = useState<string | null>(null);

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

  useEffect(() => {
    void load();
  }, [load]);

  // Reset province panel zoom & pan whenever province selection changes
  useEffect(() => {
    setPanelZoom(1);
    setPanelPan({ x: 0, y: 0 });
    setHoveredTown(null);
  }, [selectedProvince]);

  // Mouse wheel zoom listener for the MAIN MAP canvas (allows zooming in more: 0.5x to 5.0x)
  useEffect(() => {
    const container = mainMapContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.002;
      setZoomLevel((prev) => {
        const next = Math.min(5.0, Math.max(0.5, prev + zoomDelta));
        return Number(next.toFixed(2));
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Mouse wheel zoom listener for the PROVINCE PANEL MAP
  useEffect(() => {
    const container = provincePanelMapRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.0022;
      setPanelZoom((prev) => {
        const next = Math.min(4.5, Math.max(0.7, prev + zoomDelta));
        return Number(next.toFixed(2));
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [selectedProvince]);

  // Panel Drag to Pan Handlers
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    dragStartRef.current = { x: e.clientX - panelPan.x, y: e.clientY - panelPan.y };
  };

  const handlePanelMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPanel) return;
    setPanelPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePanelMouseUp = () => {
    setIsDraggingPanel(false);
  };

  // Check if a user is currently opening the app / active now (within last 10 minutes)
  const isUserActive = useCallback((user: UniqueVisitorLocation, idx: number): boolean => {
    if (!user.openedAt) return idx === 0;
    const tenMinutesAgo = Date.now() - 10 * 60_000;
    return user.openedAt.getTime() >= tenMinutesAgo;
  }, []);

  const activeCount = useMemo(() => {
    return locations.filter((loc, idx) => isUserActive(loc, idx)).length;
  }, [locations, isUserActive]);

  const summary = useMemo(
    () => ({
      visitors: locations.length,
      visits: locations.reduce((total, row) => total + row.visitCount, 0),
      provinces: new Set(locations.map((row) => row.province).filter(Boolean)).size,
      activeNow: activeCount,
      latest: locations.reduce<Date | null>((current, row) => {
        if (!row.openedAt || (current && current >= row.openedAt)) return current;
        return row.openedAt;
      }, null),
    }),
    [locations, activeCount]
  );

  const provinceStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of locations) {
      const name = row.province.trim() || 'Unknown';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Object.keys(ZIMBABWE_PROVINCES).map((provName) => ({
      name: provName,
      count: counts.get(provName) ?? 0,
      data: ZIMBABWE_PROVINCES[provName],
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [locations]);

  // Transform matrix for 3D ground tilt vs 2D Top View
  const mapTransformStyle = useMemo(() => {
    if (viewMode === 'top') {
      return {
        transform: `rotateX(0deg) rotateZ(0deg) scale(${zoomLevel})`,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        boxShadow: '0 12px 35px -10px rgba(0, 0, 0, 0.25)',
      };
    }
    return {
      transform: `rotateX(${tiltAngle}deg) rotateZ(${rotateAngle}deg) translateY(-20px) scale(${zoomLevel * 0.95})`,
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
      boxShadow: '0 50px 85px -20px rgba(0, 0, 0, 0.6), 0 30px 45px -15px rgba(0, 0, 0, 0.45)',
    };
  }, [viewMode, tiltAngle, rotateAngle, zoomLevel]);

  // Province Zoom Transform: Smooth zoom-in animation when a province is selected
  const provinceZoomStyle = useMemo(() => {
    if (!selectedProvince || !ZIMBABWE_PROVINCES[selectedProvince]) {
      return {
        transform: 'scale(1) translate(0px, 0px)',
        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
      };
    }
    const target = ZIMBABWE_PROVINCES[selectedProvince];
    const scale = 2.7;
    const tx = (400 - target.center[0]);
    const ty = (325 - target.center[1]);

    return {
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      transformOrigin: `${target.center[0]}px ${target.center[1]}px`,
      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  }, [selectedProvince]);

  // Disperse users inside province when zoomed in so all different users are visible
  const provinceUsersMap = useMemo(() => {
    const grouped = new Map<string, UniqueVisitorLocation[]>();
    for (const loc of locations) {
      const p = loc.province || 'Unknown';
      if (!grouped.has(p)) grouped.set(p, []);
      grouped.get(p)!.push(loc);
    }
    return grouped;
  }, [locations]);

  // Selected province data & user list
  const activeProvinceData = selectedProvince ? ZIMBABWE_PROVINCES[selectedProvince] : null;
  const activeProvinceUsers = useMemo(() => {
    if (!selectedProvince) return [];
    return locations.filter((l) => l.province === selectedProvince);
  }, [locations, selectedProvince]);

  // Province Panel SVG ViewBox Calculations
  const panelViewBox = useMemo(() => {
    if (!activeProvinceData) return { x: 0, y: 0, width: 800, height: 650, baseScale: 1 };
    const { bounds } = activeProvinceData;
    const padX = Math.max(12, (bounds.maxX - bounds.minX) * 0.14);
    const padY = Math.max(12, (bounds.maxY - bounds.minY) * 0.14);
    const vbX = bounds.minX - padX;
    const vbY = bounds.minY - padY;
    const vbW = (bounds.maxX - bounds.minX) + padX * 2;
    const vbH = (bounds.maxY - bounds.minY) + padY * 2;
    const baseScale = vbW / 260;
    return { x: vbX, y: vbY, width: vbW, height: vbH, baseScale };
  }, [activeProvinceData]);

  // Sort locations so the hovered user pin is always rendered last (on top)
  const renderedLocations = useMemo(() => {
    if (!hoveredUserId) return locations;
    return [...locations].sort((a, b) => {
      if (a.visitorId === hoveredUserId) return 1;
      if (b.visitorId === hoveredUserId) return -1;
      return 0;
    });
  }, [locations, hoveredUserId]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col text-left bg-slate-900 text-white select-none">
      {/* Top Stat Bar & View Mode Switcher */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-3 py-2.5 backdrop-blur-md md:px-5 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <StatChip
            label="Total Visitors"
            value={loading ? '—' : summary.visitors}
            Icon={Users}
            tint="bg-blue-500/10 text-blue-400 border border-blue-500/20"
          />
          <StatChip
            label="Opening App / Live"
            value={loading ? '—' : summary.activeNow}
            Icon={Radio}
            tint="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          />
          <StatChip
            label="Visits"
            value={loading ? '—' : summary.visits}
            Icon={LocateFixed}
            tint="bg-orange-500/10 text-orange-400 border border-orange-500/20"
          />
          <StatChip
            label="Active Provinces"
            value={loading ? '—' : `${summary.provinces} / 10`}
            Icon={MapPinned}
            tint="bg-purple-500/10 text-purple-400 border border-purple-500/20"
          />
        </div>

        {/* View Controls: 3D Ground Tilted vs Top View */}
        <div className="flex items-center gap-2">
          {selectedProvince && (
            <button
              type="button"
              onClick={() => setSelectedProvince(null)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-black transition hover:bg-amber-500/30 shadow-md"
            >
              <ArrowLeft size={13} />
              Reset Zoom ({selectedProvince})
            </button>
          )}

          <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setViewMode('3d');
                setTiltAngle(52);
                setRotateAngle(-14);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass size={14} className={viewMode === '3d' ? 'animate-pulse' : ''} />
              3D Ground Tilt
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('top');
                setTiltAngle(0);
                setRotateAngle(0);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                viewMode === 'top'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              Top View (2D)
            </button>
          </div>

          {/* Mouse Scroll & Button Zoom Controls (Zooms from 50% up to 500%) */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-white/10" title="Use mouse scroll wheel to zoom map freely">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
              title="Zoom out (-)"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[10px] font-bold px-1.5 text-slate-300 tabular-nums min-w-[38px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(5.0, Number((z + 0.25).toFixed(2))))}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
              title="Zoom in (+)"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setSelectedProvince(null);
                if (viewMode === '3d') {
                  setTiltAngle(52);
                  setRotateAngle(-14);
                }
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="shrink-0 bg-red-500/15 border-b border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* Main Map Stage */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Map Viewport Area (Listens to Mouse Scroll Wheel) */}
        <div
          ref={mainMapContainerRef}
          className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#070b14] p-4 cursor-crosshair"
          style={{
            perspective: '1300px',
            perspectiveOrigin: '50% 55%',
          }}
        >
          {/* Subtle 3D Floor Grid Plane */}
          {viewMode === '3d' && (
            <div
              className="absolute inset-x-0 bottom-[-20%] h-[120%] pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'rotateX(75deg) translateY(120px) scale(1.6)',
                transformOrigin: 'bottom center',
              }}
            />
          )}

          {/* Zoom In/Out Banner Indicator */}
          {selectedProvince && (
            <div className="absolute top-4 left-4 z-40 flex items-center gap-2.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 p-2.5 pr-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-300">
              <button
                type="button"
                onClick={() => setSelectedProvince(null)}
                className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-md"
                title="Zoom back to Zimbabwe"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ZIMBABWE_PROVINCES[selectedProvince]?.color }}
                  />
                  {selectedProvince} Province
                </p>
                <p className="text-[10px] text-emerald-400 font-bold">
                  Viewing {provinceUsersMap.get(selectedProvince)?.length ?? 0} localized users · Click anywhere or Back button to zoom out
                </p>
              </div>
            </div>
          )}

          {/* Mouse Scroll Hint Badge */}
          <div className="absolute top-4 right-4 z-30 pointer-events-none flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-2.5 py-1 backdrop-blur-md border border-white/10 text-[10px] text-slate-400">
            <Move size={11} className="text-emerald-400" />
            <span>Mouse scroll to zoom in/out</span>
          </div>

          {/* 3D Map Container Card */}
          <div
            className="relative w-full max-w-[850px] aspect-[800/650] max-h-[85vh] rounded-3xl"
            style={mapTransformStyle}
          >
            {/* 3D Extruded Relief Slab Depth (Visible in 3D Ground Tilt) */}
            {viewMode === '3d' && (
              <div
                className="absolute inset-0 rounded-3xl bg-slate-950/90 border-2 border-slate-700/60 pointer-events-none"
                style={{
                  transform: 'translateZ(-22px) translateY(16px)',
                  boxShadow: '0 30px 50px rgba(0,0,0,0.8), inset 0 2px 6px rgba(255,255,255,0.1)',
                }}
              />
            )}

            {/* Main Zimbabwe Provincial Map SVG */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-900/90 border-2 border-slate-700/80 backdrop-blur-md shadow-2xl">
              <svg
                viewBox="0 0 800 650"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              >
                <defs>
                  {/* Glowing filters for user spots */}
                  <filter id="spot-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Ground drop shadow for provinces */}
                  <filter id="province-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Animated Zoom Group — Zooms smoothly into province when clicked */}
                <g style={provinceZoomStyle}>
                  {/* Ambient Grid Lines inside map */}
                  <g opacity="0.07" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3">
                    <line x1="100" y1="0" x2="100" y2="650" />
                    <line x1="250" y1="0" x2="250" y2="650" />
                    <line x1="400" y1="0" x2="400" y2="650" />
                    <line x1="550" y1="0" x2="550" y2="650" />
                    <line x1="700" y1="0" x2="700" y2="650" />
                    <line x1="0" y1="130" x2="800" y2="130" />
                    <line x1="0" y1="260" x2="800" y2="260" />
                    <line x1="0" y1="390" x2="800" y2="390" />
                    <line x1="0" y1="520" x2="800" y2="520" />
                  </g>

                  {/* 10 Distinctly Colored Provinces */}
                  <g filter="url(#province-shadow)">
                    {Object.entries(ZIMBABWE_PROVINCES).map(([pName, pData]) => {
                      const isHovered = hoveredProvince === pName;
                      const isSelected = selectedProvince === pName;
                      const count = locations.filter((loc) => loc.province === pName).length;

                      return (
                        <g
                          key={pData.id}
                          className="cursor-pointer transition-all duration-300 group"
                          onMouseEnter={() => setHoveredProvince(pName)}
                          onMouseLeave={() => setHoveredProvince(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvince((prev) => (prev === pName ? null : pName));
                          }}
                        >
                          <path
                            d={pData.path}
                            fill={isHovered || isSelected ? pData.hoverColor : pData.color}
                            fillOpacity={
                              isSelected
                                ? 0.98
                                : isHovered
                                ? 0.95
                                : selectedProvince
                                ? 0.25
                                : 0.82
                            }
                            stroke={isSelected ? '#facc15' : isHovered ? '#ffffff' : pData.borderColor}
                            strokeWidth={isSelected ? 3.5 : isHovered ? 2.8 : 1.6}
                            strokeLinejoin="round"
                            className="transition-all duration-300"
                            style={{
                              filter: isHovered
                                ? `drop-shadow(0 0 12px ${pData.hoverColor})`
                                : undefined,
                            }}
                          />

                          {/* Province Center Label */}
                          <g
                            transform={`translate(${pData.center[0]}, ${pData.center[1]})`}
                            className="pointer-events-none"
                            opacity={selectedProvince && !isSelected ? 0.2 : 1}
                          >
                            <text
                              textAnchor="middle"
                              y="-4"
                              className="font-black tracking-wider uppercase select-none drop-shadow-md"
                              fontSize={
                                selectedProvince === pName
                                  ? '8'
                                  : pName === 'Harare' || pName === 'Bulawayo'
                                  ? '11'
                                  : '12'
                              }
                              fill="#ffffff"
                            >
                              {pName}
                            </text>
                            <text
                              textAnchor="middle"
                              y={selectedProvince === pName ? '6' : '11'}
                              className="font-bold select-none opacity-85"
                              fontSize={selectedProvince === pName ? '6' : '9'}
                              fill="#e2e8f0"
                            >
                              {count} {count === 1 ? 'user' : 'users'}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>

                  {/* User Pins with User Icon, individual spot colors, hover reaction, and blinking for active users */}
                  <g className="pointer-events-auto">
                    {renderedLocations.map((row, idx) => {
                      const pName = row.province || 'Unknown';
                      const isZoomed = selectedProvince !== null;
                      const isThisProvince = selectedProvince === pName;

                      // If a province is selected and user is in another province, dim them
                      const opacity = !isZoomed ? 1 : isThisProvince ? 1 : 0.12;

                      // Disperse users in the province so all different users are visible
                      const pUsers = provinceUsersMap.get(pName) || [row];
                      const userIndexInProvince = pUsers.findIndex((u) => u.visitorId === row.visitorId);
                      const basePos = projectToMap(row.latitude, row.longitude, row.province);

                      // Radial dispersion when zoomed into this province
                      const angle = userIndexInProvince >= 0
                        ? (userIndexInProvince * (2 * Math.PI / Math.max(1, pUsers.length)))
                        : 0;
                      const disperseRadius = isZoomed && isThisProvince && pUsers.length > 1
                        ? 16 + (userIndexInProvince % 3) * 12
                        : 0;

                      const posX = basePos.x + Math.cos(angle) * disperseRadius;
                      const posY = basePos.y + Math.sin(angle) * disperseRadius;

                      const spotColor = getVisitorSpotColor(row.visitorId, idx);
                      const active = isUserActive(row, idx);
                      const isHovered = hoveredUserId === row.visitorId;
                      const isSelected = selectedUser?.visitorId === row.visitorId;

                      return (
                        <g
                          key={row.visitorId || idx}
                          transform={`translate(${posX}, ${posY})`}
                          opacity={opacity}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredUserId(row.visitorId)}
                          onMouseLeave={() => setHoveredUserId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser((curr) => (curr?.visitorId === row.visitorId ? null : row));
                          }}
                        >
                          {/* Invisible stationary hit target to completely prevent hover jitter/flicker */}
                          <circle cx="0" cy="-8" r="16" fill="transparent" pointerEvents="all" />

                          {/* Visual Pin Body — scales smoothly on hover without displacing hit area */}
                          <g
                            className="transition-transform duration-200"
                            style={{
                              transform: isHovered ? 'scale(1.4)' : isSelected ? 'scale(1.2)' : 'scale(1)',
                              transformOrigin: '0px -8px',
                              filter: isHovered
                                ? `drop-shadow(0 0 10px ${spotColor.hex})`
                                : undefined,
                            }}
                          >
                            {/* Ground anchor shadow */}
                            <ellipse cx="0" cy="1" rx="4.5" ry="2" fill="rgba(0,0,0,0.5)" />

                            {/* 3D Pin stem */}
                            <path
                              d="M 0,0 L 0,-6"
                              stroke={spotColor.hex}
                              strokeWidth="2"
                              strokeLinecap="round"
                            />

                            {/* Radar wave animation: ONLY for active users opening the app */}
                            {active && (
                              <circle
                                cx="0"
                                cy="-10"
                                r="13"
                                fill={spotColor.hex}
                                opacity="0.38"
                                className="animate-ping"
                              />
                            )}

                            {/* Pin Head Bubble with spot color */}
                            <circle
                              cx="0"
                              cy="-10"
                              r="8"
                              fill={spotColor.hex}
                              stroke="#ffffff"
                              strokeWidth="1.6"
                              filter="url(#spot-glow)"
                            />

                            {/* USER ICON (Crisp White Silhouette inside Pin) */}
                            {/* Head */}
                            <circle cx="0" cy="-12.2" r="2.2" fill="#ffffff" />
                            {/* Body */}
                            <path
                              d="M -3.6,-6 C -3.6,-8.3 3.6,-8.3 3.6,-6 Z"
                              fill="#ffffff"
                            />

                            {/* Live status beacon dot */}
                            {active && (
                              <circle
                                cx="5.5"
                                cy="-15"
                                r="2.2"
                                fill="#22c55e"
                                stroke="#0f172a"
                                strokeWidth="0.8"
                                className="animate-pulse"
                              />
                            )}

                            {/* Visit Count Pill if > 1 */}
                            {row.visitCount > 1 && (
                              <g transform="translate(6, -5)">
                                <circle r="3.8" fill="#0f172a" stroke={spotColor.hex} strokeWidth="0.8" />
                                <text
                                  textAnchor="middle"
                                  y="1.8"
                                  fontSize="4.8"
                                  fontWeight="black"
                                  fill="#ffffff"
                                >
                                  {row.visitCount > 99 ? '99+' : row.visitCount}
                                </text>
                              </g>
                            )}
                          </g>

                          {/* Hover Reaction Tooltip rendered directly in SVG coordinate space */}
                          {isHovered && (
                            <g transform="translate(0, -28)" className="pointer-events-none select-none">
                              {/* Tooltip Background Card */}
                              <rect
                                x="-68"
                                y="-36"
                                width="136"
                                height="36"
                                rx="7"
                                fill="#020617"
                                fillOpacity="0.96"
                                stroke={spotColor.hex}
                                strokeWidth="1.2"
                                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.7))"
                              />
                              {/* Arrow Pointer */}
                              <polygon points="0,0 -4,-4 4,-4" fill="#020617" />

                              {/* Mini User Icon inside Tooltip */}
                              <circle cx="-54" cy="-18" r="4.5" fill={spotColor.hex} />
                              <circle cx="-54" cy="-19.5" r="1.3" fill="#ffffff" />
                              <path d="M -56,-16 C -56,-17.5 -52,-17.5 -52,-16 Z" fill="#ffffff" />

                              <text x="-44" y="-23" fontSize="7.5" fontWeight="bold" fill="#ffffff">
                                {locationName(row).length > 15
                                  ? `${locationName(row).slice(0, 15)}…`
                                  : locationName(row)}
                              </text>
                              <text x="-44" y="-14" fontSize="6" fill="#94a3b8">
                                {shortId(row.visitorId)} · {row.visitCount} visits
                              </text>

                              {active ? (
                                <g transform="translate(-44, -5)">
                                  <circle cx="2" cy="-2" r="1.8" fill="#22c55e" />
                                  <text x="6" y="0" fontSize="5.5" fontWeight="bold" fill="#4ade80">
                                    Opening app · Active now
                                  </text>
                                </g>
                              ) : (
                                <text x="-44" y="-5" fontSize="5.5" fill="#c084fc">
                                  {row.province || 'Zimbabwe'}
                                </text>
                              )}
                            </g>
                          )}

                          {/* When zoomed into province: show town/user tag */}
                          {isZoomed && isThisProvince && !isHovered && (
                            <g transform="translate(8, -8)" className="pointer-events-none">
                              <rect
                                x="-1"
                                y="-5.5"
                                width={locationName(row).length * 3.8 + 6}
                                height="8"
                                rx="2"
                                fill="#020617"
                                fillOpacity="0.85"
                                stroke={spotColor.hex}
                                strokeWidth="0.5"
                              />
                              <text
                                x="2"
                                y="0"
                                fontSize="4"
                                fontWeight="bold"
                                fill="#ffffff"
                              >
                                {locationName(row)}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>
              </svg>

              {/* Selected User Modal / Detail Card */}
              {selectedUser && (
                <div className="absolute bottom-4 left-4 z-40 max-w-sm rounded-2xl border border-white/20 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl text-left animate-in fade-in slide-in-from-bottom-3 duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex items-center justify-center h-5 w-5 rounded-full shadow-md text-white"
                        style={{
                          backgroundColor: getVisitorSpotColor(selectedUser.visitorId, 0).hex,
                        }}
                      >
                        <User size={12} />
                      </span>
                      <p className="text-sm font-black text-white">{locationName(selectedUser)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedUser.formattedAddress ||
                      [selectedUser.district, selectedUser.province].filter(Boolean).join(', ')}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Visitor ID</span>
                      <p className="font-mono text-slate-200">{shortId(selectedUser.visitorId)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Visits</span>
                      <p className="font-bold text-emerald-400">{selectedUser.visitCount} visits</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Province</span>
                      <p className="font-semibold text-purple-300">{selectedUser.province || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                      <p className="font-medium text-slate-300 flex items-center gap-1">
                        {isUserActive(selectedUser, 0) ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Live Now
                          </span>
                        ) : selectedUser.openedAt ? (
                          dateTime.format(selectedUser.openedAt)
                        ) : (
                          'Recorded'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Map Watermark / Legend Badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-xl bg-slate-950/70 px-3 py-1.5 backdrop-blur-md border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-wide text-white">
                  Republic of Zimbabwe
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                  10 Provinces
                </span>
              </div>

              {/* Live Active Legend */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2.5 rounded-xl bg-slate-950/75 px-3 py-1.5 backdrop-blur-md border border-white/10 text-[10px]">
                <div className="flex items-center gap-1 font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Blinking = Opening App / Live</span>
                </div>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Click province to zoom in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Switches between All-Provinces Directory and Dedicated Province Map Inspector */}
        <aside
          className={`flex shrink-0 flex-col border-l border-white/10 bg-slate-950 text-left transition-all duration-300 ${
            selectedProvince ? 'w-80 sm:w-96 lg:w-[410px]' : 'w-64 sm:w-72 lg:w-80'
          }`}
        >
          {selectedProvince && activeProvinceData ? (
            /* ========================================================
               DEDICATED PROVINCE MAP INSPECTOR
               ======================================================== */
            <div className="flex h-full flex-col overflow-hidden animate-in fade-in slide-in-from-right-3 duration-200">
              {/* Province Header Bar */}
              <div className="border-b border-white/10 px-4 py-3 bg-slate-900/90 backdrop-blur shrink-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvince(null)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300 transition hover:bg-white/20 hover:text-white"
                  >
                    <ArrowLeft size={13} />
                    <span>All Provinces</span>
                  </button>

                  {/* Province Panel Zoom Controls */}
                  <div className="flex items-center gap-1 rounded-lg bg-slate-950/80 px-1.5 py-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPanelZoom((z) => Math.max(0.7, Number((z - 0.25).toFixed(2))))}
                      className="p-1 text-slate-400 hover:text-white transition"
                      title="Zoom out province map"
                    >
                      <ZoomOut size={12} />
                    </button>
                    <span className="text-[10px] font-mono px-1 text-emerald-400 font-bold tabular-nums">
                      {Math.round(panelZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setPanelZoom((z) => Math.min(4.5, Number((z + 0.25).toFixed(2))))}
                      className="p-1 text-slate-400 hover:text-white transition"
                      title="Zoom in province map"
                    >
                      <ZoomIn size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPanelZoom(1);
                        setPanelPan({ x: 0, y: 0 });
                      }}
                      className="p-1 text-slate-400 hover:text-white transition"
                      title="Reset view"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-md shadow-md border border-white/30"
                      style={{ backgroundColor: activeProvinceData.color }}
                    />
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        {activeProvinceData.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" /> Capital: {activeProvinceData.capital}
                      </span>
                    </div>
                  </div>

                  <span
                    className="rounded-lg px-2 py-0.5 text-xs font-black"
                    style={{
                      backgroundColor: `${activeProvinceData.color}25`,
                      color: activeProvinceData.hoverColor,
                      border: `1px solid ${activeProvinceData.color}60`,
                    }}
                  >
                    {activeProvinceUsers.length} {activeProvinceUsers.length === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>

              {/* Dedicated Province Map Viewport with District/Town Labels & Zoom */}
              <div
                ref={provincePanelMapRef}
                className="relative h-64 sm:h-72 shrink-0 bg-[#070b14] border-b border-white/10 overflow-hidden select-none cursor-grab active:cursor-grabbing"
                onMouseDown={handlePanelMouseDown}
                onMouseMove={handlePanelMouseMove}
                onMouseUp={handlePanelMouseUp}
                onMouseLeave={handlePanelMouseUp}
                title="Scroll mouse wheel to zoom · Click & drag to pan map"
              >
                {/* Compass Marker */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/80 border border-white/10 text-[9px] text-slate-400 backdrop-blur-sm pointer-events-none">
                  <Navigation size={10} className="text-emerald-400 transform -rotate-45" />
                  <span>N</span>
                </div>

                {/* Hint Bar */}
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/80 border border-white/10 text-[9px] text-slate-400 backdrop-blur-sm pointer-events-none">
                  <Move size={10} className="text-emerald-400" />
                  <span>Scroll to zoom · Drag to pan</span>
                </div>

                <svg
                  viewBox={`${panelViewBox.x} ${panelViewBox.y} ${panelViewBox.width} ${panelViewBox.height}`}
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.7))' }}
                >
                  <defs>
                    <filter id="panel-province-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={activeProvinceData.color} floodOpacity="0.7" />
                    </filter>
                  </defs>

                  {/* Interactive Pan and Zoom Canvas Group */}
                  <g
                    transform={`translate(${panelPan.x}, ${panelPan.y}) scale(${panelZoom})`}
                    style={{
                      transformOrigin: `${activeProvinceData.center[0]}px ${activeProvinceData.center[1]}px`,
                      transition: isDraggingPanel ? 'none' : 'transform 0.15s ease-out',
                    }}
                  >
                    {/* Neighboring Provinces in soft dark silhouette for geographic perspective */}
                    <g opacity="0.22">
                      {Object.entries(ZIMBABWE_PROVINCES).map(([otherName, otherData]) => {
                        if (otherName === selectedProvince) return null;
                        return (
                          <path
                            key={otherData.id}
                            d={otherData.path}
                            fill="#1e293b"
                            stroke="#475569"
                            strokeWidth={0.7 * panelViewBox.baseScale}
                          />
                        );
                      })}
                    </g>

                    {/* Selected Province Boundary Shape */}
                    <path
                      d={activeProvinceData.path}
                      fill={activeProvinceData.color}
                      fillOpacity="0.88"
                      stroke="#ffffff"
                      strokeWidth={1.8 * panelViewBox.baseScale}
                      strokeLinejoin="round"
                      filter="url(#panel-province-glow)"
                    />

                    {/* District & Town markers with high-contrast typographic labels */}
                    {activeProvinceData.towns.map((town) => {
                      const pos = projectToMap(town.lat, town.lon, selectedProvince);
                      const isCapital = town.type === 'capital';
                      const isMajor = town.type === 'major_city';
                      const isHovered = hoveredTown === town.name;
                      const s = panelViewBox.baseScale;

                      return (
                        <g
                          key={town.name}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTown(town.name)}
                          onMouseLeave={() => setHoveredTown(null)}
                        >
                          {/* Town Node / Pin */}
                          {isCapital ? (
                            <g>
                              <circle r={6 * s} fill="#facc15" stroke="#0f172a" strokeWidth={1.2 * s} />
                              <polygon
                                points="0,-3.5 1,-1 3.5,-1 1.5,0.7 2.2,3 0,1.5 -2.2,3 -1.5,0.7 -3.5,-1 -1,-1"
                                fill="#78350f"
                                transform={`scale(${0.8 * s})`}
                              />
                            </g>
                          ) : isMajor ? (
                            <circle
                              r={4.5 * s}
                              fill="#38bdf8"
                              stroke="#ffffff"
                              strokeWidth={1.2 * s}
                            />
                          ) : (
                            <circle
                              r={3.2 * s}
                              fill="#ffffff"
                              stroke="#0f172a"
                              strokeWidth={1 * s}
                            />
                          )}

                          {/* Town Label Pill */}
                          <g
                            transform={`translate(0, ${isCapital ? -10 * s : -7.5 * s})`}
                            className="pointer-events-none"
                          >
                            <rect
                              x={-(town.name.length * 3.2 * s + 6 * s) / 2}
                              y={-7 * s}
                              width={town.name.length * 3.2 * s + 6 * s}
                              height={8.5 * s}
                              rx={2.2 * s}
                              fill="#020617"
                              fillOpacity="0.9"
                              stroke={isHovered ? '#facc15' : isCapital ? '#facc15' : '#475569'}
                              strokeWidth={0.7 * s}
                            />
                            <text
                              textAnchor="middle"
                              y={-1.2 * s}
                              fontSize={4.2 * s}
                              fontWeight={isCapital ? '900' : '700'}
                              fill={isCapital ? '#fef08a' : '#ffffff'}
                            >
                              {isCapital ? `★ ${town.name}` : town.name}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Local Users Pins in this Province */}
                    {activeProvinceUsers.map((u, uIdx) => {
                      const basePos = projectToMap(u.latitude, u.longitude, u.province);
                      const s = panelViewBox.baseScale;
                      const angle = uIdx * (2 * Math.PI / Math.max(1, activeProvinceUsers.length));
                      const dispR = activeProvinceUsers.length > 1 ? (14 + (uIdx % 3) * 8) * s : 0;
                      const uX = basePos.x + Math.cos(angle) * dispR;
                      const uY = basePos.y + Math.sin(angle) * dispR;

                      const spotColor = getVisitorSpotColor(u.visitorId, uIdx);
                      const active = isUserActive(u, uIdx);
                      const isHovered = hoveredUserId === u.visitorId;
                      const isSelected = selectedUser?.visitorId === u.visitorId;

                      return (
                        <g
                          key={u.visitorId || uIdx}
                          transform={`translate(${uX}, ${uY})`}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredUserId(u.visitorId)}
                          onMouseLeave={() => setHoveredUserId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser((curr) => (curr?.visitorId === u.visitorId ? null : u));
                          }}
                        >
                          {/* Stationary hit area to prevent flicker */}
                          <circle cx="0" cy={-9 * s} r={16 * s} fill="transparent" pointerEvents="all" />

                          {/* Radar wave animation for live active users */}
                          {active && (
                            <circle
                              cx="0"
                              cy={-9 * s}
                              r={12 * s}
                              fill={spotColor.hex}
                              opacity="0.45"
                              className="animate-ping"
                            />
                          )}

                          {/* User Pin Silhouette */}
                          <g
                            style={{
                              transform: isHovered ? 'scale(1.3)' : isSelected ? 'scale(1.2)' : 'scale(1)',
                              transformOrigin: `0px ${-9 * s}px`,
                              transition: 'transform 0.15s ease',
                              filter: isHovered ? `drop-shadow(0 0 8px ${spotColor.hex})` : undefined,
                            }}
                          >
                            <circle
                              cx="0"
                              cy={-9 * s}
                              r={7 * s}
                              fill={spotColor.hex}
                              stroke="#ffffff"
                              strokeWidth={1.2 * s}
                            />
                            {/* White silhouette user head */}
                            <circle cx="0" cy={-11 * s} r={1.8 * s} fill="#ffffff" />
                            {/* White silhouette user body */}
                            <path
                              d={`M ${-3 * s},${-6 * s} C ${-3 * s},${-8.5 * s} ${3 * s},${-8.5 * s} ${3 * s},${-6 * s} Z`}
                              fill="#ffffff"
                            />

                            {/* Live beacon dot */}
                            {active && (
                              <circle
                                cx={5 * s}
                                cy={-14 * s}
                                r={2 * s}
                                fill="#22c55e"
                                stroke="#020617"
                                strokeWidth={0.6 * s}
                              />
                            )}
                          </g>

                          {/* Tooltip on hover directly in Province Panel Map */}
                          {isHovered && (
                            <g transform={`translate(0, ${-25 * s})`} className="pointer-events-none select-none">
                              <rect
                                x={-52 * s}
                                y={-24 * s}
                                width={104 * s}
                                height={24 * s}
                                rx={4 * s}
                                fill="#020617"
                                stroke={spotColor.hex}
                                strokeWidth={0.9 * s}
                              />
                              <text
                                x={0}
                                y={-13 * s}
                                textAnchor="middle"
                                fontSize={5 * s}
                                fontWeight="bold"
                                fill="#ffffff"
                              >
                                {locationName(u).slice(0, 16)}
                              </text>
                              <text
                                x={0}
                                y={-5 * s}
                                textAnchor="middle"
                                fontSize={4 * s}
                                fill={active ? '#4ade80' : '#94a3b8'}
                              >
                                {active ? '● Live Now' : `${u.visitCount} visits`}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Local Statistics Cards */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 border-b border-white/10 shrink-0 text-center">
                <div className="rounded-lg bg-white/5 p-2 border border-white/10">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Total Users</p>
                  <p className="text-base font-black text-white">{activeProvinceUsers.length}</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/30">
                  <p className="text-[9px] uppercase font-bold text-emerald-400">Live Now</p>
                  <p className="text-base font-black text-emerald-300">
                    {activeProvinceUsers.filter((u, i) => isUserActive(u, i)).length}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-500/10 p-2 border border-orange-500/30">
                  <p className="text-[9px] uppercase font-bold text-orange-400">Visits</p>
                  <p className="text-base font-black text-orange-300">
                    {activeProvinceUsers.reduce((s, u) => s + u.visitCount, 0)}
                  </p>
                </div>
              </div>

              {/* Districts & Towns Directory */}
              <div className="border-b border-white/10 px-4 py-2.5 bg-slate-900/40 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                  <Building2 size={11} className="text-emerald-400" />
                  Districts & Towns ({activeProvinceData.towns.length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                  {activeProvinceData.towns.map((t) => (
                    <span
                      key={t.name}
                      onMouseEnter={() => setHoveredTown(t.name)}
                      onMouseLeave={() => setHoveredTown(null)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border cursor-pointer transition ${
                        hoveredTown === t.name
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : t.type === 'capital'
                          ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t.type === 'capital' && <Star size={9} className="text-amber-400 fill-amber-400" />}
                      <span>{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Visitors List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                  <Users size={11} className="text-blue-400" />
                  Local Visitors ({activeProvinceUsers.length})
                </span>

                {activeProvinceUsers.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-white/[0.02] border border-white/5">
                    <MapPin size={20} className="mx-auto text-slate-500 mb-1 opacity-60" />
                    <p className="text-xs text-slate-400 font-medium">No visitors recorded in {activeProvinceData.name} yet.</p>
                  </div>
                ) : (
                  activeProvinceUsers.map((user, idx) => {
                    const spot = getVisitorSpotColor(user.visitorId, idx);
                    const active = isUserActive(user, idx);
                    const isSelected = selectedUser?.visitorId === user.visitorId;

                    return (
                      <div
                        key={user.visitorId || idx}
                        onClick={() => setSelectedUser((curr) => (curr?.visitorId === user.visitorId ? null : user))}
                        className={`flex items-center justify-between gap-2.5 p-2.5 rounded-xl cursor-pointer transition border ${
                          isSelected
                            ? 'bg-white/20 border-emerald-400/60 shadow-lg'
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm border border-white/30"
                            style={{ backgroundColor: spot.hex }}
                          >
                            <User size={12} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate" title={locationName(user)}>
                              {locationName(user)}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {shortId(user.visitorId)} · {user.visitCount} visits
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {active && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Live
                            </span>
                          )}
                          <ChevronRight size={13} className="text-slate-500" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* ========================================================
               ALL PROVINCES DIRECTORY OVERVIEW
               ======================================================== */
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b border-white/10 px-4 py-3 bg-slate-900/50 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-400" />
                    Provinces
                  </h3>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {provinceStats.length} Regions
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Click any province to open its detailed map and inspect local users.
                </p>
              </div>

              {/* User Spot Color Legend */}
              <div className="border-b border-white/10 px-4 py-2.5 bg-slate-900/30 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                  <User size={11} className="text-emerald-400" />
                  Active User Pins (Different Spot Colors)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SPOT_COLORS.slice(0, 8).map((sc) => (
                    <span
                      key={sc.hex}
                      className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sc.hex }} />
                      <span className="text-slate-300">{sc.name.split(' ')[0]}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Province List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {provinceStats.map(({ name, count, data }) => {
                  const isHovered = hoveredProvince === name;

                  return (
                    <div
                      key={name}
                      onMouseEnter={() => setHoveredProvince(name)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      onClick={() => setSelectedProvince(name)}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isHovered
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/[0.02] border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-md shadow-sm border border-white/30 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: data.color }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate" title={name}>
                            {name}
                          </p>
                          <p className="text-[10px] text-slate-400">Capital: {data.capital}</p>
                        </div>
                      </div>

                      <span
                        className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-black tabular-nums transition-colors"
                        style={{
                          backgroundColor: `${data.color}30`,
                          color: data.hoverColor,
                          border: `1px solid ${data.color}50`,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom 3D Ground Tilt Quick Controls */}
              {viewMode === '3d' && (
                <div className="border-t border-white/10 p-3 bg-slate-900/60 space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Sliders size={12} /> Ground Tilt:
                    </span>
                    <span className="font-mono text-emerald-400">{tiltAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="65"
                    value={tiltAngle}
                    onChange={(e) => setTiltAngle(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default VisitorMap;
