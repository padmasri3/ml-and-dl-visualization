import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function PCAViz() {
  const [nComponents, setNComponents] = useState(2);
  const [variance, setVariance] = useState(3);
  const [numPoints, setNumPoints] = useState(80);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    const angle = 0.7;
    return Array.from({ length: numPoints }, () => {
      const t = (rng() - 0.5) * variance * 2;
      const noise = (rng() - 0.5) * variance * 0.4;
      return {
        x: Math.round((t * Math.cos(angle) + noise * Math.sin(angle)) * 100) / 100,
        y: Math.round((t * Math.sin(angle) - noise * Math.cos(angle)) * 100) / 100,
        original: true,
      };
    });
  }, [numPoints, variance]);

  const { pc1Dir, pc2Dir, projectedData, varianceExplained } = useMemo(() => {
    const mx = data.reduce((s, d) => s + d.x, 0) / data.length;
    const my = data.reduce((s, d) => s + d.y, 0) / data.length;
    const centered = data.map(d => ({ x: d.x - mx, y: d.y - my }));

    const covXX = centered.reduce((s, d) => s + d.x * d.x, 0) / data.length;
    const covXY = centered.reduce((s, d) => s + d.x * d.y, 0) / data.length;
    const covYY = centered.reduce((s, d) => s + d.y * d.y, 0) / data.length;

    const trace = covXX + covYY;
    const det = covXX * covYY - covXY * covXY;
    const lambda1 = trace / 2 + Math.sqrt(trace * trace / 4 - det);
    const lambda2 = trace / 2 - Math.sqrt(trace * trace / 4 - det);

    let vx = covXY;
    let vy = lambda1 - covXX;
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    vx /= len; vy /= len;

    const projected = centered.map(d => {
      const proj1 = d.x * vx + d.y * vy;
      if (nComponents === 1) {
        return { x: Math.round((proj1 * vx + mx) * 100) / 100, y: Math.round((proj1 * vy + my) * 100) / 100 };
      }
      return { x: Math.round((d.x + mx) * 100) / 100, y: Math.round((d.y + my) * 100) / 100 };
    });

    return {
      pc1Dir: { x: vx, y: vy },
      pc2Dir: { x: -vy, y: vx },
      projectedData: projected,
      varianceExplained: [lambda1 / (lambda1 + lambda2), lambda2 / (lambda1 + lambda2)],
    };
  }, [data, nComponents]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Components: {nComponents}</span>
          <input type="range" min={1} max={2} value={nComponents} onChange={e => setNComponents(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Variance: {variance}</span>
          <input type="range" min={1} max={6} step={0.5} value={variance} onChange={e => setVariance(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Points: {numPoints}</span>
          <input type="range" min={30} max={150} value={numPoints} onChange={e => setNumPoints(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">PC1 Variance</div>
          <div className="text-lg font-semibold text-primary">{(varianceExplained[0] * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">PC2 Variance</div>
          <div className="text-lg font-semibold text-foreground">{(varianceExplained[1] * 100).toFixed(1)}%</div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="number" dataKey="y" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Scatter data={data} fill="hsl(var(--muted-foreground))" opacity={0.3} r={2} name="Original" />
            <Scatter data={projectedData} fill="hsl(var(--primary))" opacity={0.8} r={3} name="Projected" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
