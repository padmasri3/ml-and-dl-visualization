import { useState, useMemo } from "react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

interface Props {
  mode: "ridge" | "lasso" | "elasticnet";
}

export default function RegularizationViz({ mode }: Props) {
  const [alpha, setAlpha] = useState(1);
  const [l1Ratio, setL1Ratio] = useState(0.5);
  const [numFeatures, setNumFeatures] = useState(8);

  const trueCoeffs = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: numFeatures }, () => (rng() - 0.5) * 6);
  }, [numFeatures]);

  const regularizedCoeffs = useMemo(() => {
    return trueCoeffs.map(c => {
      if (mode === "ridge") {
        return c / (1 + alpha);
      } else if (mode === "lasso") {
        const sign = Math.sign(c);
        return sign * Math.max(0, Math.abs(c) - alpha * 0.5);
      } else {
        const l1 = l1Ratio;
        const l2 = 1 - l1Ratio;
        const shrunk = c / (1 + alpha * l2);
        const sign = Math.sign(shrunk);
        return sign * Math.max(0, Math.abs(shrunk) - alpha * l1 * 0.5);
      }
    });
  }, [trueCoeffs, alpha, mode, l1Ratio]);

  const chartData = trueCoeffs.map((tc, i) => ({
    name: `β${i + 1}`,
    original: Math.round(tc * 100) / 100,
    regularized: Math.round(regularizedCoeffs[i] * 100) / 100,
  }));

  const sparsity = regularizedCoeffs.filter(c => Math.abs(c) < 0.01).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Alpha (λ): {alpha.toFixed(1)}</span>
          <input type="range" min={0} max={5} step={0.1} value={alpha} onChange={e => setAlpha(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Features: {numFeatures}</span>
          <input type="range" min={4} max={15} value={numFeatures} onChange={e => setNumFeatures(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        {mode === "elasticnet" && (
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">L1 Ratio: {l1Ratio.toFixed(2)}</span>
            <input type="range" min={0} max={1} step={0.05} value={l1Ratio} onChange={e => setL1Ratio(+e.target.value)} className="w-full accent-primary h-1.5" />
          </label>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Penalty</div>
          <div className="text-lg font-semibold text-foreground">{mode === "ridge" ? "L2" : mode === "lasso" ? "L1" : "L1+L2"}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Sparsity</div>
          <div className="text-lg font-semibold text-primary">{sparsity}/{numFeatures}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Alpha</div>
          <div className="text-lg font-semibold text-foreground">{alpha.toFixed(1)}</div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Bar dataKey="original" fill="hsl(var(--muted-foreground))" opacity={0.4} name="Original" />
            <Bar dataKey="regularized" fill="hsl(var(--primary))" name="Regularized" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
