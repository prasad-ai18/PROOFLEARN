import type { Course } from "../course-types";

export const JAVA_COURSE: Course = {
  id: "course-java",
  slug: "java",
  title: "Java Programming & OOP",
  tagline: "Master Java from fundamentals to enterprise patterns and the Collections framework.",
  description: "Complete Java course covering Java 17+ features, object-oriented design, the Collections framework, concurrency basics, and building production-grade applications.",
  category: "Programming",
  difficulty: "Beginner",
  estimatedHours: 32,
  iconName: "Coffee",
  badgeColor: "red",
  prerequisites: [],
  learningOutcomes: [
    "Write strongly-typed Java programs with classes and interfaces",
    "Apply OOP principles: encapsulation, inheritance, polymorphism",
    "Use the Java Collections framework effectively",
    "Handle exceptions with try/catch/finally",
    "Write concurrent code with threads and the ExecutorService"
  ],
  resources: [
    { id: "java-r1", title: "Oracle Java Documentation", provider: "Oracle", type: "documentation", url: "https://docs.oracle.com/en/java/", description: "Official Java SE documentation and API reference.", difficulty: "All Levels", isFree: true },
    { id: "java-r2", title: "Baeldung Java Tutorials", provider: "Baeldung", type: "tutorial", url: "https://www.baeldung.com/", description: "High-quality in-depth Java tutorials and guides.", difficulty: "All Levels", isFree: true },
    { id: "java-r3", title: "Effective Java (book)", provider: "Joshua Bloch", type: "book", url: "https://www.oreilly.com/library/view/effective-java/9780134686097/", description: "The definitive guide to best practices in Java programming.", difficulty: "Intermediate", isFree: false },
    { id: "java-r4", title: "Java Programming MOOC", provider: "University of Helsinki", type: "platform", url: "https://java-programming.mooc.fi/", description: "Free university-level Java course with exercises.", difficulty: "Beginner", isFree: true }
  ],
  modules: [
    {
      id: "java-mod-1",
      slug: "java-oop",
      title: "Module 1: Object-Oriented Java",
      description: "Classes, objects, encapsulation, inheritance, and interfaces.",
      order: 1,
      lessons: [
        {
          id: "java-les-1-1",
          slug: "classes-and-objects",
          title: "Classes, Objects & Encapsulation",
          summary: "Defining classes, constructors, instance variables, and access modifiers.",
          durationMinutes: 30,
          order: 1,
          content: `### Classes vs Objects
A **class** is a blueprint. An **object** is an instance of that blueprint.

\`\`\`java
public class BankAccount {
    // Fields (instance variables)
    private String owner;
    private double balance;
    
    // Constructor
    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }
    
    // Getter (accessor)
    public double getBalance() {
        return balance;
    }
    
    // Method with validation
    public boolean deposit(double amount) {
        if (amount <= 0) return false;
        balance += amount;
        return true;
    }
    
    public boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
    
    @Override
    public String toString() {
        return String.format("BankAccount[%s, $%.2f]", owner, balance);
    }
}
\`\`\`

### Creating Objects
\`\`\`java
BankAccount account = new BankAccount("Ada", 1000.0);
account.deposit(500.0);
account.withdraw(200.0);
System.out.println(account.getBalance()); // 1300.0
System.out.println(account);  // BankAccount[Ada, $1300.00]
\`\`\`

### Access Modifiers
| Modifier | Class | Package | Subclass | World |
|----------|-------|---------|----------|-------|
| private  | ✓     | ✗       | ✗        | ✗     |
| (default)| ✓     | ✓       | ✗        | ✗     |
| protected| ✓     | ✓       | ✓        | ✗     |
| public   | ✓     | ✓       | ✓        | ✓     |`,
          keyTakeaways: [
            "Keep fields private — expose behavior through public methods (encapsulation)",
            "Constructors initialize object state; use this.field for disambiguation",
            "Override toString() for meaningful string representation",
            "Validate inputs in setters/methods — don't trust callers"
          ],
          practiceQuestions: [
            {
              id: "java-pq-1-1-1",
              prompt: "Why should class fields be private?",
              type: "multiple-choice",
              options: [
                "Private fields use less memory",
                "Encapsulation: hiding implementation details prevents external code from corrupting internal state",
                "Private fields run faster than public ones",
                "Java requires private fields"
              ],
              correctAnswer: 1,
              explanation: "Encapsulation (making fields private) means external code cannot directly corrupt an object's state. You control access through methods that can validate inputs."
            },
            {
              id: "java-pq-1-1-2",
              prompt: "What does 'this' refer to in a Java method?",
              type: "multiple-choice",
              options: [
                "The class itself (static reference)",
                "The current object instance",
                "The parent class",
                "The constructor"
              ],
              correctAnswer: 1,
              explanation: "'this' refers to the current object instance. It's used to disambiguate instance variables from parameters with the same name."
            }
          ],
          proofChallenge: {
            id: "java-proof-1-1",
            title: "Java OOP Proof",
            scenario: "A student makes the balance field public: 'public double balance'. Another developer then writes: account.balance = -999999;",
            prompt: "What design principle does this violate and how do you fix it?",
            type: "multiple-choice",
            options: [
              "No violation — public fields are fine in Java",
              "Violates encapsulation — make balance private and expose it only through validated methods",
              "Violates inheritance — use abstract class instead",
              "Violates polymorphism — add more method overrides"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies encapsulation violation", "Knows to make fields private", "Understands validation in methods"],
            explanation: "Public fields destroy encapsulation — any code can set balance to -999999 bypassing business rules. Solution: private double balance; with withdraw() and deposit() methods that validate before modifying."
          }
        }
      ]
    }
  ]
};

export const TYPESCRIPT_COURSE: Course = {
  id: "course-typescript",
  slug: "typescript",
  title: "TypeScript: Typed JavaScript at Scale",
  tagline: "Add static types to JavaScript to catch bugs at compile time, not runtime.",
  description: "Learn TypeScript from basic type annotations to advanced patterns: generics, utility types, discriminated unions, and type-safe API patterns used in production codebases.",
  category: "Programming",
  difficulty: "Intermediate",
  estimatedHours: 20,
  iconName: "Code",
  badgeColor: "blue",
  prerequisites: ["JavaScript ES6+"],
  learningOutcomes: [
    "Annotate variables, functions, and objects with TypeScript types",
    "Write generic functions and classes",
    "Use union types, intersection types, and type guards",
    "Apply utility types: Partial, Required, Pick, Omit, Record",
    "Configure tsconfig.json for production projects"
  ],
  resources: [
    { id: "ts-r1", title: "TypeScript Handbook", provider: "TypeScript.org", type: "documentation", url: "https://www.typescriptlang.org/docs/handbook/", description: "Official TypeScript handbook — comprehensive and well-organized.", difficulty: "All Levels", isFree: true },
    { id: "ts-r2", title: "TypeScript Exercises", provider: "typescript-exercises.github.io", type: "platform", url: "https://typescript-exercises.github.io/", description: "Interactive TypeScript exercises from beginner to advanced.", difficulty: "All Levels", isFree: true },
    { id: "ts-r3", title: "Total TypeScript", provider: "Matt Pocock", type: "platform", url: "https://www.totaltypescript.com/", description: "Advanced TypeScript tutorials from a TypeScript community expert.", difficulty: "Intermediate", isFree: false }
  ],
  modules: [
    {
      id: "ts-mod-1",
      slug: "typescript-types",
      title: "Module 1: TypeScript Type System",
      description: "Basic types, interfaces, type aliases, and union/intersection types.",
      order: 1,
      lessons: [
        {
          id: "ts-les-1-1",
          slug: "types-and-interfaces",
          title: "Types, Interfaces & Union Types",
          summary: "Defining shapes for data with TypeScript's type system.",
          durationMinutes: 25,
          order: 1,
          content: `### Basic Type Annotations
\`\`\`typescript
let name: string = "Ada";
let age: number = 42;
let isActive: boolean = true;
let ids: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 42];

// Function types
function greet(name: string): string {
    return \`Hello, \${name}\`;
}
\`\`\`

### Interfaces — Object Shapes
\`\`\`typescript
interface User {
    id: number;
    name: string;
    email: string;
    role?: "admin" | "user"; // optional field with literal types
    readonly createdAt: Date; // readonly — cannot reassign
}

function createUser(data: Omit<User, "id" | "createdAt">): User {
    return {
        id: Math.random(),
        createdAt: new Date(),
        ...data
    };
}
\`\`\`

### Union & Intersection Types
\`\`\`typescript
// Union — value can be one of several types
type ID = string | number;
type Status = "pending" | "active" | "cancelled";

// Discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle": return Math.PI * shape.radius ** 2;
        case "rect":   return shape.width * shape.height;
    }
}
\`\`\`

### Generics
\`\`\`typescript
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

const firstNum = first([1, 2, 3]);    // type: number | undefined
const firstStr = first(["a", "b"]);   // type: string | undefined
\`\`\``,
          keyTakeaways: [
            "Interfaces define object shapes; type aliases work for all type expressions",
            "Union types (A | B) mean a value can be A or B — use type guards to narrow",
            "Discriminated unions with a 'kind' field enable exhaustive switch checking",
            "Generics allow reusable, type-safe functions and data structures"
          ],
          practiceQuestions: [
            {
              id: "ts-pq-1-1-1",
              prompt: "What does 'string | number' mean in TypeScript?",
              type: "multiple-choice",
              options: [
                "A type that must be both string AND number simultaneously",
                "A union type that can be either string OR number",
                "An intersection type combining string and number",
                "A tuple type with string at index 0 and number at index 1"
              ],
              correctAnswer: 1,
              explanation: "The | operator creates a union type — the value can be any one of the listed types. Use type guards (typeof, instanceof) to narrow a union to a specific type."
            },
            {
              id: "ts-pq-1-1-2",
              prompt: "What is the purpose of the 'readonly' modifier on an interface field?",
              type: "multiple-choice",
              options: [
                "The field is hidden from external code",
                "The field cannot be reassigned after object creation",
                "The field must be set in the constructor",
                "The field is optional"
              ],
              correctAnswer: 1,
              explanation: "readonly prevents reassignment of the property after the object is created. It's TypeScript's compile-time equivalent of const for object properties."
            }
          ],
          proofChallenge: {
            id: "ts-proof-1-1",
            title: "TypeScript Types Proof",
            scenario: "You're writing a function that processes either a string ID or a numeric ID from an API. You must handle each type differently.",
            prompt: "Which TypeScript pattern is most appropriate?",
            type: "multiple-choice",
            options: [
              "Use 'any' type to accept both",
              "Write two separate functions",
              "Use a union type 'string | number' with a typeof guard to branch",
              "Cast everything to string with .toString()"
            ],
            correctAnswer: 2,
            rubricGuidelines: ["Uses union type for flexible input", "Uses typeof guard for type narrowing", "Avoids 'any' which loses type safety"],
            explanation: "Union types (string | number) with typeof guards give type-safe handling of multiple possible types. Using 'any' loses all type safety. Two functions work but aren't DRY. toString() forces one path, losing information."
          }
        }
      ]
    }
  ]
};

export const DOCKER_COURSE: Course = {
  id: "course-docker",
  slug: "docker",
  title: "Docker: Container Fundamentals",
  tagline: "Package and run any application consistently across any environment.",
  description: "Learn Docker from first principles: images, containers, Dockerfiles, volumes, networking, Docker Compose, and containerizing real applications.",
  category: "Tools & DevOps",
  difficulty: "Beginner",
  estimatedHours: 14,
  iconName: "Box",
  badgeColor: "sky",
  prerequisites: ["Basic command line"],
  learningOutcomes: [
    "Understand Docker's container model vs virtual machines",
    "Build custom Docker images with Dockerfiles",
    "Manage data with volumes and bind mounts",
    "Orchestrate multi-container apps with Docker Compose",
    "Push and pull images from Docker Hub"
  ],
  resources: [
    { id: "docker-r1", title: "Docker Official Documentation", provider: "Docker", type: "documentation", url: "https://docs.docker.com/", description: "Complete official Docker documentation.", difficulty: "All Levels", isFree: true },
    { id: "docker-r2", title: "Play with Docker", provider: "Docker", type: "platform", url: "https://labs.play-with-docker.com/", description: "Free browser-based Docker lab environment.", difficulty: "Beginner", isFree: true },
    { id: "docker-r3", title: "Docker for Beginners", provider: "freeCodeCamp", type: "video", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", description: "Free 2-hour Docker beginner course on YouTube.", difficulty: "Beginner", isFree: true }
  ],
  modules: [
    {
      id: "docker-mod-1",
      slug: "docker-fundamentals",
      title: "Module 1: Images & Containers",
      description: "Docker's architecture, running containers, and building images.",
      order: 1,
      lessons: [
        {
          id: "docker-les-1-1",
          slug: "containers-and-images",
          title: "Containers, Images & Dockerfiles",
          summary: "The difference between images and containers, and writing Dockerfiles.",
          durationMinutes: 25,
          order: 1,
          content: `### Container vs Virtual Machine
- **VM** — emulates entire hardware, includes full OS kernel (~GBs, minutes to start)
- **Container** — shares host kernel, isolates processes using namespaces (~MBs, milliseconds to start)

### Docker Key Concepts
- **Image** — read-only blueprint (layers of filesystem changes)
- **Container** — running instance of an image (adds writable layer)
- **Registry** — storage for images (Docker Hub, ECR, GCR)

### Basic Docker Commands
\`\`\`bash
# Pull and run
docker pull nginx
docker run -d -p 8080:80 --name webserver nginx

# List containers
docker ps           # running
docker ps -a        # all including stopped

# Execute in running container
docker exec -it webserver bash

# Logs and cleanup
docker logs webserver
docker stop webserver && docker rm webserver
\`\`\`

### Writing a Dockerfile
\`\`\`dockerfile
# Start from official Python image
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run as non-root user (security best practice)
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose port and define entrypoint
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Build and Run
\`\`\`bash
docker build -t myapp:1.0 .
docker run -d -p 8000:8000 myapp:1.0
\`\`\``,
          keyTakeaways: [
            "Images are read-only templates; containers are writable running instances",
            "Copy requirements.txt before code to leverage Docker layer caching",
            "Always run as non-root user in production containers",
            "Use slim/alpine base images to minimize attack surface and image size"
          ],
          practiceQuestions: [
            {
              id: "docker-pq-1-1-1",
              prompt: "Why should you COPY requirements.txt before COPY . . in a Dockerfile?",
              type: "multiple-choice",
              options: [
                "Python requires dependency files first",
                "Docker caches layers — copying dependencies first means the RUN pip install layer is reused when only code changes",
                "It reduces the final image size",
                "The order doesn't matter in Dockerfiles"
              ],
              correctAnswer: 1,
              explanation: "Docker caches layers. If requirements.txt hasn't changed, the pip install layer is reused. If you copy all code first, any code change invalidates the pip install cache, causing slow rebuilds."
            },
            {
              id: "docker-pq-1-1-2",
              prompt: "What is the difference between docker stop and docker rm?",
              type: "multiple-choice",
              options: [
                "They are the same command",
                "stop halts a running container; rm removes a stopped container permanently",
                "stop removes the container; rm removes the image",
                "stop pauses the container; rm restarts it"
              ],
              correctAnswer: 1,
              explanation: "docker stop sends SIGTERM to gracefully halt a running container. docker rm permanently removes a stopped container. To stop and remove: docker stop <name> && docker rm <name>, or docker rm -f <name>."
            }
          ],
          proofChallenge: {
            id: "docker-proof-1-1",
            title: "Docker Fundamentals Proof",
            scenario: "Your Dockerfile runs pip install before copying application code, but you want the pip install to be cached on subsequent builds.",
            prompt: "Which Dockerfile order is correct for optimal caching?",
            type: "multiple-choice",
            options: [
              "COPY . . → RUN pip install → COPY requirements.txt .",
              "COPY requirements.txt . → RUN pip install → COPY . .",
              "RUN pip install → COPY requirements.txt . → COPY . .",
              "The order of COPY and RUN doesn't affect caching"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Copies requirements.txt first", "Runs pip install before copying code", "Understands layer caching invalidation"],
            explanation: "Copy requirements.txt → RUN pip install → copy code. This way, pip install is only re-run when requirements.txt changes. Copying all code first means every code change triggers a pip reinstall."
          }
        }
      ]
    }
  ]
};

export const PROMPT_ENGINEERING_COURSE: Course = {
  id: "course-prompt-engineering",
  slug: "prompt-engineering",
  title: "Prompt Engineering & AI Interaction",
  tagline: "Write prompts that consistently get accurate, useful results from AI models.",
  description: "Learn systematic prompt engineering techniques: structured prompting, role prompting, chain-of-thought, retrieval-augmented generation, and evaluation frameworks.",
  category: "AI & ML",
  difficulty: "Beginner",
  estimatedHours: 12,
  iconName: "Sparkles",
  badgeColor: "amber",
  prerequisites: ["Basic understanding of AI/LLMs"],
  learningOutcomes: [
    "Apply structured prompting templates for consistent results",
    "Use role prompting, chain-of-thought, and few-shot techniques",
    "Evaluate prompt quality with systematic testing",
    "Build prompt libraries for repeated use cases",
    "Implement prompt guardrails for safety and accuracy"
  ],
  resources: [
    { id: "pe-r1", title: "Prompt Engineering Guide", provider: "DAIR.AI", type: "documentation", url: "https://www.promptingguide.ai/", description: "Comprehensive open-source prompt engineering resource.", difficulty: "All Levels", isFree: true },
    { id: "pe-r2", title: "Google Prompting Essentials", provider: "Google", type: "platform", url: "https://grow.google/intl/en_us/guide-to-prompting-for-work/", description: "Google's guide to effective workplace prompting.", difficulty: "Beginner", isFree: true },
    { id: "pe-r3", title: "Learn Prompting", provider: "learnprompting.org", type: "tutorial", url: "https://learnprompting.org/", description: "Community-written guide to prompt engineering.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "pe-mod-1",
      slug: "prompting-foundations",
      title: "Module 1: Prompting Foundations",
      description: "Core prompt components and the anatomy of effective prompts.",
      order: 1,
      lessons: [
        {
          id: "pe-les-1-1",
          slug: "anatomy-of-a-prompt",
          title: "Anatomy of an Effective Prompt",
          summary: "Breaking down prompts into components: context, instruction, format, and constraints.",
          durationMinutes: 20,
          order: 1,
          content: `### The Four Pillars of an Effective Prompt

**1. Role / Persona**
Set who the model should act as:
\`You are a senior software engineer specializing in Python and system design.\`

**2. Context / Background**
Provide relevant information:
\`I'm building a REST API for a food delivery app using FastAPI. 
The app serves 10,000 requests/minute at peak.\`

**3. Task / Instruction**
Be explicit and specific:
\`Review the following endpoint for performance bottlenecks and 
security vulnerabilities. List each issue with its severity (High/Medium/Low).\`

**4. Format / Constraints**
Specify the output structure:
\`Format your response as a numbered list. 
For each issue: issue name, severity, explanation, and fix.\`

### Complete Example
\`\`\`
You are a senior Python engineer and code reviewer.

Context: We are building a fintech API serving 50,000 daily active users. 
Security and performance are critical.

Task: Review this authentication function and identify all issues:

def authenticate(username, password):
    query = f"SELECT * FROM users WHERE username='{username}'"
    user = db.execute(query)
    if user and user.password == password:
        return generate_token(user.id)
    return None

Output Format:
- Number each issue
- Include: Issue, Risk Level (Critical/High/Medium), Fix
- End with a corrected code example
\`\`\`

### Common Prompt Mistakes
❌ "Write me some code" — too vague
✅ "Write a Python function that validates email addresses using regex. 
    Return True if valid. Include docstring and 3 test cases."

❌ "Summarize this" — no output format
✅ "Summarize in exactly 3 bullet points, each under 20 words."`,
          keyTakeaways: [
            "The 4 pillars: Role, Context, Task, Format — use all four for complex prompts",
            "Specificity is the biggest driver of prompt quality",
            "Specify output format explicitly: length, structure, tone, examples",
            "Provide examples of what 'good' looks like (few-shot) when possible"
          ],
          practiceQuestions: [
            {
              id: "pe-pq-1-1-1",
              prompt: "Which prompt is most likely to get a useful response?",
              type: "multiple-choice",
              options: [
                "Explain machine learning",
                "You are an ML tutor. Explain gradient descent to a beginner in 3 bullet points, using a simple real-world analogy. No math equations.",
                "Tell me about AI",
                "What is a neural network?"
              ],
              correctAnswer: 1,
              explanation: "Option B includes role (ML tutor), audience (beginner), format (3 bullet points), style (real-world analogy), and a constraint (no equations). These specifics dramatically improve response quality."
            },
            {
              id: "pe-pq-1-1-2",
              prompt: "What is the purpose of a 'role' or 'persona' in a system prompt?",
              type: "multiple-choice",
              options: [
                "Makes the model respond faster",
                "Activates relevant knowledge and response style associated with that role",
                "Required by all LLM APIs",
                "Prevents the model from making mistakes"
              ],
              correctAnswer: 1,
              explanation: "Assigning a role (e.g., 'expert Python engineer') activates associated knowledge and response style — technical depth, relevant examples, appropriate vocabulary — without you having to specify each dimension explicitly."
            }
          ],
          proofChallenge: {
            id: "pe-proof-1-1",
            title: "Prompt Engineering Proof",
            scenario: "You need an AI to extract customer complaint categories from 1,000 support tickets. Initial results are inconsistent — sometimes 'billing', sometimes 'payment issue', sometimes 'charge problem' for the same type.",
            prompt: "What prompting technique would most effectively solve this inconsistency?",
            type: "multiple-choice",
            options: [
              "Use higher temperature for more creativity",
              "Provide few-shot examples with fixed category names and ask for JSON output with predefined enum values",
              "Ask the model to try harder in the prompt",
              "Use a shorter prompt to reduce confusion"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Uses few-shot examples to demonstrate expected categories", "Requests structured output (JSON) with fixed enum values", "Understands temperature should be LOW for consistency tasks"],
            explanation: "Few-shot examples showing exact category names + JSON with an enum ('billing' | 'technical' | 'shipping' | 'other') forces consistent output. Temperature should be 0 for maximum consistency in classification tasks."
          }
        }
      ]
    }
  ]
};

export const EXCEL_COURSE: Course = {
  id: "course-excel",
  slug: "excel",
  title: "Microsoft Excel for Data Analysis",
  tagline: "Master Excel from formulas to pivot tables, data analysis, and automation.",
  description: "Comprehensive Excel course covering formulas, functions, pivot tables, data cleaning, VLOOKUP, INDEX/MATCH, Power Query, and introduction to Excel macros (VBA).",
  category: "Data Science",
  difficulty: "Beginner",
  estimatedHours: 16,
  iconName: "Table",
  badgeColor: "green",
  prerequisites: [],
  learningOutcomes: [
    "Write advanced Excel formulas including nested IFs and array formulas",
    "Use VLOOKUP, XLOOKUP, INDEX/MATCH for data lookups",
    "Build pivot tables and pivot charts for data summarization",
    "Clean data with Text-to-Columns, Remove Duplicates, and Flash Fill",
    "Automate repetitive tasks with basic Excel macros"
  ],
  resources: [
    { id: "excel-r1", title: "Microsoft Excel Help", provider: "Microsoft", type: "documentation", url: "https://support.microsoft.com/en-us/excel", description: "Official Microsoft Excel support and tutorials.", difficulty: "All Levels", isFree: true },
    { id: "excel-r2", title: "Excel Is Fun (YouTube)", provider: "YouTube", type: "video", url: "https://www.youtube.com/@ExcelIsFun", description: "Massive Excel YouTube channel with 3,000+ tutorial videos.", difficulty: "All Levels", isFree: true },
    { id: "excel-r3", title: "Excel Practice Online", provider: "excelpractice.com", type: "platform", url: "https://excelpractice.com/", description: "Practice Excel skills with interactive exercises.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "excel-mod-1",
      slug: "excel-formulas",
      title: "Module 1: Essential Formulas & Functions",
      description: "Core Excel functions for math, text, lookup, and logic operations.",
      order: 1,
      lessons: [
        {
          id: "excel-les-1-1",
          slug: "lookup-functions",
          title: "VLOOKUP, XLOOKUP & INDEX/MATCH",
          summary: "Searching and retrieving data from tables — the most essential Excel skills.",
          durationMinutes: 25,
          order: 1,
          content: `### VLOOKUP — Vertical Lookup
Syntax: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])

\`\`\`
Product    | Category | Price
Apple      | Fruit    | $1.20
Banana     | Fruit    | $0.50
Carrot     | Veg      | $0.80

=VLOOKUP("Banana", A1:C4, 3, FALSE)  → $0.50
\`\`\`

**VLOOKUP Limitations:**
- Can only look left-to-right
- Returns value from a fixed column number
- Fragile when columns are added/removed

### XLOOKUP — Modern Replacement (Excel 365)
Syntax: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])

\`\`\`
=XLOOKUP("Banana", A:A, C:C, "Not found")  → $0.50
\`\`\`

Benefits: looks right OR left, returns any column, handles not-found gracefully.

### INDEX/MATCH — Most Flexible
\`\`\`
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))

=INDEX(C:C, MATCH("Banana", A:A, 0))  → $0.50
\`\`\`

**Why INDEX/MATCH:**
- Looks in any direction
- Doesn't break when columns are inserted
- Can match on multiple criteria
- Works in all Excel versions

### Handling Errors
\`\`\`
=IFERROR(VLOOKUP(A2, Table, 2, FALSE), "Not found")
=XLOOKUP(A2, Table[ID], Table[Name], "Not found")
\`\`\``,
          keyTakeaways: [
            "Prefer XLOOKUP (Excel 365) or INDEX/MATCH over VLOOKUP for new work",
            "Always use FALSE (exact match) in VLOOKUP for non-sorted data",
            "Wrap lookups in IFERROR to handle missing values gracefully",
            "INDEX/MATCH is flexible: looks left/right and works in all Excel versions"
          ],
          practiceQuestions: [
            {
              id: "excel-pq-1-1-1",
              prompt: "Why can VLOOKUP only look up values to the right?",
              type: "multiple-choice",
              options: [
                "It's a design limitation — VLOOKUP requires the lookup column to be leftmost",
                "Excel processes data right-to-left",
                "The col_index_num parameter counts from right to left",
                "VLOOKUP is only for sorted data"
              ],
              correctAnswer: 0,
              explanation: "VLOOKUP requires the lookup column to be the first column of the table_array, and returns values from columns to the right (by index). Use INDEX/MATCH or XLOOKUP for left-lookups."
            },
            {
              id: "excel-pq-1-1-2",
              prompt: "What does MATCH(value, range, 0) return?",
              type: "multiple-choice",
              options: [
                "The value itself",
                "The relative position (row number) of the value in the range",
                "TRUE if found, FALSE if not",
                "The count of matching cells"
              ],
              correctAnswer: 1,
              explanation: "MATCH returns the relative position (1-based index) of the lookup value in a range. The 0 means exact match. This position number is then used by INDEX to retrieve the value."
            }
          ],
          proofChallenge: {
            id: "excel-proof-1-1",
            title: "Excel Lookup Proof",
            scenario: "You have an employee ID in column D and want to retrieve the salary from column B (which is to the LEFT of column D). VLOOKUP is returning an error.",
            prompt: "What is the correct solution?",
            type: "multiple-choice",
            options: [
              "Rearrange the columns so salary is to the right of employee ID",
              "Use INDEX/MATCH: =INDEX(B:B, MATCH(D2, D:D, 0))",
              "Use VLOOKUP with a negative column index",
              "VLOOKUP is the only option — this lookup is impossible"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Uses INDEX/MATCH for left-lookup", "Correct syntax with MATCH locating position", "Understands VLOOKUP can't look left"],
            explanation: "VLOOKUP cannot look left. =INDEX(B:B, MATCH(D2, D:D, 0)) correctly: MATCH finds the row position of the employee ID in D:D, then INDEX retrieves the salary from B:B at that row."
          }
        }
      ]
    }
  ]
};

export const LINUX_COURSE: Course = {
  id: "course-linux",
  slug: "linux-command-line",
  title: "Linux Command Line & Shell Scripting",
  tagline: "Navigate, automate, and control any system from the terminal.",
  description: "Master the Linux command line from basic navigation to shell scripting, process management, file permissions, and system administration fundamentals.",
  category: "Tools & DevOps",
  difficulty: "Beginner",
  estimatedHours: 16,
  iconName: "Terminal",
  badgeColor: "zinc",
  prerequisites: [],
  learningOutcomes: [
    "Navigate the Linux filesystem confidently",
    "Manage files and directories with core commands",
    "Control file permissions and user ownership",
    "Write bash shell scripts for automation",
    "Manage processes and system resources"
  ],
  resources: [
    { id: "linux-r1", title: "The Linux Command Line (book)", provider: "William Shotts", type: "book", url: "https://linuxcommand.org/tlcl.php", description: "Free comprehensive Linux command line book.", difficulty: "Beginner", isFree: true },
    { id: "linux-r2", title: "OverTheWire: Bandit", provider: "OverTheWire", type: "platform", url: "https://overthewire.org/wargames/bandit/", description: "Fun Linux command line learning game (CTF-style).", difficulty: "Beginner", isFree: true },
    { id: "linux-r3", title: "Explainshell.com", provider: "explainshell.com", type: "tool", url: "https://explainshell.com/", description: "Paste any command to get a detailed explanation of each part.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "linux-mod-1",
      slug: "linux-navigation",
      title: "Module 1: Navigation & File Management",
      description: "Filesystem structure, essential commands, and file permissions.",
      order: 1,
      lessons: [
        {
          id: "linux-les-1-1",
          slug: "essential-commands",
          title: "Essential Linux Commands",
          summary: "Navigation, file operations, viewing content, and search commands.",
          durationMinutes: 25,
          order: 1,
          content: `### Filesystem Navigation
\`\`\`bash
pwd               # Print working directory
ls -la            # List all files (including hidden) with details
cd /var/log       # Change to absolute path
cd ~/projects     # Change to home-relative path
cd ..             # Go up one directory
cd -              # Go to previous directory
\`\`\`

### File Operations
\`\`\`bash
cp file.txt backup/           # Copy file
cp -r src/ dest/              # Copy directory recursively
mv old.txt new.txt            # Rename / move
rm file.txt                   # Delete file
rm -rf directory/             # Delete directory (DANGEROUS!)
mkdir -p projects/api/src     # Create nested directories
touch file.txt                # Create empty file / update timestamp
\`\`\`

### Viewing Content
\`\`\`bash
cat file.txt                  # Print entire file
less file.txt                 # Paginate (q to quit)
head -20 file.txt             # First 20 lines
tail -f /var/log/app.log      # Follow log in real-time
grep -r "error" ./logs/       # Search recursively
grep -n "TODO" src/*.py       # Show line numbers
\`\`\`

### File Permissions
\`\`\`bash
ls -l file.txt
# -rw-r--r-- 1 ada users 4096 Aug 23 file.txt
# [type][owner][group][others]

chmod 644 file.txt     # rw-r--r-- (read/write owner, read others)
chmod 755 script.sh    # rwxr-xr-x (executable)
chown ada:users file   # Change owner and group
\`\`\`

### Process Management
\`\`\`bash
ps aux | grep python    # Find processes
kill -9 <PID>           # Force kill process
top / htop              # Interactive process viewer
\`\`\``,
          keyTakeaways: [
            "Use 'ls -la' to see hidden files and permissions",
            "rm -rf is irreversible — double-check before running",
            "chmod 755 = rwxr-xr-x (owner executes; others read/execute)",
            "tail -f follows a log file in real-time — essential for debugging"
          ],
          practiceQuestions: [
            {
              id: "linux-pq-1-1-1",
              prompt: "What does 'chmod 755 script.sh' mean?",
              type: "multiple-choice",
              options: [
                "Owner: read/write, Group: read/write, Others: read/write",
                "Owner: read/write/execute, Group: read/execute, Others: read/execute",
                "Owner: read/execute, Group: write, Others: none",
                "All users: read/write/execute"
              ],
              correctAnswer: 1,
              explanation: "7 = rwx (4+2+1), 5 = r-x (4+0+1). So 755 = rwxr-xr-x: owner has read/write/execute; group and others have read/execute."
            },
            {
              id: "linux-pq-1-1-2",
              prompt: "Which command displays the last 50 lines of a log file AND continues showing new lines as they're added?",
              type: "multiple-choice",
              options: [
                "cat -50 app.log",
                "head -50 app.log",
                "tail -50f app.log",
                "less +50 app.log"
              ],
              correctAnswer: 2,
              explanation: "tail -n 50 -f (or combined as -50f) shows the last 50 lines AND follows (-f) new content as it's written — essential for monitoring live logs."
            }
          ],
          proofChallenge: {
            id: "linux-proof-1-1",
            title: "Linux Commands Proof",
            scenario: "You accidentally ran 'rm -rf /' as root. What is the real-world consequence?",
            prompt: "Select the correct statement.",
            type: "multiple-choice",
            options: [
              "It deletes only the current user's files",
              "Modern Linux systems block this command automatically",
              "It recursively deletes the entire filesystem from the root — catastrophic data loss",
              "It creates a backup first"
            ],
            correctAnswer: 2,
            rubricGuidelines: ["Identifies the catastrophic nature of rm -rf /", "Understands it starts deletion from filesystem root", "Knows no backup is created"],
            explanation: "rm -rf / starts at filesystem root (/) and recursively (-r) force-deletes (-f) everything. Modern Linux requires --no-preserve-root flag, but the lesson is: always double-check rm -rf commands before executing. There is no undo."
          }
        }
      ]
    }
  ]
};

export const NLP_COURSE: Course = {
  id: "course-nlp",
  slug: "natural-language-processing",
  title: "Natural Language Processing",
  tagline: "Build text classifiers, named entity recognizers, and sentiment analyzers.",
  description: "Practical NLP course covering text preprocessing, classical ML for text, word embeddings, transformer models, and building NLP pipelines with Hugging Face.",
  category: "AI & ML",
  difficulty: "Intermediate",
  estimatedHours: 28,
  iconName: "MessageSquare",
  badgeColor: "indigo",
  prerequisites: ["Python", "Machine Learning fundamentals", "Linear algebra basics"],
  learningOutcomes: [
    "Preprocess text data: tokenization, stemming, lemmatization",
    "Build text classifiers with TF-IDF and classical ML",
    "Understand word embeddings: Word2Vec, GloVe, fastText",
    "Fine-tune transformer models with Hugging Face",
    "Build named entity recognition and sentiment analysis pipelines"
  ],
  resources: [
    { id: "nlp-r1", title: "Hugging Face NLP Course", provider: "Hugging Face", type: "platform", url: "https://huggingface.co/learn/nlp-course/", description: "Free, comprehensive NLP course from the leading ML hub.", difficulty: "Intermediate", isFree: true },
    { id: "nlp-r2", title: "spaCy Documentation", provider: "spaCy", type: "documentation", url: "https://spacy.io/usage", description: "Industrial-strength NLP library documentation and tutorials.", difficulty: "All Levels", isFree: true },
    { id: "nlp-r3", title: "NLTK Book", provider: "NLTK Project", type: "book", url: "https://www.nltk.org/book/", description: "Free NLP textbook using Python's NLTK library.", difficulty: "Beginner", isFree: true }
  ],
  modules: [
    {
      id: "nlp-mod-1",
      slug: "text-preprocessing",
      title: "Module 1: Text Preprocessing",
      description: "Tokenization, normalization, and feature extraction from raw text.",
      order: 1,
      lessons: [
        {
          id: "nlp-les-1-1",
          slug: "text-preprocessing-pipeline",
          title: "Text Preprocessing Pipeline",
          summary: "Cleaning and transforming raw text into features for NLP models.",
          durationMinutes: 25,
          order: 1,
          content: `### The NLP Preprocessing Pipeline
Raw text → Tokenize → Lowercase → Remove noise → Normalize → Features

### Tokenization
\`\`\`python
import spacy
nlp = spacy.load("en_core_web_sm")

text = "Hello! Dr. Smith went to the U.S.A. yesterday."
doc = nlp(text)

tokens = [token.text for token in doc]
# ['Hello', '!', 'Dr.', 'Smith', 'went', 'to', 'the', 'U.S.A.', 'yesterday', '.']
\`\`\`

### Stopword Removal & Lemmatization
\`\`\`python
# Lemmatization: reduces to dictionary form
# running → run, better → good, was → be

clean_tokens = [
    token.lemma_.lower()
    for token in doc
    if not token.is_stop    # remove stop words
    and not token.is_punct  # remove punctuation
    and token.is_alpha      # letters only
]
# ['hello', 'dr.', 'smith', 'go', 'u.s.a.', 'yesterday']
\`\`\`

### TF-IDF — Classic Feature Extraction
\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

corpus = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "cats and dogs are pets"
]

vectorizer = TfidfVectorizer(max_features=100)
X = vectorizer.fit_transform(corpus)  # sparse matrix
print(X.shape)  # (3, 9) — 3 docs, 9 unique terms
\`\`\`

TF-IDF = Term Frequency × Inverse Document Frequency
- High TF-IDF = term appears often in THIS doc but rarely across all docs
- Low TF-IDF = common word across all docs (less informative)`,
          keyTakeaways: [
            "Always preprocess text before modeling: lowercase, remove punctuation, stopwords",
            "Lemmatization is preferred over stemming — produces real words",
            "TF-IDF captures term importance relative to the document collection",
            "spaCy is the production-grade NLP library; NLTK for learning/research"
          ],
          practiceQuestions: [
            {
              id: "nlp-pq-1-1-1",
              prompt: "What is the difference between stemming and lemmatization?",
              type: "multiple-choice",
              options: [
                "They are identical",
                "Stemming chops word endings (may produce non-words); lemmatization returns the dictionary base form",
                "Stemming returns the base form; lemmatization chops endings",
                "Stemming requires a grammar model; lemmatization uses rules"
              ],
              correctAnswer: 1,
              explanation: "Stemming (e.g., 'running' → 'runn') is faster but may produce non-words. Lemmatization (e.g., 'running' → 'run') uses vocabulary and grammar rules to return the actual dictionary form."
            },
            {
              id: "nlp-pq-1-1-2",
              prompt: "Why are stopwords removed in many NLP tasks?",
              type: "multiple-choice",
              options: [
                "Stopwords cause syntax errors",
                "Stopwords (the, is, at, etc.) appear in nearly all documents and add noise without discriminating meaning",
                "Stopwords are misspelled words",
                "Removing stopwords always improves model accuracy"
              ],
              correctAnswer: 1,
              explanation: "Stopwords are extremely common function words (the, is, at, and) that appear in almost all documents. They don't help discriminate between topics, so removing them reduces noise and dimensionality."
            }
          ],
          proofChallenge: {
            id: "nlp-proof-1-1",
            title: "NLP Preprocessing Proof",
            scenario: "You're building a sentiment classifier for product reviews. Your TF-IDF model is giving high weight to 'the', 'is', 'a' but low weight to 'terrible' and 'excellent'.",
            prompt: "What is causing this and how do you fix it?",
            type: "multiple-choice",
            options: [
              "The training data is too small — add more reviews",
              "Stopwords were not removed — add stop_words='english' to TfidfVectorizer",
              "The model needs more features — increase max_features",
              "TF-IDF is not suitable for sentiment analysis"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies stopwords as the issue", "Adds stop_words parameter to TfidfVectorizer", "Understands TF-IDF should down-weight common words"],
            explanation: "TF-IDF should penalize very common words, but 'the', 'is' dominate counts without the stopwords filter. Fix: TfidfVectorizer(stop_words='english'). This removes stopwords automatically, letting sentiment words ('excellent', 'terrible') get appropriate weights."
          }
        }
      ]
    }
  ]
};

export const POSTGRESQL_COURSE: Course = {
  id: "course-postgresql",
  slug: "postgresql",
  title: "PostgreSQL: Production Database Engineering",
  tagline: "Design, optimize, and manage production PostgreSQL databases.",
  description: "Advanced PostgreSQL course covering schema design, indexing strategies, query optimization, stored procedures, transactions, RLS, and production administration.",
  category: "Database",
  difficulty: "Intermediate",
  estimatedHours: 24,
  iconName: "Database",
  badgeColor: "indigo",
  prerequisites: ["SQL fundamentals"],
  learningOutcomes: [
    "Design normalized database schemas with proper constraints",
    "Create and optimize indexes for query performance",
    "Write stored procedures and triggers in PL/pgSQL",
    "Manage transactions and isolation levels",
    "Implement Row Level Security for multi-tenant applications"
  ],
  resources: [
    { id: "pg-r1", title: "PostgreSQL Official Documentation", provider: "PostgreSQL.org", type: "documentation", url: "https://www.postgresql.org/docs/current/", description: "Complete PostgreSQL documentation — best reference available.", difficulty: "All Levels", isFree: true },
    { id: "pg-r2", title: "PostgreSQL Exercises", provider: "pgexercises.com", type: "platform", url: "https://pgexercises.com/", description: "Interactive PostgreSQL exercises with real datasets.", difficulty: "All Levels", isFree: true },
    { id: "pg-r3", title: "The Art of PostgreSQL", provider: "Dimitri Fontaine", type: "book", url: "https://theartofpostgresql.com/", description: "Expert-level PostgreSQL book focusing on SQL as application code.", difficulty: "Advanced", isFree: false }
  ],
  modules: [
    {
      id: "pg-mod-1",
      slug: "schema-design",
      title: "Module 1: Schema Design & Normalization",
      description: "Relational schema design, normal forms, and constraint definitions.",
      order: 1,
      lessons: [
        {
          id: "pg-les-1-1",
          slug: "normalization-and-constraints",
          title: "Normalization, Constraints & Foreign Keys",
          summary: "Designing efficient, consistent schemas through normalization and constraints.",
          durationMinutes: 30,
          order: 1,
          content: `### Database Normalization
Normalization eliminates data redundancy and maintains consistency.

**1NF — Each cell has one value, each row is unique:**
- No repeating groups
- All values are atomic

**2NF — No partial dependencies (for composite keys):**
- Every non-key attribute depends on the ENTIRE primary key

**3NF — No transitive dependencies:**
- Every non-key attribute depends ONLY on the primary key

### Production Schema Example
\`\`\`sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    price       NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id),
    status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    total       NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2) NOT NULL,
    UNIQUE (order_id, product_id)
);
\`\`\`

### Useful Indexes
\`\`\`sql
-- Index for common query patterns
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status != 'delivered';
CREATE INDEX idx_order_items_order ON order_items(order_id);
\`\`\``,
          keyTakeaways: [
            "Use CHECK constraints to enforce business rules at the database level",
            "UUID primary keys prevent ID enumeration attacks; SERIAL for internal tables",
            "REFERENCES with ON DELETE options controls cascading behavior",
            "Create indexes on columns frequently used in WHERE, JOIN, and ORDER BY clauses"
          ],
          practiceQuestions: [
            {
              id: "pg-pq-1-1-1",
              prompt: "What does ON DELETE CASCADE mean on a foreign key?",
              type: "multiple-choice",
              options: [
                "Prevents deletion of the parent record if children exist",
                "Automatically deletes child records when the parent is deleted",
                "Sets child foreign key to NULL when parent is deleted",
                "Throws an error when you attempt to delete the parent"
              ],
              correctAnswer: 1,
              explanation: "ON DELETE CASCADE automatically deletes all child rows when the parent row is deleted. ON DELETE RESTRICT prevents the deletion. ON DELETE SET NULL sets child FK to NULL."
            },
            {
              id: "pg-pq-1-1-2",
              prompt: "Why use NUMERIC(10,2) instead of FLOAT for financial data?",
              type: "multiple-choice",
              options: [
                "NUMERIC is faster for calculations",
                "FLOAT has floating-point precision errors (e.g., 0.1 + 0.2 ≠ 0.3); NUMERIC is exact",
                "FLOAT cannot store decimal values",
                "NUMERIC uses less storage space"
              ],
              correctAnswer: 1,
              explanation: "IEEE 754 floating-point (FLOAT/REAL) has inherent precision errors. NUMERIC (exact decimal) is mandatory for financial data where $1.99 + $0.01 must exactly equal $2.00."
            }
          ],
          proofChallenge: {
            id: "pg-proof-1-1",
            title: "PostgreSQL Schema Design Proof",
            scenario: "You're designing a schema where products have multiple categories. A student proposes storing all categories as comma-separated values in a single 'categories' column.",
            prompt: "What is wrong with this approach and what is the correct design?",
            type: "multiple-choice",
            options: [
              "Nothing — comma-separated values are efficient and flexible",
              "It violates 1NF (non-atomic values). Correct design: product_categories junction table with product_id and category_id FKs",
              "It's fine for small datasets but would need to change at scale",
              "The correct fix is to use a JSON array column instead"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies 1NF violation (non-atomic)", "Proposes correct junction table", "Understands relational integrity benefits"],
            explanation: "Comma-separated values violate 1NF (non-atomic) and make queries impossible ('find all products in category X'). The correct relational design: product_categories(product_id FK, category_id FK, PRIMARY KEY (product_id, category_id))."
          }
        }
      ]
    }
  ]
};

export const AI_AGENTS_COURSE: Course = {
  id: "course-ai-agents",
  slug: "ai-agents",
  title: "AI Agents & Agentic Systems",
  tagline: "Build autonomous AI agents that plan, use tools, and accomplish complex tasks.",
  description: "Learn to design and build AI agents that can reason, use tools (search, code execution, APIs), maintain memory, and collaborate in multi-agent systems.",
  category: "AI & ML",
  difficulty: "Advanced",
  estimatedHours: 22,
  iconName: "Bot",
  badgeColor: "emerald",
  prerequisites: ["Python", "LLM fundamentals", "Prompt engineering"],
  learningOutcomes: [
    "Understand the ReAct (Reason + Act) agent architecture",
    "Build tool-using agents with function calling",
    "Implement memory systems: conversation, episodic, semantic",
    "Design multi-agent workflows with task delegation",
    "Evaluate and debug agent reasoning chains"
  ],
  resources: [
    { id: "agent-r1", title: "LangChain Documentation", provider: "LangChain", type: "documentation", url: "https://python.langchain.com/docs/", description: "Documentation for the LangChain agent and chain framework.", difficulty: "Intermediate", isFree: true },
    { id: "agent-r2", title: "LlamaIndex Documentation", provider: "LlamaIndex", type: "documentation", url: "https://docs.llamaindex.ai/", description: "Framework for building LLM-powered data agents.", difficulty: "Intermediate", isFree: true },
    { id: "agent-r3", title: "Google ADK Documentation", provider: "Google", type: "documentation", url: "https://google.github.io/adk-docs/", description: "Google Agent Development Kit for building multi-agent systems.", difficulty: "Intermediate", isFree: true },
    { id: "agent-r4", title: "ReAct Paper", provider: "arXiv", type: "book", url: "https://arxiv.org/abs/2210.03629", description: "Original ReAct (Reasoning + Acting) paper on LLM agents.", difficulty: "Advanced", isFree: true }
  ],
  modules: [
    {
      id: "agent-mod-1",
      slug: "agent-fundamentals",
      title: "Module 1: Agent Architecture",
      description: "What makes an AI agent, the ReAct loop, and tool use.",
      order: 1,
      lessons: [
        {
          id: "agent-les-1-1",
          slug: "react-agents",
          title: "The ReAct Agent Loop",
          summary: "How LLM agents reason and act in cycles to complete complex tasks.",
          durationMinutes: 28,
          order: 1,
          content: `### What is an AI Agent?
An AI agent is an LLM that can:
1. **Reason** — break down a task into steps
2. **Act** — call tools (search, code, APIs, databases)
3. **Observe** — process tool outputs
4. **Repeat** — until the task is complete

### The ReAct Loop (Reason + Act)
\`\`\`
User: "What's the weather in Tokyo and convert it to Fahrenheit?"

Agent [THOUGHT]: I need to get Tokyo weather, then convert it.
Agent [ACTION]: weather_tool("Tokyo")
Agent [OBSERVATION]: 22°C, partly cloudy
Agent [THOUGHT]: Got temperature. Now convert: °F = °C × 9/5 + 32 = 71.6°F
Agent [ACTION]: None needed — I can calculate this.
Agent [ANSWER]: Tokyo is 22°C (71.6°F), partly cloudy.
\`\`\`

### Tool Definition (Function Calling)
\`\`\`python
def search_web(query: str) -> str:
    """Search the web for current information about the query."""
    # ... actual search implementation
    return results

def execute_python(code: str) -> str:
    """Execute Python code and return the output."""
    # ... sandboxed execution
    return output

# Define tools for the LLM
tools = [
    {
        "name": "search_web",
        "description": "Search the web for current information",
        "parameters": {
            "query": {"type": "string", "description": "Search query"}
        }
    }
]
\`\`\`

### Memory Types in Agents
- **In-context memory** — conversation history in the prompt
- **External memory** — vector database for semantic search
- **Episodic memory** — structured log of past actions/outcomes
- **Procedural memory** — learned tool usage patterns`,
          keyTakeaways: [
            "Agents = LLM + Tools + Memory + a loop that continues until task complete",
            "ReAct (Reason + Act) is the dominant agent architecture pattern",
            "Tool descriptions must be crystal clear — the LLM reads them to decide what to call",
            "Agent memory types serve different purposes: context vs. long-term vs. procedural"
          ],
          practiceQuestions: [
            {
              id: "agent-pq-1-1-1",
              prompt: "What distinguishes an AI agent from a basic LLM chat interface?",
              type: "multiple-choice",
              options: [
                "Agents use a larger model",
                "Agents can call tools, receive results, and reason over multiple steps autonomously",
                "Agents respond faster",
                "Agents don't require a system prompt"
              ],
              correctAnswer: 1,
              explanation: "An agent adds tool-use, multi-step reasoning, and autonomous task completion on top of a base LLM. A chat interface is a single prompt → single response cycle."
            },
            {
              id: "agent-pq-1-1-2",
              prompt: "Why is tool description quality critical for LLM function calling?",
              type: "multiple-choice",
              options: [
                "The tool name is all the LLM needs",
                "The LLM reads tool descriptions to decide WHEN and HOW to call tools — poor descriptions cause wrong tool selection",
                "Tool descriptions are only for humans reading the code",
                "The LLM tries all tools and picks the best result"
              ],
              correctAnswer: 1,
              explanation: "The LLM decides which tool to call (and with what parameters) based entirely on reading the description. Vague descriptions cause hallucinated parameters or wrong tool selection."
            }
          ],
          proofChallenge: {
            id: "agent-proof-1-1",
            title: "AI Agents Proof",
            scenario: "Your agent is supposed to research a topic, write a summary, and save it to a file. It keeps calling the wrong tool or getting stuck in loops.",
            prompt: "What is the most likely root cause?",
            type: "multiple-choice",
            options: [
              "The LLM model is too small — use a larger model",
              "Poor tool descriptions and/or missing guidance in the system prompt about task decomposition",
              "Agents cannot perform multi-step tasks",
              "The temperature is too high"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies tool description quality as key", "Suggests clear system prompt with task structure", "Understands agents need guidance not just tools"],
            explanation: "Agent reliability depends heavily on: (1) crystal-clear tool descriptions that explain when to use each tool, (2) a system prompt that guides task decomposition. Wrong tool calls almost always trace back to poor tool descriptions or ambiguous instructions."
          }
        }
      ]
    }
  ]
};

export const DATA_ANALYST_ROADMAP_COURSE: Course = {
  id: "course-data-analyst-roadmap",
  slug: "data-analyst-roadmap",
  title: "Data Analyst Career Roadmap",
  tagline: "A structured path from beginner to job-ready data analyst.",
  description: "Step-by-step career guide for aspiring data analysts covering required skills, portfolio projects, job search strategy, and interview preparation.",
  category: "Career",
  difficulty: "Beginner",
  estimatedHours: 10,
  iconName: "Map",
  badgeColor: "orange",
  prerequisites: [],
  learningOutcomes: [
    "Understand the full data analyst skill stack",
    "Build a portfolio of projects that impress hiring managers",
    "Navigate the job search process effectively",
    "Prepare for data analyst interviews: SQL, statistics, case studies",
    "Negotiate your first data analyst offer"
  ],
  resources: [
    { id: "da-r1", title: "Kaggle", provider: "Kaggle", type: "platform", url: "https://www.kaggle.com/", description: "Practice with real datasets and competitions to build portfolio.", difficulty: "All Levels", isFree: true },
    { id: "da-r2", title: "DataLemur SQL Interview Prep", provider: "DataLemur", type: "platform", url: "https://datalemur.com/", description: "SQL interview questions from real FAANG companies.", difficulty: "Intermediate", isFree: true },
    { id: "da-r3", title: "Springboard Data Career Blog", provider: "Springboard", type: "tutorial", url: "https://www.springboard.com/blog/data-analysis/", description: "Career advice and skill guides for data professionals.", difficulty: "Beginner", isFree: true }
  ],
  modules: [
    {
      id: "da-roadmap-mod-1",
      slug: "data-analyst-skills",
      title: "Module 1: The Data Analyst Skill Stack",
      description: "Every skill required, in order of priority, for a data analyst career.",
      order: 1,
      lessons: [
        {
          id: "da-roadmap-les-1-1",
          slug: "skill-stack-overview",
          title: "The Complete Data Analyst Skill Stack",
          summary: "Mapping out what you need to learn and in what order.",
          durationMinutes: 20,
          order: 1,
          content: `### The Data Analyst Role
Data Analysts extract insights from data to help businesses make decisions. They sit between raw data and business stakeholders.

### Tier 1 — Must Have (Learn First)
**SQL (most important skill)**
- SELECT, WHERE, GROUP BY, HAVING
- JOINs (INNER, LEFT, RIGHT)
- Window functions: ROW_NUMBER, RANK, LAG/LEAD
- CTEs and subqueries

**Excel / Google Sheets**
- VLOOKUP/XLOOKUP, SUMIF, COUNTIF
- Pivot tables and charts
- Data cleaning

**Statistics Basics**
- Mean, median, mode, variance, standard deviation
- Hypothesis testing, p-values, confidence intervals
- Correlation vs causation

### Tier 2 — Very Valuable
**Python (pandas, matplotlib)**
- Data manipulation with pandas
- Visualizations
- Data cleaning automation

**Data Visualization**
- Tableau OR Power BI (pick one)
- Chart type selection
- Dashboard design principles

### Tier 3 — Differentiators
- A/B testing design and analysis
- Cohort analysis and funnel analysis
- Basic machine learning intuition
- dbt for data transformation
- Cloud platforms (BigQuery, Redshift, Snowflake)

### Portfolio Projects That Actually Work
1. **End-to-End Analysis**: Kaggle dataset → cleaning → EDA → insights → visualization
2. **SQL Showcase**: Complex queries against a real-world database
3. **Dashboard**: Tableau Public or Power BI portfolio dashboard
4. **Business Problem**: Take a real business question, answer it with data

### Timeline to Job-Ready
- Month 1-2: SQL + Excel
- Month 3-4: Python (pandas) + Statistics
- Month 5-6: Visualization tool + 2 portfolio projects
- Month 7: Interview prep + job applications`,
          keyTakeaways: [
            "SQL is the #1 skill for data analysts — master it first",
            "Portfolio projects > certifications — show real work",
            "Pick ONE visualization tool (Tableau OR Power BI) and go deep",
            "Interview prep: 70% SQL practice, 20% statistics, 10% behavioral"
          ],
          practiceQuestions: [
            {
              id: "da-roadmap-pq-1-1-1",
              prompt: "What is the single most important technical skill for a data analyst?",
              type: "multiple-choice",
              options: ["Python", "Machine Learning", "SQL", "Tableau"],
              correctAnswer: 2,
              explanation: "SQL is required in virtually every data analyst job. Data lives in databases and SQL is how you get to it. Python and visualization tools come after SQL proficiency."
            },
            {
              id: "da-roadmap-pq-1-1-2",
              prompt: "Which portfolio project would impress a hiring manager most?",
              type: "multiple-choice",
              options: [
                "A tutorial you followed exactly",
                "An original end-to-end analysis answering a business question with real data and clear visualizations",
                "A list of courses you completed",
                "A project with 1,000+ lines of code"
              ],
              correctAnswer: 1,
              explanation: "Hiring managers want to see original thinking applied to real data to answer a business question — not tutorial copies or certificate lists. Original analysis with business context is the gold standard."
            }
          ],
          proofChallenge: {
            id: "da-roadmap-proof-1-1",
            title: "Career Roadmap Proof",
            scenario: "You're 6 months into learning and know basic Python, some pandas, and have 3 Udemy course certificates. You haven't learned SQL yet. Should you start applying for data analyst jobs?",
            prompt: "What is the best course of action?",
            type: "multiple-choice",
            options: [
              "Yes — start applying immediately to get feedback",
              "No — spend 2-3 months mastering SQL first, then build 1-2 portfolio projects before applying",
              "Switch to a different career — data analysis requires a degree",
              "Get more certifications before applying"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Prioritizes SQL as the blocking skill", "Recommends portfolio projects over more courses", "Practical job-readiness thinking"],
            explanation: "Without SQL, you'll fail most data analyst screening tests — it's non-negotiable. Courses/certs don't substitute. Spend 2-3 months on SQL, build 1-2 real portfolio projects, THEN apply. Employers care about demonstrable skills, not certificates."
          }
        }
      ]
    }
  ]
};
