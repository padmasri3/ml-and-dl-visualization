import { useState, useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function SVMViz() {
  const [margin, setMargin] = useState(1.5);
  const [numPoints, setNumPoints] = useState(40);
  const [noise, setNoise] = useState(0.5);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: numPoints }, () => {
      const cls = rng() > 0.5 ? 1 : -1;
      const x = rng() * 8 + 1;
      const y = x * 0.8 + cls * (margin + rng() * 2) + (rng() - 0.5) * noise * 3;
      return { x, y, cls };
    });
  }, [numPoints, margin, noise]);

  // Simple decision boundary: y = 0.8x + b
  const slope = 0.8;
  const intercept = useMemo(() => {
    const sumY = data.reduce((s, d) => s + d.y, 0) / data.length;
    const sumX = data.reduce((s, d) => s + d.x, 0) / data.length;
    return sumY - slope * sumX;
  }, [data]);

  const supportVectors = useMemo(() => {
    return data.filter(d => {
      const dist = Math.abs(d.y - slope * d.x - intercept) / Math.sqrt(1 + slope * slope);
      return dist < margin * 0.8;
    }).slice(0, 4);
  }, [data, intercept, margin]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Margin Width: {margin.toFixed(1)}</span>
          <input type="range" min={0.5} max={3} step={0.1} value={margin} onChange={e => setMargin(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Points: {numPoints}</span>
          <input type="range" min={20} max={80} value={numPoints} onChange={e => setNumPoints(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Noise: {noise.toFixed(1)}</span>
          <input type="range" min={0} max={2} step={0.1} value={noise} onChange={e => setNoise(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Support Vectors</div>
          <div className="text-lg font-semibold text-primary">{supportVectors.length}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Margin</div>
          <div className="text-lg font-semibold text-foreground">{margin.toFixed(1)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Kernel</div>
          <div className="text-lg font-semibold text-foreground">Linear</div>
        </div>
      </div>
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden" style={{ height: 350 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Margin band */}
          <polygon
            points={`0,${100 - (slope * 0 + intercept + margin) * 5} 100,${100 - (slope * 10 + intercept + margin) * 5} 100,${100 - (slope * 10 + intercept - margin) * 5} 0,${100 - (slope * 0 + intercept - margin) * 5}`}
            fill="hsl(var(--primary))" opacity={0.08}
          />
          {/* Decision boundary */}
          <line x1={0} y1={100 - (intercept) * 5} x2={100} y2={100 - (slope * 10 + intercept) * 5}
            stroke="hsl(var(--primary))" strokeWidth={0.5} />
          {/* Margin lines */}
          <line x1={0} y1={100 - (intercept + margin) * 5} x2={100} y2={100 - (slope * 10 + intercept + margin) * 5}
            stroke="hsl(var(--primary))" strokeWidth={0.3} strokeDasharray="2 2" />
          <line x1={0} y1={100 - (intercept - margin) * 5} x2={100} y2={100 - (slope * 10 + intercept - margin) * 5}
            stroke="hsl(var(--primary))" strokeWidth={0.3} strokeDasharray="2 2" />
          {/* Data points */}
          {data.map((d, i) => {
            const isSV = supportVectors.includes(d);
            return d.cls === 1 ? (
              <circle key={i} cx={d.x * 10} cy={100 - d.y * 5} r={isSV ? 2.5 : 1.5}
                fill="hsl(var(--primary))" opacity={0.7}
                stroke={isSV ? "hsl(var(--foreground))" : "none"} strokeWidth={0.4} />
            ) : (
              <rect key={i} x={d.x * 10 - (isSV ? 2 : 1.2)} y={100 - d.y * 5 - (isSV ? 2 : 1.2)}
                width={isSV ? 4 : 2.4} height={isSV ? 4 : 2.4}
                fill="hsl(var(--destructive))" opacity={0.7}
                stroke={isSV ? "hsl(var(--foreground))" : "none"} strokeWidth={0.4} />
            );
          })}
        </svg>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Class +1</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-destructive" /> Class -1</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border border-foreground" /> Support Vectors</span>
      </div>
    </div>
  );
}
