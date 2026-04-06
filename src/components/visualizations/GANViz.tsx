import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GANViz() {
  const [epochs, setEpochs] = useState(50);
  const [learningRate, setLearningRate] = useState(0.001);
  const [latentDim, setLatentDim] = useState(100);

  const trainingData = useMemo(() => {
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    return Array.from({ length: epochs }, (_, i) => {
      const progress = i / epochs;
      const genLoss = 2.5 * Math.exp(-progress * 2.5 * learningRate * 1000) + 0.3 + rng() * 0.2;
      const discLoss = 0.7 - 0.3 * progress * learningRate * 500 + rng() * 0.15 + 0.2;
      return {
        epoch: i + 1,
        generatorLoss: Math.round(Math.max(0.1, genLoss) * 100) / 100,
        discriminatorLoss: Math.round(Math.max(0.1, Math.min(1.5, discLoss)) * 100) / 100,
      };
    });
  }, [epochs, learningRate]);

  const equilibrium = useMemo(() => {
    const last = trainingData[trainingData.length - 1];
    return Math.abs(last.generatorLoss - last.discriminatorLoss) < 0.3;
  }, [trainingData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Epochs: {epochs}</span>
          <input type="range" min={20} max={200} step={10} value={epochs} onChange={e => setEpochs(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Learning Rate: {learningRate.toFixed(4)}</span>
          <input type="range" min={0.0001} max={0.01} step={0.0001} value={learningRate} onChange={e => setLearningRate(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Latent Dim: {latentDim}</span>
          <input type="range" min={10} max={256} step={10} value={latentDim} onChange={e => setLatentDim(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">G Loss</div>
          <div className="text-lg font-semibold text-primary">{trainingData[trainingData.length - 1]?.generatorLoss.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">D Loss</div>
          <div className="text-lg font-semibold text-accent">{trainingData[trainingData.length - 1]?.discriminatorLoss.toFixed(2)}</div>
        </div>
        <div className={`rounded-lg p-3 text-center ${equilibrium ? "bg-success/10" : "bg-warning/10"}`}>
          <div className="text-xs text-muted-foreground">Status</div>
          <div className={`text-lg font-semibold ${equilibrium ? "text-success" : "text-warning"}`}>
            {equilibrium ? "Equilibrium" : "Training"}
          </div>
        </div>
      </div>
      {/* GAN Architecture */}
      <div className="relative bg-muted/30 rounded-lg border border-border p-4" style={{ minHeight: 100 }}>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex flex-col items-center gap-1">
            <div className="px-3 py-2 rounded-lg bg-accent/20 border border-accent/30 font-medium text-accent">Noise z</div>
            <div className="text-[10px] text-muted-foreground">dim={latentDim}</div>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-col items-center gap-1">
            <div className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 font-medium text-primary">Generator</div>
            <div className="text-[10px] text-muted-foreground">Produces fakes</div>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-col items-center gap-1">
            <div className="px-3 py-2 rounded-lg bg-warning/20 border border-warning/30 font-medium text-warning">Discriminator</div>
            <div className="text-[10px] text-muted-foreground">Real vs Fake</div>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-col items-center gap-1">
            <div className="px-3 py-2 rounded-lg bg-success/20 border border-success/30 font-medium text-success">Loss</div>
            <div className="text-[10px] text-muted-foreground">Feedback</div>
          </div>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trainingData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="epoch" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Line dataKey="generatorLoss" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Generator" />
            <Line dataKey="discriminatorLoss" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Discriminator" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
