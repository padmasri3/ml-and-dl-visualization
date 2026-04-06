import { useState, useMemo } from "react";

export default function CNNViz() {
  const [filters, setFilters] = useState(4);
  const [kernelSize, setKernelSize] = useState(3);
  const [pooling, setPooling] = useState(2);

  const layers = useMemo(() => {
    const inputSize = 28;
    const conv1Out = inputSize - kernelSize + 1;
    const pool1Out = Math.floor(conv1Out / pooling);
    const conv2Out = Math.max(1, pool1Out - kernelSize + 1);
    const pool2Out = Math.max(1, Math.floor(conv2Out / pooling));
    return [
      { name: "Input", size: inputSize, depth: 1, color: "hsl(var(--muted-foreground))" },
      { name: "Conv1", size: conv1Out, depth: filters, color: "hsl(var(--primary))" },
      { name: "Pool1", size: pool1Out, depth: filters, color: "hsl(var(--info))" },
      { name: "Conv2", size: conv2Out, depth: filters * 2, color: "hsl(var(--accent))" },
      { name: "Pool2", size: pool2Out, depth: filters * 2, color: "hsl(var(--info))" },
      { name: "FC", size: 1, depth: 128, color: "hsl(var(--success))" },
      { name: "Output", size: 1, depth: 10, color: "hsl(var(--warning))" },
    ];
  }, [filters, kernelSize, pooling]);

  const totalParams = useMemo(() => {
    const l = layers;
    let params = kernelSize * kernelSize * 1 * filters + filters; // Conv1
    params += kernelSize * kernelSize * filters * (filters * 2) + filters * 2; // Conv2
    const flatSize = l[4].size * l[4].size * l[4].depth;
    params += flatSize * 128 + 128; // FC
    params += 128 * 10 + 10; // Output
    return params;
  }, [layers, filters, kernelSize]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Filters: {filters}</span>
          <input type="range" min={2} max={16} step={2} value={filters} onChange={e => setFilters(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Kernel Size: {kernelSize}×{kernelSize}</span>
          <input type="range" min={2} max={5} value={kernelSize} onChange={e => setKernelSize(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Pool Size: {pooling}×{pooling}</span>
          <input type="range" min={2} max={4} value={pooling} onChange={e => setPooling(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Total Parameters</div>
          <div className="text-lg font-semibold text-primary">{totalParams.toLocaleString()}</div>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-muted-foreground">Layers</div>
          <div className="text-lg font-semibold text-foreground">{layers.length}</div>
        </div>
      </div>
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden p-6" style={{ minHeight: 300 }}>
        <div className="flex items-center justify-between gap-2 h-full">
          {layers.map((layer, i) => {
            const height = Math.max(20, Math.min(200, layer.size * 6));
            const width = Math.max(16, Math.min(60, layer.depth * 2 + 10));
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                  {Array.from({ length: Math.min(layer.depth, 4) }, (_, d) => (
                    <div key={d}
                      className="absolute rounded-sm border"
                      style={{
                        width: "100%",
                        height: "100%",
                        background: layer.color,
                        opacity: 0.2 + d * 0.15,
                        left: `${d * 3}px`,
                        top: `${-d * 3}px`,
                        borderColor: layer.color,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-medium text-foreground">{layer.name}</div>
                  <div className="text-[9px] text-muted-foreground">
                    {layer.size > 1 ? `${layer.size}×${layer.size}` : ""} ×{layer.depth}
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div className="absolute" style={{ left: "50%", transform: "translateX(50%)" }}>
                    <span className="text-muted-foreground text-xs">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
