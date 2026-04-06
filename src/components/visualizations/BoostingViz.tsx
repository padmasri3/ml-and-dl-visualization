import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BoostingViz() {
  const [nEstimators, setNEstimators] = useState(10);
  const [learningRate, setLearningRate] = useState(0.3);
  const [maxDepth, setMaxDepth] = useState(3);

  const lossData = useMemo(() => {
    const data: { iteration: number; trainLoss: number; valLoss: number }[] = [];
    let trainLoss = 1.0;
    let valLoss = 1.0;
    for (let i = 1; i <= nEstimators; i++) {
      trainLoss *= (1 - learningRate * 0.7 * (maxDepth / 5));
      valLoss *= (1 - learningRate * 0.5 * (maxDepth / 5));
      if (i > nEstimators * 0.7) valLoss += 0.002 * learningRate * maxDepth;
      data.push({
        iteration: i,
        trainLoss: Math.round(Math.max(0.01, trainLoss) * 1000) / 1000,
        valLoss: Math.round(Math.max(0.02, valLoss) * 1000) / 1000,
      });
    }
    return data;
  }, [nEstimators, learningRate, maxDepth]);

  const finalTrain = lossData[lossData.length - 1]?.trainLoss ?? 1;
  const finalVal = lossData[lossData.length - 1]?.valLoss ?? 1;
  const overfit = finalVal > finalTrain * 1.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Estimators: {nEstimators}</span>
          <input type="range" min={5} max={50} value={nEstimators} onChange={e => setNEstimators(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Learning Rate: {learningRate.toFixed(2)}</span>
          <input type="range" min={0.01} max={1} step={0.01} value={learningRate} onChange={e => setLearningRate(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Max Depth: {maxDepth}</span>
          <input type="range" min={1} max={8} value={maxDepth} onChange={e => setMaxDepth(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Train Loss</div>
          <div className="text-lg font-semibold text-primary">{finalTrain.toFixed(3)}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Val Loss</div>
          <div className="text-lg font-semibold text-foreground">{finalVal.toFixed(3)}</div>
        </div>
        <div className={`rounded-lg p-3 text-center ${overfit ? "bg-destructive/10" : "bg-success/10"}`}>
          <div className="text-xs text-muted-foreground">Status</div>
          <div className={`text-lg font-semibold ${overfit ? "text-destructive" : "text-success"}`}>
            {overfit ? "Overfitting" : "Good Fit"}
          </div>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lossData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="iteration" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Iterations", position: "bottom", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Line dataKey="trainLoss" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Train Loss" />
            <Line dataKey="valLoss" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Val Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
