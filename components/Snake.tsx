"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";

// Terminal daxilində Snake oyunu — ox düymələri / WASD, mobildə sürüşdürmə
const COLS = 24;
const ROWS = 14;
const START_SPEED = 120; // ms / addım
const MIN_SPEED = 60;
const BEST_KEY = "snake-best";

type P = { x: number; y: number };
type Status = "ready" | "playing" | "paused" | "over";

const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

function freeCell(snake: P[]): P {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: P[] = [];
  for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) if (!taken.has(`${x},${y}`)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)];
}

function initialSnake(): P[] {
  const y = Math.floor(ROWS / 2);
  return [{ x: 6, y }, { x: 5, y }, { x: 4, y }];
}

export default function Snake({ onExit }: { onExit: (score: number, best: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef({
    snake: initialSnake(),
    dir: { x: 1, y: 0 } as P,
    queue: [] as P[],
    food: { x: 16, y: Math.floor(ROWS / 2) } as P,
    speed: START_SPEED,
    eatenAt: -1,
  });
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const statusRef = useRef(status);
  statusRef.current = status;
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const [touchUI, setTouchUI] = useState(false);

  useEffect(() => {
    setTouchUI(window.matchMedia("(pointer: coarse)").matches);
    bestRef.current = readBest();
    setBest(bestRef.current);
    wrapRef.current?.focus();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const board = canvas?.parentElement;
    if (!canvas || !board) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cell = Math.max(4, Math.floor(Math.min(board.clientWidth / COLS, board.clientHeight / ROWS)));
    const w = cell * COLS, h = cell * ROWS;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    const c = canvas.getContext("2d")!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    // Nöqtəli fon şəbəkəsi
    c.fillStyle = "rgba(255,255,255,0.06)";
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) c.fillRect(x * cell + cell / 2 - 1, y * cell + cell / 2 - 1, 2, 2);

    const { snake, food, eatenAt } = game.current;

    // Yem — yüngülcə "nəfəs alır"
    const pulse = 1 + Math.sin(performance.now() / 180) * 0.08;
    c.save();
    c.shadowColor = "#ff6b8b";
    c.shadowBlur = 14;
    c.fillStyle = "#ff6b8b";
    c.beginPath();
    c.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, (cell / 2.8) * pulse, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // İlan — başdan quyruğa yaşıldan mavi rəngə keçir
    snake.forEach((p, i) => {
      const t = i / Math.max(snake.length - 1, 1);
      const r = Math.round(0 + (126 - 0) * t), g = Math.round(255 + (224 - 255) * t), b = Math.round(163 + (255 - 163) * t);
      const pad = i === 0 ? 1 : 2 + t * 2;
      c.fillStyle = `rgb(${r},${g},${b})`;
      if (i === 0) {
        c.shadowColor = "#00ffa3";
        c.shadowBlur = 12;
      }
      c.beginPath();
      c.roundRect(p.x * cell + pad, p.y * cell + pad, cell - pad * 2, cell - pad * 2, cell / 4);
      c.fill();
      c.shadowBlur = 0;
    });

    // Yem yeyiləndə başın ətrafında qısa dalğa
    if (eatenAt >= 0) {
      const age = (performance.now() - eatenAt) / 300;
      if (age < 1) {
        const head = snake[0];
        c.strokeStyle = `rgba(0,255,163,${1 - age})`;
        c.lineWidth = 2;
        c.beginPath();
        c.arc(head.x * cell + cell / 2, head.y * cell + cell / 2, cell * (0.6 + age * 1.4), 0, Math.PI * 2);
        c.stroke();
      }
    }
  }, []);

  // Çəkiliş dövrü
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  const reset = () => {
    game.current = { snake: initialSnake(), dir: { x: 1, y: 0 }, queue: [], food: { x: 16, y: Math.floor(ROWS / 2) }, speed: START_SPEED, eatenAt: -1 };
    scoreRef.current = 0;
    setScore(0);
  };

  const step = useCallback(() => {
    const g = game.current;
    const next = g.queue.shift();
    if (next) g.dir = next;
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    const ate = head.x === g.food.x && head.y === g.food.y;
    const body = ate ? g.snake : g.snake.slice(0, -1);

    const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
    if (hitWall || body.some((p) => p.x === head.x && p.y === head.y)) {
      play("gameover");
      if (scoreRef.current > bestRef.current) {
        bestRef.current = scoreRef.current;
        setBest(bestRef.current);
        try {
          localStorage.setItem(BEST_KEY, String(bestRef.current));
        } catch {}
      }
      setStatus("over");
      return false;
    }

    g.snake = [head, ...body];
    if (ate) {
      play("eat");
      scoreRef.current += 10;
      setScore(scoreRef.current);
      g.eatenAt = performance.now();
      g.speed = Math.max(MIN_SPEED, g.speed - 3);
      g.food = freeCell(g.snake);
    }
    return true;
  }, []);

  // Oyun addımları — sürət hər yemdən sonra artır
  useEffect(() => {
    if (status !== "playing") return;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (step()) id = setTimeout(tick, game.current.speed);
    };
    id = setTimeout(tick, game.current.speed);
    return () => clearTimeout(id);
  }, [status, step]);

  const turn = (d: P) => {
    const g = game.current;
    const last = g.queue[g.queue.length - 1] ?? g.dir;
    // Geriyə, öz bədəninə dönmək olmaz
    if (d.x === -last.x && d.y === -last.y) return;
    if (d.x === last.x && d.y === last.y) return;
    if (g.queue.length < 3) g.queue.push(d);
  };

  const start = () => {
    if (statusRef.current === "over") reset();
    play("enter");
    setStatus("playing");
  };

  const quit = () => onExit(scoreRef.current, bestRef.current);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const s = statusRef.current;
    if (key === "Escape" || key === "q") {
      e.preventDefault();
      e.stopPropagation(); // terminalın özü bağlanmasın
      quit();
    } else if (DIRS[key]) {
      e.preventDefault();
      if (s === "ready" || s === "over") start();
      if (s !== "paused") turn(DIRS[key]);
    } else if (key === " " || key === "p" || key === "Enter") {
      e.preventDefault();
      if (s === "playing") setStatus("paused");
      else start();
    }
  };

  // Mobil: sürüşdürmə ilə idarə
  const touch = useRef<P | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t0 = touch.current;
    if (!t0) return;
    const dx = e.changedTouches[0].clientX - t0.x, dy = e.changedTouches[0].clientY - t0.y;
    touch.current = null;
    const s = statusRef.current;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
      if (s !== "playing") start();
      return;
    }
    if (s === "ready" || s === "over") start();
    turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  const message: Record<Status, string | null> = {
    ready: touchUI ? "Swipe to start 👆" : "Press an arrow key / WASD to start",
    playing: null,
    paused: touchUI ? "Paused — tap to continue" : "Paused — press space to continue",
    over: `Game over · score ${score}${score > 0 && score >= best ? " · new best! 🏆" : ""}`,
  };

  return (
    <div
      ref={wrapRef}
      className="snake"
      tabIndex={0}
      role="application"
      aria-label="Snake game. Use arrow keys to move, space to pause, Q to quit."
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        e.stopPropagation();
        wrapRef.current?.focus();
      }}
    >
      <div className="snake-hud">
        <span>🐍 snake</span>
        <span>score <b>{score}</b></span>
        <span>best <b>{Math.max(best, score)}</b></span>
        <button type="button" onClick={quit} data-hover>quit (q)</button>
      </div>
      <div className="snake-board">
        <canvas ref={canvasRef} />
        {message[status] && (
          <div className="snake-msg" aria-live="polite">
            <p>{message[status]}</p>
            {status === "over" && <small>{touchUI ? "tap — play again" : "space — play again · q — quit"}</small>}
          </div>
        )}
      </div>
    </div>
  );
}
