import { useState, useMemo, useCallback, useEffect } from "react";

const GRID_SIZE = 6;
const ACTIONS = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // left, right, up, down
const ACTION_NAMES = ["←", "→", "↑", "↓"];

interface Props {
  algorithm: "q-learning" | "sarsa" | "dqn" | "monte-carlo";
}

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function GridWorldViz({ algorithm }: Props) {
  const [learningRate, setLearningRate] = useState(0.1);
  const [discount, setDiscount] = useState(0.9);
  const [episodes, setEpisodes] = useState(100);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const goal = { r: GRID_SIZE - 1, c: GRID_SIZE - 1 };
  const obstacles = useMemo(() => [{ r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 4 }, { r: 4, c: 1 }], []);
  const obstacleSet = new Set(obstacles.map(o => `${o.r},${o.c}`));

  const { qTable, path } = useMemo(() => {
    const rng = seededRandom(42 + step);
    const Q: number[][][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => Array(4).fill(0))
    );

    const isValid = (r: number, c: number) =>
      r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !obstacleSet.has(`${r},${c}`);

    const getAction = (r: number, c: number, eps: number) => {
      if (rng() < eps) return Math.floor(rng() * 4);
      const vals = Q[r][c];
      return vals.indexOf(Math.max(...vals));
    };

    const numEps = Math.min(episodes, 500);
    for (let ep = 0; ep < numEps; ep++) {
      let r = 0, c = 0;
      const epsilon = Math.max(0.01, 1 - ep / numEps);
      const visited: { r: number; c: number; a: number; reward: number }[] = [];

      for (let s = 0; s < 100; s++) {
        const a = getAction(r, c, epsilon);
        const nr = r + ACTIONS[a][0];
        const nc = c + ACTIONS[a][1];
        const validMove = isValid(nr, nc);
        const nextR = validMove ? nr : r;
        const nextC = validMove ? nc : c;
        const reward = (nextR === goal.r && nextC === goal.c) ? 10 : -0.1;

        if (algorithm === "monte-carlo") {
          visited.push({ r, c, a, reward });
        } else {
          const nextA = getAction(nextR, nextC, epsilon);
          const target = algorithm === "sarsa"
            ? reward + discount * Q[nextR][nextC][nextA]
            : reward + discount * Math.max(...Q[nextR][nextC]);
          Q[r][c][a] += learningRate * (target - Q[r][c][a]);
        }

        r = nextR; c = nextC;
        if (r === goal.r && c === goal.c) break;
      }

      if (algorithm === "monte-carlo") {
        let G = 0;
        for (let i = visited.length - 1; i >= 0; i--) {
          G = visited[i].reward + discount * G;
          Q[visited[i].r][visited[i].c][visited[i].a] += learningRate * (G - Q[visited[i].r][visited[i].c][visited[i].a]);
        }
      }
    }

    // Extract greedy path
    const path: { r: number; c: number }[] = [{ r: 0, c: 0 }];
    let pr = 0, pc = 0;
    for (let s = 0; s < 50; s++) {
      const a = Q[pr][pc].indexOf(Math.max(...Q[pr][pc]));
      const nr = pr + ACTIONS[a][0];
      const nc = pc + ACTIONS[a][1];
      if (isValid(nr, nc)) { pr = nr; pc = nc; }
      path.push({ r: pr, c: pc });
      if (pr === goal.r && pc === goal.c) break;
    }

    return { qTable: Q, path };
  }, [episodes, learningRate, discount, algorithm, step, obstacleSet, goal]);

  const handleStep = useCallback(() => setStep(s => s + 1), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Episodes: {episodes}</span>
          <input type="range" min={10} max={500} step={10} value={episodes} onChange={e => setEpisodes(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Learning Rate: {learningRate.toFixed(2)}</span>
          <input type="range" min={0.01} max={0.5} step={0.01} value={learningRate} onChange={e => setLearningRate(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Discount (γ): {discount.toFixed(2)}</span>
          <input type="range" min={0.5} max={0.99} step={0.01} value={discount} onChange={e => setDiscount(+e.target.value)} className="w-full accent-primary h-1.5" />
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={handleStep} className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          Re-train
        </button>
        <div className="text-xs text-muted-foreground flex items-center">
          Algorithm: <span className="font-medium text-foreground ml-1">{algorithm.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {Array.from({ length: GRID_SIZE }, (_, r) =>
            Array.from({ length: GRID_SIZE }, (_, c) => {
              const isGoal = r === goal.r && c === goal.c;
              const isStart = r === 0 && c === 0;
              const isObstacle = obstacleSet.has(`${r},${c}`);
              const onPath = path.some(p => p.r === r && p.c === c);
              const bestAction = qTable[r][c].indexOf(Math.max(...qTable[r][c]));
              const maxQ = Math.max(...qTable[r][c]);

              return (
                <div key={`${r}-${c}`}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-sm flex flex-col items-center justify-center text-xs border transition-colors
                    ${isGoal ? "bg-success/20 border-success/30" : ""}
                    ${isStart ? "bg-primary/20 border-primary/30" : ""}
                    ${isObstacle ? "bg-destructive/20 border-destructive/30" : ""}
                    ${!isGoal && !isStart && !isObstacle && onPath ? "bg-primary/10 border-primary/20" : ""}
                    ${!isGoal && !isStart && !isObstacle && !onPath ? "bg-muted border-border" : ""}
                  `}
                >
                  {isGoal && <span>🎯</span>}
                  {isStart && <span>🤖</span>}
                  {isObstacle && <span>🧱</span>}
                  {!isGoal && !isStart && !isObstacle && (
                    <>
                      <span className="text-muted-foreground">{ACTION_NAMES[bestAction]}</span>
                      <span className="text-[9px] text-muted-foreground">{maxQ.toFixed(1)}</span>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>🤖 Start</span>
        <span>🎯 Goal</span>
        <span>🧱 Obstacle</span>
        <span>Arrows = Best Action</span>
      </div>
    </div>
  );
}
