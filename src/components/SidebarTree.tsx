import { useState, useCallback } from "react";
import { ChevronRight, Brain, Search } from "lucide-react";
import { AlgorithmNode, algorithmTree } from "@/data/algorithms";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

function TreeNode({ node, depth = 0 }: { node: AlgorithmNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const { selectedAlgorithm, setSelectedAlgorithm } = useApp();
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedAlgorithm === node.id;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setExpanded((e) => !e);
    }
    if (node.hasContent) {
      setSelectedAlgorithm(node.id);
    }
  }, [hasChildren, node.id, node.hasContent, setSelectedAlgorithm]);

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center w-full text-left py-1.5 px-2 rounded-md text-sm transition-all duration-150 group",
          "hover:bg-sidebar-accent",
          isSelected && "bg-primary/10 text-primary font-medium",
          !isSelected && "text-sidebar-foreground",
          depth === 0 && "font-semibold text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-1"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-selected={isSelected}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 mr-1 shrink-0 transition-transform duration-200",
              expanded && "rotate-90"
            )}
          />
        )}
        {!hasChildren && <span className="w-3.5 mr-1 shrink-0" />}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && expanded && (
        <div className="animate-slide-in">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarTree() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-sm text-foreground">ML Explorer</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-sidebar-accent border border-sidebar-border rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            aria-label="Search algorithms"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2" aria-label="Algorithm navigation">
        {algorithmTree.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </nav>
    </div>
  );
}
