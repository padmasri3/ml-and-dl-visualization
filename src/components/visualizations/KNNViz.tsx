import { useState, useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const COLORS = ["hsl(220, 90%, 56%)", "hsl(0, 84%, 60%)", "hsl(142, 76%, 36%)"];

export default function KNNViz() {
  const [k, setK] = useState(5);
  const [queryX, setQueryX] = useState(5);
  const [queryY, setQueryY] = useState(5);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 60 }, () => {
      const cls = Math.floor(rng() * 3);
      const cx = [2.5, 7.5, 5][cls];
      const cy = [3, 3, 7.5][cls];
      return { x: cx + (rng() - 0.5) * 5, y: cy + (rng() - 0.5) * 5, cls };
    });
  }, []);

  const prediction = useMemo(() => {
    const q = { x: queryX, y: queryY };
    const sorted = [...data].sort((a, b) => distance(a, q) - distance(b, q));
    const neighbors = sorted.slice(0, k);
    const votes = [0, 0, 0];
    neighbors.forEach(n => votes[n.cls]++);
    const maxVotes = Math.max(...votes);
    return { cls: votes.indexOf(maxVotes), neighbors, votes };
  }, [data, k, queryX, queryY]);

  const neighborSet = new Set(prediction.neighbors.map((_, i) => {
    const q = { x: queryX, y: queryY };
    const sorted = [...data].sort((a, b) => distance(a, q) - distance(b, q));
    return data.indexOf(sorted[i]);
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">K: {k}</span>
          <input type="range" min={1} max={15} value={k} onChange={e => setK(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Query X: {queryX.toFixed(1)}</span>
          <input type="range" min={0} max={10} step={0.2} value={queryX} onChange={e => setQueryX(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Query Y: {queryY.toFixed(1)}</span>
          <input type="range" min={0} max={10} step={0.2} value={queryY} onChange={e => setQueryY(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {prediction.votes.map((v, i) => (
          <div key={i} className="rounded-lg bg-muted p-3 text-center">
            <div className="text-xs text-muted-foreground">Class {i} votes</div>
            <div className="text-lg font-semibold" style={{ color: COLORS[i] }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden" style={{ height: 350 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Draw connections to neighbors */}
          {prediction.neighbors.map((n, i) => (
            <line key={`line-${i}`} x1={queryX * 10} y1={(10 - queryY) * 10} x2={n.x * 10} y2={(10 - n.y) * 10}
              stroke="hsl(var(--border))" strokeWidth={0.3} strokeDasharray="2 2" />
          ))}
          {/* Data points */}
          {data.map((d, i) => (
            <circle key={i} cx={d.x * 10} cy={(10 - d.y) * 10} r={neighborSet.has(i) ? 2 : 1.2}
              fill={COLORS[d.cls]} opacity={neighborSet.has(i) ? 1 : 0.5}
              stroke={neighborSet.has(i) ? "hsl(var(--foreground))" : "none"} strokeWidth={0.3} />
          ))}
          {/* Query point */}
          <circle cx={queryX * 10} cy={(10 - queryY) * 10} r={2.5}
            fill={COLORS[prediction.cls]} stroke="hsl(var(--foreground))" strokeWidth={0.5} />
          <text x={queryX * 10} y={(10 - queryY) * 10 - 4} textAnchor="middle" fontSize="3" fill="hsl(var(--foreground))">
            Query → Class {prediction.cls}
          </text>
        </svg>
      </div>
    </div>
  );
}
