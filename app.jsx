const { useState, useRef, useEffect, useCallback } = React;

// ── Palette ──────────────────────────────────────────────────
const C = {
  bg: '#f5efe0',
  bgCard: '#fdf6e3',
  purple: '#b86d00',
  pink: '#d4880a',
  yellow: '#f0b830',
  teal: '#8a4f00',
  white: '#2d1a00',
  muted: '#8a6030',
  gradient: 'linear-gradient(135deg, #b86d00 0%, #d4880a 100%)',
  gradientBg: 'linear-gradient(160deg, #fdf6e3 0%, #f5efe0 60%, #faecd4 100%)',
};

// ── SVG Avatar Faces ──────────────────────────────────────────
function AvatarFace({ action, uploadedImg, size = 120 }) {
  const animStyle = {
    shake: { animation: 'shake 0.6s ease' },
    punch: { animation: 'shake 0.5s ease, splat 0.5s ease' },
    slap:  { animation: 'shake 0.4s ease' },
    cry:   { animation: 'crying 0.4s ease infinite' },
    spin:  { animation: 'spinDizzy 0.7s ease' },
    bounce:{ animation: 'bounce 0.6s ease' },
    poop:  { animation: 'shake 0.5s ease' },
    none:  {},
  }[action] || {};

  if (uploadedImg) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden', border: '3px solid #b86d00',
        ...animStyle, flexShrink: 0,
      }}>
        <img src={uploadedImg} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  // Default cartoon face
  const isCrying = action === 'cry';
  const isDizzy  = action === 'spin';
  const isPie    = action === 'poop' || action === 'slap';

  return (
    <div style={{ width: size, height: size, flexShrink: 0, ...animStyle }}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* Body */}
        <ellipse cx="60" cy="105" rx="28" ry="18" fill="#7c4dbb" />
        {/* Head */}
        <circle cx="60" cy="55" r="32" fill="#f5c5a3" />
        {/* Hair */}
        <ellipse cx="60" cy="26" rx="26" ry="10" fill="#4a2c6e" />
        <rect x="34" y="26" width="52" height="8" fill="#4a2c6e" />
        {/* Eyes */}
        {isDizzy ? (
          <>
            <text x="44" y="52" fontSize="14" textAnchor="middle">×</text>
            <text x="76" y="52" fontSize="14" textAnchor="middle">×</text>
          </>
        ) : isCrying ? (
          <>
            <ellipse cx="46" cy="50" rx="6" ry="5" fill="#fff" />
            <circle cx="46" cy="51" r="3.5" fill="#3a1a6e" />
            <ellipse cx="74" cy="50" rx="6" ry="5" fill="#fff" />
            <circle cx="74" cy="51" r="3.5" fill="#3a1a6e" />
            {/* Tears */}
            <path d="M44 56 Q43 62 42 68" stroke="#5b9cf6" strokeWidth="2" fill="none" />
            <path d="M72 56 Q71 62 70 68" stroke="#5b9cf6" strokeWidth="2" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="46" cy="50" rx="6" ry="5" fill="#fff" />
            <circle cx="46" cy="51" r="3.5" fill="#3a1a6e" />
            <ellipse cx="74" cy="50" rx="6" ry="5" fill="#fff" />
            <circle cx="74" cy="51" r="3.5" fill="#3a1a6e" />
          </>
        )}
        {/* Eyebrows — angry if shaking */}
        {(action === 'punch' || action === 'slap' || action === 'shake') ? (
          <>
            <line x1="40" y1="42" x2="52" y2="45" stroke="#4a2c6e" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="42" x2="68" y2="45" stroke="#4a2c6e" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M40 43 Q46 40 52 43" stroke="#4a2c6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M68 43 Q74 40 80 43" stroke="#4a2c6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* Mouth */}
        {isCrying ? (
          <path d="M50 68 Q60 63 70 68" stroke="#c0806a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (action === 'punch' || action === 'slap') ? (
          <ellipse cx="60" cy="69" rx="7" ry="5" fill="#c0806a" />
        ) : (
          <path d="M50 67 Q60 74 70 67" stroke="#c0806a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {/* Cheek blush */}
        <ellipse cx="36" cy="60" rx="7" ry="4" fill="#f48fb1" opacity="0.4" />
        <ellipse cx="84" cy="60" rx="7" ry="4" fill="#f48fb1" opacity="0.4" />
      </svg>
    </div>
  );
}

// ── Action Effects Overlay ────────────────────────────────────
function ActionEffect({ action }) {
  if (!action || action === 'none') return null;
  const effects = {
    punch: { emoji: '👊', label: 'POW!', color: C.yellow },
    slap:  { emoji: '👋', label: 'SLAP!', color: C.pink },
    cry:   { emoji: '😭', label: 'cry!', color: '#5b9cf6' },
    spin:  { emoji: '💫', label: 'DIZZY!', color: C.teal },
    pie:   { emoji: '🥧', label: 'SPLAT!', color: C.yellow },
    hair:  { emoji: '✂️', label: 'SHAVE!', color: C.purple },
    poop:  { emoji: '💩', label: 'EWWW!', color: '#a0522d' },
  };
  const e = effects[action];
  if (!e) return null;
  return (
    <div style={{
      position: 'absolute', top: 10, right: 10,
      animation: 'starPop 0.4s ease forwards',
      background: e.color, color: '#000',
      borderRadius: 8, padding: '4px 10px',
      fontWeight: 900, fontSize: 14, fontFamily: "'Nunito', sans-serif",
      pointerEvents: 'none', zIndex: 10,
    }}>
      {e.emoji} {e.label}
    </div>
  );
}

// ── Satisfaction Meter ────────────────────────────────────────
function SatisfactionMeter({ value }) {
  const pct = Math.min(100, Math.round(value));
  const color = pct < 30 ? C.pink : pct < 70 ? C.yellow : C.teal;
  const label = pct < 20 ? 'Still simmering...' : pct < 50 ? 'Getting there! 😤' : pct < 80 ? 'Feeling better! 😌' : 'Fully vented! 🎉';
  return (
    <div style={{ width: '100%', padding: '0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>VENT METER</span>
        <span style={{ fontSize: 11, color, fontWeight: 800 }}>{pct}%</span>
      </div>
      <div style={{ background: '#f5dfa0', borderRadius: 99, height: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: `linear-gradient(90deg, ${C.purple}, ${color})`,
          width: `${pct}%`, transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4, textAlign: 'center' }}>{label}</div>
    </div>
  );
}

// ── Stage Indicator ────────────────────────────────────────────
function StageIndicator({ stage }) {
  const stages = ['Intro', 'Setup', 'Vent', 'Heal'];
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      {stages.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: i <= stage ? 20 : 8, height: 8, borderRadius: 99,
            background: i === stage ? C.gradient : i < stage ? C.purple : '#f5dfa0',
            transition: 'all 0.4s ease',
          }} />
        </div>
      ))}
    </div>
  );
}

// ── SCREEN 1: Splash ──────────────────────────────────────────
const SLIDES = [
  {
    bg: 'linear-gradient(160deg, #fdf6e3 0%, #f5efe0 100%)',
    accent: '#b86d00',
    accentLight: '#f5dfa0',
    illustration: (
      <svg viewBox="0 0 200 196" width="200" height="196">
        {/* Sun glow */}
        <circle cx="100" cy="80" r="54" fill="#f0d090" opacity="0.35" />
        <circle cx="100" cy="80" r="38" fill="#f0b830" opacity="0.25" />
        {/* Face */}
        <circle cx="100" cy="80" r="34" fill="#f5c5a3" />
        {/* Hair */}
        <ellipse cx="100" cy="50" rx="28" ry="11" fill="#b86d00" />
        <rect x="72" y="50" width="56" height="10" fill="#b86d00" />
        {/* Eyes — frustrated */}
        <ellipse cx="88" cy="77" rx="5" ry="4.5" fill="#fff" />
        <circle cx="88" cy="78" r="3" fill="#3a1a0e" />
        <ellipse cx="112" cy="77" rx="5" ry="4.5" fill="#fff" />
        <circle cx="112" cy="78" r="3" fill="#3a1a0e" />
        {/* Angry brows */}
        <line x1="83" y1="70" x2="93" y2="73" stroke="#b86d00" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="117" y1="70" x2="107" y2="73" stroke="#b86d00" strokeWidth="2.5" strokeLinecap="round" />
        {/* Mouth — grumpy */}
        <path d="M91 90 Q100 85 109 90" stroke="#c0806a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Steam puffs */}
        <circle cx="76" cy="60" r="5" fill="#d4880a" opacity="0.4" />
        <circle cx="70" cy="52" r="4" fill="#d4880a" opacity="0.25" />
        <circle cx="124" cy="60" r="5" fill="#d4880a" opacity="0.4" />
        <circle cx="130" cy="52" r="4" fill="#d4880a" opacity="0.25" />
        {/* Body */}
        <ellipse cx="100" cy="148" rx="30" ry="20" fill="#d4880a" />
        {/* Arms crossed */}
        <path d="M70 130 Q80 140 100 138 Q120 140 130 130" stroke="#b86d00" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Tag */}
        <rect x="55" y="155" width="90" height="22" rx="11" fill="#b86d00" opacity="0.15" />
        <text x="100" y="170" textAnchor="middle" fontSize="10" fill="#b86d00" fontFamily="Nunito, sans-serif" fontWeight="800">feeling it? same.</text>
      </svg>
    ),
    headline: 'We get it.',
    sub: 'Sometimes you just need to let it all out — no judgment, no advice.',
  },
  {
    bg: 'linear-gradient(160deg, #fef3e2 0%, #faecd4 100%)',
    accent: '#c07800',
    accentLight: '#fde0a0',
    illustration: (
      <svg viewBox="0 0 200 196" width="200" height="196">
        {/* Glow rings */}
        <circle cx="100" cy="88" r="58" fill="#f0c060" opacity="0.18" />
        <circle cx="100" cy="88" r="42" fill="#e8a830" opacity="0.15" />
        {/* Avatar silhouette */}
        <circle cx="100" cy="72" r="30" fill="#f5c5a3" />
        <ellipse cx="100" cy="48" rx="24" ry="9" fill="#7a3a00" />
        <rect x="76" y="48" width="48" height="8" fill="#7a3a00" />
        {/* Eyes wide */}
        <ellipse cx="90" cy="70" rx="5.5" ry="5" fill="#fff" />
        <circle cx="90" cy="71" r="3.5" fill="#3a1a0e" />
        <ellipse cx="110" cy="70" rx="5.5" ry="5" fill="#fff" />
        <circle cx="110" cy="71" r="3.5" fill="#3a1a0e" />
        {/* Open mouth — venting */}
        <ellipse cx="100" cy="83" rx="7" ry="5" fill="#c0806a" />
        {/* Words flying out */}
        {[
          { x: 30, y: 55, rot: -20, word: 'UGH!' },
          { x: 140, y: 48, rot: 15, word: 'WHY?!' },
          { x: 22, y: 90, rot: -10, word: '😤' },
          { x: 148, y: 88, rot: 12, word: '💢' },
        ].map((w, i) => (
          <text key={i} x={w.x} y={w.y} fontSize="12" fill="#c07800" fontFamily="Nunito, sans-serif"
            fontWeight="900" transform={`rotate(${w.rot}, ${w.x}, ${w.y})`} opacity="0.85">{w.word}</text>
        ))}
        {/* Body */}
        <ellipse cx="100" cy="148" rx="28" ry="18" fill="#d4880a" />
        {/* Arms up venting */}
        <path d="M72 125 Q60 110 55 95" stroke="#b86d00" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M128 125 Q140 110 145 95" stroke="#b86d00" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="55" y="172" width="90" height="22" rx="11" fill="#c07800" opacity="0.13" />
        <text x="100" y="187" textAnchor="middle" fontSize="10" fill="#c07800" fontFamily="Nunito, sans-serif" fontWeight="800">you deserve to be heard</text>
      </svg>
    ),
    headline: 'Say it loud.',
    sub: 'Pick your situation, choose an avatar, and vent it all out.',
  },
  {
    bg: 'linear-gradient(160deg, #fff8e8 0%, #f5efe0 100%)',
    accent: '#b86d00',
    accentLight: '#fce8b0',
    illustration: (
      <svg viewBox="0 0 200 196" width="200" height="196">
        {/* Soft halo */}
        <circle cx="100" cy="80" r="55" fill="#f0d090" opacity="0.2" />
        {/* Face — relieved/happy */}
        <circle cx="100" cy="78" r="32" fill="#f5c5a3" />
        <ellipse cx="100" cy="52" rx="26" ry="10" fill="#b86d00" />
        <rect x="74" y="52" width="52" height="9" fill="#b86d00" />
        {/* Happy eyes */}
        <path d="M84 74 Q88 70 92 74" stroke="#3a1a0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M108 74 Q112 70 116 74" stroke="#3a1a0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Big smile */}
        <path d="M88 88 Q100 97 112 88" stroke="#c0806a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="80" cy="83" rx="7" ry="4" fill="#f48fb1" opacity="0.35" />
        <ellipse cx="120" cy="83" rx="7" ry="4" fill="#f48fb1" opacity="0.35" />
        {/* Heart sparkles */}
        <text x="55" y="58" fontSize="16" opacity="0.7">💛</text>
        <text x="136" y="55" fontSize="14" opacity="0.6">✨</text>
        <text x="62" y="108" fontSize="13" opacity="0.5">🌟</text>
        <text x="130" y="106" fontSize="13" opacity="0.6">💛</text>
        {/* Body */}
        <ellipse cx="100" cy="148" rx="28" ry="18" fill="#d4880a" />
        {/* Arms open / relieved */}
        <path d="M72 128 Q58 118 52 108" stroke="#b86d00" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M128 128 Q142 118 148 108" stroke="#b86d00" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="50" y="172" width="100" height="22" rx="11" fill="#b86d00" opacity="0.13" />
        <text x="100" y="187" textAnchor="middle" fontSize="10" fill="#b86d00" fontFamily="Nunito, sans-serif" fontWeight="800">feel better. every time.</text>
      </svg>
    ),
    headline: 'Then heal.',
    sub: 'Chat with our AI companion to process, reflect, and feel lighter.',
  },
];

function SplashScreen({ onStart, carouselSpeed = 3200 }) {
  const [idx, setIdx] = useState(0);
  const [animDir, setAnimDir] = useState('in');

  useEffect(() => {
    const t = setInterval(() => {
      setAnimDir('out');
      setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length);
        setAnimDir('in');
      }, 350);
    }, carouselSpeed);
    return () => clearInterval(t);
  }, [carouselSpeed]);

  const slide = SLIDES[idx];

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      background: slide.bg, transition: 'background 0.6s ease',
      padding: '0 28px 24px', overflow: 'hidden',
    }}>
      {/* Status bar clearance — dynamic island is 37px tall at top:11, status bar ~60px total */}
      <div style={{ height: 72, flexShrink: 0 }} />

      {/* Top wordmark — prominent branded title */}
      <div style={{ width: '100%', textAlign: 'center', paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: slide.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: `0 4px 12px ${slide.accent}44`,
          }}>💢</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 24, fontWeight: 700, color: C.white,
            letterSpacing: '-0.5px', lineHeight: 1,
          }}>
            go<span style={{ color: slide.accent, fontWeight: 900 }}>Vent</span>Away
          </h1>
        </div>
        <div style={{
          width: 40, height: 2, borderRadius: 99,
          background: slide.accentLight, margin: '10px auto 0',
        }} />
      </div>

      {/* Illustration — constrained so it never crowds text */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '4px 0',
        opacity: animDir === 'in' ? 1 : 0,
        transform: animDir === 'in' ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        maxHeight: 200,
      }}>
        <div style={{ transform: 'scale(0.88)', transformOrigin: 'center center' }}>
          {slide.illustration}
        </div>
      </div>

      {/* Text — full width with comfortable padding */}
      <div style={{
        textAlign: 'center', width: '100%', padding: '0 8px', marginBottom: 6,
        opacity: animDir === 'in' ? 1 : 0,
        transform: animDir === 'in' ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s',
      }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26, fontWeight: 700, color: C.white,
          letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.2,
        }}>{slide.headline}</h2>
        <p style={{
          color: C.muted, fontSize: 13, lineHeight: 1.65,
          maxWidth: '100%', margin: '0 auto', textWrap: 'pretty',
          paddingLeft: 4, paddingRight: 4,
        }}>{slide.sub}</p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '10px 0' }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            height: 7, borderRadius: 99, cursor: 'pointer',
            width: i === idx ? 22 : 7,
            background: i === idx ? slide.accent : slide.accentLight,
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>

      {/* CTA */}
      <button onClick={onStart} style={{
        width: '100%', padding: '15px', borderRadius: 16,
        background: slide.accent,
        border: 'none', cursor: 'pointer',
        color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 16, fontWeight: 700, letterSpacing: '0.2px',
        boxShadow: `0 6px 24px ${slide.accent}33`,
        transition: 'background 0.4s ease',
      }}>
        Begin
      </button>
    </div>
  );
}

// ── SCREEN 2: Setup ────────────────────────────────────────────
const VENT_REASONS = [
  { id: 'ghost', label: 'I was ghosted 👻', emoji: '👻' },
  { id: 'cheat', label: 'My partner cheated 💔', emoji: '💔' },
  { id: 'boss',  label: 'My boss is impossible 😤', emoji: '😤' },
  { id: 'inlaw', label: 'My in-laws are unbearable 😬', emoji: '😬' },
  { id: 'friend', label: 'A friend betrayed me 🗡️', emoji: '🗡️' },
  { id: 'work',  label: 'Work is burning me out 🔥', emoji: '🔥' },
  { id: 'fam',   label: 'Family drama is real 🎭', emoji: '🎭' },
  { id: 'other', label: 'Something else... ✍️', emoji: '✍️' },
];

function SetupScreen({ onNext, uploadedImg, onUpload }) {
  const [selected, setSelected] = useState(null);
  const [avatarType, setAvatarType] = useState('male');
  const [customText, setCustomText] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: C.gradientBg, padding: '20px 20px 16px',
      animation: 'slideUp 0.4s ease', overflowY: 'auto',
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 20, fontWeight: 700, color: C.white,
        textAlign: 'center', marginBottom: 4,
      }}>Help us know you 💜</h2>
      <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
        Pick an avatar &amp; tell us what happened
      </p>

      {/* Avatar selection */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
        {[
          { id: 'male', label: 'Him', colors: ['#7c4dbb', '#f5c5a3', '#4a2c6e'] },
          { id: 'female', label: 'Her', colors: ['#e91e8c', '#f5c5a3', '#8b1a5c'] },
          { id: 'upload', label: 'Photo', colors: [] },
        ].map(av => (
          <button key={av.id} onClick={() => { setAvatarType(av.id); if (av.id === 'upload') fileRef.current.click(); }}
            style={{
              width: 72, height: 86, borderRadius: 16,
              border: `2px solid ${avatarType === av.id ? C.purple : '#f0d090'}`,
              background: avatarType === av.id ? 'rgba(184,109,0,0.07)' : '#fdf6e3',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              transition: 'all 0.2s',
            }}>
            {av.id === 'upload' ? (
              <>
                {uploadedImg
                  ? <img src={uploadedImg} alt="uploaded" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 28 }}>📷</span>
                }
                <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{uploadedImg ? 'YOURS' : 'UPLOAD'}</span>
              </>
            ) : (
              <>
                <AvatarFace action="none" size={44} />
                <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{av.label.toUpperCase()}</span>
              </>
            )}
          </button>
        ))}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {/* Vent reasons */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px' }}>
          WHAT BROUGHT YOU HERE?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {VENT_REASONS.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: selected === r.id ? 'rgba(196,127,0,0.12)' : 'rgba(0,0,0,0.03)',
              border: `1.5px solid ${selected === r.id ? C.purple : 'rgba(0,0,0,0.09)'}`,
              borderRadius: 12, padding: '10px 14px', cursor: 'pointer',
              color: C.white, fontSize: 13, fontWeight: 600, fontFamily: "'Nunito', sans-serif",
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 18 }}>{r.emoji}</span>
              {r.label}
              {selected === r.id && <span style={{ marginLeft: 'auto', color: C.purple }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {selected === 'other' && (
        <textarea value={customText} onChange={e => setCustomText(e.target.value)}
          placeholder="Tell us what's going on..."
          style={{
            width: '100%', borderRadius: 12, border: '1.5px solid rgba(184,109,0,0.12)',
            background: '#fff', color: '#2d1a00', padding: '10px 12px',
            fontSize: 13, fontFamily: "'Nunito', sans-serif", resize: 'none', height: 70,
            outline: 'none', marginBottom: 8,
          }} />
      )}

      <button onClick={() => selected && onNext(selected, avatarType)} style={{
        width: '100%', padding: '14px', borderRadius: 14,
        background: selected ? C.gradient : '#f5dfa0',
        border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
        color: selected ? '#fff' : C.muted, fontFamily: "'Nunito', sans-serif",
        fontSize: 16, fontWeight: 800, marginTop: 8, transition: 'all 0.3s',
      }}>
        Let me at it! 👊
      </button>
    </div>
  );
}

// ── SCREEN 3: Vent ────────────────────────────────────────────
const ACTIONS = [
  { id: 'punch', label: 'Punch',     emoji: '👊', pos: 'left',  top: '25%' },
  { id: 'slap',  label: 'Slap',      emoji: '👋', pos: 'left',  top: '42%' },
  { id: 'cry',   label: 'Make cry',  emoji: '😭', pos: 'left',  top: '59%' },
  { id: 'hair',  label: 'Head shave',emoji: '✂️', pos: 'right', top: '25%' },
  { id: 'pie',   label: 'Throw pie', emoji: '🥧', pos: 'right', top: '42%' },
  { id: 'poop',  label: 'Dog poop',  emoji: '💩', pos: 'right', top: '59%' },
];

function VentScreen({ onHearMeOut, ventReason, uploadedImg, avatarType, avatarSize = 100, showLeaderboard = true }) {
  const [activeAction, setActiveAction] = useState(null);
  const [actionKey, setActionKey] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [hitCount, setHitCount] = useState({});
  const [floaters, setFloaters] = useState([]);
  const actionTimeout = useRef(null);

  const reasonMap = {
    ghost: 'the Ghoster', cheat: 'the Cheater', boss: 'the Boss',
    inlaw: 'the In-Law', friend: 'the Betrayer', work: 'Work Stress',
    fam: 'Family Drama', other: 'Them',
  };
  const label = reasonMap[ventReason] || 'Them';

  const handleAction = (action) => {
    setActiveAction(action.id);
    setActionKey(k => k + 1);
    setSatisfaction(s => Math.min(100, s + 12 + Math.random() * 8));
    setHitCount(h => ({ ...h, [action.id]: (h[action.id] || 0) + 1 }));

    // Float emoji
    const id = Date.now();
    setFloaters(f => [...f, { id, emoji: action.emoji, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setFloaters(f => f.filter(fl => fl.id !== id)), 900);

    if (actionTimeout.current) clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(() => setActiveAction(null), 700);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: C.gradientBg, animation: 'slideUp 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18, fontWeight: 700, color: C.white,
        }}>Let it out! 💢</h2>
        <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
          Tap an action to vent on <span style={{ color: C.pink, fontWeight: 700 }}>{label}</span>
        </p>
      </div>

      {/* Satisfaction meter */}
      <div style={{ padding: '0 20px 8px' }}>
        <SatisfactionMeter value={satisfaction} />
      </div>

      {/* Main arena */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Floating emojis */}
        {floaters.map(fl => (
          <div key={fl.id} style={{
            position: 'absolute', left: `${fl.x}%`, bottom: '55%',
            fontSize: 28, animation: 'floatUp 0.9s ease forwards',
            pointerEvents: 'none', zIndex: 20,
          }}>{fl.emoji}</div>
        ))}

        {/* Left actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'absolute', left: 12 }}>
          {ACTIONS.filter(a => a.pos === 'left').map(a => (
            <button key={a.id} onClick={() => handleAction(a)} style={{
              background: activeAction === a.id ? C.purple : 'rgba(184,109,0,0.06)',
              border: `1.5px solid ${activeAction === a.id ? C.purple : 'rgba(184,109,0,0.12)'}`,
              borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
              color: '#2d1a00', fontSize: 12, fontWeight: 800,
              fontFamily: "'Nunito', sans-serif",
              transition: 'all 0.15s', textAlign: 'center', minWidth: 68,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{a.emoji}</span>
              <span>{a.label}</span>
              {hitCount[a.id] ? <span style={{ background: C.pink, borderRadius: 99, fontSize: 9, padding: '0 4px', color: '#fff' }}>{hitCount[a.id]}</span> : null}
            </button>
          ))}
        </div>

        {/* Avatar center */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ActionEffect key={actionKey} action={activeAction} />
          <div style={{
            background: 'rgba(184,109,0,0.04)', borderRadius: '50%',
            padding: 16, border: '2px dashed rgba(184,109,0,0.12)',
          }}>
            <AvatarFace action={activeAction || 'none'} uploadedImg={uploadedImg} size={avatarSize} key={actionKey} />
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.05)', borderRadius: 8,
            padding: '3px 10px', border: '1px solid rgba(0,0,0,0.08)',
          }}>
            <span style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>{label.toUpperCase()}</span>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'absolute', right: 12 }}>
          {ACTIONS.filter(a => a.pos === 'right').map(a => (
            <button key={a.id} onClick={() => handleAction(a)} style={{
              background: activeAction === a.id ? C.purple : 'rgba(184,109,0,0.06)',
              border: `1.5px solid ${activeAction === a.id ? C.purple : 'rgba(184,109,0,0.12)'}`,
              borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
              color: '#2d1a00', fontSize: 12, fontWeight: 800,
              fontFamily: "'Nunito', sans-serif",
              transition: 'all 0.15s', textAlign: 'center', minWidth: 68,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{a.emoji}</span>
              <span style={{ fontSize: 11 }}>{a.label}</span>
              {hitCount[a.id] ? <span style={{ background: C.pink, borderRadius: 99, fontSize: 9, padding: '0 4px', color: '#fff' }}>{hitCount[a.id]}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Hit summary */}
      {Object.keys(hitCount).length > 0 && (
        <div style={{ padding: '0 20px 8px', display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(hitCount).map(([k, v]) => {
            const a = ACTIONS.find(x => x.id === k);
            return (
              <span key={k} style={{
                background: 'rgba(184,109,0,0.07)', borderRadius: 99, padding: '3px 8px',
                fontSize: 11, color: C.muted, fontWeight: 700,
              }}>{a?.emoji} ×{v}</span>
            );
          })}
        </div>
      )}

      {/* Leaderboard teaser + CTA */}
      <div style={{ padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {showLeaderboard && <div style={{
          background: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: '8px 12px',
          border: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>THIS WEEK'S TOP VENT</div>
            <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>"My boss is impossible" · 2,341 vents</div>
          </div>
        </div>}
        <button onClick={onHearMeOut} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: C.gradient, border: 'none', cursor: 'pointer',
          color: '#fff', fontFamily: "'Nunito', sans-serif",
          fontSize: 16, fontWeight: 800,
          boxShadow: '0 6px 24px rgba(184,109,0,0.15)',
        }}>
          Hear Me Out 💬
        </button>
      </div>
    </div>
  );
}

// ── SCREEN 4: Hear Me Out ─────────────────────────────────────
const PROMPTS = [
  "What would you want them to know?",
  "How long has this been bothering you?",
  "What do you wish had happened instead?",
  "What would make you feel better right now?",
  "If they apologized, what would you say?",
];

// ── Canned reply pool (no backend) ────────────────────────────
const REPLY_OPENERS = [
  "That sounds really hard. What's the worst part of it for you?",
  "I hear you. How long have you been carrying this around?",
  "Ugh, that's a lot to be sitting with. What did you wish they'd done differently?",
  "Yeah, that would mess anyone up a little. What's hitting you hardest right now?",
  "Mmhm. That feeling is so valid — what's been running through your head about it?",
];
const REPLY_MIDDLE = [
  "It's totally fair to feel that way. What would 'a little better' look like tonight?",
  "You're allowed to be angry about this. Is there something you've been holding back from saying out loud?",
  "That makes complete sense. Has anyone in your life been making this easier or harder?",
  "You're not overreacting — this stuff is heavy. What part feels the most unfair?",
  "Mmhm, keep going. What do you think they'd say if they could really hear you?",
  "That tracks. If a friend told you the same story, what would you tell them?",
];
const REPLY_HEALING = [
  "You're doing the work just by saying it out loud. What's one tiny thing you could do for yourself today? 💜",
  "I'm proud of you for naming all of that. How are you feeling now compared to when we started?",
  "You deserve to be heard, and you are. What do you want to leave behind in this conversation?",
  "Honestly, you sound stronger than you give yourself credit for. What's one thing you're grateful you still have?",
  "Take a breath — you let it out, and that matters. What would 'lighter' feel like for you?",
];
const KEYWORD_REPLIES = [
  { kw: /\b(alone|lonely|isolat)/i, reply: "Feeling alone in this is its own kind of pain. You're not alone right now — I'm here. What's one person who used to make you feel seen?" },
  { kw: /\b(tired|exhausted|drained|done)/i, reply: "That kind of tired goes way past sleep. What's been pulling the most energy out of you lately?" },
  { kw: /\b(angry|furious|pissed|rage|hate)/i, reply: "That anger is signal — it's telling you something mattered. What boundary do you wish had been there?" },
  { kw: /\b(sad|cry|crying|tears)/i, reply: "Let it come up. Crying is just feelings finally finding a door. What did you need that you didn't get?" },
  { kw: /\b(scared|afraid|anxious|worried|fear)/i, reply: "That fear is real, and it's protecting you from something. What's the worst-case your brain keeps replaying?" },
  { kw: /\b(stupid|dumb|fool|idiot|naive)/i, reply: "Hey — caring about someone isn't stupid. Wanting to be treated well isn't stupid. What did you think you should've seen sooner?" },
  { kw: /\b(better|okay|lighter|grateful|good)/i, reply: "I love that you can feel even a sliver of that right now. What helped that small shift happen?" },
  { kw: /\b(thank|thanks|appreciate)/i, reply: "You don't owe me anything — you showed up for yourself today, that's the whole thing. 💜 What feels like the right next step?" },
];

function pickCannedReply(userMsg, msgCount, reasonLabel) {
  // Keyword match first — feels more responsive when it lands.
  for (const k of KEYWORD_REPLIES) {
    if (k.kw.test(userMsg)) return k.reply;
  }
  // Otherwise rotate through phases based on conversation length.
  const phase = msgCount < 3 ? REPLY_OPENERS : msgCount < 7 ? REPLY_MIDDLE : REPLY_HEALING;
  return phase[Math.floor(Math.random() * phase.length)];
}

function HearMeOutScreen({ ventReason }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('prompt'); // prompt | typing | done
  const bottomRef = useRef();

  const reasonLabel = {
    ghost: 'being ghosted', cheat: 'being cheated on', boss: 'your boss situation',
    inlaw: 'your in-law drama', friend: 'your friend betrayal', work: 'work burnout',
    fam: 'your family situation', other: 'what happened',
  }[ventReason] || 'what happened';

  useEffect(() => {
    // Initial bot message
    setMessages([{
      role: 'bot',
      text: `Hey, I hear you about ${reasonLabel}. That's genuinely tough — and your feelings are completely valid. I'm here to listen. 💜`,
    }]);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Simulate a small thinking delay then pick a contextual canned reply.
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
    const reply = pickCannedReply(userMsg, messages.length, reasonLabel);
    setMessages(m => [...m, { role: 'bot', text: reply }]);
    setPromptIdx(i => (i + 1) % PROMPTS.length);
    setLoading(false);
  };

  const usePrompt = () => {
    setInput(PROMPTS[promptIdx]);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: C.gradientBg, animation: 'slideUp 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 10px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18, fontWeight: 700, color: C.white,
        }}>Hear Me Out 💬</h2>
        <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
          I'm listening — tell me everything
        </p>
      </div>

      {/* Emotional stages */}
      <div style={{ padding: '8px 20px', display: 'flex', gap: 6, justifyContent: 'center' }}>
        {['Venting 💢', 'Processing 🌀', 'Healing 💜'].map((s, i) => {
          const active = messages.length > i * 3;
          return (
            <div key={s} style={{
              borderRadius: 99, padding: '4px 10px', fontSize: 10, fontWeight: 800,
              background: active ? 'rgba(184,109,0,0.12)' : 'rgba(0,0,0,0.03)',
              color: active ? C.purple : C.muted,
              border: `1px solid ${active ? C.purple : 'transparent'}`,
              transition: 'all 0.4s',
            }}>{s}</div>
          );
        })}
      </div>

      {/* Messages */}
      <div ref={bottomRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'slideUp 0.3s ease',
          }}>
            {m.role === 'bot' && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: C.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2,
              }}>💜</div>
            )}
            <div style={{
              maxWidth: '75%', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '10px 14px',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, #b86d00, #d4880a)'
                : '#fff',
              color: m.role === 'user' ? '#fff' : '#2d1a00', fontSize: 13, fontWeight: 500, lineHeight: 1.5,
              border: m.role === 'bot' ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: C.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>💜</div>
            <div style={{
              background: '#fff', borderRadius: '16px 16px 16px 4px',
              padding: '12px 16px', color: C.muted, fontSize: 13,
            }}>
              <span style={{ animation: 'pulse 1s ease infinite' }}>typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt suggestion */}
      <div style={{ padding: '4px 16px' }}>
        <button onClick={usePrompt} style={{
          background: 'rgba(184,109,0,0.04)', border: '1px dashed rgba(184,109,0,0.15)',
          borderRadius: 10, padding: '7px 12px', cursor: 'pointer',
          color: C.muted, fontSize: 12, fontFamily: "'Nunito', sans-serif",
          textAlign: 'left', width: '100%', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: C.purple }}>💡</span>
          <span>Try: "{PROMPTS[promptIdx]}"</span>
        </button>
      </div>

      {/* Input */}
      <div style={{ padding: '8px 16px 16px', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Tell me more..."
          style={{
            flex: 1, borderRadius: 12, border: '1.5px solid rgba(184,109,0,0.12)',
            background: '#fff', color: '#2d1a00', padding: '10px 14px',
            fontSize: 13, fontFamily: "'Nunito', sans-serif", outline: 'none',
          }} />
        <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
          width: 44, height: 44, borderRadius: 12, background: C.gradient,
          border: 'none', cursor: 'pointer', fontSize: 18,
          opacity: input.trim() && !loading ? 1 : 0.5, flexShrink: 0,
        }}>➤</button>
      </div>
    </div>
  );
}

// ── Palettes ──────────────────────────────────────────────────
const PALETTES = {
  'Cream & Amber': { bg:'#f5efe0',bgCard:'#fdf6e3',purple:'#b86d00',pink:'#d4880a',yellow:'#f0b830',teal:'#8a4f00',white:'#2d1a00',muted:'#8a6030',gradient:'linear-gradient(135deg,#b86d00 0%,#d4880a 100%)',gradientBg:'linear-gradient(160deg,#fdf6e3 0%,#f5efe0 60%,#faecd4 100%)' },
  'Soft Pink':     { bg:'#fdf0f0',bgCard:'#fff5f5',purple:'#d6536d',pink:'#e8845a',yellow:'#f4a96a',teal:'#c94470',white:'#2d0f1a',muted:'#9e5a6a',gradient:'linear-gradient(135deg,#d6536d 0%,#e8845a 100%)',gradientBg:'linear-gradient(160deg,#fff0f3 0%,#fdf0f0 60%,#ffeee8 100%)' },
  'Pale Violet':   { bg:'#f2eeff',bgCard:'#f7f3ff',purple:'#6b35d9',pink:'#9b5de5',yellow:'#b87dfa',teal:'#4e22a8',white:'#1a0a35',muted:'#7a5aaa',gradient:'linear-gradient(135deg,#6b35d9 0%,#9b5de5 100%)',gradientBg:'linear-gradient(160deg,#f7f3ff 0%,#f2eeff 60%,#ede5ff 100%)' },
  'Peach Terra':   { bg:'#f9ebe0',bgCard:'#fdf3ea',purple:'#c0442a',pink:'#e05c3a',yellow:'#f28c5e',teal:'#a33520',white:'#2a0e05',muted:'#8a4a35',gradient:'linear-gradient(135deg,#c0442a 0%,#e05c3a 100%)',gradientBg:'linear-gradient(160deg,#fdf3ea 0%,#f9ebe0 60%,#fde8d8 100%)' },
  'Midnight':      { bg:'#0d0820',bgCard:'#1a1035',purple:'#9b5de5',pink:'#f15bb5',yellow:'#fee440',teal:'#00f5d4',white:'#f8f4ff',muted:'#a89ec9',gradient:'linear-gradient(135deg,#9b5de5 0%,#f15bb5 100%)',gradientBg:'linear-gradient(160deg,#1a0a35 0%,#0d0820 60%,#120a30 100%)' },
};

// ── Main App ──────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState(0);
  const [ventReason, setVentReason] = useState(null);
  const [avatarType, setAvatarType] = useState('male');
  const [uploadedImg, setUploadedImg] = useState(null);
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "Cream & Amber",
    "carouselSpeed": 3,
    "avatarSize": 120,
    "showLeaderboard": true
  }/*EDITMODE-END*/);

  // Apply palette live
  const pal = PALETTES[tweaks.palette] || PALETTES['Cream & Amber'];
  Object.assign(C, pal);
  document.body.style.background = pal.bg;

  const goTo = (s) => setScreen(s);

  const screens = [
    <SplashScreen onStart={() => goTo(1)} carouselSpeed={tweaks.carouselSpeed * 1000} />,
    <SetupScreen
      onNext={(reason, av) => { setVentReason(reason); setAvatarType(av); goTo(2); }}
      uploadedImg={uploadedImg}
      onUpload={(img) => { setUploadedImg(img); setAvatarType('upload'); }}
    />,
    <VentScreen
      onHearMeOut={() => goTo(3)}
      ventReason={ventReason}
      uploadedImg={avatarType === 'upload' ? uploadedImg : null}
      avatarType={avatarType}
      avatarSize={tweaks.avatarSize}
      showLeaderboard={tweaks.showLeaderboard}
    />,
    <HearMeOutScreen ventReason={ventReason} />,
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px 16px', background: C.bg }}>
      <TweaksPanel>
        <TweakSection title="Theme">
          <TweakSelect id="palette" label="Color palette" value={tweaks.palette} options={Object.keys(PALETTES)} onChange={v => setTweak('palette', v)} />
        </TweakSection>
        <TweakSection title="Splash">
          <TweakSlider id="carouselSpeed" label="Slide speed (sec)" value={tweaks.carouselSpeed} min={1} max={8} step={0.5} onChange={v => setTweak('carouselSpeed', v)} />
        </TweakSection>
        <TweakSection title="Vent Screen">
          <TweakSlider id="avatarSize" label="Avatar size" value={tweaks.avatarSize} min={70} max={140} step={5} onChange={v => setTweak('avatarSize', v)} />
          <TweakToggle id="showLeaderboard" label="Show leaderboard" value={tweaks.showLeaderboard} onChange={v => setTweak('showLeaderboard', v)} />
        </TweakSection>
      </TweaksPanel>
      <IOSDevice width={375} height={760} dark={true}>
        <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
          {/* Stage indicator */}
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, zIndex: 50 }}>
            <StageIndicator stage={screen} />
          </div>

          {/* Back button */}
          {screen > 0 && (
            <button onClick={() => setScreen(s => s - 1)} style={{
              position: 'absolute', top: 10, left: 14, zIndex: 50,
              background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
              color: C.muted, borderRadius: 8, padding: '4px 10px', fontSize: 13,
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            }}>← Back</button>
          )}

          {/* Render current screen */}
          <div style={{ height: '100%', paddingBottom: 32 }}>
            {screens[screen]}
          </div>
        </div>
      </IOSDevice>

      {/* Desktop nav helper */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {['Splash', 'Setup', 'Vent', 'Hear Me Out'].map((s, i) => (
          <button key={s} onClick={() => setScreen(i)} style={{
            padding: '6px 14px', borderRadius: 99,
            background: screen === i ? C.gradient : 'rgba(0,0,0,0.07)',
            border: 'none', cursor: 'pointer', color: screen === i ? '#fff' : C.muted,
            fontSize: 12, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
            transition: 'all 0.2s',
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
