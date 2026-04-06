import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function SemiSupervisedViz() {
  const [labeledRatio, setLabeledRatio] = useState(0.15);
  const [propagationSteps, setPropagationSteps] = useState(3);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    const points: { x: number; y: number; trueClass: number; labeled: boolean; predictedClass: number }[] = [];
    for (let i = 0; i < 80; i++) {
      const cls = rng() > 0.5 ? 0 : 1;
      const cx = cls === 0 ? 3 : 7;
      const cy = cls === 0 ? 7 : 3;
      points.push({
        x: cx + (rng() - 0.5) * 5,
        y: cy + (rng() - 0.5) * 5,
        trueClass: cls,
        labeled: rng() < labeledRatio,
        predictedClass: -1,
      });
    }
    // Label propagation
    for (let step = 0; step < propagationSteps; step++) {
      points.forEach((p, i) => {
        if (p.labeled) { p.predictedClass = p.trueClass; return; }
        const dists = points.filter(q => q.labeled || q.predictedClass >= 0)
          .map(q => ({ cls: q.predictedClass >= 0 ? q.predictedClass : q.trueClass, d: Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 5);
        if (dists.length > 0) {
          const votes = [0, 0];
          dists.forEach(d => votes[d.cls]++);
          p.predictedClass = votes[0] > votes[1] ? 0 : 1;
        }
      });
    }
    return points;
  }, [labeledRatio, propagationSteps]);

  const accuracy = useMemo(() => {
    const predicted = data.filter(d => d.predictedClass >= 0);
    if (predicted.length === 0) return 0;
    return predicted.filter(d => d.predictedClass === d.trueClass).length / predicted.length;
  }, [data]);

  const labeled = data.filter(d => d.labeled).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Labeled Ratio: {(labeledRatio * 100).toFixed(0)}%</span>
          <input type="range" min={0.05} max={0.5} step={0.05} value={labeledRatio} onChange={e => setLabeledRatio(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Propagation Steps: {propagationSteps}</span>
          <input type="range" min={1} max={10} value={propagationSteps} onChange={e => setPropagationSteps(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Labeled</div>
          <div className="text-lg font-semibold text-primary">{labeled}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Unlabeled</div>
          <div className="text-lg font-semibold text-foreground">{data.length - labeled}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Accuracy</div>
          <div className="text-lg font-semibold text-primary">{(accuracy * 100).toFixed(1)}%</div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="number" dataKey="y" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Scatter data={data}>
              {data.map((d, i) => (
                <Cell key={i}
                  fill={d.predictedClass === 0 ? "hsl(var(--primary))" : d.predictedClass === 1 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}
                  opacity={d.labeled ? 1 : 0.5}
                  r={d.labeled ? 5 : 3}
                  stroke={d.labeled ? "hsl(var(--foreground))" : "none"}
                  strokeWidth={d.labeled ? 1 : 0}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary border border-foreground" /> Labeled</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary/50" /> Propagated</span>
      </div>
    </div>
  );
}
