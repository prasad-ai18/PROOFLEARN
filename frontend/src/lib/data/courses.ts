export interface PracticeQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  type: "multiple-choice" | "short-answer" | "code-prediction";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints?: string[];
}

export interface ProofChallenge {
  id: string;
  title: string;
  scenario: string;
  prompt: string;
  type: "multiple-choice" | "code-prediction" | "scenario-analysis" | "implementation-design";
  options?: string[];
  correctAnswer: string | number;
  rubricGuidelines: string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  order: number;
  content: string; // Markdown formatted educational lesson
  keyTakeaways: string[];
  practiceQuestions: PracticeQuestion[];
  proofChallenge: ProofChallenge;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Programming" | "Database" | "AI & ML" | "Data Science";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  iconName: string;
  badgeColor: string;
  modules: Module[];
}

export const COURSES: Course[] = [
  // =========================================================================
  // 1. PYTHON
  // =========================================================================
  {
    id: "course-python",
    slug: "python",
    title: "Python Mastery & Engineering",
    tagline: "Master Python from foundational syntax to object-oriented architectures and real-world pipelines.",
    description: "A comprehensive, rigorous course in modern Python 3 programming. Progress from core primitives, control flow, and data structures to functions, error handling, modular design, and OOP.",
    category: "Programming",
    difficulty: "Beginner",
    estimatedHours: 24,
    iconName: "Terminal",
    badgeColor: "emerald",
    modules: [
      {
        id: "py-mod-1",
        slug: "python-fundamentals",
        title: "Module 1: Python Fundamentals & Data Types",
        description: "Understand the Python runtime, variables, memory references, dynamic typing, and primitive numeric and boolean operations.",
        order: 1,
        lessons: [
          {
            id: "py-les-1-1",
            slug: "introduction-to-python",
            title: "Lesson 1: The Python Model & Variables",
            summary: "Understand how Python interprets code, dynamic typing, variable assignments, and naming conventions.",
            durationMinutes: 20,
            order: 1,
            content: `
### What is Python?
Python is a high-level, interpreted, dynamically-typed programming language designed for readability and developer productivity. Unlike compiled languages like C++ or Java where source code compiles to machine code or bytecode ahead of time, CPython (the standard interpreter) compiles Python source code into bytecode (.pyc) and executes it on the Python Virtual Machine (PVM).

### Variables and Dynamic Binding
In Python, variables are **not** memory boxes with fixed types. Instead, variables are **named references (pointers)** bound to objects in heap memory.

\`\`\`python
# Variable assignment binds the name 'x' to an integer object 42
x = 42
print(type(x))  # <class 'int'>

# Dynamic re-binding: 'x' now points to a string object
x = "ProofLearn"
print(type(x))  # <class 'str'>
\`\`\`

### Fundamental Primitive Data Types
1. **Integer (\`int\`)**: Arbitrary-precision whole numbers (e.g. \`100\`, \`-5000\`, \`10**50\`).
2. **Floating-point (\`float\`)**: Double-precision 64-bit IEEE 754 numbers (e.g. \`3.14159\`, \`1e-4\`).
3. **Boolean (\`bool\`)**: Subclass of integers with two singletons: \`True\` (1) and \`False\` (0).
4. **String (\`str\`)**: Immutable sequence of Unicode characters (e.g. \`"Hello World"\`).

### Variable Naming Rules
- Must begin with a letter (a-z, A-Z) or an underscore (\`_\`).
- May contain digits, letters, and underscores.
- Case-sensitive: \`totalScore\` and \`totalscore\` are distinct.
- Follow **PEP 8** style: use \`snake_case\` for variables and functions.
`,
            keyTakeaways: [
              "Python variables are named references bound to heap objects, not static typed memory boxes.",
              "CPython executes bytecode on the Python Virtual Machine.",
              "Python supports integers with arbitrary precision and 64-bit IEEE 754 floating-point numbers.",
              "PEP 8 recommends snake_case for variable and function naming."
            ],
            practiceQuestions: [
              {
                id: "py-pq-1-1-1",
                prompt: "What will the following code output?",
                codeSnippet: `a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))`,
                type: "multiple-choice",
                options: ["3", "4", "Error", "None"],
                correctAnswer: 1,
                explanation: "In Python, assigning b = a binds 'b' to the exact same list object in heap memory. Mutating b also mutates the object that 'a' references, so len(a) is 4."
              },
              {
                id: "py-pq-1-1-2",
                prompt: "Which of the following variable names violates standard Python identifier rules?",
                type: "multiple-choice",
                options: ["_user_id", "user_count_2", "2nd_user", "UserClass"],
                correctAnswer: 2,
                explanation: "Python identifiers cannot begin with a numeric digit. '2nd_user' raises a SyntaxError."
              }
            ],
            proofChallenge: {
              id: "py-pc-1-1",
              title: "Object Reference & Mutability Verification",
              scenario: "An engineer assumes that assigning a variable creates an isolated, cloned copy of the data.",
              prompt: "Analyze the code snippet below and predict the exact final state of both variables. Explain why Python's object model behaves this way.",
              type: "multiple-choice",
              options: [
                "x = [10, 20], y = [10, 20, 30] because assignment copies the list",
                "x = [10, 20, 30], y = [10, 20, 30] because both point to the same list reference in memory",
                "x = [10, 20], y = [10, 20] because append returns a new copy",
                "An UnboundLocalError occurs"
              ],
              correctAnswer: 1,
              rubricGuidelines: [
                "Identifies that assignment in Python copies reference pointers, not heap object contents",
                "Explains that list.append mutates the underlying list in-place",
                "Distinguishes shallow object references from deep copies"
              ],
              explanation: "In Python, variable assignment copies the memory reference. Since list is a mutable container, calling .append(30) modifies the single heap instance referenced by both x and y."
            }
          },
          {
            id: "py-les-1-2",
            slug: "strings-and-operators",
            title: "Lesson 2: String Manipulation & Arithmetic Operators",
            summary: "Master string immutability, slicing, f-strings, arithmetic, and logical operator precedence.",
            durationMinutes: 25,
            order: 2,
            content: `
### String Immutability
In Python, strings are **immutable sequences**. Once created in memory, individual characters cannot be overwritten in place:

\`\`\`python
s = "ProofLearn"
# s[0] = "p"  # TypeError: 'str' object does not support item assignment

# Creating a modified string creates a new string object:
s_upper = s.upper()  # 'PROOFLEARN'
\`\`\`

### Slicing Syntax: \`sequence[start:stop:step]\`
- \`start\`: Index where slice begins (inclusive, default 0).
- \`stop\`: Index where slice ends (exclusive, default length).
- \`step\`: Stride between indices (default 1, negative reverses).

\`\`\`python
text = "Python3"
print(text[0:4])   # 'Pyth'
print(text[::2])   # 'Pto3'
print(text[::-1])  # '3nohtyP' (reversed)
\`\`\`

### Formatted String Literals (F-Strings)
Introduced in Python 3.6 (PEP 498), f-strings evaluate expressions at runtime with high efficiency:

\`\`\`python
name = "Ada"
score = 98.4567
print(f"Learner {name}: score = {score:.2f}%")  # 'Learner Ada: score = 98.46%'
\`\`\`

### Operators & Precedence
- **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\` (float division), \`//\` (floor division), \`%\` (modulo), \`**\` (exponentiation).
- **Comparison**: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`, \`is\` (identity), \`in\` (membership).
- **Logical**: \`not\` > \`and\` > \`or\` with short-circuit evaluation.
`,
            keyTakeaways: [
              "Strings are immutable; operations on strings always return new string instances.",
              "Slicing [start:stop:step] allows sub-sequence extraction without modifying the original.",
              "F-strings provide performant, readable string interpolation with format specifiers.",
              "Logical operators short-circuit: 'and' returns the first falsy operand, 'or' returns the first truthy operand."
            ],
            practiceQuestions: [
              {
                id: "py-pq-1-2-1",
                prompt: "What is the output of 'Engineering'[2:7:2]?",
                type: "multiple-choice",
                options: ["'gner'", "'gin'", "'eir'", "'gn'"],
                correctAnswer: 1,
                explanation: "Index 2 is 'g', index 4 is 'i', index 6 is 'n' (exclusive of 7). Stride 2 yields 'gin'."
              }
            ],
            proofChallenge: {
              id: "py-pc-1-2",
              title: "Operator Precedence & Short-Circuit Proof",
              scenario: "A developer writes: result = 0 or 'active' and None or 'fallback'.",
              prompt: "Evaluate the expression step-by-step applying Python's operator precedence and short-circuit evaluation rules.",
              type: "multiple-choice",
              options: [
                "'fallback' because 'and' binds first ('active' and None -> None), then 0 or None or 'fallback' -> 'fallback'",
                "'active' because 'or' is evaluated left to right",
                "None because None overrides fallback",
                "0 because 0 is the first value"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Applies 'and' before 'or' precedence correctly",
                "Understands truthy and falsy evaluation for 0, strings, and None",
                "Traces left-to-right short-circuit chaining"
              ],
              explanation: "'and' has higher precedence than 'or'. 'active' and None evaluates to None. The expression becomes: 0 or None or 'fallback'. 0 is falsy, None is falsy, so it resolves to 'fallback'."
            }
          }
        ]
      },
      {
        id: "py-mod-2",
        slug: "control-flow-and-collections",
        title: "Module 2: Control Flow, Lists, Tuples & Dictionaries",
        description: "Master conditional branching, for/while loops, list comprehensions, and hash-table dictionary lookups.",
        order: 2,
        lessons: [
          {
            id: "py-les-2-1",
            slug: "conditionals-and-loops",
            title: "Lesson 1: Conditional Branching & Loops",
            summary: "Structure deterministic control flow using if-elif-else, while loops, for loops with range, and break/continue.",
            durationMinutes: 30,
            order: 1,
            content: `
### Conditional Branching
Python uses indentation (4 spaces per PEP 8) to define code blocks instead of curly braces.

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
\`\`\`

### The \`for\` Loop & Iteration Protocol
In Python, \`for\` loops iterate directly over elements of an **iterable** (lists, strings, tuples, dictionaries, generators):

\`\`\`python
for i in range(1, 6):  # yields 1, 2, 3, 4, 5
    if i == 3:
        continue  # skip iteration 3
    print(i)
\`\`\`

### The \`for-else\` Construct
A loop's \`else\` clause executes **only if the loop completed naturally** without encountering a \`break\` statement:

\`\`\`python
numbers = [2, 4, 6, 8]
target = 5
for n in numbers:
    if n == target:
        print("Found target!")
        break
else:
    print("Target not present in list.")
\`\`\`
`,
            keyTakeaways: [
              "Python blocks are structured using consistent 4-space indentation.",
              "for loops consume items from any object implementing the iterator protocol (__iter__ / __next__).",
              "Loop else clauses run only when the loop terminates without a break."
            ],
            practiceQuestions: [
              {
                id: "py-pq-2-1-1",
                prompt: "When does a Python loop's 'else' block execute?",
                type: "multiple-choice",
                options: [
                  "When the loop encounters a break statement",
                  "Only when the loop condition was initially False",
                  "When the loop completes all iterations without encountering a break",
                  "Every time the loop finishes an iteration"
                ],
                correctAnswer: 2,
                explanation: "The loop 'else' block runs only when the loop completes normally across all items without hitting a break statement."
              }
            ],
            proofChallenge: {
              id: "py-pc-2-1",
              title: "Early Termination & Loop State Synthesis",
              scenario: "You are designing an anomaly scanner that checks a batch of sensor readings. If an anomaly > 100 is found, processing halts immediately; otherwise a 'batch_healthy' flag is set.",
              prompt: "Identify the most idiomatic, bug-free Python pattern using loop constructs without unnecessary duplicate boolean tracking flags.",
              type: "multiple-choice",
              options: [
                "Use a for-loop iterating over readings, break when val > 100, and use the for-else block to set batch_healthy = True",
                "Create a global counter variable and increment it in an infinite while loop",
                "Use recursion with try-except to catch list index bounds",
                "Write three nested if-statements"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Demonstrates mastery of the for-else idiom for search/validation workflows",
                "Eliminates redundant flag variables",
                "Ensures O(N) worst-case and O(1) best-case termination"
              ],
              explanation: "The for-else construct is Python's built-in pattern for search algorithms. Breaking on anomaly skips the else block; completing all checks triggers the else block to safely validate the batch."
            }
          },
          {
            id: "py-les-2-2",
            slug: "data-structures-and-comprehensions",
            title: "Lesson 2: Lists, Dictionaries, Sets & Comprehensions",
            summary: "Harness dynamic arrays (lists), hash maps (dicts), unique sets, and concise list/dict comprehensions.",
            durationMinutes: 35,
            order: 2,
            content: `
### Core Collection Types
1. **List (\`list\`)**: Ordered, mutable, dynamic array ($O(1)$ amortized append, $O(N)$ arbitrary insertion).
2. **Tuple (\`tuple\`)**: Ordered, immutable sequence ($O(1)$ indexing, hashable if elements are hashable).
3. **Dictionary (\`dict\`)**: Key-value hash map ($O(1)$ average lookup, keys must be hashable).
4. **Set (\`set\`)**: Unordered collection of unique hashable elements ($O(1)$ average membership check).

### List & Dictionary Comprehensions
Comprehensions provide a clear, declarative syntax to construct collections:

\`\`\`python
# List comprehension: [expression for item in iterable if condition]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Dict comprehension: {key_expr: val_expr for item in iterable}
user_lookup = {user["id"]: user["name"] for user in users_data}
\`\`\`
`,
            keyTakeaways: [
              "Lists are mutable dynamic arrays; tuples are immutable and can serve as dictionary keys.",
              "Dictionaries and Sets rely on hash tables for O(1) average-time lookups.",
              "Comprehensions are more efficient and expressive than manual loop appending."
            ],
            practiceQuestions: [
              {
                id: "py-pq-2-2-1",
                prompt: "Which data structure provides O(1) average time complexity for checking element membership?",
                type: "multiple-choice",
                options: ["list", "tuple", "set", "linked list"],
                correctAnswer: 2,
                explanation: "Sets use hash tables to compute element hashes, offering O(1) average time membership verification (x in my_set)."
              }
            ],
            proofChallenge: {
              id: "py-pc-2-2",
              title: "Dictionary Transformation & Data Pipeline Proof",
              scenario: "You are given a raw list of invoice items: items = [{'sku': 'A', 'qty': 2, 'unit_price': 10}, {'sku': 'B', 'qty': 5, 'unit_price': 20}].",
              prompt: "Select the comprehension that calculates a dictionary mapping each SKU to its total revenue (qty * unit_price) only for items where qty >= 2.",
              type: "multiple-choice",
              options: [
                "{item['sku']: item['qty'] * item['unit_price'] for item in items if item['qty'] >= 2}",
                "[item['sku']: item['qty'] * item['unit_price'] for item in items]",
                "{for item in items: item['sku'] = item['qty'] * item['unit_price']}",
                "dict(item['sku'] for item in items if qty >= 2)"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Uses correct dict comprehension syntax {k: v for x in iterable if cond}",
                "Performs accurate arithmetic calculation per element",
                "Applies predicate filter correctly"
              ],
              explanation: "The dict comprehension {item['sku']: item['qty'] * item['unit_price'] for item in items if item['qty'] >= 2} creates the key-value mapping directly with the filter applied."
            }
          }
        ]
      },
      {
        id: "py-mod-3",
        slug: "functions-and-oop",
        title: "Module 3: Functions, Scope, Modular Design & OOP",
        description: "Master first-class functions, closures, *args/**kwargs, decorators, classes, inheritance, and encapsulation.",
        order: 3,
        lessons: [
          {
            id: "py-les-3-1",
            slug: "functions-and-scope",
            title: "Lesson 1: First-Class Functions, *args, **kwargs & Scope",
            summary: "Understand LEGB scope resolution, default argument mutability traps, and variable argument unpacking.",
            durationMinutes: 30,
            order: 1,
            content: `
### Function Definition & Parameters
Functions in Python are **first-class objects**: they can be passed as arguments, assigned to variables, and returned from other functions.

\`\`\`python
def calculate_tax(subtotal: float, rate: float = 0.08) -> float:
    \"\"\"Compute sales tax rounded to two decimal places.\"\"\"
    return round(subtotal * rate, 2)
\`\`\`

### Positional & Keyword Variable Arguments
- \`*args\`: Packs extra positional arguments into a tuple.
- \`**kwargs\`: Packs extra keyword arguments into a dictionary.

\`\`\`python
def logger(level: str, *messages, **metadata):
    print(f"[{level}]", " ".join(messages), metadata)

logger("INFO", "Service", "started", host="localhost", port=8000)
# Output: [INFO] Service started {'host': 'localhost', 'port': 8000}
\`\`\`

### The LEGB Scope Resolution Rule
Python resolves variable names in this order:
1. **L (Local)**: Inside current function.
2. **E (Enclosing)**: Enclosing nested functions (closures).
3. **G (Global)**: Top-level module variables.
4. **B (Built-in)**: Built-in namespace (\`len\`, \`range\`, \`print\`).

### The Mutable Default Parameter Trap
\`\`\`python
# DANGEROUS: Default list is evaluated ONCE when function is defined!
def append_item(item, target_list=[]):
    target_list.append(item)
    return target_list

# CORRECT IDIOM:
def append_item_safe(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list
\`\`\`
`,
            keyTakeaways: [
              "Python resolves variable names using the LEGB rule (Local, Enclosing, Global, Built-in).",
              "*args captures arbitrary positional arguments as a tuple; **kwargs captures keyword arguments as a dict.",
              "Never use mutable default arguments like [] or {}; use None and assign inside the function."
            ],
            practiceQuestions: [
              {
                id: "py-pq-3-1-1",
                prompt: "Why should you avoid using a mutable default parameter such as def func(data=[])?",
                type: "multiple-choice",
                options: [
                  "It causes a syntax error in Python 3",
                  "The default object is created once at function definition time and shared across all calls",
                  "Lists cannot be passed as arguments in Python",
                  "It makes the function run in O(N^2) time"
                ],
                correctAnswer: 1,
                explanation: "Default parameter expressions evaluate once when the function is parsed, so all invocations without an explicit argument share the exact same list instance."
              }
            ],
            proofChallenge: {
              id: "py-pc-3-1",
              title: "Modular Function Architecture Proof",
              scenario: "You are designing an e-commerce checkout pipeline calculating cart item subtotals, promotional percentages, and shipping surcharges across multiple invoice templates.",
              prompt: "Explain in detail: (1) what function signature you would define, (2) how local variable scope prevents side-effects, and (3) why pure functions are critical in financial calculation pipelines.",
              type: "multiple-choice",
              options: [
                "Define def compute_total(subtotal, discount_rate=0.0, shipping=0.0) -> float; local variables remain isolated in the call stack frame; pure functions guarantee deterministic output without mutating cart state",
                "Define a global variable and modify it with inline scripts in every invoice template",
                "Use a single while loop with hardcoded tax rates in every page",
                "Store values in mutable default lists across threads"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Specifies clear parameter signatures with typed hints and default values",
                "Articulates stack frame variable isolation",
                "Justifies immutability and purity for auditability and testing"
              ],
              explanation: "A pure function with explicit parameters isolates local arithmetic within its stack frame, guaranteeing reproducible, bug-free calculations without cross-request state pollution."
            }
          },
          {
            id: "py-les-3-2",
            slug: "object-oriented-programming",
            title: "Lesson 2: Classes, Objects, Inheritance & Encapsulation",
            summary: "Design maintainable object-oriented systems with constructors, dunder methods, inheritance, and properties.",
            durationMinutes: 40,
            order: 2,
            content: `
### Object-Oriented Principles in Python
Python supports full OOP via class definitions:

\`\`\`python
class BankAccount:
    \"\"\"Encapsulated bank account entity with balance validation.\"\"\"
    
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self._balance = max(0.0, initial_balance)  # Protected attribute by convention

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self._balance += amount

    def __repr__(self) -> str:
        return f"BankAccount(owner='{self.owner}', balance={self._balance:.2f})"
\`\`\`

### Inheritance & Polymorphism
\`\`\`python
class SavingsAccount(BankAccount):
    def __init__(self, owner: str, initial_balance: float = 0.0, interest_rate: float = 0.03):
        super().__init__(owner, initial_balance)
        self.interest_rate = interest_rate

    def apply_interest(self) -> None:
        interest = self._balance * self.interest_rate
        self.deposit(interest)
\`\`\`
`,
            keyTakeaways: [
              "Classes bundle state (attributes) and behavior (methods) into reusable types.",
              "@property decorators enable controlled getter/setter access with validation.",
              "super() delegates initialization and method calls to base classes in the method resolution order (MRO)."
            ],
            practiceQuestions: [
              {
                id: "py-pq-3-2-1",
                prompt: "What is the purpose of the '__init__' method in a Python class?",
                type: "multiple-choice",
                options: [
                  "To destroy the object when garbage collected",
                  "To initialize instance attributes when a new object is created",
                  "To define class inheritance hierarchy",
                  "To compile bytecode"
                ],
                correctAnswer: 1,
                explanation: "__init__ is the initializer method called immediately after a new object instance is allocated by __new__."
              }
            ],
            proofChallenge: {
              id: "py-pc-3-2",
              title: "Encapsulation & Polymorphic Hierarchy Proof",
              scenario: "An engineer needs to design a notification dispatch system supporting Email, SMS, and Slack dispatchers.",
              prompt: "Select the architectural pattern that achieves clean extensibility using object-oriented principles.",
              type: "multiple-choice",
              options: [
                "Define a base NotificationSender with an abstract send(recipient, message) method, subclassing EmailSender and SMSSender with polymorphic overrides",
                "Write a giant function with 20 if-elif statements checking string flags",
                "Store functions in global tuples without class structures",
                "Duplicate the sending logic inside every API endpoint"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Employs polymorphic interface design (Open-Closed Principle)",
                "Separates specific transport logic into cohesive subclasses",
                "Allows adding new notification channels without modifying existing dispatch code"
              ],
              explanation: "Creating an abstract base class with polymorphic subclasses adheres to the Open-Closed Principle: the core system can dispatch to any sender adhering to the interface without editing client code."
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. JAVA
  // =========================================================================
  {
    id: "course-java",
    slug: "java",
    title: "Java Enterprise & OOP Architecture",
    tagline: "Master strongly-typed object-oriented design, the JVM, collections, and modern Java features.",
    description: "Learn enterprise-grade Java programming. Understand the JVM ecosystem, memory model, static typing, interfaces, abstract classes, collections framework, and streams.",
    category: "Programming",
    difficulty: "Beginner",
    estimatedHours: 26,
    iconName: "Code",
    badgeColor: "amber",
    modules: [
      {
        id: "java-mod-1",
        slug: "java-core-syntax",
        title: "Module 1: JVM Architecture & Core Syntax",
        description: "Understand JDK vs JRE vs JVM, static type system, primitive types vs reference types, and compilation.",
        order: 1,
        lessons: [
          {
            id: "java-les-1-1",
            slug: "jdk-jvm-and-primitives",
            title: "Lesson 1: Java Ecosystem & Primitive Types",
            summary: "Learn the write-once run-anywhere model, bytecode execution on the JVM, and 8 primitive data types.",
            durationMinutes: 25,
            order: 1,
            content: `
### The Java Virtual Machine (JVM) Architecture
Java source code (\`.java\`) is compiled by \`javac\` into platform-independent **bytecode** (\`.class\`). The **Java Virtual Machine (JVM)** interprets and Just-In-Time (JIT) compiles this bytecode into native machine instructions at runtime.

- **JDK (Java Development Kit)**: Compiler (\`javac\`), tools, and JRE.
- **JRE (Java Runtime Environment)**: JVM plus standard class libraries.
- **JVM**: Execution engine with memory areas (Heap, Stack, Metaspace, PC registers).

### The 8 Primitive Data Types
1. **byte**: 8-bit signed integer (-128 to 127).
2. **short**: 16-bit signed integer.
3. **int**: 32-bit signed integer (default for whole numbers).
4. **long**: 64-bit signed integer (suffix \`L\`).
5. **float**: 32-bit IEEE 754 floating point (suffix \`f\`).
6. **double**: 64-bit IEEE 754 floating point (default decimal).
7. **boolean**: \`true\` or \`false\`.
8. **char**: 16-bit Unicode character (\`'A'\`, \`'\\u0041'\`).
`,
            keyTakeaways: [
              "Java compiles to bytecode (.class) executed by the JVM on any platform.",
              "Primitive types live directly on the stack; reference types point to heap objects.",
              "int (32-bit) and double (64-bit) are the standard numeric defaults."
            ],
            practiceQuestions: [
              {
                id: "java-pq-1-1-1",
                prompt: "Which component in the Java architecture compiles .java source code into .class bytecode?",
                type: "multiple-choice",
                options: ["JVM", "JIT Compiler", "javac", "Garbage Collector"],
                correctAnswer: 2,
                explanation: "javac is the Java compiler included in the JDK that translates human-readable source code into bytecode."
              }
            ],
            proofChallenge: {
              id: "java-pc-1-1",
              title: "Stack vs Heap & Pass-by-Value Proof",
              scenario: "A developer claims that passing an object to a Java method allows reassigning the caller's reference variable.",
              prompt: "Demonstrate why Java is strictly pass-by-value in all situations, explaining what happens to primitive values vs object reference pointers.",
              type: "multiple-choice",
              options: [
                "Java is strictly pass-by-value: for primitives, the value is copied; for objects, the reference pointer is copied by value, so reassigning the parameter does not change the caller's variable",
                "Java is pass-by-reference for all objects",
                "Java switches to pass-by-reference if the method is marked public",
                "Java passes variables by pointer in static methods only"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Articulates that Java is strictly pass-by-value across all data types",
                "Clarifies that object parameters receive a copy of the reference address",
                "Explains why parameter reassignment inside a method is invisible to the caller"
              ],
              explanation: "Java evaluates all method arguments by value. Passing an object passes a copy of the reference bit-pattern. Modifying object fields mutates the shared heap object, but reassigning the variable parameter modifies only the local stack copy."
            }
          }
        ]
      },
      {
        id: "java-mod-2",
        slug: "java-oop-and-collections",
        title: "Module 2: Object-Oriented Design & Collections Framework",
        description: "Master interfaces, abstract classes, polymorphism, Generics, List, Map, and Set implementations.",
        order: 2,
        lessons: [
          {
            id: "java-les-2-1",
            slug: "interfaces-and-collections",
            title: "Lesson 1: Interfaces, Polymorphism & Collections",
            summary: "Implement decoupled architectures with interfaces and utilize ArrayList, HashSet, and HashMap.",
            durationMinutes: 35,
            order: 1,
            content: `
### Interfaces & Polymorphism
An interface in Java defines a contract that classes implement. It enables **loose coupling** and **dependency inversion**:

\`\`\`java
public interface PaymentProcessor {
    boolean processPayment(double amount);
}

public class StripeProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // Stripe integration logic
        return true;
    }
}
\`\`\`

### Java Collections Framework
- **\`List<T>\`**: Ordered collection with duplicates (\`ArrayList\`, \`LinkedList\`).
- **\`Set<T>\`**: Unique elements based on \`equals()\` and \`hashCode()\` (\`HashSet\`, \`TreeSet\`).
- **\`Map<K, V>\`**: Key-value pairs (\`HashMap\`, \`ConcurrentHashMap\`, \`TreeMap\`).

\`\`\`java
Map<String, Integer> inventory = new HashMap<>();
inventory.put("SKU-100", 45);
int stock = inventory.getOrDefault("SKU-100", 0);
\`\`\`
`,
            keyTakeaways: [
              "Interfaces provide abstract method contracts enabling runtime polymorphism.",
              "Collections framework provides robust generic data structures in java.util.",
              "HashMap requires proper equals() and hashCode() implementations on key objects."
            ],
            practiceQuestions: [
              {
                id: "java-pq-2-1-1",
                prompt: "Which collection should you use when you need fast O(1) key-based lookups with unique keys?",
                type: "multiple-choice",
                options: ["ArrayList", "HashMap", "LinkedList", "Vector"],
                correctAnswer: 1,
                explanation: "HashMap computes hash buckets for keys, providing O(1) average time complexity for get and put operations."
              }
            ],
            proofChallenge: {
              id: "java-pc-2-1",
              title: "Equals and HashCode Contract Proof",
              scenario: "A custom Person class overrides equals() to compare IDs, but forgets to override hashCode(). Objects are inserted into a HashSet.",
              prompt: "What critical bug will occur when attempting to find an existing Person in the HashSet?",
              type: "multiple-choice",
              options: [
                "The HashSet may fail to locate the existing Person because default Object.hashCode() places identical objects in different hash buckets",
                "A NullPointerException is thrown automatically",
                "The HashSet converts itself into an ArrayList",
                "The code fails to compile"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Explains the equals() and hashCode() contract: equal objects must have equal hash codes",
                "Traces how hash tables use hashCode() to locate the bucket before calling equals()",
                "Identifies silent data duplication or lookup failures"
              ],
              explanation: "If two objects are equal according to equals(), they must produce the same hashCode(). Without overriding hashCode(), two identical Person instances get different hash codes, placing them in different buckets where set.contains() will never find them."
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. SQL
  // =========================================================================
  {
    id: "course-sql",
    slug: "sql",
    title: "SQL & Relational Database Mastery",
    tagline: "Master declarative database querying, relational joins, aggregations, window functions, and indexing.",
    description: "Learn foundational to advanced relational database querying and schema design. Progress from basic SELECT and WHERE filters to complex multi-table JOINs, GROUP BY aggregations, CTEs, and indexing.",
    category: "Database",
    difficulty: "Beginner",
    estimatedHours: 20,
    iconName: "Database",
    badgeColor: "blue",
    modules: [
      {
        id: "sql-mod-1",
        slug: "sql-fundamentals",
        title: "Module 1: Relational Concepts & Declarative Queries",
        description: "Understand tables, rows, foreign keys, SELECT queries, WHERE filtering, and logical operators.",
        order: 1,
        lessons: [
          {
            id: "sql-les-1-1",
            slug: "select-and-filtering",
            title: "Lesson 1: SELECT, WHERE, Ordering & Filtering",
            summary: "Learn declarative SQL syntax, row filtering, NULL handling with IS NULL, and ORDER BY with LIMIT.",
            durationMinutes: 25,
            order: 1,
            content: `
### Declarative Querying
SQL (Structured Query Language) is **declarative**: you specify *what data you want*, and the query planner/optimizer determines *how to retrieve it*.

\`\`\`sql
-- Logical query execution order differs from syntactic order:
-- FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
SELECT 
    customer_id, 
    email, 
    created_at 
FROM customers 
WHERE is_active = TRUE 
  AND country = 'US'
ORDER BY created_at DESC 
LIMIT 20;
\`\`\`

### Three-Valued Logic & NULLs
In SQL, \`NULL\` represents an **unknown value**. Comparing anything with \`NULL\` using \`=\` or \`!=\` yields \`UNKNOWN\`, not \`TRUE\` or \`FALSE\`.

\`\`\`sql
-- WRONG: Returns 0 rows because NULL = NULL evaluates to UNKNOWN!
SELECT * FROM users WHERE deleted_at = NULL;

-- CORRECT:
SELECT * FROM users WHERE deleted_at IS NULL;
\`\`\`
`,
            keyTakeaways: [
              "SQL is declarative: execution engine optimizes physical scan/index access paths.",
              "Query execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.",
              "NULL requires IS NULL or IS NOT NULL due to SQL three-valued logic."
            ],
            practiceQuestions: [
              {
                id: "sql-pq-1-1-1",
                prompt: "Which clause in a SQL query is evaluated first by the database engine?",
                type: "multiple-choice",
                options: ["SELECT", "FROM", "WHERE", "ORDER BY"],
                correctAnswer: 1,
                explanation: "The database engine first evaluates the FROM clause to identify and join the source tables before applying row filters."
              }
            ],
            proofChallenge: {
              id: "sql-pc-1-1",
              title: "Three-Valued Logic & NULL Filter Proof",
              scenario: "A database has a column 'discount_code' where 50 rows have 'SUMMER', 30 rows have 'WINTER', and 20 rows are NULL.",
              prompt: "A query runs: SELECT COUNT(*) FROM orders WHERE discount_code != 'SUMMER'; What count will be returned and why?",
              type: "multiple-choice",
              options: [
                "30 rows, because NULL != 'SUMMER' evaluates to UNKNOWN and is excluded by WHERE filters",
                "50 rows, because NULL is not equal to 'SUMMER'",
                "80 rows, because all non-SUMMER rows are counted",
                "An SQL syntax error is raised"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Explains three-valued logic (TRUE, FALSE, UNKNOWN)",
                "Identifies that WHERE predicates include only rows evaluating strictly to TRUE",
                "Explains why NULL comparison requires COALESCE or OR IS NULL"
              ],
              explanation: "In SQL, NULL != 'SUMMER' evaluates to UNKNOWN. The WHERE clause keeps only rows that evaluate strictly to TRUE. The 20 NULL rows are discarded, leaving only the 30 'WINTER' rows."
            }
          }
        ]
      },
      {
        id: "sql-mod-2",
        slug: "joins-and-aggregations",
        title: "Module 2: Relational JOINs & Aggregations",
        description: "Master INNER, LEFT, RIGHT, and FULL OUTER joins, aggregate functions, GROUP BY, and HAVING filters.",
        order: 2,
        lessons: [
          {
            id: "sql-les-2-1",
            slug: "joins-and-group-by",
            title: "Lesson 1: Multi-Table JOINs & GROUP BY Aggregations",
            summary: "Master join topologies (INNER vs LEFT) and aggregate group summaries with GROUP BY and HAVING.",
            durationMinutes: 35,
            order: 1,
            content: `
### Relational JOIN Topologies
1. **INNER JOIN**: Returns rows with matching keys in **both** tables.
2. **LEFT (OUTER) JOIN**: Returns **all** rows from left table, filling unmatched right columns with \`NULL\`.
3. **FULL OUTER JOIN**: Returns all rows from both tables, filling mismatches with \`NULL\`.

\`\`\`sql
SELECT 
    u.id AS user_id,
    u.email,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.amount), 0.0) AS total_revenue
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email
HAVING COUNT(o.id) >= 3
ORDER BY total_revenue DESC;
\`\`\`

### WHERE vs HAVING
- \`WHERE\`: Filters individual rows **before** aggregation.
- \`HAVING\`: Filters grouped buckets **after** aggregate functions are computed.
`,
            keyTakeaways: [
              "INNER JOIN discards unmatched records; LEFT JOIN preserves all left-side records with NULLs for missing relations.",
              "GROUP BY collapses rows into aggregate summary buckets.",
              "WHERE filters before grouping; HAVING filters after grouping."
            ],
            practiceQuestions: [
              {
                id: "sql-pq-2-1-1",
                prompt: "What is the key difference between WHERE and HAVING in SQL?",
                type: "multiple-choice",
                options: [
                  "WHERE works on grouped results, HAVING works on raw rows",
                  "WHERE filters raw rows before aggregation; HAVING filters aggregate groupings after GROUP BY",
                  "HAVING is only used in subqueries",
                  "There is no difference"
                ],
                correctAnswer: 1,
                explanation: "WHERE filters rows prior to the GROUP BY stage; HAVING filters the summary groups after aggregate functions (SUM, COUNT) are calculated."
              }
            ],
            proofChallenge: {
              id: "sql-pc-2-1",
              title: "Join Selection & Revenue Aggregation Proof",
              scenario: "A business requires a report listing all registered customers and their lifetime spent. Customers who have never placed an order must appear with $0.00 spent.",
              prompt: "Select the correct SQL query and explain why an INNER JOIN would produce an erroneous report for management.",
              type: "multiple-choice",
              options: [
                "Use LEFT JOIN customers ON orders with COALESCE(SUM(o.amount), 0); an INNER JOIN would silently omit customers with 0 orders",
                "Use INNER JOIN with WHERE orders.amount > 0",
                "Use RIGHT JOIN orders with GROUP BY customer_id",
                "Use a cross join without an ON condition"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Identifies that INNER JOIN eliminates rows with no matches",
                "Selects LEFT JOIN to preserve all customer entities",
                "Uses COALESCE to handle NULL sum values cleanly"
              ],
              explanation: "An INNER JOIN requires matching keys on both sides, which discards customers with 0 orders. A LEFT JOIN preserves every customer and COALESCE(SUM(o.amount), 0) turns NULLs into $0.00."
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. AI & MACHINE LEARNING
  // =========================================================================
  {
    id: "course-aiml",
    slug: "ai-ml",
    title: "AI & Machine Learning Engineering",
    tagline: "Build foundational intuition and engineering practices for supervised learning, evaluation metrics, and model deployment.",
    description: "Understand machine learning from first principles. Progress through dataset preprocessing, train/test validation, regression, classification, decision trees, and overfitting prevention.",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimatedHours: 30,
    iconName: "Brain",
    badgeColor: "purple",
    modules: [
      {
        id: "aiml-mod-1",
        slug: "ml-foundations",
        title: "Module 1: Machine Learning Foundations & Preprocessing",
        description: "Understand the ML paradigm, features, labels, train/test splitting, and feature scaling.",
        order: 1,
        lessons: [
          {
            id: "aiml-les-1-1",
            slug: "supervised-learning-and-split",
            title: "Lesson 1: Supervised Learning & Train/Test Split",
            summary: "Learn feature matrices (X), target vectors (y), dataset partitioning, and data leakage prevention.",
            durationMinutes: 30,
            order: 1,
            content: `
### The Machine Learning Paradigm
In traditional software engineering, humans write **Rules** + provide **Data** $\to$ software produces **Answers**.
In Machine Learning, we feed **Data** + **Answers (Labels)** $\to$ algorithm learns **Rules (Model Parameters)**.

- **Feature Matrix ($X$)**: Matrix of input measurements (dimensions $N \times D$).
- **Target Vector ($y$)**: Ground-truth labels to predict ($N$ labels).

### Train / Test Split & Data Leakage Prevention
To evaluate how well a model generalizes to unseen data, we partition the dataset:
- **Training Set (70-80%)**: Used to fit model parameters ($\theta$).
- **Testing Set (20-30%)**: Held out strictly for unbiased generalization scoring.

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Partition data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# CRITICAL: Fit scaler ONLY on training data to prevent data leakage!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Only transform test set!
\`\`\`
`,
            keyTakeaways: [
              "Machine Learning learns statistical parameters mapping feature inputs X to target labels y.",
              "Never evaluate a model on the data it trained on; hold out an unseen test set.",
              "Data Leakage occurs when test set statistics (e.g. mean/std) leak into training preprocessing."
            ],
            practiceQuestions: [
              {
                id: "aiml-pq-1-1-1",
                prompt: "Why must you fit a StandardScaler only on the training set (fit_transform) and only transform the test set?",
                type: "multiple-choice",
                options: [
                  "To save CPU computation time",
                  "To prevent data leakage of test set distributions into model training",
                  "Because test sets cannot contain numeric numbers",
                  "It is required by Python syntax"
                ],
                correctAnswer: 1,
                explanation: "Fitting on the entire dataset leaks distribution parameters (mean, standard deviation) from the test set into training, resulting in overly optimistic, invalid evaluation metrics."
              }
            ],
            proofChallenge: {
              id: "aiml-pc-1-1",
              title: "Overfitting & Generalization Proof",
              scenario: "A model achieves 99.8% accuracy on training data, but drops to 52.1% on the held-out test dataset.",
              prompt: "Diagnose this failure mode, explain why it happened, and specify two concrete regularization or architecture techniques to resolve it.",
              type: "multiple-choice",
              options: [
                "The model is severely overfitting (memorizing training noise); resolve by adding regularization (L1/L2) or reducing model complexity and increasing training data",
                "The model is underfitting; resolve by making the model much deeper",
                "The test dataset is corrupted; delete the test dataset",
                "The learning rate was too small"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Correctly diagnoses high variance / overfitting",
                "Explains failure of generalization to unseen distributions",
                "Proposes valid countermeasures: regularization, pruning, cross-validation, feature reduction"
              ],
              explanation: "A large gap between near-perfect training score and chance-level test score is the textbook signature of high variance / overfitting. The model memorized noise rather than generalizable feature patterns."
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. DATA SCIENCE
  // =========================================================================
  {
    id: "course-ds",
    slug: "data-science",
    title: "Data Science & Statistical Analytics",
    tagline: "Wrangle real-world data, perform exploratory analysis, engineer features, and derive actionable insights.",
    description: "Master real-world data science workflows using NumPy, Pandas, statistical distributions, correlation analysis, and data visualization.",
    category: "Data Science",
    difficulty: "Beginner",
    estimatedHours: 22,
    iconName: "BarChart3",
    badgeColor: "indigo",
    modules: [
      {
        id: "ds-mod-1",
        slug: "data-wrangling-and-pandas",
        title: "Module 1: Pandas DataFrames & Exploratory Data Analysis",
        description: "Master tabular manipulation with Pandas, handling missing data, grouping, and statistical summaries.",
        order: 1,
        lessons: [
          {
            id: "ds-les-1-1",
            slug: "pandas-dataframes-and-cleaning",
            title: "Lesson 1: Pandas DataFrames & Data Cleaning",
            summary: "Load structured datasets, inspect summary statistics, handle missing values, and filter records.",
            durationMinutes: 30,
            order: 1,
            content: `
### The Pandas DataFrame
A **DataFrame** is a 2-dimensional labeled data structure with columns of potentially different types, backed by contiguous NumPy arrays.

\`\`\`python
import pandas as pd
import numpy as np

# Load and inspect dataset
df = pd.read_csv("telecom_churn.csv")
print(df.shape)       # (rows, columns)
print(df.info())        # data types & non-null counts
print(df.describe())    # 5-number statistical summary
\`\`\`

### Data Cleaning Strategies for Missing Values
1. **Detection**: \`df.isna().sum()\`
2. **Dropping**: \`df.dropna(subset=['critical_id'])\`
3. **Imputation**:
   - Numerical: Median (robust to outliers) or Mean.
   - Categorical: Mode or dedicated \`'Missing'\` category.

\`\`\`python
# Impute missing numeric ages with median
median_age = df['age'].median()
df['age'] = df['age'].fillna(median_age)
\`\`\`
`,
            keyTakeaways: [
              "Pandas DataFrames provide fast, vectorized tabular data operations.",
              "df.describe() gives statistical distribution metrics (mean, std, quartiles).",
              "Median imputation is preferred over mean when distributions exhibit skewness or outliers."
            ],
            practiceQuestions: [
              {
                id: "ds-pq-1-1-1",
                prompt: "When imputing missing values in a heavily skewed numeric column containing severe outliers, which metric is most appropriate?",
                type: "multiple-choice",
                options: ["Mean", "Median", "Standard Deviation", "Random Integer"],
                correctAnswer: 1,
                explanation: "The median is a robust statistic resistant to extreme outliers, whereas the mean is easily distorted by long distribution tails."
              }
            ],
            proofChallenge: {
              id: "ds-pc-1-1",
              title: "Vectorized Operations & Missing Data Handling Proof",
              scenario: "An analyst writes a Python for-loop iterating over 1,000,000 DataFrame rows with df.iloc to calculate a tax column, taking 45 seconds to complete.",
              prompt: "Explain why row-by-row iteration in Pandas is an antipattern and demonstrate the vectorized solution that executes in milliseconds.",
              type: "multiple-choice",
              options: [
                "df['tax'] = df['subtotal'] * 0.08 leverages contiguous C-level SIMD vectorized instructions across memory, avoiding Python bytecode loop overhead",
                "Use a while loop with a time.sleep delay",
                "Export to Excel and recalculate with macros",
                "Duplicate the DataFrame into a Python dictionary"
              ],
              correctAnswer: 0,
              rubricGuidelines: [
                "Explains overhead of Python interpreter loops vs vectorized C NumPy operations",
                "Specifies correct column-wise vector syntax df['col'] = df['a'] * b",
                "Demonstrates understanding of memory contiguity in data processing"
              ],
              explanation: "Vectorized column expressions delegate calculations to compiled C/Fortran routines in NumPy/Pandas that operate on contiguous memory buffers, achieving 100x-1000x speedups over Python iterrows/iloc loops."
            }
          }
        ]
      }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug || c.id === slug);
}

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getLessonBySlugs(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): { course: Course; module: Module; lesson: Lesson } | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const targetModule = course.modules.find((m) => m.slug === moduleSlug);
  if (!targetModule) return null;

  const lesson = targetModule.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;

  return { course, module: targetModule, lesson };
}

