import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AutoencoderViz() {
  const [bottleneck, setBottleneck] = useState(3);
  const [inputDim, setInputDim] = useState(8);
  const [noiseLevel, setNoiseLevel] = useState(0.2);

  const data = useMemo(() => {
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    const original = Array.from({ length: inputDim }, (_, i) => ({
      dim: `D${i + 1}`,
      value: Math.round((Math.sin(i * 0.7) * 0.5 + 0.5) * 100) / 100,
    }));
    const compressed = original.slice(0, bottleneck).map((d, i) => ({
      ...d,
      dim: `Z${i + 1}`,
      value: Math.round(d.value * (0.8 + rng() * 0.4) * 100) / 100,
    }));
    const reconstructed = original.map(d => ({
      ...d,
      reconstructed: Math.round((d.value + (rng() - 0.5) * noiseLevel * 2) * 100) / 100,
    }));
    return { original, compressed, reconstructed };
  }, [inputDim, bottleneck, noiseLevel]);

  const mse = useMemo(() => {
    const sum = data.reconstructed.reduce((s, d) => s + (d.value - d.reconstructed) ** 2, 0);
    return sum / data.reconstructed.length;
  }, [data]);

  const structure = [inputDim, Math.ceil((inputDim + bottleneck) / 2), bottleneck, Math.ceil((inputDim + bottleneck) / 2), inputDim];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Input Dimensions: {inputDim}</span>
          <input type="range" min={4} max={12} value={inputDim} onChange={e => setInputDim(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Bottleneck Size: {bottleneck}</span>
          <input type="range" min={1} max={Math.max(2, inputDim - 2)} value={bottleneck} onChange={e => setBottleneck(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Noise: {noiseLevel.toFixed(2)}</span>
          <input type="range" min={0} max={0.5} step={0.05} value={noiseLevel} onChange={e => setNoiseLevel(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Compression</div>
          <div className="text-lg font-semibold text-primary">{((1 - bottleneck / inputDim) * 100).toFixed(0)}%</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">MSE</div>
          <div className="text-lg font-semibold text-foreground">{mse.toFixed(4)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Bottleneck</div>
          <div className="text-lg font-semibold text-foreground">{bottleneck}</div>
        </div>
      </div>
      {/* Architecture visualization */}
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden p-4" style={{ minHeight: 160 }}>
        <div className="flex items-end justify-around h-full gap-1">
          {structure.map((size, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`rounded transition-all ${i === 2 ? "bg-accent/40 border-accent" : i < 2 ? "bg-primary/20 border-primary/30" : "bg-success/20 border-success/30"} border`}
                style={{ width: 24, height: size * 12 }}
              />
              <span className="text-[9px] text-muted-foreground">
                {i === 0 ? "Input" : i === 2 ? "Latent" : i === structure.length - 1 ? "Output" : i < 2 ? "Enc" : "Dec"}
              </span>
              <span className="text-[9px] font-medium text-foreground">{size}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.reconstructed} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="dim" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" opacity={0.5} name="Original" />
            <Bar dataKey="reconstructed" fill="hsl(var(--accent))" name="Reconstructed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
