import { useState, useMemo } from "react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function generateData(n: number, noise: number) {
  const rng = seededRandom(42);
  return Array.from({ length: n }, () => {
    const x = rng() * 4 - 2;
    const y = 0.5 * x * x * x - x * x + 0.3 * x + 1 + (rng() - 0.5) * noise * 2;
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }).sort((a, b) => a.x - b.x);
}

function fitPolynomial(data: { x: number; y: number }[], degree: number) {
  const n = data.length;
  const size = degree + 1;
  const X: number[][] = data.map(p => Array.from({ length: size }, (_, j) => Math.pow(p.x, j)));
  const Xt = Array.from({ length: size }, (_, i) => X.map(row => row[i]));
  const XtX = Xt.map(row => Array.from({ length: size }, (_, j) => row.reduce((s, v, k) => s + v * X[k][j], 0)));
  const XtY = Xt.map(row => row.reduce((s, v, k) => s + v * data[k].y, 0));

  // Gaussian elimination
  const A = XtX.map((row, i) => [...row, XtY[i]]);
  for (let i = 0; i < size; i++) {
    let maxRow = i;
    for (let k = i + 1; k < size; k++) if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    if (Math.abs(A[i][i]) < 1e-10) continue;
    for (let k = i + 1; k < size; k++) {
      const f = A[k][i] / A[i][i];
      for (let j = i; j <= size; j++) A[k][j] -= f * A[i][j];
    }
  }
  const coeffs = new Array(size).fill(0);
  for (let i = size - 1; i >= 0; i--) {
    coeffs[i] = A[i][size];
    for (let j = i + 1; j < size; j++) coeffs[i] -= A[i][j] * coeffs[j];
    coeffs[i] /= A[i][i] || 1;
  }
  return coeffs;
}

export default function PolynomialRegressionViz() {
  const [degree, setDegree] = useState(3);
  const [noise, setNoise] = useState(2);
  const [numPoints, setNumPoints] = useState(60);

  const data = useMemo(() => generateData(numPoints, noise), [numPoints, noise]);
  const coeffs = useMemo(() => fitPolynomial(data, degree), [data, degree]);

  const curveData = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -2; x <= 2; x += 0.05) {
      const y = coeffs.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
      pts.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }
    return pts;
  }, [coeffs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Degree: {degree}</span>
          <input type="range" min={1} max={10} value={degree} onChange={e => setDegree(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Noise: {noise}</span>
          <input type="range" min={0} max={5} step={0.5} value={noise} onChange={e => setNoise(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Points: {numPoints}</span>
          <input type="range" min={20} max={150} value={numPoints} onChange={e => setNumPoints(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Degree</div>
          <div className="text-lg font-semibold text-foreground">{degree}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Parameters</div>
          <div className="text-lg font-semibold text-primary">{degree + 1}</div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" domain={[-2, 2]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Scatter data={data} fill="hsl(var(--primary))" opacity={0.6} r={3} />
            <Line data={curveData} type="monotone" dataKey="y" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
