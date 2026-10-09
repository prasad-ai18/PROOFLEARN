import { LanguageInfo, SupportedLanguage } from "./types";

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: "python",
    name: "Python",
    version: "3.11.8",
    iconName: "FileCode",
    extension: "py",
    category: "Data & Query",
    description: "Versatile language for AI/ML, Data Science, algorithms, and rapid prototyping.",
    defaultCode: `# Python 3.11 - ProofLearn Interactive Execution
def solve():
    print("=== PROOFLEARN Python Playground ===")
    numbers = [12, 45, 78, 23, 56, 89, 90, 11]
    
    # Filter even numbers and compute their squares
    squared_evens = [x ** 2 for x in numbers if x % 2 == 0]
    print(f"Original numbers: {numbers}")
    print(f"Squared evens: {squared_evens}")
    print(f"Max value: {max(numbers)}, Sum: {sum(numbers)}")

solve()
`,
    samplePrograms: [
      {
        title: "Two Sum Algorithm",
        description: "Optimal O(N) hash map solution for finding two indices that sum to a target.",
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test run
test_arr = [2, 7, 11, 15]
target_val = 9
result = two_sum(test_arr, target_val)
print(f"Array: {test_arr}, Target: {target_val}")
print(f"Indices found: {result}")
print(f"Values: {test_arr[result[0]]} + {test_arr[result[1]]} = {target_val}")
`,
      },
      {
        title: "Matrix Multiplication (AI/ML Core)",
        description: "Basic dot product and 2D matrix multiplication logic used in neural networks.",
        code: `def matrix_multiply(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    cols_B = len(B[0])
    
    # Initialize output with zeros
    result = [[0 for _ in range(cols_B)] for _ in range(rows_A)]
    
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                result[i][j] += A[i][k] * B[k][j]
    return result

# Matrix A (2x3) and B (3x2)
A = [[1, 2, 3], [4, 5, 6]]
B = [[7, 8], [9, 1], [2, 3]]
C = matrix_multiply(A, B)

print("Matrix A:")
for r in A: print(f"  {r}")
print("Matrix B:")
for r in B: print(f"  {r}")
print("Product Matrix A x B:")
for r in C: print(f"  {r}")
`,
      },
    ],
  },
  {
    id: "c",
    name: "C (GCC)",
    version: "GCC 13.2 / C17",
    iconName: "Binary",
    extension: "c",
    category: "Systems & ECE",
    description: "Low-level systems language used in Operating Systems, Embedded Systems, and firmware.",
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("=== PROOFLEARN C Systems Playground ===\\n");
    
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Array before sorting: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    
    // Bubble sort demonstration
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    printf("Array after sorting:  ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    
    return 0;
}
`,
    samplePrograms: [
      {
        title: "Pointers & Dynamic Memory",
        description: "Dynamic allocation with malloc and pointer manipulation.",
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 5;
    int *buffer = (int *)malloc(capacity * sizeof(int));
    if (!buffer) return 1;
    
    for (int i = 0; i < capacity; i++) {
        *(buffer + i) = (i + 1) * 10;
    }
    
    printf("Dynamically allocated elements:\\n");
    for (int i = 0; i < capacity; i++) {
        printf("Index %d at %p -> Value: %d\\n", i, (void *)(buffer + i), *(buffer + i));
    }
    
    free(buffer);
    printf("Memory freed safely.\\n");
    return 0;
}
`,
      },
      {
        title: "Embedded Bitwise Flags (ECE)",
        description: "Hardware register bit masking and manipulation for microcontrollers.",
        code: `#include <stdio.h>

#define LED_PIN_0   (1 << 0)
#define LED_PIN_1   (1 << 1)
#define TIMER_EN    (1 << 4)
#define INTERRUPT_EN (1 << 7)

int main(void) {
    unsigned char control_register = 0x00;
    
    // Set LED 0 and Timer Enable bits
    control_register |= (LED_PIN_0 | TIMER_EN);
    printf("Register after SET: 0x%02X\\n", control_register);
    
    // Check if TIMER_EN is active
    if (control_register & TIMER_EN) {
        printf("TIMER_EN bit is ACTIVE\\n");
    }
    
    // Toggle LED 0
    control_register ^= LED_PIN_0;
    printf("Register after TOGGLE LED0: 0x%02X\\n", control_register);
    
    return 0;
}
`,
      },
    ],
  },
  {
    id: "cpp",
    name: "C++ (G++)",
    version: "G++ 13 / C++20",
    iconName: "Code",
    extension: "cpp",
    category: "Core Programming",
    description: "High-performance language with modern STL, templates, and zero-cost abstractions.",
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::cout << "=== PROOFLEARN C++20 Standard Library ===" << std::endl;
    
    std::vector<int> numbers = {15, 3, 98, 42, 7, 61, 88};
    
    std::cout << "Original vector: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted vector:   ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    long long total = std::accumulate(numbers.begin(), numbers.end(), 0LL);
    std::cout << "Vector sum: " << total << ", Count: " << numbers.size() << std::endl;
    
    return 0;
}
`,
    samplePrograms: [
      {
        title: "Binary Search Tree (BST)",
        description: "Node insertion and in-order traversal in modern C++.",
        code: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}

void inOrder(TreeNode* root) {
    if (!root) return;
    inOrder(root->left);
    std::cout << root->val << " ";
    inOrder(root->right);
}

int main() {
    TreeNode* root = nullptr;
    int items[] = {50, 30, 20, 40, 70, 60, 80};
    for (int x : items) root = insert(root, x);
    
    std::cout << "BST In-Order Traversal (Sorted): ";
    inOrder(root);
    std::cout << std::endl;
    return 0;
}
`,
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    version: "OpenJDK 21",
    iconName: "Coffee",
    extension: "java",
    category: "Core Programming",
    description: "Enterprise OOP language used in backend architectures, Android, and distributed big data.",
    defaultCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== PROOFLEARN Java 21 Engine ===");
        
        List<String> domains = Arrays.asList(
            "Artificial Intelligence",
            "Computer Science & DSA",
            "Data Science & Analytics",
            "Electronics & Embedded (ECE)"
        );
        
        System.out.println("Available Learning Tracks:");
        for (int i = 0; i < domains.size(); i++) {
            System.out.printf("[%d] %s%n", i + 1, domains.get(i));
        }
        
        // HashMap frequency counter
        String text = "prooflearn code practice verify mastery prooflearn";
        Map<String, Integer> freq = new HashMap<>();
        for (String word : text.split(" ")) {
            freq.put(word, freq.getOrDefault(word, 0) + 1);
        }
        
        System.out.println("\\nWord frequencies:");
        freq.forEach((k, v) -> System.out.println("  " + k + " -> " + v));
    }
}
`,
    samplePrograms: [
      {
        title: "LRU Cache Implementation",
        description: "Classic design with LinkedHashMap for O(1) cache access and eviction.",
        code: `import java.util.*;

class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

public class Main {
    public static void main(String[] args) {
        LRUCache<String, Integer> cache = new LRUCache<>(3);
        cache.put("user_1", 100);
        cache.put("user_2", 200);
        cache.put("user_3", 300);
        System.out.println("Initial Cache: " + cache);
        
        cache.get("user_1"); // Access user_1
        cache.put("user_4", 400); // Should evict least recently used (user_2)
        
        System.out.println("After Accessing user_1 and Adding user_4:");
        System.out.println("Updated Cache: " + cache);
    }
}
`,
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    version: "ES2024 / Node 20",
    iconName: "FileCode",
    extension: "js",
    category: "Web & Cloud",
    description: "The ubiquitous language of the web, full-stack microservices, and asynchronous runtimes.",
    defaultCode: `// JavaScript ES2024 - ProofLearn Live Sandbox
console.log("=== PROOFLEARN JavaScript Environment ===");

const students = [
  { name: "Alex Chen", course: "DSA Masterclass", score: 94 },
  { name: "Sarah Connor", course: "Deep Learning & PyTorch", score: 88 },
  { name: "Rajesh Kumar", course: "VLSI Design with Verilog", score: 96 },
  { name: "Elena Rostova", course: "Distributed Systems", score: 78 },
];

const certifiedStudents = students
  .filter(s => s.score >= 85)
  .map(s => ({
    ...s,
    credential: \`PLF-2026-\${Math.random().toString(36).substring(2, 7).toUpperCase()}\`,
    status: "Proof Certified"
  }));

console.log("High Distinction Certified Candidates (>=85%):");
console.table ? console.table(certifiedStudents) : console.log(JSON.stringify(certifiedStudents, null, 2));
`,
    samplePrograms: [
      {
        title: "Async / Await Promise Pipeline",
        description: "Concurrent promise resolution with Promise.allSettled.",
        code: `async function simulateTask(taskName, delayMs) {
  await new Promise(res => setTimeout(res, delayMs));
  return \`Completed: \${taskName} in \${delayMs}ms\`;
}

async function run() {
  console.log("Starting parallel verification tasks...");
  const tasks = [
    simulateTask("Syntax Verification", 10),
    simulateTask("Unit Tests Execution", 20),
    simulateTask("Proof Ledger Ledger Signing", 15)
  ];
  
  const results = await Promise.all(tasks);
  results.forEach(r => console.log("✔", r));
  console.log("All pipeline stages passed!");
}

run();
`,
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.4.5",
    iconName: "FileCode",
    extension: "ts",
    category: "Web & Cloud",
    description: "Typed superset of JavaScript providing static safety, interfaces, and union types.",
    defaultCode: `// TypeScript 5.4 - ProofLearn Type Checker
interface ProofCredential {
  candidateName: string;
  courseTitle: string;
  grade: number;
  verified: boolean;
  issuedAt: string;
}

function issueCertificate(
  name: string,
  course: string,
  score: number
): ProofCredential {
  return {
    candidateName: name,
    courseTitle: course,
    grade: score,
    verified: score >= 70,
    issuedAt: new Date().toISOString().split("T")[0],
  };
}

const credential = issueCertificate(
  "Devina Sharma",
  "Computer Networks & TCP/IP Internals",
  92
);

console.log("=== PROOFLEARN Verified Credential ===");
console.log(\`Candidate:   \${credential.candidateName}\`);
console.log(\`Course:      \${credential.courseTitle}\`);
console.log(\`Grade:       \${credential.grade}% (Distinction)\`);
console.log(\`Verification: \${credential.verified ? "VERIFIED VALID" : "FAILED"}\`);
`,
    samplePrograms: [
      {
        title: "Generic Binary Heap",
        description: "Type-safe priority queue heap implementation with generics.",
        code: `class PriorityQueue<T> {
  private data: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number): void {
    this.data.push({ item, priority });
    this.data.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): T | undefined {
    return this.data.shift()?.item;
  }

  size(): number {
    return this.data.length;
  }
}

const queue = new PriorityQueue<string>();
queue.enqueue("Low priority background task", 1);
queue.enqueue("CRITICAL: Final Exam Submission", 10);
queue.enqueue("Medium: Practice Quiz", 5);

console.log("Dequeued highest priority:", queue.dequeue());
console.log("Next in line:", queue.dequeue());
`,
      },
    ],
  },
  {
    id: "rust",
    name: "Rust",
    version: "rustc 1.76",
    iconName: "Shield",
    extension: "rs",
    category: "Systems & ECE",
    description: "Blazingly fast memory-safe systems programming language without a garbage collector.",
    defaultCode: `fn main() {
    println!("=== PROOFLEARN Rust Systems Engine ===");
    
    let scores = vec![85, 92, 78, 96, 88, 74];
    
    let sum: i32 = scores.iter().sum();
    let count = scores.len();
    let average = sum as f64 / count as f64;
    
    println!("Evaluation scores: {:?}", scores);
    println!("Total sum: {}", sum);
    println!("Average score: {:.2}%", average);
    
    let passed_count = scores.iter().filter(|&&x| x >= 70).count();
    println!("Passing candidates (>=70%): {}/{}", passed_count, count);
}
`,
    samplePrograms: [
      {
        title: "Safe Concurrency & Structs",
        description: "Pattern matching with Result/Option enums and ownership semantics.",
        code: `#[derive(Debug)]
struct Candidate {
    name: String,
    score: u32,
}

impl Candidate {
    fn is_certified(&self) -> bool {
        self.score >= 70
    }
}

fn evaluate(name: &str, score: u32) -> Result<Candidate, String> {
    if score > 100 {
        Err(String::from("Invalid score > 100"))
    } else {
        Ok(Candidate {
            name: name.to_string(),
            score,
        })
    }
}

fn main() {
    match evaluate("Arjun", 95) {
        Ok(c) => println!("Candidate: {} -> Certified: {}", c.name, c.is_certified()),
        Err(e) => println!("Error: {}", e),
    }
}
`,
      },
    ],
  },
  {
    id: "go",
    name: "Go (Golang)",
    version: "Go 1.22",
    iconName: "Terminal",
    extension: "go",
    category: "Web & Cloud",
    description: "Concise language designed for cloud microservices, concurrency, and scalable backends.",
    defaultCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("=== PROOFLEARN Go Concurrency Engine ===")

	channels := make(chan string, 3)

	go func() {
		time.Sleep(10 * time.Millisecond)
		channels <- "Task 1: Verify Code Output"
	}()

	go func() {
		time.Sleep(20 * time.Millisecond)
		channels <- "Task 2: Compile AST Graph"
	}()

	go func() {
		time.Sleep(15 * time.Millisecond)
		channels <- "Task 3: Issue Proof Stamp"
	}()

	for i := 0; i < 3; i++ {
		msg := <-channels
		fmt.Printf("Received: %s\\n", msg)
	}

	fmt.Println("All concurrent pipelines finished successfully.")
}
`,
    samplePrograms: [
      {
        title: "REST Model & Slices",
        description: "Struct models, methods, and JSON-like slice operations.",
        code: `package main

import "fmt"

type Course struct {
	ID       string
	Title    string
	Lessons  int
	Domain   string
}

func main() {
	catalog := []Course{
		{"CS101", "Data Structures & Algorithms", 12, "CSE"},
		{"AI201", "PyTorch & Deep Learning", 14, "AIML"},
		{"EC301", "ARM Cortex-M Firmware", 10, "ECE"},
	}

	fmt.Println("ProofLearn Course Index:")
	for _, c := range catalog {
		fmt.Printf("• [%s] %s (%d lessons) - Domain: %s\\n", c.ID, c.Title, c.Lessons, c.Domain)
	}
}
`,
      },
    ],
  },
  {
    id: "sql",
    name: "SQL (PostgreSQL)",
    version: "PostgreSQL 16",
    iconName: "Database",
    extension: "sql",
    category: "Data & Query",
    description: "Standard language for querying, transforming, and managing relational databases.",
    defaultCode: `-- SQL Playground: Analytics Query & Schema
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    domain VARCHAR(50),
    gpa NUMERIC(3, 2),
    certificates_earned INT
);

INSERT INTO students (name, domain, gpa, certificates_earned) VALUES
('Priya Sharma', 'AIML', 3.92, 4),
('Vikram Rao', 'CSE', 3.75, 2),
('Neha Patel', 'ECE', 3.88, 5),
('Aman Verma', 'Data Science', 3.65, 3),
('Sophia Davis', 'CSE', 3.95, 6);

-- Top candidates with high distinction (>3.80 GPA)
SELECT 
    name, 
    domain, 
    gpa, 
    certificates_earned,
    CASE 
        WHEN gpa >= 3.90 THEN 'Summa Cum Laude'
        WHEN gpa >= 3.80 THEN 'Magna Cum Laude'
        ELSE 'Cum Laude'
    END as honors_rank
FROM students
WHERE gpa >= 3.70
ORDER BY gpa DESC;
`,
    samplePrograms: [
      {
        title: "Aggregations & Group By",
        description: "Average GPA and total certificates grouped by academic domain.",
        code: `SELECT 
    domain,
    COUNT(*) as student_count,
    ROUND(AVG(gpa), 2) as avg_gpa,
    SUM(certificates_earned) as total_certs
FROM students
GROUP BY domain
HAVING COUNT(*) >= 1
ORDER BY avg_gpa DESC;
`,
      },
    ],
  },
  {
    id: "bash",
    name: "Bash Shell",
    version: "GNU Bash 5.2",
    iconName: "Terminal",
    extension: "sh",
    category: "Systems & ECE",
    description: "Linux shell scripting for system administration, DevOps pipelines, and automation.",
    defaultCode: `#!/usr/bin/env bash
# ProofLearn Bash Automation Script

echo "=== System Health & Deployment Inspection ==="
DATE=$(date "+%Y-%m-%d %H:%M:%S")
echo "Timestamp: $DATE"

DOMAINS=("AIML" "CSE" "ECE" "Data-Science" "DevOps")

echo "Checking pipeline status for registered domains:"
for domain in "\${DOMAINS[@]}"; do
    echo "  [OK] Domain module '$domain' is healthy"
done

TOTAL_COURSES=207
PASSING_SCORE=70
echo "Catalog Verified: $TOTAL_COURSES active courses loaded"
echo "Certification Threshold: $PASSING_SCORE% score required"
`,
    samplePrograms: [
      {
        title: "Log Parsing & Metrics Extraction",
        description: "Process simulated web access logs with awk and grep.",
        code: `#!/usr/bin/env bash
LOGS=(
  "200 GET /courses"
  "200 GET /code-playground"
  "404 GET /unknown-endpoint"
  "200 POST /api/submit-exam"
  "200 GET /resume-builder"
  "500 POST /simulate-crash"
)

echo "Total requests recorded: \${#LOGS[@]}"
SUCCESS_COUNT=0

for log in "\${LOGS[@]}"; do
  STATUS=$(echo "$log" | cut -d' ' -f1)
  if [ "$STATUS" -eq 200 ]; then
    ((SUCCESS_COUNT++))
  fi
done

echo "Successful (200 OK) responses: $SUCCESS_COUNT"
`,
      },
    ],
  },
  {
    id: "verilog",
    name: "Verilog HDL",
    version: "IEEE 1364-2005",
    iconName: "Cpu",
    extension: "v",
    category: "Systems & ECE",
    description: "Hardware Description Language for digital logic synthesis, FPGA, and ASIC design.",
    defaultCode: `// Verilog HDL: 4-bit Synchronous Binary Counter
module counter_4bit (
    input wire clk,
    input wire rst_n,
    input wire enable,
    output reg [3:0] count
);

always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        count <= 4'b0000;
    end else if (enable) begin
        count <= count + 1'b1;
    end
end

endmodule

// Testbench Simulation
module tb_counter;
    reg clk;
    reg rst_n;
    reg enable;
    wire [3:0] count;

    counter_4bit uut (
        .clk(clk),
        .rst_n(rst_n),
        .enable(enable),
        .count(count)
    );

    initial begin
        $display("=== Verilog Simulation: 4-bit Counter ===");
        clk = 0;
        rst_n = 0;
        enable = 1;
        #10 rst_n = 1; // Release reset
        
        $display("Cycle 0: Reset Released -> Count = %b", count);
        $display("Cycle 1: Clock Pulse   -> Count = 0001");
        $display("Cycle 2: Clock Pulse   -> Count = 0010");
        $display("Simulation complete. All assertions passed.");
    end
endmodule
`,
    samplePrograms: [
      {
        title: "2-to-1 Multiplexer (Mux)",
        description: "Combinational digital logic multiplexer unit.",
        code: `module mux_2to1 (
    input wire a,
    input wire b,
    input wire sel,
    output wire y
);
    assign y = (sel == 1'b0) ? a : b;
endmodule
`,
      },
    ],
  },
];
