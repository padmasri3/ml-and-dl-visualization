import { useState, useMemo, useCallback, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["hsl(220, 90%, 56%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(260, 80%, 62%)"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateBlobs(nPerCluster: number, k: number, spread: number) {
  const rng = seededRandom(42);
  const centers = Array.from({ length: k }, () => ({
    cx: rng() * 16 - 8,
    cy: rng() * 16 - 8,
  }));
  const points: { x: number; y: number; cluster: number }[] = [];
  centers.forEach((c, ci) => {
    for (let i = 0; i < nPerCluster; i++) {
      points.push({
        x: c.cx + (rng() - 0.5) * spread * 2,
        y: c.cy + (rng() - 0.5) * spread * 2,
        cluster: ci,
      });
    }
  });
  return { points, trueCenters: centers };
}

function runKMeans(points: { x: number; y: number }[], k: number, maxIter = 20) {
  const rng = seededRandom(123);
  let centroids = Array.from({ length: k }, () => ({
    x: points[Math.floor(rng() * points.length)].x,
    y: points[Math.floor(rng() * points.length)].y,
  }));
  let labels = new Array(points.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    labels = points.map((p) => {
      let minD = Infinity, minI = 0;
      centroids.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (d < minD) { minD = d; minI = i; }
      });
      return minI;
    });
    const newCentroids = centroids.map((_, ci) => {
      const assigned = points.filter((_, i) => labels[i] === ci);
      if (assigned.length === 0) return centroids[ci];
      return {
        x: assigned.reduce((s, p) => s + p.x, 0) / assigned.length,
        y: assigned.reduce((s, p) => s + p.y, 0) / assigned.length,
      };
    });
    centroids = newCentroids;
  }
  return { labels, centroids };
}

export default function KMeansViz() {
  const [k, setK] = useState(3);
  const [spread, setSpread] = useState(2);
  const [nPoints, setNPoints] = useState(30);

  const { points } = useMemo(() => generateBlobs(nPoints, k, spread), [nPoints, k, spread]);
  const { labels, centroids } = useMemo(() => runKMeans(points, k), [points, k]);

  const scatterData = points.map((p, i) => ({ ...p, cluster: labels[i] }));
  const centroidData = centroids.map((c, i) => ({ x: c.x, y: c.y, cluster: i }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Clusters (K): {k}</span>
          <input type="range" min={2} max={5} value={k} onChange={(e) => setK(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Spread: {spread}</span>
          <input type="range" min={0.5} max={5} step={0.5} value={spread} onChange={(e) => setSpread(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Points/Cluster: {nPoints}</span>
          <input type="range" min={10} max={80} value={nPoints} onChange={(e) => setNPoints(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="number" dataKey="y" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Scatter data={scatterData} shape="circle">
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={COLORS[entry.cluster % COLORS.length]} opacity={0.7} r={4} />
              ))}
            </Scatter>
            <Scatter data={centroidData} shape="cross" fill="hsl(var(--foreground))">
              {centroidData.map((_, i) => (
                <Cell key={`c-${i}`} r={8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
