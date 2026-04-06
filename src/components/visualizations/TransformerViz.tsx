import { useState, useMemo } from "react";

export default function TransformerViz() {
  const [numHeads, setNumHeads] = useState(4);
  const [seqLength, setSeqLength] = useState(6);
  const [temperature, setTemperature] = useState(1);

  const tokens = ["The", "cat", "sat", "on", "the", "mat", "and", "slept"].slice(0, seqLength);

  const attentionMatrix = useMemo(() => {
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    const n = tokens.length;
    const matrix: number[][] = Array.from({ length: n }, (_, i) => {
      const row = Array.from({ length: n }, (_, j) => {
        let score = rng() * 2 - 1;
        if (i === j) score += 1.5; // self-attention bias
        if (Math.abs(i - j) <= 1) score += 0.8; // locality bias
        return score / temperature;
      });
      const maxScore = Math.max(...row);
      const expRow = row.map(s => Math.exp(s - maxScore));
      const sum = expRow.reduce((a, b) => a + b, 0);
      return expRow.map(e => e / sum);
    });
    return matrix;
  }, [tokens.length, temperature]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Attention Heads: {numHeads}</span>
          <input type="range" min={1} max={8} value={numHeads} onChange={e => setNumHeads(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Sequence Length: {seqLength}</span>
          <input type="range" min={3} max={8} value={seqLength} onChange={e => setSeqLength(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Temperature: {temperature.toFixed(1)}</span>
          <input type="range" min={0.1} max={3} step={0.1} value={temperature} onChange={e => setTemperature(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">d_model</div>
          <div className="text-lg font-semibold text-primary">{numHeads * 64}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Heads</div>
          <div className="text-lg font-semibold text-foreground">{numHeads}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">d_k</div>
          <div className="text-lg font-semibold text-foreground">64</div>
        </div>
      </div>
      {/* Attention heatmap */}
      <div className="flex justify-center">
        <div className="inline-block">
          <div className="flex">
            <div className="w-12" />
            {tokens.map((t, i) => (
              <div key={i} className="w-12 text-center text-[10px] text-muted-foreground font-medium pb-1 truncate">{t}</div>
            ))}
          </div>
          {attentionMatrix.map((row, i) => (
            <div key={i} className="flex">
              <div className="w-12 text-[10px] text-muted-foreground font-medium flex items-center justify-end pr-2 truncate">{tokens[i]}</div>
              {row.map((val, j) => (
                <div key={j}
                  className="w-12 h-10 flex items-center justify-center text-[9px] font-mono border border-border/30 transition-colors"
                  style={{
                    background: `hsl(var(--primary) / ${val})`,
                    color: val > 0.4 ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                  }}
                >
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground">
        Self-Attention Weights (softmax of Q·K<sup>T</sup> / √d<sub>k</sub>)
      </div>
    </div>
  );
}
