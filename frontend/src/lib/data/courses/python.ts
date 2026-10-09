import type { Course } from "../course-types";

// ===================================================================
// PYTHON COURSE
// ===================================================================
export const PYTHON_COURSE: Course = {
  id: "course-python",
  slug: "python",
  title: "Python Programming Mastery",
  tagline: "From beginner syntax to production-grade Python engineering.",
  description: "A comprehensive Python 3 course covering fundamentals, data structures, OOP, file handling, and real-world libraries including NumPy and Pandas.",
  category: "Programming",
  difficulty: "Beginner",
  estimatedHours: 30,
  iconName: "Terminal",
  badgeColor: "emerald",
  prerequisites: [],
  learningOutcomes: [
    "Write clean, idiomatic Python code",
    "Master built-in data structures (lists, dicts, sets, tuples)",
    "Apply OOP principles with classes and inheritance",
    "Handle files, exceptions, and modules professionally",
    "Use NumPy and Pandas for data manipulation"
  ],
  resources: [
    { id: "py-r1", title: "Python Official Documentation", provider: "Python.org", type: "documentation", url: "https://docs.python.org/3/", description: "The official Python 3 reference and library documentation.", difficulty: "All Levels", isFree: true },
    { id: "py-r2", title: "Python Tutorial", provider: "Python.org", type: "tutorial", url: "https://docs.python.org/3/tutorial/", description: "Official beginner-friendly Python tutorial.", difficulty: "Beginner", isFree: true },
    { id: "py-r3", title: "Real Python", provider: "Real Python", type: "tutorial", url: "https://realpython.com/", description: "High-quality Python tutorials and articles.", difficulty: "All Levels", isFree: false },
    { id: "py-r4", title: "freeCodeCamp Python Course", provider: "freeCodeCamp", type: "video", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", description: "Complete 4-hour Python beginner course on YouTube.", difficulty: "Beginner", isFree: true },
    { id: "py-r5", title: "Kaggle Python", provider: "Kaggle", type: "platform", url: "https://www.kaggle.com/learn/python", description: "Free hands-on Python micro-course with notebooks.", difficulty: "Beginner", isFree: true },
    { id: "py-r6", title: "Python Exercises", provider: "Exercism", type: "platform", url: "https://exercism.org/tracks/python", description: "100+ Python exercises with mentor feedback.", difficulty: "All Levels", isFree: true }
  ],
  modules: [
    {
      id: "py-mod-1",
      slug: "python-fundamentals",
      title: "Module 1: Python Fundamentals",
      description: "Variables, data types, operators, and the Python runtime model.",
      order: 1,
      lessons: [
        {
          id: "py-les-1-1",
          slug: "variables-and-types",
          title: "Variables, Types & Dynamic Binding",
          summary: "How Python handles variables as object references, not containers.",
          durationMinutes: 20,
          order: 1,
          content: `### What is Python?
Python is a high-level, interpreted, dynamically-typed language. Variables are **named references** bound to objects in heap memory—not typed memory slots.

\`\`\`python
x = 42          # x references an int object
x = "hello"     # x now references a str object — no error!
print(type(x))  # <class 'str'>
\`\`\`

### Primitive Types
- **int** — arbitrary precision integers: \`x = 100\`
- **float** — IEEE 754 doubles: \`pi = 3.14159\`
- **bool** — subclass of int: \`True\`, \`False\`
- **str** — immutable Unicode sequences: \`name = "Ada"\`
- **NoneType** — singleton \`None\`

### Type Checking
\`\`\`python
x = 3.14
print(type(x))        # <class 'float'>
print(isinstance(x, float))  # True
\`\`\`

### Variable Naming
- Must start with letter or underscore
- Case-sensitive: \`count\` ≠ \`Count\`
- Use \`snake_case\` by Python convention (PEP 8)`,
          keyTakeaways: [
            "Python variables are references, not typed containers",
            "Dynamic typing means a variable can be rebound to any type",
            "Use isinstance() for type checking, not type() ==",
            "Follow PEP 8: snake_case for variable names"
          ],
          practiceQuestions: [
            {
              id: "py-pq-1-1-1",
              prompt: "What does the following code print?",
              codeSnippet: "x = 5\nx = x + 0.5\nprint(type(x))",
              type: "multiple-choice",
              options: ["<class 'int'>", "<class 'float'>", "<class 'complex'>", "TypeError"],
              correctAnswer: 1,
              explanation: "Adding an int and a float produces a float due to Python's implicit type coercion."
            },
            {
              id: "py-pq-1-1-2",
              prompt: "Which variable name follows PEP 8 conventions for a multi-word variable?",
              type: "multiple-choice",
              options: ["userName", "user_name", "UserName", "user-name"],
              correctAnswer: 1,
              explanation: "PEP 8 mandates snake_case for variable names. camelCase is for Java/JavaScript."
            }
          ],
          proofChallenge: {
            id: "py-proof-1-1",
            title: "Python Type System Proof",
            scenario: "A colleague insists that Python variables 'store' values like Java primitive types.",
            prompt: "Which statement correctly describes Python's variable model?",
            type: "multiple-choice",
            options: [
              "Variables are fixed-type memory slots that store values directly",
              "Variables are named references pointing to objects in heap memory",
              "Variables are pointers that must be declared before use",
              "Variables hold values but their type cannot change after assignment"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Mentions reference/binding model", "Understands dynamic typing", "Distinguishes from static languages"],
            explanation: "Python variables are names bound to objects via reference. The object has a type, not the variable. This enables dynamic typing."
          }
        },
        {
          id: "py-les-1-2",
          slug: "control-flow",
          title: "Control Flow: Conditionals & Loops",
          summary: "if/elif/else logic, for and while loops, break/continue/pass.",
          durationMinutes: 25,
          order: 2,
          content: `### Conditionals
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
print(grade)  # B
\`\`\`

### Truthiness
Empty sequences, zero, and None are falsy:
\`\`\`python
if []:      # False — empty list
if "":      # False — empty string
if 0:       # False
if None:    # False
\`\`\`

### for Loops
\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# With enumerate
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
\`\`\`

### while Loops & break/continue
\`\`\`python
n = 10
while n > 0:
    if n % 2 == 0:
        n -= 1
        continue   # skip even
    print(n)
    n -= 1
    if n < 5:
        break      # stop early
\`\`\``,
          keyTakeaways: [
            "elif chains avoid deeply nested ifs",
            "Python uses truthiness—any object can evaluate to True/False",
            "enumerate() gives both index and value in for loops",
            "break exits loops; continue skips to next iteration"
          ],
          practiceQuestions: [
            {
              id: "py-pq-1-2-1",
              prompt: "What does this loop print?",
              codeSnippet: "for i in range(5):\n    if i == 3:\n        break\n    print(i)",
              type: "multiple-choice",
              options: ["0 1 2 3 4", "0 1 2", "0 1 2 3", "1 2 3 4"],
              correctAnswer: 1,
              explanation: "break exits the loop when i==3, so only 0, 1, 2 are printed."
            },
            {
              id: "py-pq-1-2-2",
              prompt: "Which of the following is falsy in Python?",
              type: "multiple-choice",
              options: ["[0]", "\"False\"", "0.0", "False == 0"],
              correctAnswer: 2,
              explanation: "0.0 is the float zero and evaluates to False. [0] is a non-empty list (truthy). \"False\" is a non-empty string (truthy). False==0 is a boolean expression that evaluates to True."
            }
          ],
          proofChallenge: {
            id: "py-proof-1-2",
            title: "Control Flow Proof",
            scenario: "You need to iterate a list and skip negative numbers, stopping when you hit the value 99.",
            prompt: "Which control flow construct should you use?",
            type: "multiple-choice",
            options: [
              "A for loop with break to stop and continue to skip negatives",
              "A while loop only — for loops cannot break early",
              "An if/else chain without any loop",
              "Recursion — loops cannot handle both conditions"
            ],
            correctAnswer: 0,
            rubricGuidelines: ["Identifies correct loop type", "Knows break exits loop", "Knows continue skips iteration"],
            explanation: "A for loop with break (to stop at 99) and continue (to skip negatives) is the cleanest, idiomatic approach."
          }
        }
      ]
    },
    {
      id: "py-mod-2",
      slug: "functions-and-scope",
      title: "Module 2: Functions & Scope",
      description: "Defining functions, arguments, return values, lambda, closures, and scope rules.",
      order: 2,
      lessons: [
        {
          id: "py-les-2-1",
          slug: "defining-functions",
          title: "Defining & Calling Functions",
          summary: "def keyword, parameters, return values, default args, *args, **kwargs.",
          durationMinutes: 25,
          order: 1,
          content: `### Basic Function Definition
\`\`\`python
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

print(greet("Ada"))           # Hello, Ada!
print(greet("Alan", "Hi"))    # Hi, Alan!
\`\`\`

### *args and **kwargs
\`\`\`python
def total(*args):
    return sum(args)

print(total(1, 2, 3, 4))   # 10

def describe(**kwargs):
    for key, val in kwargs.items():
        print(f"{key}: {val}")

describe(name="Ada", job="Engineer")
\`\`\`

### Lambda Functions
\`\`\`python
square = lambda x: x ** 2
nums = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(nums, key=lambda x: -x)
print(sorted_nums)  # [9, 5, 4, 3, 1, 1]
\`\`\`

### Scope: LEGB Rule
Local → Enclosing → Global → Built-in
\`\`\`python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        print(x)   # "enclosing" — found in enclosing scope
    inner()
\`\`\``,
          keyTakeaways: [
            "Default parameters make functions more flexible",
            "*args collects positional args as tuple, **kwargs as dict",
            "Lambda is a single-expression anonymous function",
            "Python uses LEGB scope resolution: Local → Enclosing → Global → Built-in"
          ],
          practiceQuestions: [
            {
              id: "py-pq-2-1-1",
              prompt: "What does this function call return?",
              codeSnippet: "def add(a, b=10):\n    return a + b\n\nprint(add(5))",
              type: "multiple-choice",
              options: ["5", "10", "15", "TypeError"],
              correctAnswer: 2,
              explanation: "b defaults to 10 when not provided, so add(5) = 5 + 10 = 15."
            },
            {
              id: "py-pq-2-1-2",
              prompt: "Which statement about *args is correct?",
              type: "multiple-choice",
              options: [
                "*args passes keyword arguments",
                "*args collects extra positional arguments into a list",
                "*args collects extra positional arguments into a tuple",
                "*args must come before required parameters"
              ],
              correctAnswer: 2,
              explanation: "*args collects extra positional arguments into a TUPLE, not a list."
            }
          ],
          proofChallenge: {
            id: "py-proof-2-1",
            title: "Functions Proof",
            scenario: "A teammate wrote a function that accepts any number of numbers and returns their average, but it crashes when called with no arguments.",
            prompt: "What is the correct implementation?",
            type: "multiple-choice",
            options: [
              "def avg(*args): return sum(args) / len(args)",
              "def avg(*args): return sum(args) / len(args) if args else 0",
              "def avg(args): return sum(args) / len(args)",
              "def avg(**kwargs): return sum(kwargs.values()) / len(kwargs)"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Uses *args for variadic input", "Handles division by zero (empty args)", "Returns 0 for empty input"],
            explanation: "Option B uses *args correctly AND guards against division by zero with 'if args else 0'."
          }
        }
      ]
    },
    {
      id: "py-mod-3",
      slug: "data-structures",
      title: "Module 3: Data Structures",
      description: "Lists, tuples, dictionaries, sets, and list comprehensions.",
      order: 3,
      lessons: [
        {
          id: "py-les-3-1",
          slug: "lists-and-dicts",
          title: "Lists, Dictionaries & Comprehensions",
          summary: "Core mutable data structures and Pythonic comprehension syntax.",
          durationMinutes: 30,
          order: 1,
          content: `### Lists
\`\`\`python
nums = [1, 2, 3, 4, 5]
nums.append(6)       # [1, 2, 3, 4, 5, 6]
nums.pop()           # 6 — removes last
nums[1:3]            # [2, 3] — slicing
\`\`\`

### Dictionaries
\`\`\`python
student = {"name": "Ada", "score": 95}
student["grade"] = "A"
student.get("age", "N/A")   # "N/A" — safe access

# Iterate
for key, val in student.items():
    print(f"{key}: {val}")
\`\`\`

### List Comprehensions
\`\`\`python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix = [[i*j for j in range(3)] for i in range(3)]
\`\`\`

### Sets
\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)   # {3, 4} — intersection
print(a | b)   # {1, 2, 3, 4, 5, 6} — union
print(a - b)   # {1, 2} — difference
\`\`\``,
          keyTakeaways: [
            "Lists are ordered, mutable sequences",
            "Dicts map keys to values — O(1) average lookup",
            "List comprehensions replace map/filter in Pythonic code",
            "Sets store unique values and support set algebra"
          ],
          practiceQuestions: [
            {
              id: "py-pq-3-1-1",
              prompt: "What does this comprehension produce?",
              codeSnippet: "[x**2 for x in range(5) if x % 2 != 0]",
              type: "multiple-choice",
              options: ["[0, 1, 4, 9, 16]", "[1, 9]", "[1, 4, 9]", "[0, 4, 16]"],
              correctAnswer: 1,
              explanation: "range(5) = [0,1,2,3,4]. Filtering odd numbers gives [1,3]. Squaring gives [1,9]."
            },
            {
              id: "py-pq-3-1-2",
              prompt: "Which dict method safely returns a default if a key is missing?",
              type: "multiple-choice",
              options: ["dict[key]", "dict.fetch(key, default)", "dict.get(key, default)", "dict.find(key)"],
              correctAnswer: 2,
              explanation: "dict.get(key, default) returns the default value instead of raising KeyError."
            }
          ],
          proofChallenge: {
            id: "py-proof-3-1",
            title: "Data Structures Proof",
            scenario: "You have a list of words and need to count occurrences of each word efficiently.",
            prompt: "What is the most Pythonic approach?",
            type: "multiple-choice",
            options: [
              "Use a list and manually search for each word",
              "Use a dictionary with word as key and count as value",
              "Use a set — sets track occurrences",
              "Use a tuple since it's immutable and faster"
            ],
            correctAnswer: 1,
            rubricGuidelines: ["Identifies dict as correct structure", "Understands O(1) key lookup", "Knows dict.get() for safe default"],
            explanation: "A dictionary maps word→count with O(1) average lookup. Sets don't track counts. Lists require O(n) search."
          }
        }
      ]
    }
  ]
};
