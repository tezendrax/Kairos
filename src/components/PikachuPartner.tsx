'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type PikachuState = 'idle' | 'walk' | 'hello' | 'thunderbolt' | 'peek';
type PeekEdge = 'left' | 'right' | 'top' | 'bottom' | null;

interface PikachuAction {
  text: string;
  voiceKey: string;
  state: PikachuState;
}

// PokeBall SVG Icon for Recall/Summon
const PokeballIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Upper red half */}
    <path d="M 10 50 A 40 40 0 0 1 90 50 Q 50 48 10 50 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="5" />
    {/* Lower white half */}
    <path d="M 10 50 A 40 40 0 0 0 90 50 Q 50 52 10 50 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5" />
    {/* Middle black band */}
    <line x1="10" y1="50" x2="90" y2="50" stroke="#1e293b" strokeWidth="5" />
    {/* Center button */}
    <circle cx="50" cy="50" r="16" fill="#1e293b" />
    <circle cx="50" cy="50" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
  </svg>
);

// 1. Gestures / General Situations
const PIKA_GESTURES: PikachuAction[] = [
  { text: "Pika Pika! ✨", voiceKey: "pika_pika", state: "idle" },
  { text: "Pika-Chu! 👍", voiceKey: "pika_chu", state: "hello" },
  { text: "Pika Pika Pika! 🎉", voiceKey: "pika_pika_pika", state: "hello" },
  { text: "Pikachuuuu! ⭐", voiceKey: "pikachuuuu", state: "hello" },
  { text: "Pika...? 🤔", voiceKey: "pika_question", state: "peek" },
  { text: "Pi-ka-Pi! 😊", voiceKey: "pi_ka_pi", state: "walk" },
  { text: "Pika Pika! 👋", voiceKey: "pika_pika", state: "hello" },
  { text: "Pika-Chuuu! 🌟", voiceKey: "pikachuuuu", state: "hello" },
  { text: "Pika! Pika! 💛", voiceKey: "pika_pika", state: "walk" },
  { text: "Pikaaa-CHU! 👋⚡", voiceKey: "pikaaa_chu", state: "hello" }
];

// 2. Motivational Moments (Triggered on user actions / dashboard events)
const PIKA_MOTIVATIONS = {
  you_can_do_it: { text: "You can do it! 🚀 (Pika Pika! ✨)", voiceKey: "pika_pika", state: "walk" as PikachuState },
  keep_going: { text: "Keep going! 🎯 (Pika-Chu! ⚡)", voiceKey: "pika_chu", state: "hello" as PikachuState },
  great_job: { text: "Great job! 🏆 (Pikachuuuu! 🌟)", voiceKey: "pikachuuuu", state: "hello" as PikachuState },
  dont_give_up: { text: "Don't give up! 💪 (Pika Pika Pika! 💛)", voiceKey: "pika_pika_pika", state: "walk" as PikachuState },
  mission_completed: { text: "Mission completed! 🎉 (Pika-CHUUUU! 🎊)", voiceKey: "volt_tackle", state: "hello" as PikachuState }
};

// 3. Battle Moves
const PIKA_MOVES: PikachuAction[] = [
  { text: "Pikaachuuuu! ⚡", voiceKey: "thunderbolt", state: "thunderbolt" },
  { text: "Pika-Pika-Pika-CHUUUU! ⚡⚡", voiceKey: "thunder", state: "thunderbolt" },
  { text: "Pika! 💨", voiceKey: "pika_short", state: "walk" },
  { text: "Pika-CHAA! 💫", voiceKey: "pika_cha", state: "hello" },
  { text: "Pikaaa... CHUU! 🔵", voiceKey: "electro_ball", state: "thunderbolt" },
  { text: "PIKAAAAA-CHUUUU!!! ⚡🔥", voiceKey: "volt_tackle", state: "thunderbolt" },
  { text: "Pika-cha! 👊", voiceKey: "pika_punch", state: "hello" },
  { text: "Pika-Pika! 🕸️", voiceKey: "electro_web", state: "walk" },
  { text: "Pi-ka! ⚡", voiceKey: "agility", state: "walk" },
  { text: "Chu! ⚡", voiceKey: "chu", state: "thunderbolt" }
];

export default function PikachuPartner() {
  const [state, setState] = useState<PikachuState>('idle');
  const [position, setPosition] = useState({ x: 150, y: 250 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [rotation, setRotation] = useState(0);
  const [peekEdge, setPeekEdge] = useState<PeekEdge>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [lightningActive, setLightningActive] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [moveDuration, setMoveDuration] = useState(3.5);
  const [isShiny, setIsShiny] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll reaction states
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize shiny and active states once on mount
  useEffect(() => {
    setIsShiny(Math.random() < 0.1);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pikachu-active');
      if (stored !== null) {
        setIsActive(stored === 'true');
      }
    }
  }, []);

  // Sync state via custom window event
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleToggle = () => {
      setIsActive(prev => {
        const next = !prev;
        localStorage.setItem('pikachu-active', String(next));
        return next;
      });
    };
    window.addEventListener('pikachu-toggle', handleToggle);
    return () => window.removeEventListener('pikachu-toggle', handleToggle);
  }, []);

  const handleToggleActive = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pikachu-toggle'));
    }
  };

  // Refs for tracking position, state and active status to avoid loop/closure issues
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isActiveRef = useRef(isActive);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const isDraggingRef = useRef(false);

  // Keep track of scroll offset and status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Play the actual anime voice recording of Pikachu (from the public/sounds/pikachu/ folder)
  const speakPikaVoice = (voiceKey: string) => {
    if (typeof window === 'undefined') return;
    try {
      // Curated index arrays representing voice classifications from the 97 files
      const pikaShort = [1, 5, 6, 11, 22, 64, 68, 69, 89, 90, 94];
      const pikaMedium = [2, 10, 20, 29, 37, 51, 52, 58, 62, 82, 83, 88];
      const pikaLong = [3, 7, 8, 9, 13, 14, 19, 25, 26, 27, 28, 30, 31, 32, 33, 44, 45, 46, 49, 54, 55, 56, 57, 71, 74, 76, 81];
      const pikaQuestion = [15, 17, 34, 35, 36, 38, 39, 40, 41, 42, 43, 47, 48, 50, 53, 59, 60, 61, 63, 65, 66, 67, 70, 72, 73, 75, 77, 78, 79, 80, 84, 85, 86, 87, 91, 92, 93, 95, 96, 97];

      let candidates: number[];
      switch (voiceKey) {
        case 'pika_short':
        case 'agility':
        case 'chu':
          candidates = pikaShort;
          break;
        case 'pika_pika':
        case 'pi_ka_pi':
        case 'pika_chu':
        case 'pika_pika_pika':
        case 'pika_cha':
        case 'pika_punch':
        case 'electro_web':
          candidates = pikaMedium;
          break;
        case 'pikachuuuu':
        case 'pikaaa_chu':
        case 'electro_ball':
        case 'volt_tackle':
        case 'thunderbolt':
        case 'thunder':
          candidates = pikaLong;
          break;
        case 'pika_question':
        default:
          candidates = pikaQuestion;
          break;
      }

      const randomIndex = candidates[Math.floor(Math.random() * candidates.length)];
      const audioPath = `/sounds/pikachu/Pikachu (${randomIndex}).mp3`;
      const audio = new Audio(audioPath);
      audio.volume = 0.22; // cute, audible volume
      audio.play().catch(e => console.warn("Pikachu voice blocked or failed:", e));
    } catch (err) {
      console.warn("Actual Pikachu voice failed to play:", err);
    }
  };

  const runPikachuAction = (action: { text: string; voiceKey: string; state: PikachuState }) => {
    setState(action.state);
    setBubbleText(action.text);
    speakPikaVoice(action.voiceKey);

    // If it's an electric/thunderbolt move, trigger the lightning paths and screen flashes!
    if (action.state === 'thunderbolt') {
      setLightningActive(true);
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 200);
      
      // Notify page to show spark alerts on calendars
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pikachu-thunderbolt'));
      }

      setTimeout(() => {
        setLightningActive(false);
        setBubbleText(null);
        setState('idle');
      }, 1600);
    } else {
      // Normal action reset after 3 seconds
      setTimeout(() => {
        setBubbleText(null);
        setState('idle');
      }, 3000);
    }
  };

  const walkTo = (targetX: number, targetY: number) => {
    const currentX = positionRef.current.x;
    const currentY = positionRef.current.y;
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const duration = Math.max(1.5, dist / 150);
    setMoveDuration(duration);
    setFacing(targetX > currentX ? 'right' : 'left');
    setRotation(0);
    setPeekEdge(null);
    setState('walk');
    setPosition({ x: targetX, y: targetY });
  };

  const getUIBoxCorners = (): { x: number; y: number }[] => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return [];

    const selectors = [
      '.rounded-2xl',
      '.bg-slate-900\\/40',
      '.bg-slate-900\\/60',
      '[class*="bg-slate-900"]',
      '.border-slate-800\\/80'
    ];
    
    const elements = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];
    const corners: { x: number; y: number }[] = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      // Filter out elements that are too small or not visible
      if (rect.width > 120 && rect.height > 85 && rect.top > 0 && rect.left > 0 && rect.bottom < window.innerHeight + 200) {
        const top = rect.top;
        const left = rect.left;
        const right = rect.right;
        const bottom = rect.bottom;

        // Store viewport coordinates, offset so Pikachu sits nicely at the corners
        corners.push({ x: left - 40, y: top - 50 });      // Top-Left
        corners.push({ x: right - 90, y: top - 50 });     // Top-Right
        corners.push({ x: left - 40, y: bottom - 80 });   // Bottom-Left
        corners.push({ x: right - 90, y: bottom - 80 });  // Bottom-Right
      }
    });

    return corners;
  };

  const walkToRandomTarget = () => {
    if (typeof window === 'undefined') return;

    const corners = getUIBoxCorners();
    
    if (corners.length > 0 && Math.random() < 0.85) {
      // 85% chance of walking to a corner of a card/section
      const target = corners[Math.floor(Math.random() * corners.length)];
      
      // Clamp coordinates to viewport boundaries so he doesn't walk off screen
      const clampedX = Math.max(20, Math.min(window.innerWidth - 150, target.x));
      const clampedViewportY = Math.max(20, Math.min(window.innerHeight - 200, target.y));
      
      // Convert to position.y considering parallax offset
      const targetY = clampedViewportY + scrollY * 0.15;
      walkTo(clampedX, targetY);
    } else {
      // 15% chance (or fallback) of walking to a random spot on the screen
      const nextX = Math.random() * (window.innerWidth - 140) + 20;
      const nextViewportY = Math.random() * (window.innerHeight - 240) + 60;
      const targetY = nextViewportY + scrollY * 0.15;
      walkTo(nextX, targetY);
    }
  };

  const peekAtEdge = () => {
    if (typeof window === 'undefined') return;

    const edges: PeekEdge[] = ['left', 'right', 'top', 'bottom'];
    const selectedEdge = edges[Math.floor(Math.random() * edges.length)];
    setPeekEdge(selectedEdge);

    const currentX = positionRef.current.x;
    const currentY = positionRef.current.y;
    let targetX = currentX;
    let targetY = currentY;

    if (selectedEdge === 'left') {
      targetX = -20;
      targetY = Math.random() * (window.innerHeight - 250) + 100;
      setRotation(90);
      setFacing('right');
    } else if (selectedEdge === 'right') {
      targetX = window.innerWidth - 65;
      targetY = Math.random() * (window.innerHeight - 250) + 100;
      setRotation(-90);
      setFacing('left');
    } else if (selectedEdge === 'top') {
      targetX = Math.random() * (window.innerWidth - 200) + 100;
      targetY = -30;
      setRotation(180);
      setFacing(Math.random() > 0.5 ? 'right' : 'left');
    } else if (selectedEdge === 'bottom') {
      targetX = Math.random() * (window.innerWidth - 200) + 100;
      targetY = window.innerHeight - 55;
      setRotation(0);
      setFacing(Math.random() > 0.5 ? 'right' : 'left');
    }

    setMoveDuration(2.2);
    setState('peek');
    setPosition({ x: targetX, y: targetY });
    
    setTimeout(() => {
      setBubbleText('Pika...? 🤔');
      speakPikaVoice('pika_question');
      setTimeout(() => setBubbleText(null), 1800);
    }, 1500);
  };

  const handlePikachuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    const currentState = stateRef.current;
    if (currentState === 'idle' || currentState === 'walk' || currentState === 'peek') {
      // 15% easter egg trigger shiny state transition + sparks if normal
      if (!isShiny && Math.random() < 0.15) {
        setIsShiny(true);
        setBubbleText('✨ Shiny Sparkle! ✨');
        speakPikaVoice('pika_pika_pika');
        setTimeout(() => setBubbleText(null), 2500);
        return;
      }

      // Play a random move or gesture!
      const allActions = [...PIKA_GESTURES, ...PIKA_MOVES];
      const randomAction = allActions[Math.floor(Math.random() * allActions.length)];
      runPikachuAction(randomAction);
    }
  };

  // Random behavior generator
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startX = window.innerWidth / 2 - 50;
    const startY = window.innerHeight / 2 - 50;
    setPosition({ x: startX, y: startY });

    const interval = setInterval(() => {
      if (!isActiveRef.current) return;
      const currentState = stateRef.current;
      if (currentState === 'thunderbolt') return;

      const r = Math.random();
      
      if (r < 0.40) {
        // Walk somewhere along the corners of the cards in the UI
        walkToRandomTarget();
      } else if (r < 0.60) {
        // Peek/hang on screen edge
        peekAtEdge();
      } else if (r < 0.85) {
        // Run a random gesture
        const randGesture = PIKA_GESTURES[Math.floor(Math.random() * PIKA_GESTURES.length)];
        runPikachuAction(randGesture);
      } else {
        // Run a random move!
        const randMove = PIKA_MOVES[Math.floor(Math.random() * PIKA_MOVES.length)];
        runPikachuAction(randMove);
      }
    }, 16000);

    return () => clearInterval(interval);
  }, []);

  // Listen for Dashboard Events to trigger specific reactions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocusStart = () => {
      if (!isActiveRef.current) return;
      runPikachuAction(PIKA_MOTIVATIONS.you_can_do_it);
    };

    const handleFocusComplete = () => {
      if (!isActiveRef.current) return;
      const isAlt = Math.random() > 0.5;
      runPikachuAction(isAlt ? PIKA_MOTIVATIONS.great_job : PIKA_MOTIVATIONS.mission_completed);
    };

    const handleCheerUp = () => {
      if (!isActiveRef.current) return;
      const isAlt = Math.random() > 0.5;
      runPikachuAction(isAlt ? PIKA_MOTIVATIONS.keep_going : PIKA_MOTIVATIONS.dont_give_up);
    };

    const handleTaskComplete = () => {
      if (!isActiveRef.current) return;
      const isAlt = Math.random() > 0.5;
      runPikachuAction(isAlt ? PIKA_MOTIVATIONS.great_job : PIKA_MOTIVATIONS.mission_completed);
    };

    const handleTaskStart = () => {
      if (!isActiveRef.current) return;
      runPikachuAction(PIKA_MOTIVATIONS.you_can_do_it);
    };

    const handleMotivate = () => {
      if (!isActiveRef.current) return;
      const isAlt = Math.random() > 0.5;
      runPikachuAction(isAlt ? PIKA_MOTIVATIONS.keep_going : PIKA_MOTIVATIONS.dont_give_up);
    };

    window.addEventListener('pikachu-focus-start', handleFocusStart);
    window.addEventListener('pikachu-focus-complete', handleFocusComplete);
    window.addEventListener('pikachu-cheer-up', handleCheerUp);
    window.addEventListener('pikachu-task-complete', handleTaskComplete);
    window.addEventListener('pikachu-task-start', handleTaskStart);
    window.addEventListener('pikachu-motivate', handleMotivate);

    return () => {
      window.removeEventListener('pikachu-focus-start', handleFocusStart);
      window.removeEventListener('pikachu-focus-complete', handleFocusComplete);
      window.removeEventListener('pikachu-cheer-up', handleCheerUp);
      window.removeEventListener('pikachu-task-complete', handleTaskComplete);
      window.removeEventListener('pikachu-task-start', handleTaskStart);
      window.removeEventListener('pikachu-motivate', handleMotivate);
    };
  }, []);

  // Parallax scroll math
  const scrollOffset = scrollY * 0.15;
  const currentY = position.y - scrollOffset;

  // 2D animation variants mimicking retro cartoon squash/stretch and cute bounces
  const innerVariants: Variants = {
    idle: {
      scaleY: [1, 1.05, 1],
      scaleX: [1, 0.98, 1],
      y: 0,
      rotate: 0,
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    walk: {
      rotate: [-5, 5, -5],
      y: [0, -8, 0],
      transition: {
        rotate: { duration: 0.35, repeat: Infinity, ease: "linear" },
        y: { duration: 0.35, repeat: Infinity, ease: "easeOut" }
      }
    },
    hello: {
      y: [0, -40, 0],
      rotate: [0, 360],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    },
    thunderbolt: {
      x: [0, -4, 4, -4, 4, 0],
      y: [0, 4, -4, 4, -4, 0],
      scale: [1, 1.25, 1.15, 1.25, 1],
      transition: {
        x: { duration: 0.1, repeat: Infinity },
        y: { duration: 0.1, repeat: Infinity },
        scale: { duration: 0.2 }
      }
    },
    peek: {
      y: [0, -4, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const colors = isShiny ? {
    light: '#ffedd5', // warm cream shiny highlight
    mid: '#f97316',   // classic shiny orange
    dark: '#ea580c'   // shiny shadow orange
  } : {
    light: '#fffbeb', // warm cream highlight
    mid: '#facc15',   // vintage 97 warm yellow
    dark: '#ca8a04'   // vintage shadows
  };
  const pikaYellow = colors.mid;

  return (
    <>
      {/* Re-summon Pokéball Button when hidden */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleToggleActive}
            className="fixed bottom-6 right-6 z-40 cursor-pointer pointer-events-auto bg-slate-900/90 border border-slate-800 p-2.5 rounded-full shadow-lg shadow-red-500/10 flex items-center justify-center group"
            title="Summon Pikachu"
          >
            <PokeballIcon className="w-8 h-8 group-hover:animate-bounce" />
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-16 bg-slate-900 border border-slate-800 text-xs text-slate-200 px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-md"
            >
              Go, Pikachu! ⚡
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen flash for thunderbolt */}
      <AnimatePresence>
        {isActive && screenFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-yellow-400 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Lightning Paths overlay */}
      {isActive && lightningActive && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <svg className="w-full h-full opacity-70">
            {[...Array(6)].map((_, i) => {
              const startX = position.x + 65;
              const startY = currentY + 65;
              const midX1 = startX + (Math.random() - 0.5) * 250;
              const midY1 = startY + (Math.random() - 0.5) * 250;
              const midX2 = midX1 + (Math.random() - 0.5) * 350;
              const midY2 = midY1 + (Math.random() - 0.5) * 350;
              const endX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : 500;
              const endY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : 500;

              return (
                <g key={i}>
                  <path
                    d={`M ${startX} ${startY} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${endX} ${endY}`}
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 10px #FBBF24) drop-shadow(0 0 20px #D97706)'
                    }}
                  />
                  <path
                    d={`M ${startX} ${startY} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${endX} ${endY}`}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Pikachu Canvas Container */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              x: position.x,
              y: currentY,
              rotate: rotation + (isScrolling ? (facing === 'left' ? -8 : 8) : 0),
              scaleX: (facing === 'left' ? -1 : 1) * (isScrolling ? 0.94 : 1),
              scaleY: isScrolling ? 1.08 : 1,
            }}
            exit={{ opacity: 0, scale: 0.5, y: currentY + 50 }}
            className="fixed pointer-events-auto select-none z-30 cursor-grab active:cursor-grabbing"
            drag
            dragMomentum={false}
            dragConstraints={{
              left: 10,
              right: typeof window !== 'undefined' ? window.innerWidth - 140 : 800,
              top: 10,
              bottom: typeof window !== 'undefined' ? window.innerHeight - 140 : 800
            }}
            onDragStart={() => {
              isDraggingRef.current = true;
              setState('walk');
            }}
            onDragEnd={(event) => {
              const element = event.target as HTMLElement;
              let currentEl: HTMLElement | null = element;
              while (currentEl && !currentEl.classList.contains('fixed')) {
                currentEl = currentEl.parentElement;
              }
              if (currentEl) {
                const rect = currentEl.getBoundingClientRect();
                const newX = rect.left;
                const newViewportY = rect.top;
                const newY = newViewportY + scrollY * 0.15;
                setPosition({ x: newX, y: newY });
              }
              setState('idle');
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 80);
            }}
            transition={{
              x: { ease: 'easeInOut', duration: state === 'walk' || state === 'peek' ? moveDuration : 0.4 },
              y: { ease: 'easeInOut', duration: state === 'walk' || state === 'peek' ? moveDuration : 0.4 },
              rotate: { type: 'spring', stiffness: 200, damping: 15 },
              scaleX: { duration: 0.15 },
              scaleY: { duration: 0.15 }
            }}
          >
            {/* Speech Bubble */}
            <AnimatePresence>
              {bubbleText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bg-slate-900/95 border border-yellow-500/50 text-yellow-400 font-bold px-3 py-1.5 rounded-2xl text-[10px] shadow-lg shadow-yellow-500/10 pointer-events-none z-50 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap"
                  style={{
                    top: rotation === 180 ? '130px' : '-45px',
                    transform: rotation === 180 ? 'translateX(-50%) rotate(180deg)' : 'translateX(-50%)'
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
                  {bubbleText}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2D Sprite Wrapper */}
            <div
              onClick={handlePikachuClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="pointer-events-auto cursor-pointer relative group"
            >
              {/* Recall Pokéball Button (appears on hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive();
                    }}
                    className="absolute -top-10 right-0 bg-slate-900/90 border border-slate-800 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-slate-800 z-50 flex items-center justify-center group/btn"
                    title="Recall Pikachu to Pokéball"
                  >
                    <PokeballIcon className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-300" />
                  </motion.button>
                )}
              </AnimatePresence>

              {state === 'thunderbolt' && (
                <div className="absolute inset-0 bg-yellow-400/40 rounded-full filter blur-xl animate-ping pointer-events-none" />
              )}

              {/* Sparkles overlay if shiny */}
              {isShiny && (
                <div className="absolute -inset-4 pointer-events-none">
                  <motion.div
                    animate={{
                      scale: [0.5, 1, 0.5],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 left-1/4 text-yellow-350 text-sm"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [0.8, 0.4, 0.8],
                      opacity: [0.2, 0.9, 0.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                    className="absolute bottom-2 right-1/4 text-yellow-350 text-xs"
                  >
                    ✨
                  </motion.div>
                </div>
              )}

              {/* Animated 2D Pikachu Hand-Drawn Anime Model */}
              <motion.div
                variants={innerVariants}
                animate={state}
                initial="idle"
                style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={`/images/pikachu/pikachu_${state}.png`}
                  alt={`Pikachu ${state}`}
                  className="w-full h-full object-contain pointer-events-none select-none"
                  style={{
                    filter: isShiny 
                      ? 'hue-rotate(-22deg) saturate(1.3) contrast(1.05) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' 
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    // Thunderbolt specific additional glow/brightness
                    ...(state === 'thunderbolt' ? {
                      filter: `${isShiny ? 'hue-rotate(-22deg) saturate(1.3) contrast(1.05)' : ''} brightness(1.2) drop-shadow(0 0 15px rgba(251, 191, 36, 0.8))`
                    } : {})
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
