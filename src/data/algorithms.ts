export interface AlgorithmNode {
  id: string;
  label: string;
  children?: AlgorithmNode[];
  hasContent?: boolean;
}

export const algorithmTree: AlgorithmNode[] = [
  {
    id: "ml",
    label: "Machine Learning (ML) Algorithms",
    children: [
      {
        id: "supervised",
        label: "Supervised Learning",
        children: [
          {
            id: "regression",
            label: "Regression",
            children: [
              { id: "linear-regression", label: "Linear Regression", hasContent: true },
              { id: "polynomial-regression", label: "Polynomial Regression", hasContent: true },
              { id: "ridge-regression", label: "Ridge Regression", hasContent: true },
              { id: "lasso-regression", label: "Lasso Regression", hasContent: true },
              { id: "elastic-net", label: "Elastic Net", hasContent: true },
            ],
          },
          {
            id: "classification",
            label: "Classification",
            children: [
              { id: "logistic-regression", label: "Logistic Regression", hasContent: true },
              { id: "knn", label: "k-NN", hasContent: true },
              { id: "svm", label: "SVM", hasContent: true },
              { id: "decision-tree", label: "Decision Tree", hasContent: true },
              { id: "random-forest", label: "Random Forest", hasContent: true },
              { id: "gradient-boosting", label: "Gradient Boosting", hasContent: true },
              { id: "xgboost", label: "XGBoost", hasContent: true },
              { id: "lightgbm", label: "LightGBM", hasContent: true },
              { id: "catboost", label: "CatBoost", hasContent: true },
              { id: "naive-bayes", label: "Naive Bayes", hasContent: true },
            ],
          },
        ],
      },
      {
        id: "unsupervised",
        label: "Unsupervised Learning",
        children: [
          { id: "clustering", label: "Clustering (K-Means, DBSCAN, etc.)", hasContent: true },
          { id: "dimensionality-reduction", label: "Dimensionality Reduction (PCA, t-SNE, UMAP)", hasContent: true },
          { id: "association-rules", label: "Association Rule Learning (Apriori, Eclat)", hasContent: true },
        ],
      },
      {
        id: "semi-supervised",
        label: "Semi-Supervised Learning",
        hasContent: true,
      },
      {
        id: "reinforcement",
        label: "Reinforcement Learning",
        children: [
          { id: "q-learning", label: "Q-Learning", hasContent: true },
          { id: "sarsa", label: "SARSA", hasContent: true },
          { id: "dqn", label: "DQN", hasContent: true },
          { id: "monte-carlo", label: "Monte Carlo", hasContent: true },
        ],
      },
      {
        id: "dl",
        label: "Deep Learning (DL) Algorithms",
        children: [
          { id: "neural-networks", label: "Neural Networks (MLP, FNN)", hasContent: true },
          { id: "cnn", label: "CNN (LeNet, ResNet, etc.)", hasContent: true },
          { id: "rnn", label: "RNN (LSTM, GRU)", hasContent: true },
          { id: "transformers", label: "Transformers (BERT, GPT, T5)", hasContent: true },
          { id: "autoencoders", label: "Autoencoders", hasContent: true },
          { id: "gans", label: "GANs & Diffusion Models", hasContent: true },
          { id: "deep-rl", label: "Deep Reinforcement Learning (DQN, PPO, Actor-Critic)", hasContent: true },
        ],
      },
    ],
  },
];

export function flattenTree(nodes: AlgorithmNode[]): AlgorithmNode[] {
  const result: AlgorithmNode[] = [];
  function walk(list: AlgorithmNode[]) {
    for (const node of list) {
      if (node.hasContent) result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return result;
}
