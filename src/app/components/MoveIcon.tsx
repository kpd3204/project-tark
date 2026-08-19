/* MoveIcon — five diamond-based identity icons for TARK's cognitive moves.
   Uses SVG paths from the provided brand assets (Asset_17–21).
   Supports any render size and three color variants. */

export type MoveKey = 'OPEN' | 'TRACE' | 'SHIFT' | 'SURFACE' | 'COMMIT';
type Variant = 'color' | 'white' | 'black';

const MOVE_COLORS: Record<MoveKey, string> = {
  OPEN:    '#FFD167',
  TRACE:   '#E27238',
  SHIFT:   '#465BA4',
  SURFACE: '#4DB49F',
  COMMIT:  '#DA3832',
};

function getColor(move: MoveKey, variant: Variant): string {
  if (variant === 'white') return '#FFFFFF';
  if (variant === 'black') return '#1A1A1A';
  return MOVE_COLORS[move];
}

/* ── OPEN — Asset_17: hollow diamond with four separated corner arrows */
function OpenIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 295.2 295.2" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path fill={color} d="M37.9,130.23l92.74-92.74c1.07-1.07,1.66-2.51,1.66-4.02V5.69c0-5.06-6.12-7.59-9.69-4.02L2.1,122.19c-3.58,3.58-1.04,9.69,4.02,9.69h27.78c1.51,0,2.95-.6,4.02-1.66Z"/>
      <path fill={color} d="M130.65,257.71l-93.16-93.16c-1.07-1.07-2.51-1.66-4.02-1.66H5.69c-5.06,0-7.59,6.12-4.02,9.69l120.94,120.94c3.58,3.58,9.69,1.04,9.69-4.02v-27.78c0-1.51-.6-2.95-1.66-4.02Z"/>
      <path fill={color} d="M164.97,37.91l92.32,92.32c1.07,1.07,2.51,1.66,4.02,1.66h27.78c5.06,0,7.59-6.12,4.02-9.69L173,2.1c-3.58-3.58-9.69-1.04-9.69,4.02v27.78c0,1.51.6,2.95,1.66,4.02Z"/>
      <path fill={color} d="M257.71,164.55l-92.74,92.74c-1.07,1.07-1.66,2.51-1.66,4.02v27.78c0,5.06,6.12,7.59,9.69,4.02l120.52-120.52c3.58-3.58,1.04-9.69-4.02-9.69h-27.78c-1.51,0-2.95.6-4.02,1.66Z"/>
    </svg>
  );
}

/* ── SHIFT — Asset_18: diamond outline with square inside */
function ShiftIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 322.37 329.54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path fill={color} d="M113.96,241.03l-75.99-75.99,127.07-127.07,87.69,87.69c2.4,2.4,5.64,3.74,9.03,3.74h29.87c3.2,0,4.81-3.87,2.54-6.14L175.06,4.15c-2.77-2.77-6.4-4.15-10.03-4.15s-7.26,1.38-10.03,4.15L4.15,155.01c-5.54,5.54-5.54,14.52,0,20.05l107.4,107.4c2.27,2.27,6.14.66,6.14-2.54v-29.87c0-3.39-1.35-6.64-3.74-9.03Z"/>
      <path fill={color} d="M291.37,175.96v122.58h-122.58v-122.58h122.58M308.19,144.96h-156.22c-7.83,0-14.18,6.35-14.18,14.18v156.22c0,7.83,6.35,14.18,14.18,14.18h156.22c7.83,0,14.18-6.35,14.18-14.18v-156.22c0-7.83-6.35-14.18-14.18-14.18h0Z"/>
    </svg>
  );
}

/* ── SURFACE — Asset_19: diamond with mountain/wave silhouette inside */
function SurfaceIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 330.07 330.07" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path fill={color} d="M325.92,155.01L175.06,4.15c-2.77-2.77-6.4-4.15-10.03-4.15s-7.26,1.38-10.03,4.15L4.15,155.01c-5.54,5.54-5.54,14.52,0,20.05l150.85,150.85c2.77,2.77,6.4,4.15,10.03,4.15s7.26-1.38,10.03-4.15l150.85-150.85c5.54-5.54,5.54-14.52,0-20.05ZM165.03,292.1l-127.07-127.07,29.66-29.66,11.58,11.58c5.54,5.54,14.52,5.54,20.05,0l11.47-11.47,41.07,41.07c5.54,5.54,14.52,5.54,20.05,0l44.78-44.78,15.19,15.19c5.54,5.54,14.52,5.54,20.05,0l11.07-11.07,29.15,29.15-127.07,127.07Z"/>
    </svg>
  );
}

/* ── TRACE — Asset_20: diamond with pixel/stepped squares trailing inward */
function TraceIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 334.92 330.07" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path fill={color} d="M330.76,155.01L179.91,4.15c-2.77-2.77-6.4-4.15-10.03-4.15s-7.26,1.38-10.03,4.15L51.05,112.96c-1.56,1.56-.46,4.24,1.76,4.24h33.8c2.59,0,5.08-1.03,6.91-2.86l76.37-76.37,127.07,127.07-127.07,127.07-79.96-79.96c-1.83-1.83-4.32-2.86-6.91-2.86h-33.8c-2.21,0-3.32,2.68-1.76,4.24l112.39,112.39c2.77,2.77,6.4,4.15,10.03,4.15s7.26-1.38,10.03-4.15l150.85-150.85c5.54-5.54,5.54-14.52,0-20.05Z"/>
      <rect fill={color} x="133.86" y="130.65" width="71.19" height="71.19" rx="5.5" ry="5.5" transform="translate(-67.92 168.52) rotate(-45)"/>
      <rect fill={color} x="77.24" y="140.97" width="50.56" height="50.56" transform="translate(-87.53 121.18) rotate(-45)"/>
      <rect fill={color} x="36.99" y="148.59" width="35.31" height="35.31" transform="translate(-101.55 87.33) rotate(-45)"/>
      <rect fill={color} x="5.88" y="152.04" width="28.38" height="28.38" transform="translate(-111.67 62.88) rotate(-45)"/>
    </svg>
  );
}

/* ── COMMIT — Asset_21: nested diamonds (diamond within diamond) */
function CommitIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 330.07 330.07" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path fill={color} d="M325.92,155.01L175.06,4.15c-2.77-2.77-6.4-4.15-10.03-4.15s-7.26,1.38-10.03,4.15L4.15,155.01c-5.54,5.54-5.54,14.52,0,20.05l150.85,150.85c2.77,2.77,6.4,4.15,10.03,4.15s7.26-1.38,10.03-4.15l150.85-150.85c5.54-5.54,5.54-14.52,0-20.05ZM165.03,292.1l-127.07-127.07,127.07-127.07,127.07,127.07-127.07,127.07Z"/>
      <path fill={color} d="M89.62,155.76c-5.54,5.54-5.54,14.52,0,20.05l65.44,65.44c5.54,5.54,14.52,5.54,20.05,0l65.44-65.44c5.54-5.54,5.54-14.52,0-20.05l-65.44-65.44c-5.54-5.54-14.52-5.54-20.05,0l-65.44,65.44Z"/>
    </svg>
  );
}

const ICON_MAP: Record<MoveKey, React.ComponentType<{ color: string }>> = {
  OPEN:    OpenIcon,
  TRACE:   TraceIcon,
  SHIFT:   ShiftIcon,
  SURFACE: SurfaceIcon,
  COMMIT:  CommitIcon,
};

interface MoveIconProps {
  move: MoveKey;
  size?: number;
  variant?: Variant;
  className?: string;
}

export function MoveIcon({ move, size = 48, variant = 'color', className }: MoveIconProps) {
  const IconComponent = ICON_MAP[move];
  const color = getColor(move, variant);

  return (
    <div
      className={className}
      style={{ width: size, height: size, flexShrink: 0, display: 'inline-block' }}
    >
      <IconComponent color={color} />
    </div>
  );
}

export { MOVE_COLORS };
