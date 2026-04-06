import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function NaiveBayesViz() {
  const [spamPrior, setSpamPrior] = useState(0.4);
  const [wordFreq, setWordFreq] = useState(0.7);

  const words = ["free", "win", "offer", "click", "meeting", "report", "hello", "urgent"];
  
  const posteriors = useMemo(() => {
    return words.map((word, i) => {
      const pWordSpam = i < 4 ? wordFreq * (1 - i * 0.1) : (1 - wordFreq) * 0.3;
      const pWordHam = i < 4 ? (1 - wordFreq) * 0.2 : wordFreq * (0.5 + i * 0.05);
      const pSpam = (pWordSpam * spamPrior) / (pWordSpam * spamPrior + pWordHam * (1 - spamPrior));
      return {
        word,
        spamProb: Math.round(pSpam * 100),
        hamProb: Math.round((1 - pSpam) * 100),
        isSpammy: pSpam > 0.5,
      };
    });
  }, [spamPrior, wordFreq]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Spam Prior P(spam): {spamPrior.toFixed(2)}</span>
          <input type="range" min={0.1} max={0.9} step={0.05} value={spamPrior} onChange={e => setSpamPrior(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Word Discriminativeness: {wordFreq.toFixed(2)}</span>
          <input type="range" min={0.3} max={1} step={0.05} value={wordFreq} onChange={e => setWordFreq(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={posteriors} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="word" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "P(spam|word) %", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Bar dataKey="spamProb" name="P(spam|word)">
              {posteriors.map((p, i) => (
                <Cell key={i} fill={p.isSpammy ? "hsl(var(--destructive))" : "hsl(var(--primary))"} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
