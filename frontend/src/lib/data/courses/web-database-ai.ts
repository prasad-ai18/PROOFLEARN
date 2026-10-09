import type { Course } from "../course-types";

export const JAVASCRIPT_COURSE: Course = {
  id: "course-javascript",
  slug: "javascript",
  title: "JavaScript: Modern Web Programming",
  tagline: "Master JavaScript from fundamentals to async patterns and modern ES6+ features.",
  description: "A complete JavaScript course covering the language core, DOM manipulation, async/await, closures, prototypes, and modern ES6+ syntax used in production applications.",
  category: "Programming",
  difficulty: "Beginner",
  estimatedHours: 28,
  iconName: "Code",
  badgeColor: "amber",
  prerequisites: ["Basic HTML knowledge"],
  learningOutcomes: [
    "Understand JavaScript's event loop and execution model",
    "Master closures, prototypes, and the 'this' keyword",
    "Write async code with Promises and async/await",
    "Manipulate the DOM and handle browser events",
    "Use modern ES6+ features: destructuring, spread, modules"
  ],
  resources: [
    { id: "js-r1", title: "MDN JavaScript Guide", provider: "Mozilla MDN", type: "documentation", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", description: "The definitive reference for all JavaScript features.", difficulty: "All Levels", isFree: true },
    { id: "js-r2", title: "javascript.info", provider: "javascript.info", type: "tutorial", url: "https://javascript.info/", description: "Modern, comprehensive JavaScript tutorial from basics to advanced.", difficulty: "All Levels", isFree: true },
    { id: "js-r3", title: "freeCodeCamp JavaScript Algorithms", provider: "freeCodeCamp", type: "platform", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", description: "Interactive JS certification with 300+ challenges.", difficulty: "Beginner", isFree: true },
    { id: "js-r4", title: "You Don't Know JS (book series)", provider: "Kyle Simpson", type: "book", url: "https://github.com/getify/You-Dont-Know-JS", description: "Free deep-dive book series on JavaScript internals.", difficulty: "Intermediate", isFree: true }
  ],
  modules: [
    {
      id: "js-mod-1",
      slug: "js-fundamentals",
      title: "Module 1: JavaScript Fundamentals",
      description: "Variables, types, operators, and JavaScript's unique type coercion system.",
      order: 1,
      lessons: [
        {
          id: "js-les-1-1",
          slug: "variables-and-scope",
          title: "Variables: var, let, const & Scope",
          summary: "The difference between var, let, const, and how hoisting and block scope work.",
          durationMinutes: 22,
          order: 1,
          content: `### var vs let vs const
\`\`\`javascript
var x = 1;   // function-scoped, hoisted
let y = 2;   // block-scoped, not hoisted
const z = 3; // block-scoped, immutable binding

// var is hoisted — accessible before declaration
console.log(a); // undefined (not error)
var a = 5;

// let is NOT hoisted the same way
// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 5;
\`\`\`

### Block Scope
\`\`\`javascript
{
  let blockScoped = "only here";
  var functionScoped = "everywhere in function";
}
// console.log(blockScoped); // ReferenceError
console.log(functionScoped); // works
\`\`\`

### const is NOT immutable — just rebind-safe
\`\`\`javascript
const arr = [1, 2, 3];
arr.push(4);        // OK — mutating the object
// arr = [1, 2];    // TypeError — rebinding not allowed
\`\`\``,
          keyTakeaways: [
            "Prefer const by default, let when reassignment needed, avoid var",
            "var is function-scoped and hoisted; let/const are block-scoped",
            "const prevents rebinding, not mutation of the referenced object",
            "The temporal dead zone makes let/const safer than var"
          ],
          practiceQuestions: [
            {
              id: "js-pq-1-1-1",
              prompt: "What does this code output?",
              codeSnippet: "console.log(x);\nvar x = 5;\nconsole.log(x);",
              type: "multiple-choice",
              options: ["ReferenceError, 5", "undefined, 5", "5, 5", "undefined, undefined"],
              correctAnswer: 1,
              explanation: "var declarations are hoisted to the top of their scope with value undefined. The assignment happens on line 2, so the first log prints undefined."
            },
            {
              id: "js-pq-1-1-2",
              prompt: "Which statement about const is TRUE?",
              type: "multiple-choice",
              options: [
                "const makes the value completely immutable",
                "const prevents reassigning the binding but allows mutation of the object",
                "const is block-scoped and hoisted like var",
                "const can only hold primitive values"
              ],
              correctAnswer: 1,
              explanation: "const prevents reassignment of the variable binding, but you can still mutate the object/array it points to."
            }
          ],
          proofChallenge: {
            id: "js-proof-1-1",
            title: "JavaScript Variables Proof",
            scenario: "A junior dev says 'const means the value can never change, so I use it for my counter variable.'",
            prompt: "What is wrong with this reasoning?",
            type: "multiple-choice",
            options: [
              "Nothing — const is always the right choice",
              "const prevents reassignment, so const counter++ would throw a TypeError",
              "const is not block-scoped so it may leak",
              "const variables cannot hold numbers"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies that counter++ requires reassignment", "Knows const prevents rebinding", "Recommends let for mutable counters"],
            explanation: "counter++ is equivalent to counter = counter + 1, which is a reassignment. const prevents this and will throw TypeError at runtime."
          }
        }
      ]
    },
    {
      id: "js-mod-2",
      slug: "async-javascript",
      title: "Module 2: Asynchronous JavaScript",
      description: "Callbacks, Promises, async/await, and the event loop.",
      order: 2,
      lessons: [
        {
          id: "js-les-2-1",
          slug: "promises-and-async-await",
          title: "Promises & async/await",
          summary: "Writing clean async code with Promises and the async/await syntax.",
          durationMinutes: 30,
          order: 1,
          content: `### The Problem with Callbacks
\`\`\`javascript
// Callback hell — hard to read and maintain
fetchUser(id, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});
\`\`\`

### Promises
\`\`\`javascript
const fetchUser = (id) => new Promise((resolve, reject) => {
  if (id > 0) resolve({ id, name: "Ada" });
  else reject(new Error("Invalid ID"));
});

fetchUser(1)
  .then(user => console.log(user.name))
  .catch(err => console.error(err.message));
\`\`\`

### async/await — cleaner syntax
\`\`\`javascript
async function loadUserData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (err) {
    console.error("Failed:", err.message);
    throw err;
  }
}
\`\`\`

### Promise.all for parallel execution
\`\`\`javascript
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
\`\`\``,
          keyTakeaways: [
            "Promises represent a value that may be available in the future",
            "async/await is syntactic sugar over Promises — same behavior",
            "Always handle rejections with .catch() or try/catch in async functions",
            "Use Promise.all() to run independent async operations in parallel"
          ],
          practiceQuestions: [
            {
              id: "js-pq-2-1-1",
              prompt: "What does async/await syntax actually use under the hood?",
              type: "multiple-choice",
              options: ["Callbacks", "Generators", "Promises", "Web Workers"],
              correctAnswer: 2,
              explanation: "async/await is syntactic sugar over Promises. An async function always returns a Promise."
            },
            {
              id: "js-pq-2-1-2",
              prompt: "What is the advantage of Promise.all() over sequential awaits?",
              type: "multiple-choice",
              options: [
                "It runs promises sequentially for better error handling",
                "It runs promises in parallel, reducing total wait time",
                "It cancels other promises if one fails",
                "It guarantees all promises succeed"
              ],
              correctAnswer: 1,
              explanation: "Promise.all() runs all promises concurrently, so total time = max(individual times) instead of sum of all times."
            }
          ],
          proofChallenge: {
            id: "js-proof-2-1",
            title: "Async JavaScript Proof",
            scenario: "You need to fetch user data and their posts simultaneously, then display both.",
            prompt: "Which approach is most efficient?",
            type: "multiple-choice",
            options: [
              "const user = await fetchUser(); const posts = await fetchPosts(user.id);",
              "const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);",
              "fetchUser().then(() => fetchPosts())",
              "Run both in setTimeout callbacks"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Uses Promise.all for parallelism", "Understands sequential await adds latency", "Correct destructuring syntax"],
            explanation: "Promise.all() fetches both simultaneously. Sequential awaits add the latencies together unnecessarily when the requests are independent."
          }
        }
      ]
    }
  ]
};

export const SQL_COURSE: Course = {
  id: "course-sql",
  slug: "sql",
  title: "SQL & Relational Databases",
  tagline: "Query, aggregate, and analyze relational data with professional SQL.",
  description: "Master SQL from basic SELECT statements to complex JOINs, window functions, subqueries, and query optimization strategies used in production data systems.",
  category: "Database",
  difficulty: "Beginner",
  estimatedHours: 20,
  iconName: "Database",
  badgeColor: "blue",
  prerequisites: [],
  learningOutcomes: [
    "Write complex SELECT queries with multiple JOINs",
    "Use aggregate functions with GROUP BY and HAVING",
    "Apply window functions for analytical queries",
    "Design normalized relational schemas",
    "Understand query execution and basic optimization"
  ],
  resources: [
    { id: "sql-r1", title: "SQLite Tutorial", provider: "SQLiteTutorial.net", type: "tutorial", url: "https://www.sqlitetutorial.net/", description: "Free comprehensive SQL tutorial using SQLite.", difficulty: "Beginner", isFree: true },
    { id: "sql-r2", title: "PostgreSQL Documentation", provider: "PostgreSQL.org", type: "documentation", url: "https://www.postgresql.org/docs/current/", description: "Official PostgreSQL reference documentation.", difficulty: "Intermediate", isFree: true },
    { id: "sql-r3", title: "SQL Practice", provider: "SQLZoo", type: "platform", url: "https://sqlzoo.net/", description: "Interactive SQL exercises with instant feedback.", difficulty: "All Levels", isFree: true },
    { id: "sql-r4", title: "Kaggle SQL Course", provider: "Kaggle", type: "platform", url: "https://www.kaggle.com/learn/intro-to-sql", description: "Free hands-on SQL course with BigQuery notebooks.", difficulty: "Beginner", isFree: true },
    { id: "sql-r5", title: "Mode SQL Tutorial", provider: "Mode", type: "tutorial", url: "https://mode.com/sql-tutorial/", description: "Excellent beginner to advanced SQL tutorial with real data.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "sql-mod-1",
      slug: "sql-basics",
      title: "Module 1: SELECT & Filtering",
      description: "Basic queries, filtering with WHERE, ordering, and limiting results.",
      order: 1,
      lessons: [
        {
          id: "sql-les-1-1",
          slug: "select-and-where",
          title: "SELECT, WHERE & ORDER BY",
          summary: "Retrieving specific columns, filtering rows, and ordering results.",
          durationMinutes: 20,
          order: 1,
          content: `### Basic SELECT
\`\`\`sql
-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, salary
FROM employees;
\`\`\`

### WHERE Clause — Filtering Rows
\`\`\`sql
SELECT * FROM employees
WHERE department = 'Engineering'
  AND salary > 75000;

-- Pattern matching
SELECT * FROM products
WHERE name LIKE 'Pro%';   -- starts with "Pro"

-- IN operator
SELECT * FROM orders
WHERE status IN ('pending', 'processing');
\`\`\`

### ORDER BY & LIMIT
\`\`\`sql
SELECT first_name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 10;
\`\`\`

### NULL Handling
\`\`\`sql
-- IS NULL / IS NOT NULL (never use = NULL)
SELECT * FROM employees WHERE manager_id IS NULL;
\`\`\``,
          keyTakeaways: [
            "SELECT specifies columns; * returns all (avoid in production)",
            "WHERE filters rows using conditions; AND/OR combine them",
            "ORDER BY sorts results; DESC for descending",
            "LIMIT restricts result count; use for pagination",
            "Always use IS NULL / IS NOT NULL, never = NULL"
          ],
          practiceQuestions: [
            {
              id: "sql-pq-1-1-1",
              prompt: "Which query finds employees earning between $50,000 and $100,000?",
              type: "multiple-choice",
              options: [
                "SELECT * FROM employees WHERE salary > 50000 AND salary < 100000",
                "SELECT * FROM employees WHERE salary BETWEEN 50000 AND 100000",
                "SELECT * FROM employees WHERE 50000 < salary < 100000",
                "Both A and B are correct"
              ],
              correctAnswer: 3,
              explanation: "Both WHERE salary > 50000 AND salary < 100000 and BETWEEN (inclusive) work. Note: BETWEEN includes the boundary values."
            },
            {
              id: "sql-pq-1-1-2",
              prompt: "How do you check if a column value is NULL in SQL?",
              type: "multiple-choice",
              options: ["WHERE col = NULL", "WHERE col == NULL", "WHERE col IS NULL", "WHERE col = 'NULL'"],
              correctAnswer: 2,
              explanation: "NULL comparisons require IS NULL or IS NOT NULL. Using = NULL always returns false due to SQL's three-valued logic."
            }
          ],
          proofChallenge: {
            id: "sql-proof-1-1",
            title: "SQL Filtering Proof",
            scenario: "You need to find all active premium customers from California who joined in 2024.",
            prompt: "Which WHERE clause is correct?",
            type: "multiple-choice",
            options: [
              "WHERE state = 'CA' AND tier = 'premium' AND status = 'active' AND YEAR(join_date) = 2024",
              "WHERE state = 'CA' OR tier = 'premium' AND status = 'active'",
              "WHERE state IN 'CA' AND tier = 'premium'",
              "WHERE state = 'CA' AND tier = 'premium' OR status = 'active'"
            ],
            correctAnswer: 0,
            rubricGuidelines: ["Uses AND correctly for all conditions", "Filters state, tier, status, and year", "Understands AND vs OR operator precedence"],
            explanation: "Option A correctly uses AND to combine all four conditions. Options B and D mix AND/OR incorrectly. Option C has invalid IN syntax."
          }
        }
      ]
    },
    {
      id: "sql-mod-2",
      slug: "sql-joins",
      title: "Module 2: JOINs & Aggregations",
      description: "Joining multiple tables and aggregating data with GROUP BY.",
      order: 2,
      lessons: [
        {
          id: "sql-les-2-1",
          slug: "joins",
          title: "INNER, LEFT, RIGHT & FULL JOINs",
          summary: "Combining rows from multiple tables using different JOIN types.",
          durationMinutes: 28,
          order: 1,
          content: `### INNER JOIN — matching rows only
\`\`\`sql
SELECT o.order_id, c.name, o.total
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;
\`\`\`

### LEFT JOIN — all left rows, matched or NULL
\`\`\`sql
-- Show all customers, even those with no orders
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
\`\`\`

### Practical Multi-Table Query
\`\`\`sql
SELECT 
  e.first_name,
  e.last_name,
  d.name AS department,
  m.first_name AS manager
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY d.name, e.last_name;
\`\`\``,
          keyTakeaways: [
            "INNER JOIN returns only rows with matches in both tables",
            "LEFT JOIN returns all left rows, NULL for unmatched right",
            "Always specify ON conditions to avoid accidental Cartesian products",
            "Use table aliases for readability in multi-table queries"
          ],
          practiceQuestions: [
            {
              id: "sql-pq-2-1-1",
              prompt: "Which JOIN includes customers who have no orders?",
              type: "multiple-choice",
              options: ["INNER JOIN", "LEFT JOIN from customers", "RIGHT JOIN from orders", "Both B and C"],
              correctAnswer: 3,
              explanation: "LEFT JOIN from customers includes all customers (with NULL for orders). RIGHT JOIN from orders also shows all right-side rows—but here that's orders, not customers. B is the correct answer for this specific scenario."
            },
            {
              id: "sql-pq-2-1-2",
              prompt: "What happens if you forget the ON clause in a JOIN?",
              type: "multiple-choice",
              options: [
                "SQL returns an error",
                "SQL returns only matching rows",
                "SQL produces a Cartesian product (all combinations)",
                "SQL uses primary keys automatically"
              ],
              correctAnswer: 2,
              explanation: "Without ON, SQL performs a cross join (Cartesian product), returning every row from table A combined with every row from table B."
            }
          ],
          proofChallenge: {
            id: "sql-proof-2-1",
            title: "SQL JOINs Proof",
            scenario: "You need a report of all products and their order counts, including products that have never been ordered (showing 0).",
            prompt: "Which query structure is correct?",
            type: "multiple-choice",
            options: [
              "SELECT p.name, COUNT(o.id) FROM products p INNER JOIN orders o ON p.id = o.product_id GROUP BY p.id",
              "SELECT p.name, COUNT(o.id) FROM products p LEFT JOIN orders o ON p.id = o.product_id GROUP BY p.id",
              "SELECT p.name, COUNT(*) FROM orders o RIGHT JOIN products p ON o.product_id = p.id",
              "Options B and C produce identical results"
            ],
            correctAnswer: 3,
            rubricGuidelines: ["Uses LEFT JOIN (or equivalent RIGHT JOIN)", "Understands NULL products need outer join", "Groups by product"],
            explanation: "Both B (LEFT JOIN from products) and C (RIGHT JOIN from orders with products on right) produce the same result—all products including unordered ones. INNER JOIN in A would exclude unordered products."
          }
        }
      ]
    }
  ]
};

export const GENERATIVE_AI_COURSE: Course = {
  id: "course-generative-ai",
  slug: "generative-ai",
  title: "Generative AI: Concepts to Applications",
  tagline: "Understand and build with generative AI — from transformers to production apps.",
  description: "Comprehensive course on generative AI covering large language models, diffusion models, prompt engineering, RAG systems, and building production AI applications.",
  category: "AI & ML",
  difficulty: "Intermediate",
  estimatedHours: 25,
  iconName: "Brain",
  badgeColor: "purple",
  prerequisites: ["Basic Python", "Basic Machine Learning concepts"],
  learningOutcomes: [
    "Understand how large language models (LLMs) work",
    "Write effective prompts using structured techniques",
    "Build RAG systems for domain-specific AI applications",
    "Evaluate and improve AI model outputs",
    "Deploy generative AI applications responsibly"
  ],
  resources: [
    { id: "genai-r1", title: "Google AI for Developers", provider: "Google", type: "documentation", url: "https://ai.google.dev/", description: "Official Google Gemini API documentation and tutorials.", difficulty: "All Levels", isFree: true },
    { id: "genai-r2", title: "Hugging Face Course", provider: "Hugging Face", type: "tutorial", url: "https://huggingface.co/learn/nlp-course/", description: "Free NLP and transformer model course from the leading AI hub.", difficulty: "Intermediate", isFree: true },
    { id: "genai-r3", title: "Microsoft AI Fundamentals", provider: "Microsoft Learn", type: "platform", url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/", description: "Free AI fundamentals learning path from Microsoft.", difficulty: "Beginner", isFree: true },
    { id: "genai-r4", title: "Andrej Karpathy: Intro to LLMs", provider: "YouTube", type: "video", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", description: "Expert 1-hour introduction to large language models.", difficulty: "Intermediate", isFree: true },
    { id: "genai-r5", title: "Prompt Engineering Guide", provider: "DAIR.AI", type: "documentation", url: "https://www.promptingguide.ai/", description: "Comprehensive open-source prompt engineering guide.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "genai-mod-1",
      slug: "llm-fundamentals",
      title: "Module 1: How LLMs Work",
      description: "Tokens, transformers, context windows, and how language models generate text.",
      order: 1,
      lessons: [
        {
          id: "genai-les-1-1",
          slug: "transformers-and-tokens",
          title: "Transformers, Tokens & Attention",
          summary: "The architecture behind GPT, Gemini, Claude — transformers and self-attention explained.",
          durationMinutes: 25,
          order: 1,
          content: `### What is a Large Language Model?
A Large Language Model (LLM) is a neural network trained on vast amounts of text to predict the next token. Models like GPT-4, Gemini, and Claude are all transformer-based LLMs.

### Tokenization
Text is not processed as characters or words — it's split into **tokens**.
- "Hello world" → ["Hello", " world"] (2 tokens)
- "unbelievable" → ["un", "believ", "able"] (3 tokens)
- ~4 characters ≈ 1 token on average

### The Transformer Architecture
The transformer uses **self-attention** to weigh relationships between all tokens in a sequence simultaneously.

Key components:
1. **Embedding layer** — converts tokens to dense vectors
2. **Multi-head self-attention** — captures relationships between tokens
3. **Feed-forward layers** — transform representations
4. **Output layer** — predicts next token probabilities

### Context Window
The maximum number of tokens a model can process at once.
- GPT-4: 128K tokens
- Gemini 1.5 Pro: 1M tokens
- Claude 3.5: 200K tokens

Exceeding the context window causes information loss (older tokens are truncated).

### Temperature & Sampling
- **Temperature 0** = deterministic (most likely token always)
- **Temperature 1** = balanced creativity
- **Temperature > 1** = more random/creative
- **Top-p (nucleus) sampling** = sample from top-p probability mass`,
          keyTakeaways: [
            "LLMs predict the next token based on all previous context",
            "Tokenization splits text into sub-word units, not whole words",
            "Self-attention allows the model to relate any token to any other",
            "Context window limits how much text the model can 'see' at once",
            "Temperature controls output randomness — 0 = deterministic"
          ],
          practiceQuestions: [
            {
              id: "genai-pq-1-1-1",
              prompt: "What does an LLM fundamentally do?",
              type: "multiple-choice",
              options: [
                "Searches the internet for answers",
                "Predicts the next most likely token given the context",
                "Looks up facts from a database",
                "Executes code to generate responses"
              ],
              correctAnswer: 1,
              explanation: "LLMs are trained to predict the next token. Through massive scale training, this simple objective leads to emergent reasoning capabilities."
            },
            {
              id: "genai-pq-1-1-2",
              prompt: "What happens when you set temperature to 0?",
              type: "multiple-choice",
              options: [
                "The model refuses to answer",
                "The model always picks the highest probability token (deterministic)",
                "The model becomes more creative",
                "The model uses less memory"
              ],
              correctAnswer: 1,
              explanation: "Temperature 0 makes the model deterministic — it always selects the most probable next token, resulting in consistent, predictable outputs."
            }
          ],
          proofChallenge: {
            id: "genai-proof-1-1",
            title: "LLM Architecture Proof",
            scenario: "A user wants to send a 500-page novel to an LLM for summarization but gets an error about context length.",
            prompt: "What is causing this issue and what should the user do?",
            type: "multiple-choice",
            options: [
              "The model doesn't understand literature — use a different model type",
              "The novel exceeds the model's context window — chunk it or use a model with larger context",
              "LLMs cannot summarize — use a specialized summarization API",
              "The API is broken — retry the request"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies context window as the constraint", "Suggests chunking as a solution", "Knows larger context models exist"],
            explanation: "Context window limits how much text an LLM processes at once. Solutions: chunk the document and summarize pieces, or use a model with larger context (Gemini 1.5 Pro at 1M tokens)."
          }
        }
      ]
    },
    {
      id: "genai-mod-2",
      slug: "prompt-engineering",
      title: "Module 2: Prompt Engineering",
      description: "Techniques for writing effective prompts: zero-shot, few-shot, chain-of-thought, and structured outputs.",
      order: 2,
      lessons: [
        {
          id: "genai-les-2-1",
          slug: "prompting-techniques",
          title: "Zero-Shot, Few-Shot & Chain-of-Thought",
          summary: "Core prompting techniques that dramatically improve LLM output quality.",
          durationMinutes: 28,
          order: 1,
          content: `### Zero-Shot Prompting
No examples provided — rely on the model's training.
\`\`\`
Classify this review as positive or negative:
"The product broke after one week. Very disappointed."
\`\`\`

### Few-Shot Prompting
Provide examples to guide the model:
\`\`\`
Classify these reviews:
Review: "Amazing quality!" → Positive
Review: "Arrived broken." → Negative  
Review: "Decent for the price." → Neutral

Review: "The product broke after one week. Very disappointed."
→
\`\`\`

### Chain-of-Thought (CoT)
Ask the model to reason step-by-step:
\`\`\`
Solve this step by step:
A train travels 120 miles in 2 hours. Another train 
travels 90 miles in 1.5 hours. Which is faster?

Let me think through this:
Step 1: Train A speed = 120/2 = 60 mph
Step 2: Train B speed = 90/1.5 = 60 mph
Step 3: Both trains travel at the same speed.
\`\`\`

### Structured Output
Request specific formats:
\`\`\`
Extract information from this text and return as JSON:
{"name": "...", "email": "...", "company": "..."}

Text: "Hi, I'm Ada Lovelace from DeepMind. 
Reach me at ada@deepmind.com"
\`\`\`

### System Prompts
Set persistent behavior/persona:
\`\`\`
System: You are a senior Python engineer. 
Always explain code clearly with comments.
Prefer readability over cleverness.

User: Write a function to flatten nested lists.
\`\`\``,
          keyTakeaways: [
            "Few-shot examples dramatically improve accuracy for structured tasks",
            "Chain-of-thought prompting improves reasoning for math/logic tasks",
            "System prompts define persistent model behavior and persona",
            "Request JSON output for programmatic processing of LLM responses",
            "Be specific and explicit — LLMs follow instructions literally"
          ],
          practiceQuestions: [
            {
              id: "genai-pq-2-1-1",
              prompt: "Which technique is most effective for improving LLM performance on math word problems?",
              type: "multiple-choice",
              options: [
                "Zero-shot prompting with a clean question",
                "Chain-of-thought prompting asking for step-by-step reasoning",
                "Increasing temperature to 1.5",
                "Making the prompt shorter"
              ],
              correctAnswer: 1,
              explanation: "Chain-of-thought prompting significantly improves LLM performance on reasoning tasks by forcing step-by-step thinking before the final answer."
            },
            {
              id: "genai-pq-2-1-2",
              prompt: "What is a system prompt?",
              type: "multiple-choice",
              options: [
                "The initial greeting message from the user",
                "A special instruction that sets the model's behavior and persona for the conversation",
                "A backend code instruction sent to the GPU",
                "An error message when the model fails"
              ],
              correctAnswer: 1,
              explanation: "System prompts define the model's behavior, persona, constraints, and response format for the entire conversation."
            }
          ],
          proofChallenge: {
            id: "genai-proof-2-1",
            title: "Prompt Engineering Proof",
            scenario: "You're building a customer support bot that must classify inquiries into: Billing, Technical, General. It's giving inconsistent results.",
            prompt: "Which prompting approach would most improve consistency?",
            type: "multiple-choice",
            options: [
              "Use zero-shot with a simple instruction",
              "Increase the temperature for more variety",
              "Use few-shot examples showing correct classifications for each category",
              "Use chain-of-thought and ask it to reason about the category"
            ],
            correctAnswer: 2,
            rubricGuidelines: ["Identifies few-shot as best for classification", "Understands examples guide consistent categorization", "Knows temperature shouldn't increase for consistency"],
            explanation: "Few-shot examples showing at least one example per category calibrate the model's classification boundaries. Temperature should be kept LOW (not increased) for consistency tasks."
          }
        }
      ]
    }
  ]
};
