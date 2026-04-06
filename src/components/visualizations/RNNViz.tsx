import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RNNViz() {
  const [seqLength, setSeqLength] = useState(8);
  const [hiddenSize, setHiddenSize] = useState(4);
  const [cellType, setCellType] = useState<"rnn" | "lstm" | "gru">("lstm");

  const sequence = useMemo(() => {
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    return Array.from({ length: seqLength }, (_, i) => ({
      step: i,
      input: Math.round(Math.sin(i * 0.8) * 50 + 50),
      hidden: Math.round(rng() * 100),
      output: Math.round(Math.sin((i + 1) * 0.8) * 50 + 50 + (rng() - 0.5) * 20),
    }));
  }, [seqLength]);

  const params = useMemo(() => {
    const inputSize = 1;
    if (cellType === "rnn") return (inputSize + hiddenSize) * hiddenSize + hiddenSize;
    if (cellType === "lstm") return 4 * ((inputSize + hiddenSize) * hiddenSize + hiddenSize);
    return 3 * ((inputSize + hiddenSize) * hiddenSize + hiddenSize); // GRU
  }, [hiddenSize, cellType]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Sequence Length: {seqLength}</span>
          <input type="range" min={4} max={16} value={seqLength} onChange={e => setSeqLength(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Hidden Size: {hiddenSize}</span>
          <input type="range" min={2} max={16} value={hiddenSize} onChange={e => setHiddenSize(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Cell Type</span>
          <select value={cellType} onChange={e => setCellType(e.target.value as typeof cellType)}
            className="w-full py-1 px-2 text-sm bg-muted border border-border rounded-md text-foreground">
            <option value="rnn">Vanilla RNN</option>
            <option value="lstm">LSTM</option>
            <option value="gru">GRU</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Parameters</div>
          <div className="text-lg font-semibold text-primary">{params}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Gates</div>
          <div className="text-lg font-semibold text-foreground">{cellType === "lstm" ? 4 : cellType === "gru" ? 3 : 1}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Cell</div>
          <div className="text-lg font-semibold text-foreground uppercase">{cellType}</div>
        </div>
      </div>
      {/* Unrolled RNN diagram */}
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-x-auto p-4" style={{ minHeight: 150 }}>
        <div className="flex items-center gap-3 min-w-max justify-center">
          {sequence.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-muted-foreground">x{i}</div>
              <div className="w-10 h-10 rounded border border-primary bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {cellType === "lstm" ? "LSTM" : cellType === "gru" ? "GRU" : "RNN"}
              </div>
              <div className="text-[10px] text-muted-foreground">h{i}</div>
              {i < sequence.length - 1 && (
                <div className="absolute" style={{ left: `${i * 52 + 50}px`, top: "50%" }}>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 min-w-max justify-center mt-1">
          {sequence.map((_, i) => (
            i < sequence.length - 1 ? (
              <div key={`arrow-${i}`} className="text-primary text-xs" style={{ width: 52, textAlign: "center" }}>→</div>
            ) : <div key={`arrow-${i}`} style={{ width: 40 }} />
          ))}
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sequence} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="step" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Line dataKey="input" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Input" />
            <Line dataKey="output" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} name="Prediction" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
