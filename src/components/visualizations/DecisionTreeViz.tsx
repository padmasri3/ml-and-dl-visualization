import { useState, useMemo } from "react";

interface TreeNodeData {
  feature: string;
  threshold: number;
  left?: TreeNodeData | string;
  right?: TreeNodeData | string;
}

function buildTree(maxDepth: number, minSamples: number): TreeNodeData {
  const tree: TreeNodeData = {
    feature: "Petal Length",
    threshold: 2.45,
    left: "Setosa",
    right: maxDepth > 1
      ? {
          feature: "Petal Width",
          threshold: 1.75,
          left: minSamples <= 5
            ? {
                feature: "Petal Length",
                threshold: 4.95,
                left: "Versicolor",
                right: maxDepth > 2 ? "Virginica" : "Versicolor",
              }
            : "Versicolor",
          right: "Virginica",
        }
      : "Versicolor / Virginica",
  };
  return tree;
}

function TreeNodeComponent({ node, depth = 0 }: { node: TreeNodeData | string; depth?: number }) {
  if (typeof node === "string") {
    const colors: Record<string, string> = {
      Setosa: "bg-primary/20 text-primary border-primary/30",
      Versicolor: "bg-success/20 text-success border-success/30",
      Virginica: "bg-accent/20 text-accent border-accent/30",
    };
    return (
      <div className="flex flex-col items-center">
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${colors[node] || "bg-muted text-foreground border-border"}`}>
          🍃 {node}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="px-3 py-2 rounded-lg border border-border bg-card text-center text-xs shadow-sm">
        <div className="font-medium text-foreground">{node.feature}</div>
        <div className="text-muted-foreground">≤ {node.threshold}</div>
      </div>
      <div className="flex items-start mt-2 gap-2">
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-border" />
          <span className="text-[10px] text-muted-foreground mb-1">Yes</span>
          <TreeNodeComponent node={node.left!} depth={depth + 1} />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-border" />
          <span className="text-[10px] text-muted-foreground mb-1">No</span>
          <TreeNodeComponent node={node.right!} depth={depth + 1} />
        </div>
      </div>
    </div>
  );
}

export default function DecisionTreeViz() {
  const [maxDepth, setMaxDepth] = useState(3);
  const [minSamples, setMinSamples] = useState(2);
  const tree = useMemo(() => buildTree(maxDepth, minSamples), [maxDepth, minSamples]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Max Depth: {maxDepth}</span>
          <input type="range" min={1} max={4} value={maxDepth} onChange={(e) => setMaxDepth(+e.target.value)}
            className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Min Samples Split: {minSamples}</span>
          <input type="range" min={2} max={20} value={minSamples} onChange={(e) => setMinSamples(+e.target.value)}
            className="w-full accent-primary h-1.5" />
        </label>
      </div>

      <div className="flex justify-center p-6 bg-muted/30 rounded-lg border border-border overflow-x-auto">
        <TreeNodeComponent node={tree} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-primary/30" /> Setosa
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-success/30" /> Versicolor
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-accent/30" /> Virginica
        </div>
      </div>
    </div>
  );
}
