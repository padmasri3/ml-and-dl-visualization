import { useState, useMemo } from "react";

interface Neuron { x: number; y: number; value: number; }

export default function NeuralNetViz() {
  const [hiddenLayers, setHiddenLayers] = useState(2);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(4);
  const [activation, setActivation] = useState<"relu" | "sigmoid" | "tanh">("relu");

  const layers = useMemo(() => {
    const structure = [3, ...Array(hiddenLayers).fill(neuronsPerLayer), 2];
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    
    const totalLayers = structure.length;
    return structure.map((size, li) => {
      const x = (li + 0.5) / totalLayers * 100;
      return Array.from({ length: size }, (_, ni) => {
        const y = (ni + 1) / (size + 1) * 100;
        let val = rng() * 2 - 1;
        if (activation === "relu") val = Math.max(0, val);
        else if (activation === "sigmoid") val = 1 / (1 + Math.exp(-val * 3));
        else val = Math.tanh(val * 2);
        return { x, y, value: val };
      });
    });
  }, [hiddenLayers, neuronsPerLayer, activation]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Hidden Layers: {hiddenLayers}</span>
          <input type="range" min={1} max={4} value={hiddenLayers} onChange={e => setHiddenLayers(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Neurons/Layer: {neuronsPerLayer}</span>
          <input type="range" min={2} max={8} value={neuronsPerLayer} onChange={e => setNeuronsPerLayer(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Activation</span>
          <select value={activation} onChange={e => setActivation(e.target.value as typeof activation)}
            className="w-full py-1 px-2 text-sm bg-muted border border-border rounded-md text-foreground">
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Total Params</div>
          <div className="text-lg font-semibold text-primary">
            {(() => {
              const s = [3, ...Array(hiddenLayers).fill(neuronsPerLayer), 2];
              return s.reduce((sum, n, i) => i === 0 ? sum : sum + s[i - 1] * n + n, 0);
            })()}
          </div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Layers</div>
          <div className="text-lg font-semibold text-foreground">{hiddenLayers + 2}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Activation</div>
          <div className="text-lg font-semibold text-foreground">{activation}</div>
        </div>
      </div>
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden" style={{ height: 350 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Connections */}
          {layers.map((layer, li) => {
            if (li === 0) return null;
            const prevLayer = layers[li - 1];
            return prevLayer.map((pn, pi) =>
              layer.map((cn, ci) => (
                <line key={`${li}-${pi}-${ci}`}
                  x1={pn.x} y1={pn.y} x2={cn.x} y2={cn.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth={0.15 + Math.abs(cn.value) * 0.3}
                  opacity={0.15 + Math.abs(cn.value) * 0.3}
                />
              ))
            );
          })}
          {/* Neurons */}
          {layers.map((layer, li) =>
            layer.map((n, ni) => (
              <g key={`n-${li}-${ni}`}>
                <circle cx={n.x} cy={n.y} r={2.5}
                  fill={n.value > 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  opacity={0.3 + Math.abs(n.value) * 0.7}
                  stroke="hsl(var(--border))" strokeWidth={0.3}
                />
                <text x={n.x} y={n.y + 0.5} textAnchor="middle" fontSize="1.8" fill="hsl(var(--foreground))" dominantBaseline="middle">
                  {n.value.toFixed(1)}
                </text>
              </g>
            ))
          )}
          {/* Layer labels */}
          {layers.map((layer, li) => (
            <text key={`label-${li}`} x={layer[0].x} y={4} textAnchor="middle" fontSize="2.5" fill="hsl(var(--muted-foreground))">
              {li === 0 ? "Input" : li === layers.length - 1 ? "Output" : `H${li}`}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
