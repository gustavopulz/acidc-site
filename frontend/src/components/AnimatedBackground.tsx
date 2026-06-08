import { useEffect, useRef } from "react";

/* ─── Lightning Bolt ─────────────────────────────────────────── */
function LightningBolt({
  left,
  delay,
  duration,
  height,
  opacity,
}: {
  left: string;
  delay: string;
  duration: string;
  height: number;
  opacity: number;
}) {
  return (
    <div
      className="absolute top-0 animate-lightning pointer-events-none"
      style={{
        left,
        animationDelay: delay,
        animationDuration: duration,
        opacity: 0,
      }}
    >
      <svg
        width="48"
        height={height}
        viewBox={`0 0 48 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`glow-${left.replace("%", "")}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M36 0 L8 ${height * 0.54} H24 L12 ${height} L40 ${height * 0.46} H26 L36 0Z`}
          fill={`rgba(255, 90, 0, ${opacity})`}
          stroke={`rgba(255, 200, 80, ${opacity * 1.5})`}
          strokeWidth="1.5"
          filter={`url(#glow-${left.replace("%", "")})`}
        />
        {/* Inner bright line */}
        <path
          d={`M34 4 L10 ${height * 0.52} H22 L14 ${height * 0.96} L38 ${height * 0.44} H28 L34 4Z`}
          fill={`rgba(255, 240, 180, ${opacity * 0.4})`}
        />
      </svg>
    </div>
  );
}

/* ─── Steam Locomotive ────────────────────────────────────────── */
function Train() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 animate-train pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 560 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0"
        style={{ width: "560px", height: "110px" }}
      >
        <defs>
          <linearGradient id="trainBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(40,15,5,0.95)" />
            <stop offset="100%" stopColor="rgba(20,5,0,0.98)" />
          </linearGradient>
          <linearGradient id="trainHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,90,0,0.5)" />
            <stop offset="100%" stopColor="rgba(255,90,0,0)" />
          </linearGradient>
          <filter id="trainGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track rails */}
        <line x1="0" y1="105" x2="560" y2="105" stroke="rgba(255,90,0,0.25)" strokeWidth="3" />
        <line x1="0" y1="109" x2="560" y2="109" stroke="rgba(255,90,0,0.15)" strokeWidth="2" />
        {/* Sleepers */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={i * 40} y={105} width="28" height="5" fill="rgba(60,20,0,0.6)" />
        ))}

        {/* Tender (coal car - back) */}
        <rect x="370" y="45" width="150" height="55" rx="4" fill="url(#trainBody)" stroke="rgba(255,90,0,0.3)" strokeWidth="1" />
        <rect x="375" y="50" width="140" height="10" fill="rgba(255,90,0,0.08)" />
        {/* Tender wheels */}
        <WheelGroup cx={410} cy={104} r={16} />
        <WheelGroup cx={460} cy={104} r={16} />
        <WheelGroup cx={510} cy={104} r={16} />
        {/* Coupling */}
        <rect x="355" y="75" width="18" height="5" fill="rgba(255,90,0,0.4)" rx="2" />

        {/* Boiler / Locomotive body */}
        <path
          d="M30 48 Q30 35 48 35 H255 Q272 35 272 48 V98 H30 Z"
          fill="url(#trainBody)"
          stroke="rgba(255,90,0,0.35)"
          strokeWidth="1.5"
        />
        {/* Boiler highlight strip */}
        <path
          d="M30 48 Q30 35 48 35 H255 Q272 35 272 48 H30Z"
          fill="url(#trainHighlight)"
          opacity="0.6"
        />

        {/* Cab */}
        <rect x="265" y="22" width="108" height="76" rx="3" fill="url(#trainBody)" stroke="rgba(255,90,0,0.35)" strokeWidth="1.5" />
        {/* Cab window */}
        <rect x="278" y="32" width="35" height="28" rx="3" fill="rgba(255,140,0,0.08)" stroke="rgba(255,90,0,0.5)" strokeWidth="1" />
        <rect x="325" y="32" width="35" height="28" rx="3" fill="rgba(255,140,0,0.08)" stroke="rgba(255,90,0,0.5)" strokeWidth="1" />
        {/* Cab roof overhang */}
        <rect x="260" y="18" width="118" height="8" rx="2" fill="url(#trainBody)" stroke="rgba(255,90,0,0.3)" strokeWidth="1" />

        {/* Smokestack */}
        <rect x="68" y="12" width="28" height="26" rx="3" fill="url(#trainBody)" stroke="rgba(255,90,0,0.4)" strokeWidth="1.5" />
        {/* Smokestack flare */}
        <path d="M62 12 Q82 4 102 12" fill="url(#trainBody)" stroke="rgba(255,90,0,0.4)" strokeWidth="1.5" />

        {/* Steam dome */}
        <ellipse cx="180" cy="33" rx="26" ry="14" fill="url(#trainBody)" stroke="rgba(255,90,0,0.35)" strokeWidth="1.5" />

        {/* Bell on top of boiler */}
        <path d="M148 28 Q158 18 168 28 Q163 35 153 35 Z" fill="url(#trainBody)" stroke="rgba(255,90,0,0.5)" strokeWidth="1.5" />
        <line x1="158" y1="35" x2="158" y2="42" stroke="rgba(255,90,0,0.4)" strokeWidth="2" />
        <ellipse cx="158" cy="43" rx="5" ry="3" fill="rgba(255,90,0,0.4)" />

        {/* Headlight */}
        <circle cx="26" cy="68" r="10" fill="rgba(255,180,60,0.12)" stroke="rgba(255,180,60,0.6)" strokeWidth="1.5" filter="url(#trainGlow)" />
        <circle cx="26" cy="68" r="5" fill="rgba(255,200,100,0.3)" />

        {/* Cow catcher / pilot */}
        <path d="M0 90 L28 62 L28 90 Z" fill="url(#trainBody)" stroke="rgba(255,90,0,0.35)" strokeWidth="1.5" />
        <line x1="0" y1="90" x2="28" y2="70" stroke="rgba(255,90,0,0.25)" strokeWidth="1" />
        <line x1="8" y1="90" x2="28" y2="74" stroke="rgba(255,90,0,0.2)" strokeWidth="1" />
        <line x1="16" y1="90" x2="28" y2="78" stroke="rgba(255,90,0,0.15)" strokeWidth="1" />

        {/* Drive wheels (large) */}
        <WheelGroup cx={95} cy={101} r={26} large />
        <WheelGroup cx={155} cy={101} r={26} large />
        <WheelGroup cx={215} cy={101} r={26} large />

        {/* Small pilot wheels */}
        <WheelGroup cx={42} cy={101} r={15} />

        {/* Connecting rod between drive wheels */}
        <rect x="95" y="97" width="120" height="8" rx="3" fill="rgba(255,90,0,0.35)" />
        {/* Piston rod */}
        <rect x="28" y="94" width="72" height="7" rx="2" fill="rgba(255,90,0,0.3)" />
        {/* Piston box */}
        <rect x="22" y="88" width="18" height="16" rx="2" fill="url(#trainBody)" stroke="rgba(255,90,0,0.4)" strokeWidth="1" />

        {/* Running board / skirt */}
        <rect x="30" y="72" width="245" height="5" rx="1" fill="rgba(255,90,0,0.2)" />

        {/* Trailing wheels under cab */}
        <WheelGroup cx={295} cy={102} r={18} />
        <WheelGroup cx={340} cy={102} r={18} />
      </svg>

      {/* Smoke puffs */}
      <SmokePuff delay="0s" />
      <SmokePuff delay="0.6s" />
      <SmokePuff delay="1.2s" />
    </div>
  );
}

function WheelGroup({
  cx,
  cy,
  r,
  large,
}: {
  cx: number;
  cy: number;
  r: number;
  large?: boolean;
}) {
  const spokes = large ? 8 : 6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(25,8,0,0.95)" stroke="rgba(255,90,0,0.5)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.15} fill="rgba(255,90,0,0.6)" />
      {/* Spokes */}
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * Math.PI * 2) / spokes;
        const x1 = cx + Math.cos(angle) * r * 0.15;
        const y1 = cy + Math.sin(angle) * r * 0.15;
        const x2 = cx + Math.cos(angle) * r * 0.88;
        const y2 = cy + Math.sin(angle) * r * 0.88;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,90,0,0.4)" strokeWidth="1.2" />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke="rgba(255,90,0,0.2)" strokeWidth="0.8" />
    </g>
  );
}

function SmokePuff({ delay }: { delay: string }) {
  return (
    <div
      className="absolute animate-smoke"
      style={{
        left: "96px",
        bottom: "62px",
        animationDelay: delay,
        opacity: 0,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="10" fill="rgba(80,40,10,0.5)" />
        <circle cx="10" cy="12" r="7" fill="rgba(60,30,8,0.4)" />
        <circle cx="20" cy="10" r="6" fill="rgba(50,25,6,0.35)" />
      </svg>
    </div>
  );
}

/* ─── Bell ────────────────────────────────────────────────────── */
function Bell() {
  return (
    <div
      className="absolute top-16 right-12 animate-bell pointer-events-none hidden md:block"
      style={{ transformOrigin: "top center" }}
    >
      <svg
        width="56"
        height="72"
        viewBox="0 0 56 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="bellGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Bell hanger */}
        <rect x="25" y="0" width="6" height="14" rx="3" fill="rgba(255,90,0,0.5)" />
        <rect x="20" y="10" width="16" height="4" rx="2" fill="rgba(255,90,0,0.4)" />

        {/* Bell body */}
        <path
          d="M28 14 Q8 16 4 46 Q2 58 8 62 H48 Q54 58 52 46 Q48 16 28 14Z"
          fill="rgba(30,10,0,0.85)"
          stroke="rgba(255,90,0,0.6)"
          strokeWidth="2"
          filter="url(#bellGlow)"
        />
        {/* Bell shine */}
        <path
          d="M28 14 Q16 16 12 32 Q20 20 28 18 Q36 20 44 32 Q40 16 28 14Z"
          fill="rgba(255,90,0,0.1)"
        />
        {/* Bell rim */}
        <path
          d="M4 58 Q4 66 28 66 Q52 66 52 58"
          stroke="rgba(255,90,0,0.7)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Bell clapper */}
        <line x1="28" y1="50" x2="28" y2="66" stroke="rgba(255,90,0,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="68" r="5" fill="rgba(255,90,0,0.5)" stroke="rgba(255,90,0,0.8)" strokeWidth="1" />

        {/* Sound waves */}
        <path d="M52 34 Q58 44 52 54" stroke="rgba(255,90,0,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M56 28 Q66 44 56 60" stroke="rgba(255,90,0,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M4 34 Q-2 44 4 54" stroke="rgba(255,90,0,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M0 28 Q-10 44 0 60" stroke="rgba(255,90,0,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Electric sparks on edges ────────────────────────────────── */
function Sparks() {
  const sparks = [
    { left: "5%", top: "20%", delay: "0s" },
    { left: "15%", top: "65%", delay: "1.3s" },
    { left: "72%", top: "30%", delay: "2.7s" },
    { left: "90%", top: "55%", delay: "0.8s" },
    { left: "45%", top: "80%", delay: "3.5s" },
  ];

  return (
    <>
      {sparks.map((spark, i) => (
        <div
          key={i}
          className="absolute animate-spark pointer-events-none"
          style={{
            left: spark.left,
            top: spark.top,
            animationDelay: spark.delay,
            opacity: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <line x1="10" y1="0" x2="10" y2="20" stroke="rgba(255,150,0,0.7)" strokeWidth="1.5" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="rgba(255,150,0,0.7)" strokeWidth="1.5" />
            <line x1="3" y1="3" x2="17" y2="17" stroke="rgba(255,150,0,0.5)" strokeWidth="1" />
            <line x1="17" y1="3" x2="3" y2="17" stroke="rgba(255,150,0,0.5)" strokeWidth="1" />
            <circle cx="10" cy="10" r="3" fill="rgba(255,200,80,0.6)" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ─── Ambient glow orbs ──────────────────────────────────────── */
function GlowOrbs() {
  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-orb pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,30,0,0.04) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full animate-orb pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,90,0,0.05) 0%, transparent 70%)", animationDelay: "3s" }} />
      <div className="absolute top-2/3 left-1/2 w-72 h-72 rounded-full animate-orb pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,0,0,0.04) 0%, transparent 70%)", animationDelay: "6s" }} />
    </>
  );
}

/* ─── Canvas-based electric arc ─────────────────────────────── */
function ElectricArc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const drawArc = (x1: number, y1: number, x2: number, y2: number) => {
      const segments = 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const midX = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30;
        const midY = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30;
        ctx.lineTo(midX, midY);
      }
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(255, 120, 0, ${Math.random() * 0.3 + 0.05})`;
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      // Only draw occasionally for flicker effect
      if (frame % 8 === 0) {
        const x = Math.random() * canvas.width;
        drawArc(x, 0, x + (Math.random() - 0.5) * 80, canvas.height);
      }
      animId = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export default function AnimatedBackground() {
  const bolts = [
    { left: "6%",  delay: "0s",    duration: "9s",  height: 180, opacity: 0.18 },
    { left: "22%", delay: "3.4s",  duration: "11s", height: 220, opacity: 0.14 },
    { left: "40%", delay: "1.8s",  duration: "8s",  height: 160, opacity: 0.12 },
    { left: "58%", delay: "5.2s",  duration: "13s", height: 200, opacity: 0.16 },
    { left: "75%", delay: "2.1s",  duration: "10s", height: 240, opacity: 0.13 },
    { left: "91%", delay: "7.0s",  duration: "9s",  height: 190, opacity: 0.15 },
  ];

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Electric arcs (canvas) */}
      <ElectricArc />

      {/* Ambient glow orbs */}
      <GlowOrbs />

      {/* Lightning bolts */}
      {bolts.map((b, i) => (
        <LightningBolt key={i} {...b} />
      ))}

      {/* Hell's Bell */}
      <Bell />

      {/* Night Train */}
      <Train />

      {/* Sparks */}
      <Sparks />
    </div>
  );
}
