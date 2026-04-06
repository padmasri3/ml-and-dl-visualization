export interface AlgorithmContent {
  title: string;
  emoji: string;
  overview: string;
  useCases: string[];
  code: string;
  codeTitle: string;
  visualizationType: string;
}

export const algorithmContentMap: Record<string, AlgorithmContent> = {
  "linear-regression": {
    title: "Linear Regression",
    emoji: "📈",
    overview: "Linear Regression models the relationship between a dependent variable and one or more independent variables by fitting a straight line (y = mx + b) that minimizes the sum of squared differences between predicted and actual values.",
    useCases: ["Predicting house prices", "Forecasting sales from ad spend", "Estimating exam scores from study hours", "Temperature prediction from historical data"],
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

X = np.random.rand(100, 1) * 10
y = 2.5 * X.squeeze() + np.random.randn(100) * 2 + 5

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"R² Score: {r2_score(y_test, y_pred):.4f}")
print(f"MSE: {mean_squared_error(y_test, y_pred):.4f}")`,
    codeTitle: "scikit-learn · Linear Regression",
    visualizationType: "linear-regression",
  },
  "polynomial-regression": {
    title: "Polynomial Regression",
    emoji: "🔄",
    overview: "Polynomial Regression extends linear regression by adding polynomial terms (x², x³, etc.) to capture non-linear relationships. The degree of the polynomial controls model complexity — too low underfits, too high overfits.",
    useCases: ["Modeling growth curves", "Fitting non-linear scientific data", "Price optimization curves", "Trajectory prediction"],
    code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

model = Pipeline([
    ('poly', PolynomialFeatures(degree=3)),
    ('linear', LinearRegression())
])
model.fit(X_train, y_train)
print(f"R² Score: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Polynomial Regression",
    visualizationType: "polynomial-regression",
  },
  "ridge-regression": {
    title: "Ridge Regression",
    emoji: "🏔️",
    overview: "Ridge Regression adds L2 regularization to linear regression, penalizing large coefficients by adding λΣβ² to the loss function. This shrinks coefficients toward zero without eliminating them, reducing overfitting while keeping all features.",
    useCases: ["High-dimensional data with multicollinearity", "Regularized prediction models", "Feature importance analysis", "Stable coefficient estimation"],
    code: `from sklearn.linear_model import Ridge

model = Ridge(alpha=1.0)
model.fit(X_train, y_train)
print(f"Coefficients: {model.coef_}")
print(f"R² Score: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Ridge Regression",
    visualizationType: "ridge",
  },
  "lasso-regression": {
    title: "Lasso Regression",
    emoji: "✂️",
    overview: "Lasso Regression uses L1 regularization (λΣ|β|), which can shrink some coefficients exactly to zero, effectively performing feature selection. It produces sparse models that are easier to interpret.",
    useCases: ["Feature selection in high-dimensional data", "Sparse model creation", "Genomics and bioinformatics", "Variable selection in economics"],
    code: `from sklearn.linear_model import Lasso

model = Lasso(alpha=0.1)
model.fit(X_train, y_train)
selected = sum(1 for c in model.coef_ if abs(c) > 1e-5)
print(f"Selected features: {selected}/{len(model.coef_)}")`,
    codeTitle: "scikit-learn · Lasso Regression",
    visualizationType: "lasso",
  },
  "elastic-net": {
    title: "Elastic Net",
    emoji: "🔗",
    overview: "Elastic Net combines L1 and L2 regularization, controlled by an l1_ratio parameter. It inherits feature selection from Lasso and coefficient shrinkage from Ridge, making it robust when features are correlated.",
    useCases: ["When features are correlated groups", "Combining benefits of Ridge and Lasso", "Genomic data analysis", "Text classification features"],
    code: `from sklearn.linear_model import ElasticNet

model = ElasticNet(alpha=0.1, l1_ratio=0.5)
model.fit(X_train, y_train)
print(f"R² Score: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Elastic Net",
    visualizationType: "elasticnet",
  },
  "logistic-regression": {
    title: "Logistic Regression",
    emoji: "🎲",
    overview: "Logistic Regression uses the sigmoid function to model the probability of a binary outcome. Despite its name, it's a classification algorithm. The decision boundary is where P(y=1) = 0.5.",
    useCases: ["Email spam detection", "Disease diagnosis (positive/negative)", "Customer churn prediction", "Credit default prediction"],
    code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")`,
    codeTitle: "scikit-learn · Logistic Regression",
    visualizationType: "logistic-regression",
  },
  "knn": {
    title: "k-Nearest Neighbors",
    emoji: "👥",
    overview: "k-NN classifies a data point based on the majority vote of its k nearest neighbors. It's a lazy learner — no training phase, just stores data and computes distances at prediction time. The choice of k is critical.",
    useCases: ["Recommendation systems", "Image recognition", "Pattern recognition", "Missing data imputation"],
    code: `from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · k-NN",
    visualizationType: "knn",
  },
  "svm": {
    title: "Support Vector Machine",
    emoji: "📐",
    overview: "SVM finds the hyperplane that maximally separates classes by maximizing the margin between the closest points (support vectors). Kernel tricks enable non-linear decision boundaries.",
    useCases: ["Text categorization", "Image classification", "Handwriting recognition", "Bioinformatics"],
    code: `from sklearn.svm import SVC

model = SVC(kernel='rbf', C=1.0, gamma='scale')
model.fit(X_train, y_train)
print(f"Support vectors: {len(model.support_vectors_)}")
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · SVM",
    visualizationType: "svm",
  },
  "decision-tree": {
    title: "Decision Tree",
    emoji: "🌳",
    overview: "A Decision Tree learns decision rules from data features, building a tree where each node tests a feature, each branch represents an outcome, and each leaf holds a prediction. It's intuitive like a flowchart.",
    useCases: ["Medical diagnosis", "Credit approval", "Spam classification", "Species classification"],
    code: `from sklearn.tree import DecisionTreeClassifier, export_text

clf = DecisionTreeClassifier(max_depth=3, min_samples_split=5)
clf.fit(X_train, y_train)
print(f"Accuracy: {clf.score(X_test, y_test):.4f}")
print(export_text(clf, feature_names=feature_names))`,
    codeTitle: "scikit-learn · Decision Tree",
    visualizationType: "decision-tree",
  },
  "random-forest": {
    title: "Random Forest",
    emoji: "🌲",
    overview: "Random Forest is an ensemble method that builds multiple decision trees on random subsets of data and features, then aggregates their predictions (majority vote for classification, average for regression). This reduces overfitting and variance.",
    useCases: ["Feature importance ranking", "Fraud detection", "Drug response prediction", "Stock market analysis"],
    code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, max_depth=5)
model.fit(X_train, y_train)
importances = model.feature_importances_
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Random Forest",
    visualizationType: "ensemble",
  },
  "gradient-boosting": {
    title: "Gradient Boosting",
    emoji: "🚀",
    overview: "Gradient Boosting builds trees sequentially, each one correcting the errors of the previous ensemble. It minimizes a loss function using gradient descent in function space, producing powerful predictive models.",
    useCases: ["Ranking systems", "Click-through rate prediction", "Insurance claim prediction", "Competition-winning models"],
    code: `from sklearn.ensemble import GradientBoostingClassifier

model = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3
)
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Gradient Boosting",
    visualizationType: "boosting",
  },
  "xgboost": {
    title: "XGBoost",
    emoji: "⚡",
    overview: "XGBoost (Extreme Gradient Boosting) is an optimized gradient boosting framework with regularization, parallel processing, and built-in cross-validation. It handles sparse data and missing values natively.",
    useCases: ["Kaggle competitions", "Large-scale classification", "Ranking algorithms", "Anomaly detection"],
    code: `import xgboost as xgb

model = xgb.XGBClassifier(
    n_estimators=100, learning_rate=0.1,
    max_depth=6, use_label_encoder=False
)
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "XGBoost",
    visualizationType: "boosting",
  },
  "lightgbm": {
    title: "LightGBM",
    emoji: "💡",
    overview: "LightGBM uses leaf-wise tree growth (vs level-wise), histogram-based splitting, and gradient-based one-side sampling for faster training on large datasets while maintaining accuracy.",
    useCases: ["Large-scale data processing", "Real-time prediction systems", "Feature-rich datasets", "Distributed learning"],
    code: `import lightgbm as lgb

model = lgb.LGBMClassifier(
    n_estimators=100, learning_rate=0.1,
    num_leaves=31, max_depth=-1
)
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "LightGBM",
    visualizationType: "boosting",
  },
  "catboost": {
    title: "CatBoost",
    emoji: "🐱",
    overview: "CatBoost handles categorical features natively using ordered target statistics, avoiding the need for manual encoding. It uses symmetric trees and ordered boosting to reduce prediction shift.",
    useCases: ["Categorical feature-heavy data", "Recommendation systems", "Click prediction", "Financial modeling"],
    code: `from catboost import CatBoostClassifier

model = CatBoostClassifier(
    iterations=100, learning_rate=0.1,
    depth=6, cat_features=cat_indices
)
model.fit(X_train, y_train, verbose=False)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "CatBoost",
    visualizationType: "boosting",
  },
  "naive-bayes": {
    title: "Naive Bayes",
    emoji: "📊",
    overview: "Naive Bayes classifiers apply Bayes' theorem with the 'naive' assumption that features are conditionally independent. Despite this simplification, they work surprisingly well for text classification and spam filtering.",
    useCases: ["Spam filtering", "Sentiment analysis", "Document classification", "Medical diagnosis"],
    code: `from sklearn.naive_bayes import GaussianNB

model = GaussianNB()
model.fit(X_train, y_train)
probs = model.predict_proba(X_test)
print(f"Accuracy: {model.score(X_test, y_test):.4f}")`,
    codeTitle: "scikit-learn · Naive Bayes",
    visualizationType: "naive-bayes",
  },
  "clustering": {
    title: "K-Means Clustering",
    emoji: "🎯",
    overview: "K-Means partitions data into K clusters by iteratively assigning points to nearest centroids, then recalculating centroids. It converges when assignments stabilize. DBSCAN is density-based and finds arbitrary-shaped clusters.",
    useCases: ["Customer segmentation", "Image compression", "Document grouping", "Anomaly detection"],
    code: `from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=4, random_state=42)
kmeans.fit(X)
labels = kmeans.labels_
print(f"Inertia: {kmeans.inertia_:.2f}")`,
    codeTitle: "scikit-learn · K-Means",
    visualizationType: "k-means",
  },
  "dimensionality-reduction": {
    title: "Dimensionality Reduction",
    emoji: "🔍",
    overview: "PCA finds orthogonal axes (principal components) that capture maximum variance. t-SNE and UMAP are non-linear methods for visualization that preserve local structure of high-dimensional data.",
    useCases: ["Data visualization", "Noise reduction", "Feature extraction", "Preprocessing for ML"],
    code: `from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)
print(f"Explained variance: {pca.explained_variance_ratio_}")`,
    codeTitle: "scikit-learn · PCA",
    visualizationType: "pca",
  },
  "association-rules": {
    title: "Association Rule Learning",
    emoji: "🛒",
    overview: "Association Rule Learning discovers interesting relationships between variables in large datasets. Apriori and Eclat find frequent itemsets and generate rules like 'customers who buy bread also buy butter' with support and confidence metrics.",
    useCases: ["Market basket analysis", "Cross-selling recommendations", "Web usage mining", "Medical diagnosis patterns"],
    code: `from mlxtend.frequent_patterns import apriori, association_rules

frequent_items = apriori(df, min_support=0.3, use_colnames=True)
rules = association_rules(frequent_items, metric="confidence", min_threshold=0.5)
print(rules[['antecedents', 'consequents', 'support', 'confidence']])`,
    codeTitle: "mlxtend · Apriori",
    visualizationType: "association",
  },
  "semi-supervised": {
    title: "Semi-Supervised Learning",
    emoji: "🏷️",
    overview: "Semi-supervised learning uses a small amount of labeled data with a large amount of unlabeled data. Label propagation spreads labels through the data based on similarity, leveraging the structure of unlabeled data.",
    useCases: ["When labeling is expensive", "Medical image classification", "Speech recognition", "Web content classification"],
    code: `from sklearn.semi_supervised import LabelPropagation

model = LabelPropagation()
# -1 indicates unlabeled
labels = [0, 1, -1, -1, -1, 0, -1, 1]
model.fit(X, labels)
print(f"Predicted labels: {model.transduction_}")`,
    codeTitle: "scikit-learn · Label Propagation",
    visualizationType: "semi-supervised",
  },
  "q-learning": {
    title: "Q-Learning",
    emoji: "🎮",
    overview: "Q-Learning is an off-policy RL algorithm that learns the optimal action-value function Q(s,a) directly. It uses the Bellman equation to update Q-values: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)].",
    useCases: ["Game AI", "Robot navigation", "Resource allocation", "Traffic control"],
    code: `import numpy as np

Q = np.zeros((n_states, n_actions))
for episode in range(1000):
    state = env.reset()
    while True:
        action = epsilon_greedy(Q, state, epsilon)
        next_state, reward, done = env.step(action)
        Q[state, action] += alpha * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )
        state = next_state
        if done: break`,
    codeTitle: "NumPy · Q-Learning",
    visualizationType: "q-learning",
  },
  "sarsa": {
    title: "SARSA",
    emoji: "🔄",
    overview: "SARSA (State-Action-Reward-State-Action) is an on-policy RL algorithm. Unlike Q-Learning which uses max Q(s',a'), SARSA uses the actual next action: Q(s,a) ← Q(s,a) + α[r + γ·Q(s',a') - Q(s,a)]. This makes it more conservative.",
    useCases: ["Safe exploration scenarios", "Risk-averse control", "Robot locomotion", "Portfolio management"],
    code: `for episode in range(1000):
    state = env.reset()
    action = epsilon_greedy(Q, state, epsilon)
    while True:
        next_state, reward, done = env.step(action)
        next_action = epsilon_greedy(Q, next_state, epsilon)
        Q[state, action] += alpha * (
            reward + gamma * Q[next_state, next_action] - Q[state, action]
        )
        state, action = next_state, next_action
        if done: break`,
    codeTitle: "NumPy · SARSA",
    visualizationType: "sarsa",
  },
  "dqn": {
    title: "DQN (Deep Q-Network)",
    emoji: "🧠",
    overview: "DQN combines Q-Learning with deep neural networks to handle high-dimensional state spaces. Key innovations include experience replay (storing and sampling past transitions) and a target network (stabilizing training).",
    useCases: ["Atari game playing", "Autonomous driving", "Network optimization", "Financial trading"],
    code: `import torch
import torch.nn as nn

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 128), nn.ReLU(),
            nn.Linear(128, 128), nn.ReLU(),
            nn.Linear(128, action_dim)
        )
    def forward(self, x):
        return self.net(x)`,
    codeTitle: "PyTorch · DQN",
    visualizationType: "dqn",
  },
  "monte-carlo": {
    title: "Monte Carlo Methods",
    emoji: "🎲",
    overview: "Monte Carlo RL methods learn from complete episodes without bootstrapping. They estimate Q-values by averaging returns over many episodes, making them unbiased but high-variance. Every-visit MC averages all visits to a state-action pair.",
    useCases: ["Blackjack strategy", "Game tree evaluation", "Policy evaluation", "Risk assessment"],
    code: `returns = defaultdict(list)
for episode in range(10000):
    episode_data = generate_episode(env, policy)
    G = 0
    for state, action, reward in reversed(episode_data):
        G = gamma * G + reward
        returns[(state, action)].append(G)
        Q[state][action] = np.mean(returns[(state, action)])`,
    codeTitle: "Python · Monte Carlo",
    visualizationType: "monte-carlo",
  },
  "neural-networks": {
    title: "Neural Networks (MLP, FNN)",
    emoji: "🕸️",
    overview: "Multi-Layer Perceptrons are feedforward neural networks with one or more hidden layers. Each neuron applies a weighted sum followed by a non-linear activation function. They're universal function approximators.",
    useCases: ["Function approximation", "Pattern recognition", "Regression and classification", "Feature learning"],
    code: `import torch.nn as nn

model = nn.Sequential(
    nn.Linear(input_dim, 128),
    nn.ReLU(),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Linear(64, num_classes)
)

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()`,
    codeTitle: "PyTorch · MLP",
    visualizationType: "neural-network",
  },
  "cnn": {
    title: "Convolutional Neural Networks",
    emoji: "🖼️",
    overview: "CNNs use learnable filters that slide across input data to detect spatial features. Through convolution, pooling, and fully-connected layers, they build hierarchical representations — edges → textures → objects.",
    useCases: ["Image classification (ImageNet)", "Object detection (YOLO)", "Medical imaging", "Self-driving cars"],
    code: `model = nn.Sequential(
    nn.Conv2d(1, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Conv2d(32, 64, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64 * 7 * 7, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)`,
    codeTitle: "PyTorch · CNN (LeNet-style)",
    visualizationType: "cnn",
  },
  "rnn": {
    title: "Recurrent Neural Networks",
    emoji: "🔁",
    overview: "RNNs process sequences by maintaining a hidden state that captures information from previous time steps. LSTM adds forget, input, and output gates to solve vanishing gradients. GRU simplifies this with reset and update gates.",
    useCases: ["Language modeling", "Machine translation", "Speech recognition", "Time series forecasting"],
    code: `model = nn.LSTM(
    input_size=embedding_dim,
    hidden_size=256,
    num_layers=2,
    batch_first=True,
    dropout=0.3,
    bidirectional=True
)

# GRU alternative
model_gru = nn.GRU(input_size=256, hidden_size=128, num_layers=2)`,
    codeTitle: "PyTorch · LSTM / GRU",
    visualizationType: "rnn",
  },
  "transformers": {
    title: "Transformers",
    emoji: "🤖",
    overview: "Transformers use self-attention to process all positions simultaneously, capturing long-range dependencies without recurrence. Multi-head attention allows the model to attend to different representation subspaces. BERT, GPT, and T5 are prominent variants.",
    useCases: ["Language understanding (BERT)", "Text generation (GPT)", "Translation (T5)", "Code generation (Codex)"],
    code: `from transformers import BertModel, BertTokenizer

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

inputs = tokenizer("Hello world", return_tensors="pt")
outputs = model(**inputs)
# outputs.last_hidden_state: [batch, seq_len, 768]`,
    codeTitle: "HuggingFace · Transformers",
    visualizationType: "transformer",
  },
  "autoencoders": {
    title: "Autoencoders",
    emoji: "🔄",
    overview: "Autoencoders learn compressed representations by encoding input into a lower-dimensional latent space, then decoding back to reconstruct the original. The bottleneck forces the model to learn the most important features.",
    useCases: ["Dimensionality reduction", "Anomaly detection", "Image denoising", "Generative modeling (VAE)"],
    code: `class Autoencoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128), nn.ReLU(),
            nn.Linear(128, latent_dim)
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 128), nn.ReLU(),
            nn.Linear(128, input_dim), nn.Sigmoid()
        )
    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)`,
    codeTitle: "PyTorch · Autoencoder",
    visualizationType: "autoencoder",
  },
  "gans": {
    title: "GANs & Diffusion Models",
    emoji: "🎨",
    overview: "GANs pit a Generator against a Discriminator in a minimax game. The Generator creates fake data to fool the Discriminator, while the Discriminator learns to tell real from fake. Diffusion models add noise then learn to denoise.",
    useCases: ["Image synthesis (StyleGAN)", "Image-to-image translation", "Data augmentation", "Super-resolution"],
    code: `class Generator(nn.Module):
    def __init__(self, latent_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(latent_dim, 256), nn.ReLU(),
            nn.Linear(256, 512), nn.ReLU(),
            nn.Linear(512, 784), nn.Tanh()
        )

class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 1), nn.Sigmoid()
        )`,
    codeTitle: "PyTorch · GAN",
    visualizationType: "gan",
  },
  "deep-rl": {
    title: "Deep Reinforcement Learning",
    emoji: "🎯",
    overview: "Deep RL combines deep learning with RL algorithms. DQN uses neural networks for Q-function approximation, PPO uses a clipped objective for stable policy optimization, and Actor-Critic methods learn both policy and value function.",
    useCases: ["Game playing (AlphaGo)", "Robotics control", "Autonomous navigation", "Resource management"],
    code: `import torch
import torch.nn as nn

class ActorCritic(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(state_dim, 128), nn.ReLU()
        )
        self.actor = nn.Linear(128, action_dim)   # policy
        self.critic = nn.Linear(128, 1)            # value
    
    def forward(self, x):
        features = self.shared(x)
        policy = torch.softmax(self.actor(features), dim=-1)
        value = self.critic(features)
        return policy, value`,
    codeTitle: "PyTorch · Actor-Critic",
    visualizationType: "dqn",
  },
};

export function getAlgorithmContent(id: string): AlgorithmContent {
  if (algorithmContentMap[id]) return algorithmContentMap[id];
  const label = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: label,
    emoji: "🧠",
    overview: `${label} is a machine learning algorithm. Detailed content coming soon!`,
    useCases: ["Content coming in Phase 2"],
    code: `# ${label} - Coming soon\nprint("Implementation coming soon!")`,
    codeTitle: `Python · ${label}`,
    visualizationType: "none",
  };
}
