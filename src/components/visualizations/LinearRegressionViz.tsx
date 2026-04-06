import { useState, useMemo, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

function generateData(n: number, slope: number, intercept: number, noise: number, seed: number) {
  const points: { x: number; y: number }[] = [];
  let rng = seed;
  const nextRand = () => {
    rng = (rng * 16807) % 2147483647;
    return (rng - 1) / 2147483646;
  };
  for (let i = 0; i < n; i++) {
    const x = nextRand() * 10;
    const y = slope * x + intercept + (nextRand() - 0.5) * noise * 2;
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

function fitLine(points: { x: number; y: number }[]) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function LinearRegressionViz() {
  const [numPoints, setNumPoints] = useState(50);
  const [noiseLevel, setNoiseLevel] = useState(3);
  const [trueSlope, setTrueSlope] = useState(2.5);

  const data = useMemo(() => generateData(numPoints, trueSlope, 5, noiseLevel, 42), [numPoints, noiseLevel, trueSlope]);
  const fit = useMemo(() => fitLine(data), [data]);
  const lineData = useMemo(() => {
    return [
      { x: 0, y: fit.intercept },
      { x: 10, y: fit.slope * 10 + fit.intercept },
    ];
  }, [fit]);

  const r2 = useMemo(() => {
    const meanY = data.reduce((s, p) => s + p.y, 0) / data.length;
    const ssTot = data.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const ssRes = data.reduce((s, p) => s + (p.y - (fit.slope * p.x + fit.intercept)) ** 2, 0);
    return 1 - ssRes / ssTot;
  }, [data, fit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Data Points: {numPoints}</span>
          <input type="range" min={10} max={200} value={numPoints} onChange={(e) => setNumPoints(+e.target.value)}
            className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Noise: {noiseLevel}</span>
          <input type="range" min={0} max={10} step={0.5} value={noiseLevel} onChange={(e) => setNoiseLevel(+e.target.value)}
            className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">True Slope: {trueSlope}</span>
          <input type="range" min={-5} max={5} step={0.1} value={trueSlope} onChange={(e) => setTrueSlope(+e.target.value)}
            className="w-full accent-primary h-1.5" />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Fitted Slope</div>
          <div className="text-lg font-semibold text-foreground">{fit.slope.toFixed(3)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Intercept</div>
          <div className="text-lg font-semibold text-foreground">{fit.intercept.toFixed(3)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">R² Score</div>
          <div className="text-lg font-semibold text-primary">{r2.toFixed(4)}</div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" domain={[0, 10]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Scatter data={data} fill="hsl(var(--primary))" opacity={0.6} r={3} />
            <Line data={lineData} type="linear" dataKey="y" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
