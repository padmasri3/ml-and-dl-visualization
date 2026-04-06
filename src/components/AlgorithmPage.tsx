import { lazy, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { getAlgorithmContent } from "@/data/algorithm-content";
import CodeBlock from "./CodeBlock";
import { BookOpen, Code, BarChart3, Lightbulb } from "lucide-react";

const LinearRegressionViz = lazy(() => import("./visualizations/LinearRegressionViz"));
const PolynomialRegressionViz = lazy(() => import("./visualizations/PolynomialRegressionViz"));
const RegularizationViz = lazy(() => import("./visualizations/RegularizationViz"));
const LogisticRegressionViz = lazy(() => import("./visualizations/LogisticRegressionViz"));
const KNNViz = lazy(() => import("./visualizations/KNNViz"));
const SVMViz = lazy(() => import("./visualizations/SVMViz"));
const DecisionTreeViz = lazy(() => import("./visualizations/DecisionTreeViz"));
const EnsembleViz = lazy(() => import("./visualizations/EnsembleViz"));
const BoostingViz = lazy(() => import("./visualizations/BoostingViz"));
const NaiveBayesViz = lazy(() => import("./visualizations/NaiveBayesViz"));
const KMeansViz = lazy(() => import("./visualizations/KMeansViz"));
const PCAViz = lazy(() => import("./visualizations/PCAViz"));
const AssociationViz = lazy(() => import("./visualizations/AssociationViz"));
const SemiSupervisedViz = lazy(() => import("./visualizations/SemiSupervisedViz"));
const GridWorldViz = lazy(() => import("./visualizations/GridWorldViz"));
const NeuralNetViz = lazy(() => import("./visualizations/NeuralNetViz"));
const CNNViz = lazy(() => import("./visualizations/CNNViz"));
const RNNViz = lazy(() => import("./visualizations/RNNViz"));
const TransformerViz = lazy(() => import("./visualizations/TransformerViz"));
const AutoencoderViz = lazy(() => import("./visualizations/AutoencoderViz"));
const GANViz = lazy(() => import("./visualizations/GANViz"));

function VizLoader() {
  return (
    <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm animate-pulse">
      Loading visualization...
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function getVisualization(type: string): React.ReactNode | null {
  const vizMap: Record<string, React.ReactNode> = {
    "linear-regression": <LinearRegressionViz />,
    "polynomial-regression": <PolynomialRegressionViz />,
    "ridge": <RegularizationViz mode="ridge" />,
    "lasso": <RegularizationViz mode="lasso" />,
    "elasticnet": <RegularizationViz mode="elasticnet" />,
    "logistic-regression": <LogisticRegressionViz />,
    "knn": <KNNViz />,
    "svm": <SVMViz />,
    "decision-tree": <DecisionTreeViz />,
    "ensemble": <EnsembleViz />,
    "boosting": <BoostingViz />,
    "naive-bayes": <NaiveBayesViz />,
    "k-means": <KMeansViz />,
    "pca": <PCAViz />,
    "association": <AssociationViz />,
    "semi-supervised": <SemiSupervisedViz />,
    "q-learning": <GridWorldViz algorithm="q-learning" />,
    "sarsa": <GridWorldViz algorithm="sarsa" />,
    "dqn": <GridWorldViz algorithm="dqn" />,
    "monte-carlo": <GridWorldViz algorithm="monte-carlo" />,
    "neural-network": <NeuralNetViz />,
    "cnn": <CNNViz />,
    "rnn": <RNNViz />,
    "transformer": <TransformerViz />,
    "autoencoder": <AutoencoderViz />,
    "gan": <GANViz />,
  };
  return vizMap[type] || null;
}

export default function AlgorithmPage() {
  const { selectedAlgorithm } = useApp();
  const content = getAlgorithmContent(selectedAlgorithm);
  const viz = getVisualization(content.visualizationType);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 animate-fade-in" key={selectedAlgorithm}>
      <div>
        <span className="text-3xl">{content.emoji}</span>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2">{content.title}</h1>
      </div>

      <Section icon={BookOpen} title="Algorithm Overview">
        <p className="text-foreground/80 leading-relaxed">{content.overview}</p>
        <div className="space-y-1.5 mt-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Lightbulb className="h-3.5 w-3.5" /> Real-World Use Cases
          </div>
          <ul className="space-y-1">
            {content.useCases.map((uc, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {uc}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section icon={Code} title="Code Implementation">
        <CodeBlock code={content.code} title={content.codeTitle} />
      </Section>

      {viz && (
        <Section icon={BarChart3} title="Interactive Visualization">
          <Suspense fallback={<VizLoader />}>
            {viz}
          </Suspense>
        </Section>
      )}
    </div>
  );
}
