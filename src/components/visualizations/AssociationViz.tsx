import { useState, useMemo } from "react";

interface Item { id: string; x: number; y: number; }
interface Rule { from: string; to: string; support: number; confidence: number; }

export default function AssociationViz() {
  const [minSupport, setMinSupport] = useState(0.3);
  const [minConfidence, setMinConfidence] = useState(0.5);

  const items: Item[] = [
    { id: "Bread", x: 50, y: 15 },
    { id: "Milk", x: 80, y: 35 },
    { id: "Butter", x: 20, y: 35 },
    { id: "Eggs", x: 35, y: 60 },
    { id: "Cheese", x: 65, y: 60 },
    { id: "Beer", x: 15, y: 85 },
    { id: "Diapers", x: 50, y: 85 },
    { id: "Chips", x: 85, y: 85 },
  ];

  const allRules: Rule[] = [
    { from: "Bread", to: "Butter", support: 0.45, confidence: 0.7 },
    { from: "Bread", to: "Milk", support: 0.5, confidence: 0.65 },
    { from: "Milk", to: "Cheese", support: 0.35, confidence: 0.6 },
    { from: "Eggs", to: "Bread", support: 0.3, confidence: 0.55 },
    { from: "Beer", to: "Diapers", support: 0.4, confidence: 0.75 },
    { from: "Beer", to: "Chips", support: 0.35, confidence: 0.6 },
    { from: "Diapers", to: "Beer", support: 0.4, confidence: 0.7 },
    { from: "Butter", to: "Eggs", support: 0.25, confidence: 0.45 },
    { from: "Cheese", to: "Bread", support: 0.2, confidence: 0.4 },
    { from: "Chips", to: "Beer", support: 0.35, confidence: 0.65 },
  ];

  const filteredRules = useMemo(() => {
    return allRules.filter(r => r.support >= minSupport && r.confidence >= minConfidence);
  }, [minSupport, minConfidence]);

  const itemMap = Object.fromEntries(items.map(i => [i.id, i]));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Min Support: {minSupport.toFixed(2)}</span>
          <input type="range" min={0.1} max={0.6} step={0.05} value={minSupport} onChange={e => setMinSupport(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Min Confidence: {minConfidence.toFixed(2)}</span>
          <input type="range" min={0.3} max={0.9} step={0.05} value={minConfidence} onChange={e => setMinConfidence(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Rules Found</div>
          <div className="text-lg font-semibold text-primary">{filteredRules.length}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Total Rules</div>
          <div className="text-lg font-semibold text-foreground">{allRules.length}</div>
        </div>
      </div>
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden" style={{ height: 350 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {filteredRules.map((r, i) => {
            const from = itemMap[r.from];
            const to = itemMap[r.to];
            if (!from || !to) return null;
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="hsl(var(--primary))" strokeWidth={r.confidence * 1.5} opacity={0.4 + r.support} />
                <polygon
                  points={`${to.x},${to.y - 1.5} ${to.x - 1},${to.y + 1.5} ${to.x + 1},${to.y + 1.5}`}
                  fill="hsl(var(--primary))" opacity={0.6}
                  transform={`rotate(${Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI}, ${to.x}, ${to.y})`}
                />
              </g>
            );
          })}
          {items.map(item => (
            <g key={item.id}>
              <circle cx={item.x} cy={item.y} r={4} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={0.5} />
              <text x={item.x} y={item.y + 0.5} textAnchor="middle" fontSize="2.5" fill="hsl(var(--foreground))" dominantBaseline="middle">
                {item.id.slice(0, 2)}
              </text>
              <text x={item.x} y={item.y + 7} textAnchor="middle" fontSize="2" fill="hsl(var(--muted-foreground))">
                {item.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {filteredRules.length > 0 && (
        <div className="space-y-1">
          {filteredRules.map((r, i) => (
            <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">{r.from}</span> → <span className="font-medium text-foreground">{r.to}</span>
              <span className="ml-auto">sup: {r.support.toFixed(2)} | conf: {r.confidence.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
