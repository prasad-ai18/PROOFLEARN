import type { Course } from "../course-types";

export const DATA_SCIENCE_COURSE: Course = {
  id: "course-data-science",
  slug: "data-science",
  title: "Data Science Fundamentals",
  tagline: "Learn to collect, clean, analyze, and visualize data to extract actionable insights.",
  description: "Complete data science course covering the full pipeline: data collection, cleaning, exploratory analysis, statistical inference, and visualization with Python's data stack.",
  category: "Data Science",
  difficulty: "Intermediate",
  estimatedHours: 32,
  iconName: "BarChart3",
  badgeColor: "cyan",
  prerequisites: ["Python basics", "Basic statistics"],
  learningOutcomes: [
    "Build end-to-end data science pipelines",
    "Clean and transform messy real-world datasets",
    "Perform exploratory data analysis (EDA)",
    "Apply statistical inference to draw conclusions",
    "Create professional visualizations with matplotlib and seaborn"
  ],
  resources: [
    { id: "ds-r1", title: "Kaggle Learn: Data Science", provider: "Kaggle", type: "platform", url: "https://www.kaggle.com/learn", description: "Free micro-courses on pandas, visualization, ML, and more.", difficulty: "Beginner", isFree: true },
    { id: "ds-r2", title: "Pandas Documentation", provider: "Pandas", type: "documentation", url: "https://pandas.pydata.org/docs/", description: "Official pandas documentation with user guide and API reference.", difficulty: "All Levels", isFree: true },
    { id: "ds-r3", title: "Python Data Science Handbook", provider: "Jake VanderPlas", type: "book", url: "https://jakevdp.github.io/PythonDataScienceHandbook/", description: "Free comprehensive book on NumPy, Pandas, Matplotlib, and scikit-learn.", difficulty: "Intermediate", isFree: true },
    { id: "ds-r4", title: "Towards Data Science", provider: "Medium", type: "tutorial", url: "https://towardsdatascience.com/", description: "Community publication with hundreds of data science tutorials.", difficulty: "All Levels", isFree: false }
  ],
  modules: [
    {
      id: "ds-mod-1",
      slug: "data-wrangling",
      title: "Module 1: Data Wrangling with Pandas",
      description: "Loading, inspecting, cleaning, and transforming data using Pandas.",
      order: 1,
      lessons: [
        {
          id: "ds-les-1-1",
          slug: "pandas-fundamentals",
          title: "Pandas DataFrames & Series",
          summary: "Core Pandas data structures and operations for data analysis.",
          durationMinutes: 30,
          order: 1,
          content: `### What is Pandas?
Pandas provides two primary data structures:
- **Series** — a 1D labeled array
- **DataFrame** — a 2D labeled table (think spreadsheet with superpowers)

### Creating DataFrames
\`\`\`python
import pandas as pd

# From a dictionary
data = {
    "name": ["Alice", "Bob", "Carol"],
    "age": [25, 30, 28],
    "salary": [70000, 85000, 92000]
}
df = pd.DataFrame(data)
print(df.head())
print(df.info())   # dtypes and nulls
print(df.describe())  # summary statistics
\`\`\`

### Selecting Data
\`\`\`python
# Column access
df["salary"]          # Series
df[["name", "age"]]   # DataFrame

# Row selection
df.loc[0]             # by label
df.iloc[0]            # by integer position
df.loc[df["age"] > 25]  # boolean mask
\`\`\`

### Data Cleaning
\`\`\`python
# Check for nulls
df.isnull().sum()

# Drop rows with any null
df.dropna()

# Fill nulls
df["salary"].fillna(df["salary"].median())

# Remove duplicates
df.drop_duplicates()

# Fix data types
df["age"] = df["age"].astype(int)
\`\`\``,
          keyTakeaways: [
            "DataFrame is 2D tabular data; Series is 1D labeled array",
            "Use .loc[] for label-based, .iloc[] for position-based selection",
            "Always check .isnull().sum() and .dtypes early in analysis",
            "fillna() with median/mode is safer than mean for skewed data"
          ],
          practiceQuestions: [
            {
              id: "ds-pq-1-1-1",
              prompt: "What does df.iloc[2, 1] return?",
              type: "multiple-choice",
              options: [
                "The value in row with label 2, column with label 1",
                "The value in the 3rd row, 2nd column (0-indexed)",
                "The value in the 2nd row, 1st column (0-indexed)",
                "A slice of rows 2 through 1"
              ],
              correctAnswer: 1,
              explanation: "iloc uses integer-based position (0-indexed). [2, 1] = row index 2 (3rd row), column index 1 (2nd column)."
            },
            {
              id: "ds-pq-1-1-2",
              prompt: "Which is the best strategy for filling missing salary values?",
              type: "multiple-choice",
              options: [
                "fillna(0) — zero is neutral",
                "fillna(df['salary'].mean()) — use the average",
                "fillna(df['salary'].median()) — more robust to outliers",
                "dropna() — always remove missing rows"
              ],
              correctAnswer: 2,
              explanation: "Median is more robust than mean for salary data, which is often right-skewed by high earners. Dropping rows loses information."
            }
          ],
          proofChallenge: {
            id: "ds-proof-1-1",
            title: "Pandas Data Wrangling Proof",
            scenario: "You load a dataset with 10,000 rows. df.isnull().sum() shows 'age' has 150 nulls and 'email' has 4,500 nulls.",
            prompt: "What is the best handling strategy?",
            type: "multiple-choice",
            options: [
              "Drop all rows with nulls using df.dropna()",
              "Fill 'age' with median; drop 'email' column (45% missing is too sparse to impute)",
              "Fill both columns with their mean values",
              "Drop only the rows with null 'age' and null 'email'"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Different strategies for different null rates", "Median for numerical imputation", "Drops heavily missing columns"],
            explanation: "150/10000 = 1.5% null age — safe to impute with median. 4500/10000 = 45% null email — too sparse; dropping the column preserves the majority of data."
          }
        }
      ]
    },
    {
      id: "ds-mod-2",
      slug: "eda-and-visualization",
      title: "Module 2: EDA & Visualization",
      description: "Exploratory data analysis patterns and creating insight-driven visualizations.",
      order: 2,
      lessons: [
        {
          id: "ds-les-2-1",
          slug: "exploratory-data-analysis",
          title: "EDA: Distributions, Correlations & Outliers",
          summary: "Systematic approach to understanding a new dataset before modeling.",
          durationMinutes: 35,
          order: 1,
          content: `### EDA Checklist
1. Shape and structure: \`df.shape\`, \`df.dtypes\`, \`df.info()\`
2. Summary statistics: \`df.describe()\`
3. Missing values: \`df.isnull().sum()\`
4. Distributions: histograms, boxplots
5. Correlations: heatmap
6. Outliers: z-scores, IQR method

### Distributions with Matplotlib/Seaborn
\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# Histogram
df["salary"].hist(bins=30, figsize=(8,4))
plt.xlabel("Salary"); plt.title("Salary Distribution")
plt.show()

# Boxplot — reveals outliers
sns.boxplot(x="department", y="salary", data=df)
plt.xticks(rotation=45)
plt.show()
\`\`\`

### Correlation Heatmap
\`\`\`python
numeric_df = df.select_dtypes(include="number")
corr = numeric_df.corr()

sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
plt.title("Feature Correlation Matrix")
plt.show()
\`\`\`

### Outlier Detection (IQR Method)
\`\`\`python
Q1 = df["salary"].quantile(0.25)
Q3 = df["salary"].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[(df["salary"] < lower) | (df["salary"] > upper)]
print(f"Found {len(outliers)} outliers")
\`\`\``,
          keyTakeaways: [
            "Always start EDA with shape, dtypes, describe(), isnull()",
            "Histograms show distribution shape; boxplots show outliers and quartiles",
            "Correlation heatmaps identify multicollinearity before modeling",
            "IQR method is robust for outlier detection: flag values outside Q1-1.5IQR to Q3+1.5IQR"
          ],
          practiceQuestions: [
            {
              id: "ds-pq-2-1-1",
              prompt: "What does a correlation coefficient of -0.85 between two variables indicate?",
              type: "multiple-choice",
              options: [
                "Weak positive correlation",
                "Strong positive correlation",
                "Strong negative correlation",
                "No correlation"
              ],
              correctAnswer: 2,
              explanation: "Correlation ranges from -1 to +1. -0.85 indicates a strong negative (inverse) linear relationship — as one variable increases, the other decreases."
            },
            {
              id: "ds-pq-2-1-2",
              prompt: "Which chart best shows the distribution of a continuous variable?",
              type: "multiple-choice",
              options: ["Bar chart", "Pie chart", "Histogram", "Line chart"],
              correctAnswer: 2,
              explanation: "Histograms show the frequency distribution of continuous variables across bins, revealing shape, skew, and modality."
            }
          ],
          proofChallenge: {
            id: "ds-proof-2-1",
            title: "EDA Proof",
            scenario: "You're analyzing house prices. The distribution is right-skewed with a few $10M+ mansions. You're deciding whether to use mean or median as the central tendency measure.",
            prompt: "Which measure is more appropriate and why?",
            type: "multiple-choice",
            options: [
              "Mean — it uses all data points",
              "Median — it's more robust to the extreme high-value outliers",
              "Mode — most common price is most useful",
              "Mean and median are equivalent for skewed data"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies right-skew problem", "Knows mean is pulled by outliers", "Recommends median as robust measure"],
            explanation: "Right-skewed data with outliers distorts the mean significantly upward. Median (50th percentile) is resistant to outliers and better represents the 'typical' house price."
          }
        }
      ]
    }
  ]
};

export const MACHINE_LEARNING_COURSE: Course = {
  id: "course-machine-learning",
  slug: "machine-learning",
  title: "Machine Learning Engineering",
  tagline: "Build, train, evaluate, and deploy ML models with scikit-learn and beyond.",
  description: "Hands-on machine learning course covering supervised learning, model evaluation, feature engineering, and production deployment using Python's scikit-learn ecosystem.",
  category: "AI & ML",
  difficulty: "Intermediate",
  estimatedHours: 35,
  iconName: "Brain",
  badgeColor: "violet",
  prerequisites: ["Python", "Statistics basics", "Linear algebra basics"],
  learningOutcomes: [
    "Train and evaluate classification and regression models",
    "Apply feature engineering and selection techniques",
    "Prevent overfitting with regularization and cross-validation",
    "Build ML pipelines for reproducible workflows",
    "Interpret model predictions and feature importance"
  ],
  resources: [
    { id: "ml-r1", title: "scikit-learn Documentation", provider: "scikit-learn", type: "documentation", url: "https://scikit-learn.org/stable/", description: "Official scikit-learn documentation with user guide and API.", difficulty: "All Levels", isFree: true },
    { id: "ml-r2", title: "fast.ai Practical Deep Learning", provider: "fast.ai", type: "platform", url: "https://course.fast.ai/", description: "Top-down practical approach to deep learning, free course.", difficulty: "Intermediate", isFree: true },
    { id: "ml-r3", title: "Kaggle ML Courses", provider: "Kaggle", type: "platform", url: "https://www.kaggle.com/learn/intro-to-machine-learning", description: "Free hands-on ML courses with real competitions.", difficulty: "Beginner", isFree: true },
    { id: "ml-r4", title: "Hands-On Machine Learning (book)", provider: "O'Reilly/Géron", type: "book", url: "https://github.com/ageron/handson-ml3", description: "Industry-standard ML book with notebooks — third edition.", difficulty: "Intermediate", isFree: false }
  ],
  modules: [
    {
      id: "ml-mod-1",
      slug: "ml-fundamentals",
      title: "Module 1: ML Fundamentals",
      description: "Supervised vs unsupervised learning, the training process, and model evaluation.",
      order: 1,
      lessons: [
        {
          id: "ml-les-1-1",
          slug: "training-and-evaluation",
          title: "Training, Validation & Evaluation",
          summary: "The ML workflow: splitting data, training models, and measuring performance.",
          durationMinutes: 28,
          order: 1,
          content: `### The Machine Learning Workflow
1. **Define the problem** — classification, regression, clustering?
2. **Collect & prepare data** — features (X) and labels (y)
3. **Split into train/validation/test sets**
4. **Train the model** on training data
5. **Evaluate** on validation set, tune hyperparameters
6. **Final evaluation** on held-out test set

### Train/Val/Test Split
\`\`\`python
from sklearn.model_selection import train_test_split

X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42
)
# Result: 70% train, 15% val, 15% test
\`\`\`

### Classification Metrics
\`\`\`python
from sklearn.metrics import (
    accuracy_score, precision_score, 
    recall_score, f1_score, confusion_matrix
)

y_pred = model.predict(X_test)
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.3f}")
print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall:    {recall_score(y_test, y_pred):.3f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.3f}")
\`\`\`

### Overfitting vs Underfitting
- **Underfitting** — model too simple; poor train AND test performance
- **Overfitting** — model memorized training data; great train, poor test
- **Good fit** — good train and test performance

\`\`\`python
# Detect via learning curves
train_score = model.score(X_train, y_train)
val_score = model.score(X_val, y_val)

if train_score - val_score > 0.1:
    print("Likely overfitting — try regularization")
\`\`\``,
          keyTakeaways: [
            "Always hold out a test set and never touch it until final evaluation",
            "Accuracy alone is misleading for imbalanced datasets — use F1/precision/recall",
            "Overfitting = high train score but poor generalization",
            "Cross-validation gives more reliable performance estimates than a single split"
          ],
          practiceQuestions: [
            {
              id: "ml-pq-1-1-1",
              prompt: "Why should the test set never be used during model development?",
              type: "multiple-choice",
              options: [
                "It makes training slower",
                "It prevents data leakage — the test set simulates unseen real-world data",
                "Test sets are only needed for classification, not regression",
                "Using the test set during development is recommended practice"
              ],
              correctAnswer: 1,
              explanation: "If you evaluate on the test set during development and tune based on it, the model is effectively 'seen' the test data, leading to overly optimistic performance estimates."
            },
            {
              id: "ml-pq-1-1-2",
              prompt: "A model achieves 99% accuracy on a fraud detection dataset where 99% of transactions are legitimate. What's the problem?",
              type: "multiple-choice",
              options: [
                "Nothing — 99% accuracy is excellent",
                "The model is predicting all transactions as legitimate (class imbalance problem)",
                "The training set is too large",
                "The model needs more features"
              ],
              correctAnswer: 1,
              explanation: "A naive model predicting 'not fraud' for everything would achieve 99% accuracy. Precision and recall for the fraud class would be 0. Use F1, precision/recall, or AUC-ROC for imbalanced datasets."
            }
          ],
          proofChallenge: {
            id: "ml-proof-1-1",
            title: "ML Evaluation Proof",
            scenario: "Your classifier achieves 95% training accuracy but only 72% validation accuracy. What is the most likely cause and solution?",
            prompt: "Select the correct diagnosis and remedy.",
            type: "multiple-choice",
            options: [
              "Underfitting — use a more complex model",
              "Overfitting — apply regularization, reduce model complexity, or get more training data",
              "Data leakage — re-split your dataset",
              "The validation set is too small — ignore the gap"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies high train/low val gap as overfitting", "Recommends regularization", "Understands the bias-variance tradeoff"],
            explanation: "A large gap between train (95%) and validation (72%) accuracy is the classic sign of overfitting. Solutions: L1/L2 regularization, reduce model depth, dropout (for neural nets), or collect more training data."
          }
        }
      ]
    }
  ]
};

export const REACT_COURSE: Course = {
  id: "course-react",
  slug: "react",
  title: "React: Modern Frontend Engineering",
  tagline: "Build fast, component-driven UIs with React 18 and the modern ecosystem.",
  description: "Complete React course covering components, hooks, state management, performance optimization, and integrating APIs in real-world applications.",
  category: "Development",
  difficulty: "Intermediate",
  estimatedHours: 30,
  iconName: "Layers",
  badgeColor: "sky",
  prerequisites: ["JavaScript (ES6+)", "Basic HTML & CSS"],
  learningOutcomes: [
    "Build reusable, composable React components",
    "Manage state with useState, useReducer, and Context",
    "Handle side effects with useEffect correctly",
    "Optimize React performance with useMemo and useCallback",
    "Fetch and display data from APIs with React Query patterns"
  ],
  resources: [
    { id: "react-r1", title: "React Documentation", provider: "React.dev", type: "documentation", url: "https://react.dev/", description: "Official, modern React documentation with interactive examples.", difficulty: "All Levels", isFree: true },
    { id: "react-r2", title: "Scrimba React Course", provider: "Scrimba", type: "platform", url: "https://scrimba.com/learn/learnreact", description: "Interactive React course with in-browser coding environment.", difficulty: "Beginner", isFree: false },
    { id: "react-r3", title: "Epic React", provider: "Kent C. Dodds", type: "platform", url: "https://epicreact.dev/", description: "Advanced, workshop-style React course from a React core contributor.", difficulty: "Intermediate", isFree: false },
    { id: "react-r4", title: "React Patterns", provider: "reactpatterns.com", type: "tutorial", url: "https://reactpatterns.com/", description: "Common React component patterns explained.", difficulty: "Intermediate", isFree: true }
  ],
  modules: [
    {
      id: "react-mod-1",
      slug: "react-components-hooks",
      title: "Module 1: Components & Hooks",
      description: "Functional components, JSX, and the core React hooks.",
      order: 1,
      lessons: [
        {
          id: "react-les-1-1",
          slug: "hooks-and-state",
          title: "useState, useEffect & Component Lifecycle",
          summary: "Managing state and side effects in functional React components.",
          durationMinutes: 30,
          order: 1,
          content: `### Functional Components
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### useState — Local State
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
    </div>
  );
}
\`\`\`

### useEffect — Side Effects
\`\`\`jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Runs after every render where userId changes
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
      
    // Cleanup function (runs before next effect or unmount)
    return () => {
      // Cancel requests, clear timers, etc.
    };
  }, [userId]); // Dependency array — re-run when userId changes
  
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
\`\`\`

### Key Rules of Hooks
1. Only call hooks at the top level (not inside loops/conditions)
2. Only call hooks from React function components or custom hooks
3. Name custom hooks with the \`use\` prefix`,
          keyTakeaways: [
            "useState returns [value, setter] — never mutate state directly",
            "useEffect dependency array controls when the effect re-runs",
            "Empty [] dependency = run once on mount; no array = run every render",
            "Always return a cleanup function from useEffect when subscribing"
          ],
          practiceQuestions: [
            {
              id: "react-pq-1-1-1",
              prompt: "What happens if you pass an empty array [] as useEffect's dependency?",
              type: "multiple-choice",
              options: [
                "The effect runs on every render",
                "The effect runs only once after the initial mount",
                "The effect never runs",
                "React throws an error"
              ],
              correctAnswer: 1,
              explanation: "An empty dependency array [] means the effect has no dependencies, so it runs once after the first render and never again."
            },
            {
              id: "react-pq-1-1-2",
              prompt: "What is wrong with: const [count, setCount] = useState(0); count++?",
              type: "multiple-choice",
              options: [
                "Nothing — incrementing state directly is fine",
                "It mutates state directly without triggering a re-render",
                "count++ is a syntax error in React",
                "useState doesn't work with numbers"
              ],
              correctAnswer: 1,
              explanation: "Directly mutating state (count++) bypasses React's state management. React won't know the state changed and won't re-render. Always use the setter: setCount(count + 1)."
            }
          ],
          proofChallenge: {
            id: "react-proof-1-1",
            title: "React Hooks Proof",
            scenario: "A component fetches user data on mount but the URL depends on a userId prop. The component is not updating when userId changes.",
            prompt: "What is the most likely cause?",
            type: "multiple-choice",
            options: [
              "useEffect must be replaced with useLayoutEffect for prop-dependent fetching",
              "The userId is missing from the useEffect dependency array",
              "useState cannot hold API response data",
              "The component needs to be a class component to handle prop changes"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies missing dependency as the bug", "Knows dependency array controls re-running", "Understands effect only runs when deps change"],
            explanation: "If userId is not in the dependency array, the effect only runs on mount. Adding userId to the array makes the effect re-run whenever userId changes, triggering a new fetch."
          }
        }
      ]
    }
  ]
};

export const POWER_BI_COURSE: Course = {
  id: "course-power-bi",
  slug: "power-bi",
  title: "Power BI: Business Intelligence & Dashboards",
  tagline: "Transform raw data into interactive dashboards with Power BI.",
  description: "Learn to connect data sources, model relationships, write DAX formulas, and build professional interactive dashboards with Microsoft Power BI.",
  category: "Data Visualization",
  difficulty: "Beginner",
  estimatedHours: 18,
  iconName: "BarChart3",
  badgeColor: "orange",
  prerequisites: ["Basic Excel knowledge"],
  learningOutcomes: [
    "Connect and transform data with Power Query",
    "Model star schemas with relationships in Power BI",
    "Write DAX measures for calculated metrics",
    "Design interactive dashboards with slicers and drill-through",
    "Publish and share reports to Power BI Service"
  ],
  resources: [
    { id: "pbi-r1", title: "Microsoft Learn Power BI", provider: "Microsoft Learn", type: "platform", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", description: "Free official Power BI learning paths from Microsoft.", difficulty: "All Levels", isFree: true },
    { id: "pbi-r2", title: "Power BI Documentation", provider: "Microsoft", type: "documentation", url: "https://learn.microsoft.com/en-us/power-bi/", description: "Complete Power BI documentation and tutorials.", difficulty: "All Levels", isFree: true },
    { id: "pbi-r3", title: "Guy in a Cube (YouTube)", provider: "YouTube", type: "video", url: "https://www.youtube.com/@GuyInACube", description: "Popular Power BI YouTube channel with practical tutorials.", difficulty: "All Levels", isFree: true },
    { id: "pbi-r4", title: "DAX Patterns", provider: "SQLBI", type: "tutorial", url: "https://www.daxpatterns.com/", description: "Comprehensive DAX formula patterns for Power BI.", difficulty: "Intermediate", isFree: true }
  ],
  modules: [
    {
      id: "pbi-mod-1",
      slug: "power-bi-basics",
      title: "Module 1: Power BI Desktop Fundamentals",
      description: "Connecting data, Power Query transformations, and basic visualizations.",
      order: 1,
      lessons: [
        {
          id: "pbi-les-1-1",
          slug: "data-connections-and-power-query",
          title: "Connecting Data & Power Query",
          summary: "Importing data from Excel, CSV, SQL, and transforming it with Power Query.",
          durationMinutes: 25,
          order: 1,
          content: `### Power BI Desktop — Three Views
1. **Report View** — drag-and-drop visualization canvas
2. **Data View** — inspect and edit tables
3. **Model View** — define table relationships

### Connecting to Data Sources
Power BI connects to 100+ data sources:
- Excel / CSV files
- SQL Server, PostgreSQL, MySQL
- Salesforce, Google Analytics
- SharePoint, OneDrive

### Power Query — Transform Before Loading
Power Query is Power BI's ETL engine (M language under the hood).

**Common Transformations:**
- Remove columns
- Filter rows
- Split columns by delimiter
- Change data types
- Merge/append tables
- Pivot/unpivot columns
- Group by and aggregate

**Example Power Query Steps:**
1. Remove empty rows: Home → Remove Rows → Remove Blank Rows
2. Promote first row as headers: Transform → Use First Row as Headers
3. Change type: click column header → change type to Date/Number/Text
4. Filter: click column dropdown → filter values

### Best Practices
- Always transform data in Power Query, not in DAX
- Never load raw data — clean it in Power Query first
- Use descriptive table and column names (no spaces — use underscores)
- Disable "Load" for intermediate/helper queries`,
          keyTakeaways: [
            "Use Power Query for all ETL — cleaner and more maintainable than DAX transformations",
            "Power BI has Report, Data, and Model views for different tasks",
            "Always rename tables and columns before building reports",
            "Query folding in Power Query pushes transformations to the data source for better performance"
          ],
          practiceQuestions: [
            {
              id: "pbi-pq-1-1-1",
              prompt: "What is the purpose of Power Query in Power BI?",
              type: "multiple-choice",
              options: [
                "Create visualizations and charts",
                "Write DAX measures for calculations",
                "Connect, import, and transform data before loading into the model",
                "Publish reports to Power BI Service"
              ],
              correctAnswer: 2,
              explanation: "Power Query is Power BI's ETL layer — it connects to data sources and applies transformations (cleaning, filtering, reshaping) before the data enters the data model."
            },
            {
              id: "pbi-pq-1-1-2",
              prompt: "Where should you perform data transformations in Power BI?",
              type: "multiple-choice",
              options: [
                "In the Report View using visual filters",
                "In Power Query Editor before loading data",
                "In DAX calculated columns",
                "In Excel before importing"
              ],
              correctAnswer: 1,
              explanation: "Power Query (before load) is preferred for transformations — it's applied once, runs efficiently, and keeps the data model clean. DAX transformations run on every query."
            }
          ],
          proofChallenge: {
            id: "pbi-proof-1-1",
            title: "Power BI Data Prep Proof",
            scenario: "You have a sales CSV with a 'Date' column stored as text ('01/15/2024'). Your time intelligence DAX won't work with text dates.",
            prompt: "Where and how do you fix this?",
            type: "multiple-choice",
            options: [
              "Write a DAX calculated column: = DATEVALUE([Date])",
              "Fix it in Power Query: select the column → Change Type → Date",
              "Use a text filter visual to convert it at report time",
              "This cannot be fixed — you need to fix the source CSV"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Uses Power Query not DAX for type conversion", "Knows type conversion is a transformation step", "Understands why text dates break time intelligence"],
            explanation: "Always fix data types in Power Query (Transform → Data Type → Date). This ensures proper date formatting for time intelligence DAX and is more performant than DAX calculated columns."
          }
        }
      ]
    }
  ]
};

export const GIT_DEVOPS_COURSE: Course = {
  id: "course-git-devops",
  slug: "git-and-devops",
  title: "Git, GitHub & DevOps Essentials",
  tagline: "Version control, collaboration workflows, and CI/CD fundamentals every developer needs.",
  description: "Master Git for version control, GitHub for collaboration, and foundational DevOps concepts including CI/CD pipelines, Docker containers, and deployment workflows.",
  category: "Tools & DevOps",
  difficulty: "Beginner",
  estimatedHours: 15,
  iconName: "GitBranch",
  badgeColor: "rose",
  prerequisites: ["Basic command line / terminal"],
  learningOutcomes: [
    "Use Git for version control: commit, branch, merge, rebase",
    "Collaborate on GitHub with pull requests and code review",
    "Understand CI/CD pipeline concepts and GitHub Actions",
    "Work with Docker containers for consistent environments",
    "Apply gitflow and trunk-based development workflows"
  ],
  resources: [
    { id: "git-r1", title: "Pro Git Book", provider: "git-scm.com", type: "book", url: "https://git-scm.com/book/en/v2", description: "Free, comprehensive official Git book.", difficulty: "All Levels", isFree: true },
    { id: "git-r2", title: "GitHub Docs", provider: "GitHub", type: "documentation", url: "https://docs.github.com/", description: "Complete GitHub documentation for all features.", difficulty: "All Levels", isFree: true },
    { id: "git-r3", title: "Learn Git Branching", provider: "learngitbranching.js.org", type: "platform", url: "https://learngitbranching.js.org/", description: "Interactive visual Git learning tool in the browser.", difficulty: "Beginner", isFree: true },
    { id: "git-r4", title: "GitHub Actions Documentation", provider: "GitHub", type: "documentation", url: "https://docs.github.com/en/actions", description: "Official GitHub Actions CI/CD documentation.", difficulty: "Intermediate", isFree: true }
  ],
  modules: [
    {
      id: "git-mod-1",
      slug: "git-fundamentals",
      title: "Module 1: Git Core Concepts",
      description: "Commits, branches, merging, and the Git object model.",
      order: 1,
      lessons: [
        {
          id: "git-les-1-1",
          slug: "commits-and-branches",
          title: "Commits, Branches & Merging",
          summary: "Understanding Git's commit graph, branching, and merge strategies.",
          durationMinutes: 25,
          order: 1,
          content: `### Git's Core Model
Git tracks snapshots (not diffs) using a directed acyclic graph (DAG) of commit objects.

### Essential Git Commands
\`\`\`bash
# Setup
git init                    # Initialize new repo
git clone <url>             # Clone existing repo

# Staging & Committing
git status                  # See changed files
git add .                   # Stage all changes
git add src/file.py         # Stage specific file
git commit -m "feat: add user login"

# Branches
git branch feature/login    # Create branch
git checkout feature/login  # Switch to branch
git checkout -b feature/x   # Create + switch
git branch -d feature/login # Delete merged branch

# Merging
git checkout main
git merge feature/login     # Merge feature into main
\`\`\`

### Commit Message Conventions (Conventional Commits)
\`\`\`
feat: add OAuth login
fix: resolve null pointer in auth middleware  
docs: update API documentation
refactor: extract user service class
test: add unit tests for payment module
chore: upgrade dependencies
\`\`\`

### .gitignore
\`\`\`bash
# Common ignores
node_modules/
.env
.env.local
__pycache__/
*.pyc
.DS_Store
dist/
build/
\`\`\``,
          keyTakeaways: [
            "Git stores snapshots, not diffs — each commit has a full tree object",
            "Branches are just lightweight pointers to commits",
            "Use Conventional Commits format for professional commit messages",
            "Always have a .gitignore to exclude secrets and build artifacts"
          ],
          practiceQuestions: [
            {
              id: "git-pq-1-1-1",
              prompt: "What does 'git checkout -b feature/payment' do?",
              type: "multiple-choice",
              options: [
                "Checks out an existing branch called feature/payment",
                "Creates a new branch called feature/payment and switches to it",
                "Deletes the feature/payment branch",
                "Merges feature/payment into main"
              ],
              correctAnswer: 1,
              explanation: "The -b flag creates a new branch. 'git checkout -b feature/payment' creates the branch AND switches to it in one command."
            },
            {
              id: "git-pq-1-1-2",
              prompt: "Which file should NEVER be committed to a Git repository?",
              type: "multiple-choice",
              options: ["README.md", "package.json", ".env (containing secrets)", "src/index.js"],
              correctAnswer: 2,
              explanation: ".env files contain API keys, database passwords, and other secrets. Always add .env to .gitignore. Secrets committed to git repos are a serious security vulnerability."
            }
          ],
          proofChallenge: {
            id: "git-proof-1-1",
            title: "Git Workflow Proof",
            scenario: "You accidentally committed your .env file with the database password to main. The commit is now in the remote repository.",
            prompt: "What is the correct immediate response?",
            type: "multiple-choice",
            options: [
              "Delete the .env file in the next commit — this is sufficient",
              "Immediately rotate (change) the exposed credentials AND remove the file from git history with git filter-branch or BFG",
              "Make the repository private — this protects the secrets",
              "Add .env to .gitignore — this removes it from git history"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Prioritizes credential rotation immediately", "Knows history must be rewritten", "Understands making private doesn't erase history"],
            explanation: "Deleting the file or making the repo private does NOT remove the secret from git history. You must: 1) Immediately rotate ALL exposed credentials. 2) Remove from history with BFG Repo Cleaner or git filter-repo. 3) Force push and notify all collaborators."
          }
        }
      ]
    }
  ]
};

export const DEEP_LEARNING_COURSE: Course = {
  id: "course-deep-learning",
  slug: "deep-learning",
  title: "Deep Learning with Neural Networks",
  tagline: "From perceptrons to transformers — build and train neural networks with PyTorch.",
  description: "Comprehensive deep learning course covering neural network theory, backpropagation, CNNs, RNNs, attention mechanisms, and building production models with PyTorch.",
  category: "AI & ML",
  difficulty: "Advanced",
  estimatedHours: 40,
  iconName: "Brain",
  badgeColor: "fuchsia",
  prerequisites: ["Python", "Machine Learning fundamentals", "Linear algebra", "Calculus basics"],
  learningOutcomes: [
    "Understand forward/backward propagation mathematically",
    "Build CNNs for image classification tasks",
    "Train RNNs and LSTMs for sequence data",
    "Implement attention mechanisms and self-attention",
    "Optimize training with regularization, batch norm, and schedulers"
  ],
  resources: [
    { id: "dl-r1", title: "PyTorch Documentation", provider: "PyTorch", type: "documentation", url: "https://pytorch.org/docs/stable/", description: "Official PyTorch documentation and tutorials.", difficulty: "All Levels", isFree: true },
    { id: "dl-r2", title: "fast.ai Deep Learning", provider: "fast.ai", type: "platform", url: "https://course.fast.ai/", description: "Top-down practical deep learning course, free.", difficulty: "Intermediate", isFree: true },
    { id: "dl-r3", title: "Deep Learning by Goodfellow", provider: "deeplearningbook.org", type: "book", url: "https://www.deeplearningbook.org/", description: "Free deep learning textbook by Goodfellow, Bengio, Courville.", difficulty: "Advanced", isFree: true },
    { id: "dl-r4", title: "Andrej Karpathy Neural Nets Zero to Hero", provider: "YouTube", type: "video", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", description: "Build neural networks from scratch — exceptional lecture series.", difficulty: "Intermediate", isFree: true }
  ],
  modules: [
    {
      id: "dl-mod-1",
      slug: "neural-network-foundations",
      title: "Module 1: Neural Network Foundations",
      description: "Neurons, activation functions, forward pass, and backpropagation.",
      order: 1,
      lessons: [
        {
          id: "dl-les-1-1",
          slug: "backpropagation",
          title: "Backpropagation & Gradient Descent",
          summary: "How neural networks learn: gradients, chain rule, and parameter updates.",
          durationMinutes: 35,
          order: 1,
          content: `### The Learning Problem
A neural network minimizes a loss function L by adjusting weights W. We need the gradient ∂L/∂W to know which direction to adjust.

### Forward Pass
\`\`\`python
import torch
import torch.nn as nn

# Simple 2-layer network
model = nn.Sequential(
    nn.Linear(784, 256),  # input → hidden
    nn.ReLU(),
    nn.Linear(256, 10),   # hidden → output
)

# Forward pass: compute predictions
x = torch.randn(32, 784)  # batch of 32 images
logits = model(x)          # shape: [32, 10]

# Compute loss
loss_fn = nn.CrossEntropyLoss()
y = torch.randint(0, 10, (32,))
loss = loss_fn(logits, y)
\`\`\`

### Backward Pass — Backpropagation
\`\`\`python
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training loop
for epoch in range(100):
    optimizer.zero_grad()  # Clear accumulated gradients
    
    logits = model(x)      # Forward pass
    loss = loss_fn(logits, y)  # Compute loss
    
    loss.backward()        # Backprop: compute ∂L/∂W for all W
    optimizer.step()       # Update: W = W - lr * ∂L/∂W
    
    if epoch % 10 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")
\`\`\`

### Activation Functions
\`\`\`python
nn.ReLU()      # max(0, x) — most common, avoids vanishing gradients
nn.GELU()      # Smooth ReLU variant — used in transformers
nn.Sigmoid()   # (0,1) output — use for binary classification
nn.Tanh()      # (-1,1) output — rarely used now
nn.Softmax()   # Probability distribution — use for multi-class output
\`\`\``,
          keyTakeaways: [
            "Forward pass: data → predictions. Backward pass: gradients → weight updates",
            "Always call optimizer.zero_grad() before loss.backward() to prevent gradient accumulation",
            "ReLU is the default hidden layer activation — GELU for transformers",
            "CrossEntropyLoss combines LogSoftmax + NLLLoss — don't add softmax before it"
          ],
          practiceQuestions: [
            {
              id: "dl-pq-1-1-1",
              prompt: "Why must you call optimizer.zero_grad() before loss.backward()?",
              type: "multiple-choice",
              options: [
                "To reset the learning rate",
                "PyTorch accumulates gradients by default — zero_grad() prevents adding new gradients to old ones",
                "To clear the model's memory cache",
                "To reset the training loss to 0"
              ],
              correctAnswer: 1,
              explanation: "PyTorch accumulates (adds) gradients each time .backward() is called. Without zero_grad(), you'd be updating weights based on the sum of gradients from all previous iterations, not just the current batch."
            },
            {
              id: "dl-pq-1-1-2",
              prompt: "What is the main advantage of ReLU over Sigmoid for hidden layers?",
              type: "multiple-choice",
              options: [
                "ReLU outputs probabilities like Sigmoid",
                "ReLU mitigates the vanishing gradient problem that affects deep networks using Sigmoid",
                "ReLU is differentiable everywhere",
                "ReLU trains faster because it uses less memory"
              ],
              correctAnswer: 1,
              explanation: "Sigmoid saturates at 0 and 1, where gradients ≈ 0 — gradients vanish in deep networks. ReLU has gradient 1 for positive inputs, allowing gradients to flow through many layers."
            }
          ],
          proofChallenge: {
            id: "dl-proof-1-1",
            title: "Backpropagation Proof",
            scenario: "Your neural network trains for 100 epochs but the loss barely decreases after epoch 5.",
            prompt: "Which is NOT a likely cause?",
            type: "multiple-choice",
            options: [
              "Learning rate is too small",
              "Vanishing gradients in a deep network",
              "The model has too many parameters — more parameters always cause slow convergence",
              "Wrong loss function for the task type"
            ],
            correctAnswer: 2,
            rubricGuidelines: ["Identifies that more params ≠ slower convergence", "Knows actual causes: LR, vanishing grads, wrong loss"],
            explanation: "More parameters don't directly cause slow convergence — they can cause overfitting, but not necessarily slow loss decrease. The actual culprits are: LR too small (tiny steps), vanishing gradients (deep network), or wrong loss function."
          }
        }
      ]
    }
  ]
};

export const STATISTICS_COURSE: Course = {
  id: "course-statistics",
  slug: "statistics",
  title: "Statistics for Data Science",
  tagline: "Probability, inference, and statistical thinking for data-driven decisions.",
  description: "Essential statistics for data science: probability theory, distributions, hypothesis testing, confidence intervals, and regression — with Python and real datasets.",
  category: "Mathematics",
  difficulty: "Beginner",
  estimatedHours: 22,
  iconName: "BarChart3",
  badgeColor: "teal",
  prerequisites: ["Basic math (algebra level)"],
  learningOutcomes: [
    "Understand probability and conditional probability",
    "Work with common statistical distributions",
    "Apply hypothesis testing with p-values correctly",
    "Calculate and interpret confidence intervals",
    "Run simple and multiple linear regression"
  ],
  resources: [
    { id: "stat-r1", title: "Statistics and Probability (Khan Academy)", provider: "Khan Academy", type: "platform", url: "https://www.khanacademy.org/math/statistics-probability", description: "Free comprehensive statistics course with practice.", difficulty: "Beginner", isFree: true },
    { id: "stat-r2", title: "StatQuest with Josh Starmer", provider: "YouTube", type: "video", url: "https://www.youtube.com/@statquest", description: "Excellent visual explanations of statistics and ML concepts.", difficulty: "All Levels", isFree: true },
    { id: "stat-r3", title: "Think Stats", provider: "Allen Downey", type: "book", url: "https://greenteapress.com/wp/think-stats-2e/", description: "Free statistics book with Python code.", difficulty: "Beginner", isFree: true }
  ],
  modules: [
    {
      id: "stat-mod-1",
      slug: "probability-fundamentals",
      title: "Module 1: Probability Fundamentals",
      description: "Events, probability rules, conditional probability, and Bayes theorem.",
      order: 1,
      lessons: [
        {
          id: "stat-les-1-1",
          slug: "probability-and-bayes",
          title: "Probability & Bayes' Theorem",
          summary: "Foundation of statistical reasoning: probability rules and Bayesian updating.",
          durationMinutes: 28,
          order: 1,
          content: `### Basic Probability
P(A) = favorable outcomes / total outcomes

For a fair die: P(roll 6) = 1/6 ≈ 0.167

### Rules of Probability
\`\`\`
P(A or B) = P(A) + P(B) - P(A and B)  [Addition rule]
P(A and B) = P(A) × P(B|A)             [Multiplication rule]
P(A and B) = P(A) × P(B)              [If A, B are independent]
\`\`\`

### Conditional Probability
P(A|B) = P(A and B) / P(B)
"Probability of A GIVEN B has occurred"

### Bayes' Theorem
P(A|B) = [P(B|A) × P(A)] / P(B)

**Medical test example:**
- Disease prevalence: P(D) = 0.01 (1%)
- Test sensitivity: P(pos|D) = 0.99
- Test specificity: P(neg|¬D) = 0.95, so P(pos|¬D) = 0.05

If you test positive, what's P(D|pos)?

\`\`\`python
# Bayes calculation
p_d = 0.01           # prior: disease prevalence
p_pos_given_d = 0.99  # sensitivity
p_pos_given_no_d = 0.05  # false positive rate

p_pos = p_pos_given_d * p_d + p_pos_given_no_d * (1 - p_d)
p_d_given_pos = (p_pos_given_d * p_d) / p_pos

print(f"P(Disease | Positive test): {p_d_given_pos:.1%}")
# ≈ 16.7% — even with positive test, likely no disease!
\`\`\``,
          keyTakeaways: [
            "Probability is between 0 and 1 — all outcomes must sum to 1",
            "Independent events: P(A and B) = P(A) × P(B)",
            "Conditional probability: P(A|B) updates our belief given new evidence",
            "Bayes' theorem: prior × likelihood → posterior — the foundation of Bayesian inference"
          ],
          practiceQuestions: [
            {
              id: "stat-pq-1-1-1",
              prompt: "P(A) = 0.3, P(B) = 0.5, and A and B are independent. What is P(A and B)?",
              type: "multiple-choice",
              options: ["0.8", "0.15", "0.2", "0.35"],
              correctAnswer: 1,
              explanation: "For independent events: P(A and B) = P(A) × P(B) = 0.3 × 0.5 = 0.15."
            },
            {
              id: "stat-pq-1-1-2",
              prompt: "Bayes' theorem is used to:",
              type: "multiple-choice",
              options: [
                "Calculate the mean of a distribution",
                "Update a prior probability with new evidence to get a posterior probability",
                "Test if two groups have equal means",
                "Compute the standard deviation of a sample"
              ],
              correctAnswer: 1,
              explanation: "Bayes' theorem formalizes how to update a prior belief (prior probability) with new evidence (likelihood) to produce an updated belief (posterior probability)."
            }
          ],
          proofChallenge: {
            id: "stat-proof-1-1",
            title: "Probability & Bayes Proof",
            scenario: "A spam filter reports 98% accuracy (correctly classifies 98% of spam as spam). Only 1% of emails are spam. If an email is flagged as spam, is it actually spam?",
            prompt: "Using Bayes' theorem intuition, what is approximately true?",
            type: "multiple-choice",
            options: [
              "The email is definitely spam — 98% accuracy is very high",
              "The email is probably NOT spam — low prior (1% spam rate) dominates",
              "The probability is exactly 98%",
              "Cannot determine without more information"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies that low base rate dominates", "Applies Bayes intuition correctly", "Understands prior × likelihood → posterior"],
            explanation: "With 1% spam rate, 99 out of 100 emails are legitimate. Even with 98% detection, the false positives from 99 legitimate emails (2% × 99 ≈ 2) outnumber true positives (98% × 1 = 0.98). The posterior P(spam|flagged) ≈ 33%, not 98%."
          }
        }
      ]
    }
  ]
};

export const NEXTJS_COURSE: Course = {
  id: "course-nextjs",
  slug: "nextjs",
  title: "Next.js: Full-Stack React Framework",
  tagline: "Build production-ready full-stack applications with Next.js App Router.",
  description: "Master Next.js 14+ with App Router, Server Components, Server Actions, API routes, authentication patterns, and deployment to Vercel.",
  category: "Development",
  difficulty: "Intermediate",
  estimatedHours: 25,
  iconName: "Layers",
  badgeColor: "slate",
  prerequisites: ["React fundamentals", "JavaScript ES6+"],
  learningOutcomes: [
    "Build full-stack apps with Next.js App Router",
    "Use React Server Components to reduce client bundle size",
    "Implement Server Actions for form handling",
    "Configure authentication with middleware",
    "Deploy and optimize Next.js applications"
  ],
  resources: [
    { id: "next-r1", title: "Next.js Documentation", provider: "Vercel/Next.js", type: "documentation", url: "https://nextjs.org/docs", description: "Official comprehensive Next.js documentation.", difficulty: "All Levels", isFree: true },
    { id: "next-r2", title: "Next.js Learn", provider: "Vercel", type: "tutorial", url: "https://nextjs.org/learn", description: "Official free Next.js tutorial — build a dashboard app.", difficulty: "Beginner", isFree: true },
    { id: "next-r3", title: "Vercel Templates", provider: "Vercel", type: "tool", url: "https://vercel.com/templates", description: "Production-ready Next.js starter templates.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "next-mod-1",
      slug: "app-router-fundamentals",
      title: "Module 1: App Router & Rendering Patterns",
      description: "File-based routing, Server Components vs Client Components, and loading/error states.",
      order: 1,
      lessons: [
        {
          id: "next-les-1-1",
          slug: "server-vs-client-components",
          title: "Server vs Client Components",
          summary: "Understanding Next.js rendering model and when to use each component type.",
          durationMinutes: 25,
          order: 1,
          content: `### The App Router Mental Model
Every component in Next.js App Router is a **Server Component by default**.

### Server Components (RSC)
Run only on the server. Zero client-side JavaScript.
\`\`\`tsx
// app/products/page.tsx — Server Component (default)
// Can directly access database, file system, env vars
async function ProductsPage() {
  const products = await db.query("SELECT * FROM products");
  
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`

### Client Components
Add "use client" directive. Required for:
- useState, useEffect, other hooks
- Browser APIs (window, localStorage)
- Event handlers (onClick, onChange)
- Interactive UI

\`\`\`tsx
"use client";

import { useState } from "react";

function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  
  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
\`\`\`

### Key Rule: Composability
\`\`\`tsx
// Server Component can import Client Component
// app/page.tsx (Server Component)
import { AddToCartButton } from "./AddToCartButton"; // Client Component

async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} /> {/* Client */}
    </div>
  );
}
\`\`\`

### File Conventions
\`\`\`
app/
  layout.tsx        # Persistent shell
  page.tsx          # Route page
  loading.tsx       # Suspense loading state
  error.tsx         # Error boundary
  not-found.tsx     # 404 state
  route.ts          # API route handler
\`\`\``,
          keyTakeaways: [
            "All components are Server Components by default — add 'use client' only when needed",
            "Server Components fetch data directly; Client Components handle interactivity",
            "Server Components cannot use hooks or browser APIs",
            "Prefer Server Components to reduce JavaScript sent to the browser"
          ],
          practiceQuestions: [
            {
              id: "next-pq-1-1-1",
              prompt: "Which file triggers a Server Component to use browser APIs?",
              type: "multiple-choice",
              options: ["Adding async to the function", "Adding 'use server' directive", "Adding 'use client' directive at the top", "Importing from 'next/client'"],
              correctAnswer: 2,
              explanation: "'use client' at the top of a file marks it and its imports as a Client Component, enabling hooks and browser APIs."
            },
            {
              id: "next-pq-1-1-2",
              prompt: "Which component type can directly query a database without an API route?",
              type: "multiple-choice",
              options: ["Client Component", "Server Component", "Both equally", "Neither — must use API routes"],
              correctAnswer: 1,
              explanation: "Server Components run exclusively on the server and can directly call databases, read files, and use server-only environment variables without exposing anything to the client."
            }
          ],
          proofChallenge: {
            id: "next-proof-1-1",
            title: "Next.js Components Proof",
            scenario: "You're building a product page that fetches data from a database and has an 'Add to Cart' button that updates local state.",
            prompt: "How should you structure this?",
            type: "multiple-choice",
            options: [
              "Make the entire page a Client Component to support both data fetching and state",
              "Keep the page as a Server Component for data fetching; extract AddToCartButton as a Client Component",
              "Use two separate API routes — one for data, one for cart state",
              "Server Components cannot co-exist with Client Components on the same page"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Server Component for data fetching", "Client Component for interactive button", "Understands composability"],
            explanation: "The correct pattern: Server Component page fetches data (efficient, no client JS), and AddToCartButton is a minimal Client Component for interactivity. This maximizes performance by keeping most code on the server."
          }
        }
      ]
    }
  ]
};
