import { useState, useMemo } from "react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

export default function LogisticRegressionViz() {
  const [threshold, setThreshold] = useState(0.5);
  const [separation, setSeparation] = useState(3);
  const [numPoints, setNumPoints] = useState(60);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: numPoints }, () => {
      const cls = rng() > 0.5 ? 1 : 0;
      const x = (cls === 1 ? separation / 2 : -separation / 2) + (rng() - 0.5) * 4;
      return { x: Math.round(x * 100) / 100, cls, prob: Math.round(sigmoid(x) * 1000) / 1000 };
    }).sort((a, b) => a.x - b.x);
  }, [numPoints, separation]);

  const sigmoidCurve = useMemo(() => {
    const pts: { x: number; prob: number }[] = [];
    for (let x = -6; x <= 6; x += 0.2) {
      pts.push({ x: Math.round(x * 100) / 100, prob: Math.round(sigmoid(x) * 1000) / 1000 });
    }
    return pts;
  }, []);

  const accuracy = useMemo(() => {
    const correct = data.filter(d => (d.prob >= threshold ? 1 : 0) === d.cls).length;
    return correct / data.length;
  }, [data, threshold]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Threshold: {threshold.toFixed(2)}</span>
          <input type="range" min={0.1} max={0.9} step={0.05} value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Class Separation: {separation}</span>
          <input type="range" min={1} max={6} step={0.5} value={separation} onChange={e => setSeparation(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Points: {numPoints}</span>
          <input type="range" min={20} max={120} value={numPoints} onChange={e => setNumPoints(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Threshold</div>
          <div className="text-lg font-semibold text-foreground">{threshold.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Accuracy</div>
          <div className="text-lg font-semibold text-primary">{(accuracy * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Decision Boundary</div>
          <div className="text-lg font-semibold text-foreground">x = 0</div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" domain={[-6, 6]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "P(y=1)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Line data={sigmoidCurve} type="monotone" dataKey="prob" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} name="Sigmoid" />
            <Scatter data={data} dataKey="prob" fill="hsl(var(--primary))">
              {data.map((d, i) => (
                <Cell key={i} fill={d.cls === 1 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} opacity={0.7} />
              ))}
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
