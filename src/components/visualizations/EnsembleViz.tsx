import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function EnsembleViz() {
  const [nTrees, setNTrees] = useState(5);
  const [maxDepth, setMaxDepth] = useState(3);
  const [sampleFraction, setSampleFraction] = useState(0.8);

  const treeVotes = useMemo(() => {
    const rng = seededRandom(42);
    const classes = ["Setosa", "Versicolor", "Virginica"];
    const trees = Array.from({ length: nTrees }, (_, i) => {
      const r = seededRandom(i * 7 + 13);
      const bias = [r(), r(), r()];
      const depthBoost = maxDepth / 4;
      bias[Math.floor(r() * 3)] += depthBoost;
      const total = bias.reduce((s, b) => s + b, 0);
      const probs = bias.map(b => b / total);
      const roll = r();
      let cum = 0;
      for (let j = 0; j < 3; j++) {
        cum += probs[j];
        if (roll < cum) return { tree: i + 1, vote: classes[j], confidence: Math.round((probs[j]) * 100) };
      }
      return { tree: i + 1, vote: classes[2], confidence: 33 };
    });
    return trees;
  }, [nTrees, maxDepth]);

  const classCounts = useMemo(() => {
    const counts: Record<string, number> = { Setosa: 0, Versicolor: 0, Virginica: 0 };
    treeVotes.forEach(t => counts[t.vote]++);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      votes: count,
      percentage: Math.round((count / nTrees) * 100),
    }));
  }, [treeVotes, nTrees]);

  const winner = classCounts.reduce((a, b) => a.votes > b.votes ? a : b);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Number of Trees: {nTrees}</span>
          <input type="range" min={3} max={21} step={2} value={nTrees} onChange={e => setNTrees(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Max Depth: {maxDepth}</span>
          <input type="range" min={1} max={6} value={maxDepth} onChange={e => setMaxDepth(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Sample Fraction: {sampleFraction.toFixed(1)}</span>
          <input type="range" min={0.3} max={1} step={0.1} value={sampleFraction} onChange={e => setSampleFraction(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="rounded-lg bg-muted p-4">
        <div className="text-xs text-muted-foreground mb-2">Individual Tree Votes</div>
        <div className="flex flex-wrap gap-2">
          {treeVotes.map((t, i) => (
            <div key={i} className="px-2 py-1 rounded text-xs border border-border bg-card">
              <span className="text-muted-foreground">T{t.tree}:</span>{" "}
              <span className="font-medium text-foreground">{t.vote}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {classCounts.map(c => (
          <div key={c.name} className={`rounded-lg p-3 text-center ${c.name === winner.name ? "bg-primary/10 border border-primary/30" : "bg-muted"}`}>
            <div className="text-xs text-muted-foreground">{c.name}</div>
            <div className="text-lg font-semibold text-foreground">{c.votes} votes</div>
            <div className="text-xs text-muted-foreground">{c.percentage}%</div>
          </div>
        ))}
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={classCounts} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
