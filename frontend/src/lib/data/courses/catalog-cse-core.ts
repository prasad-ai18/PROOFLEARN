import { buildCatalogCourse } from "../course-builder";
import type { Course } from "../course-types";

export const CSE_CORE_COURSES: Course[] = [
  // 1. Data Structures & Algorithms Masterclass
  buildCatalogCourse({
    id: "course-cse-dsa",
    slug: "data-structures-algorithms-mastery",
    title: "Data Structures & Algorithms (DSA) Mastery",
    tagline: "Master arrays, linked lists, trees, graphs, dynamic programming, and Big-O complexity.",
    description: "The ultimate technical interview and computer science engineering curriculum. Covers asymptotic Big-O analysis, binary search trees (BST), balanced AVL/Red-Black trees, heaps, union-find disjoint sets, graph traversals (BFS/DFS/Dijkstra), and dynamic programming memoization.",
    category: "Computer Science (CSE)",
    difficulty: "Intermediate",
    estimatedHours: 60,
    iconName: "Code",
    badgeColor: "blue",
    learningOutcomes: [
      "Analyze time and space complexity with Big-O, Big-Omega, and Big-Theta notations",
      "Implement self-balancing trees and priority queues from scratch",
      "Solve shortest-path, topological sort, and cycle detection graph problems",
      "Master Dynamic Programming patterns: 0/1 Knapsack, Longest Common Subsequence, and Interval DP",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/data-structures-algorithms",
    videoEmbedId: "8hly31xKli0",
    videoTitle: "Data Structures and Algorithms Full Masterclass Course",
    modules: [
      {
        id: "cse-dsa-mod-1",
        slug: "graph-algorithms",
        title: "Module 1: Graph Algorithms & Dynamic Programming",
        description: "Dijkstra's shortest path, cycle detection, and memoization techniques.",
        lessons: [
          {
            id: "cse-dsa-les-1",
            slug: "dijkstra-and-priority-queues",
            title: "Dijkstra's Shortest Path Algorithm & Heaps",
            summary: "Single-source shortest paths on non-negative weighted graphs with min-heaps in O((V + E) log V).",
            content: "Dijkstra's algorithm finds the shortest path from a starting vertex to all other vertices in a directed/undirected graph with non-negative edge weights.\n\nAlgorithm Steps:\n1. Initialize dist[src] = 0 and all other dist[v] = infinity.\n2. Push (0, src) into a min-priority queue.\n3. Pop the minimum distance node u. If current dist > dist[u], continue (already visited with a shorter path).\n4. For each neighbor v of u with weight w: if dist[u] + w < dist[v], update dist[v] and push into priority queue.",
            keyTakeaways: [
              "Dijkstra fails on graphs with negative weight edges; use Bellman-Ford or Floyd-Warshall instead",
              "Using an indexed min-heap or binary heap yields O((V + E) log V) time complexity",
              "A* search enhances Dijkstra by adding an admissible heuristic h(n) towards the target node",
            ],
            practiceQuestions: [
              {
                id: "dsa-pq-1",
                prompt: "Why can Dijkstra's algorithm produce incorrect shortest path results on graphs containing negative edge weights?",
                type: "multiple-choice",
                options: [
                  "Because Dijkstra greedily assumes that once a node is finalized and popped from the priority queue, no shorter path to it can ever be found",
                  "Because priority queues cannot store negative numbers",
                  "Because negative weights cause an infinite loop in the heap",
                  "Because graph vertices must have positive IDs",
                ],
                correctAnswer: 0,
                explanation: "Dijkstra's greedy choice assumes that path lengths only increase monotonically. A negative edge encountered later could reduce the total cost of a path to an already finalized node, invalidating earlier decisions.",
              },
            ],
            proofChallenge: {
              id: "dsa-proof-1",
              title: "Union-Find Cycle Detection in Undirected Graph",
              scenario: "An undirected network topology needs real-time detection of redundant cycle loops during incremental edge insertion.",
              questions: [
                {
                  id: "dsa-proof-q1",
                  prompt: "What is the amortized time complexity per operation for Disjoint Set Union (DSU) with Path Compression and Union by Rank?",
                  options: [
                    "O(α(N)) - inverse Ackermann function, practically O(1) constant time",
                    "O(N log N)",
                    "O(N^2)",
                    "O(log N) worst case always",
                  ],
                  correctAnswer: 0,
                  explanation: "Combining path compression during `find` with rank/size heuristics during `union` yields an amortized time complexity of O(α(N)), where α is the inverse Ackermann function, which is less than 5 for all physically possible input sizes.",
                },
              ],
              rubricGuidelines: ["Analyze DSU complexity", "Explain path compression"],
            },
          },
        ],
      },
    ],
  }),

  // 2. Operating Systems Concepts (Processes, Memory, Threads & I/O)
  buildCatalogCourse({
    id: "course-cse-operating-systems",
    slug: "operating-systems-concepts-internals",
    title: "Operating Systems Concepts & Internals",
    tagline: "Processes, virtual memory, paging, CPU scheduling, deadlocks, and file systems.",
    description: "Understand the core software layer between application code and computer hardware. Covers process control blocks (PCB), context switching, preemptive scheduling algorithms (CFS), virtual memory with multi-level page tables, TLBs, page faults, and POSIX synchronization.",
    category: "Computer Science (CSE)",
    difficulty: "Intermediate",
    estimatedHours: 45,
    iconName: "Terminal",
    badgeColor: "emerald",
    learningOutcomes: [
      "Trace process lifecycle states: New, Ready, Running, Waiting, Terminated",
      "Analyze CPU scheduling: Round Robin, Multilevel Feedback Queues, and Linux CFS",
      "Navigate virtual memory addressing: Page Tables, Page Faults, and TLB hit rates",
      "Prevent and detect deadlocks using Coffman conditions and the Banker's Algorithm",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://cloud.google.com/compute",
    mindlusterUrl: "https://www.mindluster.com/certificate/operating-systems",
    videoEmbedId: "26QPDBe-NB8",
    videoTitle: "Operating Systems Engineering Full Comprehensive Course",
    modules: [
      {
        id: "cse-os-mod-1",
        slug: "virtual-memory-paging",
        title: "Module 1: Virtual Memory & Page Translation",
        description: "Multi-level page tables, TLBs, and page replacement algorithms.",
        lessons: [
          {
            id: "cse-os-les-1",
            slug: "virtual-memory-and-tlb",
            title: "Virtual Memory Paging & The TLB",
            summary: "Translating virtual addresses to physical frame addresses via MMU and TLB.",
            content: "Virtual memory isolates processes by giving each a private 64-bit address space. The CPU Memory Management Unit (MMU) translates virtual page numbers (VPN) into physical frame numbers (PFN) using hierarchical page tables.\n\nTo prevent multiple memory lookups per instruction, the Translation Lookaside Buffer (TLB) acts as a hardware cache for recent translations. A TLB miss forces a page table walk in DRAM; a missing page triggers a software page fault interrupt to disk swap.",
            keyTakeaways: [
              "Multi-level page tables save DRAM by omitting unused portions of the address space",
              "TLB hit rates typically exceed 98% in well-behaved locality-friendly programs",
              "Thrashing occurs when the collective working set of processes exceeds physical RAM, spending 100% of CPU time in page faults",
            ],
            practiceQuestions: [
              {
                id: "os-pq-1",
                prompt: "What happens when an instruction attempts to access a virtual memory address whose valid bit in the page table is set to 0?",
                type: "multiple-choice",
                options: [
                  "The CPU hardware raises a Page Fault trap/exception, transferring control to the OS kernel page fault handler",
                  "The computer immediately turns off power",
                  "The instruction reads zeros automatically",
                  "The program jumps to line 1",
                ],
                correctAnswer: 0,
                explanation: "An invalid bit indicates either an unallocated address (segmentation fault) or a page swapped out to disk. The MMU raises an exception so the OS kernel can fetch the missing page into physical RAM.",
              },
            ],
            proofChallenge: {
              id: "os-proof-1",
              title: "Deadlock Detection via Coffman Conditions",
              scenario: "Two database threads deadlock permanently when attempting to acquire row locks in conflicting orders.",
              questions: [
                {
                  id: "os-proof-q1",
                  prompt: "Which of the following is NOT one of the four necessary Coffman conditions required for a deadlock to exist?",
                  options: [
                    "High CPU Clock Frequency",
                    "Mutual Exclusion",
                    "Hold and Wait",
                    "No Preemption & Circular Wait",
                  ],
                  correctAnswer: 0,
                  explanation: "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking any one of these four conditions guarantees that deadlock cannot occur.",
                },
              ],
              rubricGuidelines: ["Identify Coffman conditions", "Break circular wait condition"],
            },
          },
        ],
      },
    ],
  }),

  // 3. Computer Networks & TCP/IP Protocol Suite
  buildCatalogCourse({
    id: "course-cse-computer-networks",
    slug: "computer-networks-tcp-ip-suite",
    title: "Computer Networks & TCP/IP Protocol Suite",
    tagline: "OSI 7-layer model, TCP 3-way handshake, sliding windows, congestion control, and routing.",
    description: "Understand the architecture of the modern Internet. Master the OSI and TCP/IP models, Ethernet switching (ARP, VLANs), IP addressing/subnetting (CIDR), routing protocols (BGP, OSPF), TCP reliable transport (sliding window, Reno/Cubic congestion control), DNS, and TLS 1.3.",
    category: "Computer Science (CSE)",
    difficulty: "Intermediate",
    estimatedHours: 42,
    iconName: "Globe",
    badgeColor: "indigo",
    learningOutcomes: [
      "Compare OSI 7-layer and TCP/IP 4-layer protocol stacks",
      "Calculate IPv4/IPv6 subnets, subnet masks, and CIDR prefix ranges",
      "Analyze TCP connection setup (SYN, SYN-ACK, ACK), teardown (FIN/RST), and flow control",
      "Explain TCP congestion control: Slow Start, Congestion Avoidance, Fast Retransmit/Recovery",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://cloud.google.com/networking",
    mindlusterUrl: "https://www.mindluster.com/certificate/computer-networking",
    videoEmbedId: "IPvYjXCsTg8",
    videoTitle: "Computer Networking Complete Course - Beginner to Advanced",
    modules: [
      {
        id: "cse-net-mod-1",
        slug: "tcp-transport-routing",
        title: "Module 1: TCP Reliability & Congestion Control",
        description: "3-way handshakes, sequence numbers, and congestion window scaling.",
        lessons: [
          {
            id: "cse-net-les-1",
            slug: "tcp-handshake-and-congestion",
            title: "TCP 3-Way Handshake & Congestion Control",
            summary: "Establishing reliable byte streams and dynamic congestion window (cwnd) adaptation.",
            content: "TCP provides a connection-oriented, reliable, ordered byte stream over unreliable IP networks. Connection establishment uses a 3-way handshake:\n1. Client -> Server: SYN (seq = x)\n2. Server -> Client: SYN-ACK (seq = y, ack = x + 1)\n3. Client -> Server: ACK (seq = x + 1, ack = y + 1)\n\nCongestion control maintains a congestion window (cwnd). During Slow Start, cwnd doubles every RTT until ssthresh, after which it enters additive increase / multiplicative decrease (AIMD).",
            keyTakeaways: [
              "Flow control (rwnd) protects the receiver buffer; Congestion control (cwnd) protects the shared network switches",
              "Fast Retransmit triggers on receiving 3 duplicate ACKs without waiting for the RTO timer to expire",
              "TCP Cubic scales cwnd as a cubic function of time since the last loss event, optimized for high-bandwidth high-latency long-fat networks",
            ],
            practiceQuestions: [
              {
                id: "net-pq-1",
                prompt: "What is the difference between TCP Flow Control and TCP Congestion Control?",
                type: "multiple-choice",
                options: [
                  "Flow control prevents the sender from overwhelming the receiver's buffer (rwnd), while congestion control prevents the sender from overwhelming the intermediate network (cwnd)",
                  "Flow control is for UDP and Congestion control is for TCP",
                  "They are two names for the same algorithm",
                  "Flow control encrypts packets, while congestion control compresses them",
                ],
                correctAnswer: 0,
                explanation: "Flow control is end-to-end negotiated between sender and receiver via the receive window field in the TCP header. Congestion control is managed independently by the sender to avoid saturating intermediate internet routers.",
              },
            ],
            proofChallenge: {
              id: "net-proof-1",
              title: "SYN Flood Denial of Service Attack",
              scenario: "A production web server runs out of connection memory and stops accepting new TCP connections due to millions of half-open SYN packets.",
              questions: [
                {
                  id: "net-proof-q1",
                  prompt: "What kernel mechanism allows a server to accept TCP connections without allocating memory for half-open SYN queues?",
                  options: [
                    "SYN Cookies (encoding connection state cryptographically into the initial sequence number)",
                    "Disabling TCP keepalive",
                    "Switching to HTTP/1.0",
                    "Increasing the MTU to 9000 bytes",
                  ],
                  correctAnswer: 0,
                  explanation: "SYN Cookies compute the server's initial sequence number (ISN) as a cryptographic hash of client IP, port, and timestamp. The server allocates zero memory until the client returns the final ACK, neutralizing SYN flood attacks.",
                },
              ],
              rubricGuidelines: ["Explain SYN flood mechanics", "Implement SYN cookies defense"],
            },
          },
        ],
      },
    ],
  }),

  // 4. Database Management Systems (DBMS Internals & Indexing)
  buildCatalogCourse({
    id: "course-cse-dbms",
    slug: "dbms-internals-indexing-transactions",
    title: "Database Management Systems (DBMS) Internals",
    tagline: "B+ Trees, LSM trees, Write-Ahead Logging (WAL), buffer pools, and ACID concurrency.",
    description: "Deep dive into database storage engines and query execution. Master page-based storage, B+ Tree index traversal/splits, Log-Structured Merge (LSM) trees, Buffer Pool LRU eviction, Write-Ahead Logging (ARIES recovery), and MVCC transaction isolation levels.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 40,
    iconName: "Database",
    badgeColor: "cyan",
    learningOutcomes: [
      "Design disk-backed B+ Trees with slotted page layouts and binary search lookups",
      "Compare read-optimized B+ Trees (Postgres/MySQL) with write-optimized LSM Trees (RocksDB/Cassandra)",
      "Understand Write-Ahead Logging (WAL) and the ARIES crash recovery algorithm (Analysis, Redo, Undo)",
      "Analyze ACID transaction isolation anomalies: Dirty Reads, Non-Repeatable Reads, and Phantom Reads",
    ],
    roadmapSlug: "backend",
    googleSkillsUrl: "https://cloud.google.com/sql",
    mindlusterUrl: "https://www.mindluster.com/certificate/database-management-system",
    videoEmbedId: "u_m96K6Fh40",
    videoTitle: "Database Management Systems Architecture & Internals Course",
    modules: [
      {
        id: "cse-dbms-mod-1",
        slug: "b-plus-trees-wal",
        title: "Module 1: Storage Engines & Crash Recovery",
        description: "B+ Tree page splits, Buffer Pool management, and WAL durability.",
        lessons: [
          {
            id: "cse-dbms-les-1",
            slug: "b-plus-tree-indexing",
            title: "B+ Tree Indexes & Slotted Page Storage",
            summary: "High-fanout balanced search trees and disk I/O optimization.",
            content: "Relational database engines store records in fixed-size disk blocks (pages, typically 8KB). A B+ Tree index differs from a standard B-Tree because internal nodes store ONLY navigation routing keys and child pointers, while all actual data records/pointers reside exclusively in leaf nodes linked horizontally as a doubly linked list.",
            keyTakeaways: [
              "High fanout (often 100 to 500 keys per 8KB page) keeps B+ Tree height at only 3-4 levels for billions of rows",
              "Leaf-level sequential links enable lightning-fast range scans (`WHERE age BETWEEN 20 AND 30`)",
              "Slotted page architecture stores page headers and slot arrays at the top and tuple records growing upward from the bottom",
            ],
            practiceQuestions: [
              {
                id: "dbms-pq-1",
                prompt: "Why are B+ Trees universally preferred over Binary Search Trees (like Red-Black trees) for on-disk database storage engines?",
                type: "multiple-choice",
                options: [
                  "B+ Trees have massive branching factors (fanout) matching disk block sizes, keeping tree height extremely shallow (3-4 I/O ops) compared to tall binary trees",
                  "Binary trees cannot store strings",
                  "B+ Trees use zero RAM",
                  "Binary trees do not support sorting",
                ],
                correctAnswer: 0,
                explanation: "Disk I/O latency is orders of magnitude slower than CPU memory access. High-fanout B+ Trees fit hundreds of keys per 8KB page, minimizing the number of disk page fetches required to find any row.",
              },
            ],
            proofChallenge: {
              id: "dbms-proof-1",
              title: "Write-Ahead Log (WAL) Durability Violation",
              scenario: "A server experiences sudden power loss during a transaction commit; upon reboot, the database table has corrupted partial records.",
              questions: [
                {
                  id: "dbms-proof-q1",
                  prompt: "According to the fundamental WAL protocol rule, what must happen before dirty data pages can be written to disk?",
                  options: [
                    "All corresponding WAL log records describing the change must be flushed and fsynced to non-volatile disk first",
                    "The database must close all connections",
                    "The buffer pool must be emptied completely",
                    "The table must be re-indexed",
                  ],
                  correctAnswer: 0,
                  explanation: "The Write-Ahead Logging rule dictates that log records must reach persistent disk before the modified data pages are flushed. This ensures that in the event of an untimely crash, the ARIES recovery process can REDO committed operations.",
                },
              ],
              rubricGuidelines: ["Explain WAL durability guarantee", "Detail ARIES crash recovery"],
            },
          },
        ],
      },
    ],
  }),

  // 5. System Design (Scalable Distributed Systems & Microservices)
  buildCatalogCourse({
    id: "course-cse-system-design",
    slug: "system-design-distributed-systems",
    title: "System Design: Scalable Distributed Systems",
    tagline: "High availability, load balancing, sharding, caching, and rate limiters.",
    description: "Design planetary-scale internet services handling millions of requests per second. Covers horizontal scaling, consistent hashing, load balancer algorithms, database sharding/partitioning, caching strategies (Write-Through vs Cache-Aside), asynchronous message queues, and CAP theorem trade-offs.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 45,
    iconName: "Layers",
    badgeColor: "purple",
    learningOutcomes: [
      "Architect systems with 99.999% SLA availability and zero single points of failure",
      "Distribute data evenly with Consistent Hashing and virtual nodes",
      "Apply caching patterns (Cache-Aside, Write-Behind) and manage cache stampedes",
      "Design large-scale systems: URL Shortener, Twitter Feed, Uber Dispatch, and Distributed Rate Limiters",
    ],
    roadmapSlug: "system-design",
    googleSkillsUrl: "https://cloud.google.com/architecture",
    mindlusterUrl: "https://www.mindluster.com/certificate/system-design",
    videoEmbedId: "m8Icp_Cid5o",
    videoTitle: "System Design for Software Engineers Complete Course",
    modules: [
      {
        id: "cse-sd-mod-1",
        slug: "consistent-hashing-scaling",
        title: "Module 1: Partitioning, Caching & Scalability",
        description: "Consistent hashing rings, cache invalidation, and sharding keys.",
        lessons: [
          {
            id: "cse-sd-les-1",
            slug: "consistent-hashing-architecture",
            title: "Consistent Hashing & Virtual Nodes",
            summary: "Minimizing key remapping when cache/database servers are added or removed dynamically.",
            content: "Traditional modulo hashing (hash(key) % N) causes catastrophic cache invalidation whenever a server is added or removed, because nearly all keys remap to new nodes.\n\nConsistent Hashing maps both servers and data keys onto a circular 360-degree hash ring (0 to 2^32 - 1). A key is assigned to the first server encountered moving clockwise. Adding or removing a server only remaps keys located in the immediate adjacent segment (k/N keys on average).",
            keyTakeaways: [
              "Virtual nodes (multiplying each physical server into hundreds of hash ring positions) ensure uniform data distribution",
              "Consistent hashing prevents hot-spotting and cascading cache server thundering herds",
              "Widely utilized in DynamoDB, Apache Cassandra, Discord, and Akamai CDNs",
            ],
            practiceQuestions: [
              {
                id: "sd-pq-1",
                prompt: "What is the primary problem solved by introducing `Virtual Nodes` in a Consistent Hashing ring?",
                type: "multiple-choice",
                options: [
                  "Preventing non-uniform data distribution and hotspots caused by physical servers being spaced unevenly around the hash ring",
                  "Encrypting the hash keys with SSL",
                  "Allowing servers to operate without IP addresses",
                  "Compressing the memory footprint of the ring",
                ],
                correctAnswer: 0,
                explanation: "With few physical nodes, the ring segments can vary wildly in size, causing one node to hold 60% of all data while another holds 5%. Replicating each physical server across 100-200 virtual nodes evens out distribution statistically.",
              },
            ],
            proofChallenge: {
              id: "sd-proof-1",
              title: "Cache Stampede on Viral News Article",
              scenario: "When a popular news article's Redis cache key expires at midnight, 50,000 concurrent requests hammer the PostgreSQL database simultaneously, causing a total outage.",
              questions: [
                {
                  id: "sd-proof-q1",
                  prompt: "Which architectural pattern prevents multiple concurrent threads from re-querying the database when a cache key expires?",
                  options: [
                    "Distributed Mutex lock (single-flight) around cache miss or probabilistic early expiration (XFetch algorithm)",
                    "Deleting the database table",
                    "Setting cache TTL to 1 second",
                    "Turning off Redis caching",
                  ],
                  correctAnswer: 0,
                  explanation: "A distributed lock ensures only one worker thread rebuilds the cache entry while others wait or serve slightly stale data. Probabilistic early re-computation refreshes the cache in the background before hard expiration occurs.",
                },
              ],
              rubricGuidelines: ["Diagnose cache stampede / thundering herd", "Implement single-flight pattern"],
            },
          },
        ],
      },
    ],
  }),

  // 6. Compiler Design & Syntax Analysis
  buildCatalogCourse({
    id: "course-cse-compiler-design",
    slug: "compiler-design-syntax-analysis",
    title: "Compiler Design & Syntax Analysis",
    tagline: "Lexers, recursive descent parsers, ASTs, LLVM IR, and code optimization.",
    description: "Build a programming language compiler from source code to machine assembly. Covers regular expressions, lexical analyzers (Flex), context-free grammars (CFGs), LL(1) and LR(1)/LALR parsers (Bison), Abstract Syntax Tree (AST) construction, type checking, and LLVM intermediate representation (IR) code generation.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 45,
    iconName: "Code",
    badgeColor: "rose",
    learningOutcomes: [
      "Build a lexical scanner converting character streams into categorized tokens",
      "Implement predictive recursive descent and shift-reduce LR parsers",
      "Construct Abstract Syntax Trees (AST) and enforce semantic type systems",
      "Generate LLVM IR and apply SSA (Static Single Assignment) optimizations",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/compiler-design",
    videoEmbedId: "Qkwj65l_96I",
    videoTitle: "Compiler Design Complete Computer Science Course",
    modules: [
      {
        id: "cse-comp-mod-1",
        slug: "parsing-ast-llvm",
        title: "Module 1: Lexing, Parsing & Abstract Syntax Trees",
        description: "Grammars, FIRST/FOLLOW sets, and AST generation.",
        lessons: [
          {
            id: "cse-comp-les-1",
            slug: "recursive-descent-ast",
            title: "Recursive Descent Parsing & AST Construction",
            summary: "Building top-down parsers for context-free grammars and constructing typed AST nodes.",
            content: "A compiler front-end parses a sequence of tokens into an Abstract Syntax Tree (AST). In a top-down Recursive Descent Parser, each non-terminal grammar rule maps to a recursive programming function.\n\nLeft Recursion Elimination:\nGrammar rules like `E -> E + T | T` cause infinite recursive calls in top-down parsers. They must be rewritten into right-recursive form: `E -> T E'` and `E' -> + T E' | ε`.",
            keyTakeaways: [
              "Lexing transforms raw characters into token tuples: (TYPE, VALUE, LINE_NUM)",
              "Context-free grammars (CFG) describe language syntax using terminals, non-terminals, and production rules",
              "Modern compilers translate ASTs into Static Single Assignment (SSA) form where every variable is assigned exactly once",
            ],
            practiceQuestions: [
              {
                id: "comp-pq-1",
                prompt: "Why cannot a top-down Recursive Descent parser directly parse a grammar containing Immediate Left Recursion (e.g. `Expr -> Expr '+' Term`)?",
                type: "multiple-choice",
                options: [
                  "The parser function `parseExpr()` will immediately call `parseExpr()` again without consuming any tokens, causing an infinite recursive loop and stack overflow",
                  "Grammars with left recursion are mathematically uncomputable",
                  "Left recursion requires a quantum computer",
                  "Top-down parsers only support numbers, not operators",
                ],
                correctAnswer: 0,
                explanation: "When evaluating `Expr -> Expr + Term`, the function for Expr tries to match the first symbol Expr by calling itself immediately before checking any tokens, recurring indefinitely until the call stack blows up.",
              },
            ],
            proofChallenge: {
              id: "comp-proof-1",
              title: "Dangling Else Ambiguity in Language Grammar",
              scenario: "A newly designed programming language parser misinterprets nested `if (a) if (b) s1 else s2` statements.",
              questions: [
                {
                  id: "comp-proof-q1",
                  prompt: "How do standard programming languages resolve the classic 'dangling else' grammar ambiguity?",
                  options: [
                    "By establishing a disambiguation rule that pairs each `else` with the nearest preceding unmatched `if`",
                    "By banning the `else` keyword completely",
                    "By requiring all variables to be capitalized",
                    "By flipping a coin during parsing",
                  ],
                  correctAnswer: 0,
                  explanation: "The grammar is inherently ambiguous because the else could belong to either the inner or outer if. Compilers resolve this by convention: bind the else to the most recent open if clause.",
                },
              ],
              rubricGuidelines: ["Identify ambiguous grammars", "Apply disambiguation rule"],
            },
          },
        ],
      },
    ],
  }),

  // 7. Object-Oriented Analysis & Design (Design Patterns & SOLID)
  buildCatalogCourse({
    id: "course-cse-ooad",
    slug: "ooad-solid-design-patterns",
    title: "Object-Oriented Design & GoF Patterns",
    tagline: "SOLID design principles, Gang of Four patterns, and clean software architecture.",
    description: "Write maintainable, loosely coupled, enterprise-grade software. Master the SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) and GoF Design Patterns (Factory, Singleton, Observer, Strategy, Decorator, Adapter).",
    category: "Computer Science (CSE)",
    difficulty: "Beginner",
    estimatedHours: 32,
    iconName: "Layers",
    badgeColor: "amber",
    learningOutcomes: [
      "Apply the 5 SOLID object-oriented design principles to eliminate rigid codebases",
      "Implement Creational patterns: Factory Method, Abstract Factory, and Builder",
      "Implement Structural patterns: Decorator, Adapter, and Composite",
      "Implement Behavioral patterns: Strategy, Observer, Command, and State",
    ],
    roadmapSlug: "software-design",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/object-oriented-design",
    videoEmbedId: "v9ejT8FO-7I",
    videoTitle: "Object Oriented Programming & Design Patterns Masterclass",
    modules: [
      {
        id: "cse-ooad-mod-1",
        slug: "solid-and-gof",
        title: "Module 1: SOLID Principles & Strategy Pattern",
        description: "Decoupling interfaces, dependency inversion, and behavioral strategies.",
        lessons: [
          {
            id: "cse-ooad-les-1",
            slug: "solid-principles-deep-dive",
            title: "The SOLID Principles & Open/Closed Principle",
            summary: "Designing classes open for extension but closed for modification.",
            content: "The Open/Closed Principle (OCP) states that software entities (classes, modules, functions) should be open for extension, but closed for modification. Instead of modifying existing tested classes with endless `if-else` or `switch` statements to support new payment methods, define an interface (`PaymentStrategy`) and inject new concrete strategy classes (`CreditCard`, `PayPal`, `Crypto`) without touching existing code.",
            keyTakeaways: [
              "Single Responsibility: A class should have one, and only one, reason to change",
              "Liskov Substitution: Subtypes must be substitutable for their base types without altering program correctness",
              "Dependency Inversion: High-level modules should depend on abstractions (interfaces), not concrete implementations",
            ],
            practiceQuestions: [
              {
                id: "ooad-pq-1",
                prompt: "Which SOLID principle is violated when a `Square` subclass inherits from `Rectangle` and overrides `setWidth()` to simultaneously set height, breaking client assumptions that width and height can vary independently?",
                type: "multiple-choice",
                options: [
                  "Liskov Substitution Principle (LSP)",
                  "Single Responsibility Principle (SRP)",
                  "Interface Segregation Principle (ISP)",
                  "Law of Demeter",
                ],
                correctAnswer: 0,
                explanation: "LSP mandates that any code expecting a Rectangle should function correctly when handed a Square. If mutating width unexpectedly alters height, the subclass violates the base class contract.",
              },
            ],
            proofChallenge: {
              id: "ooad-proof-1",
              title: "Tightly Coupled Notification System Refactoring",
              scenario: "An e-commerce order service directly calls `new EmailClient().send()` inside `processOrder()`, making unit testing and adding SMS notifications impossible.",
              questions: [
                {
                  id: "ooad-proof-q1",
                  prompt: "How should the order service be refactored using the Dependency Inversion Principle (DIP)?",
                  options: [
                    "Define a `NotificationService` interface and inject it into the OrderService constructor (Dependency Injection)",
                    "Create a global static EmailClient singleton",
                    "Put all code into one giant main() function",
                    "Use multiple inheritance",
                  ],
                  correctAnswer: 0,
                  explanation: "By depending on a generic NotificationService interface injected via constructor, OrderService is decoupled from third-party email SDKs, allowing trivial injection of MockNotificationService during unit tests.",
                },
              ],
              rubricGuidelines: ["Apply Dependency Inversion Principle", "Inject interface abstractions"],
            },
          },
        ],
      },
    ],
  }),

  // 8. Distributed Systems & Consensus Algorithms (Raft & Paxos)
  buildCatalogCourse({
    id: "course-cse-distributed-systems",
    slug: "distributed-systems-raft-paxos-consensus",
    title: "Distributed Systems & Consensus (Raft & Paxos)",
    tagline: "Leader election, log replication, state machine replication, and vector clocks.",
    description: "Build fault-tolerant distributed systems resilient to network partitions and node crashes. Covers Lamport logical timestamps, vector clocks, the CAP theorem, Byzantine Fault Tolerance, and a comprehensive implementation of the Raft consensus protocol (Leader Election, Log Matching, Safety).",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 46,
    iconName: "Network",
    badgeColor: "indigo",
    learningOutcomes: [
      "Distinguish crash-stop (Fail-Stop) vs Byzantine arbitrary failure models",
      "Order events in distributed systems without synchronized clocks using Vector Clocks",
      "Implement the complete Raft consensus state machine: Follower, Candidate, and Leader",
      "Prove Raft leader completeness and safety invariant guarantees across network partitions",
    ],
    roadmapSlug: "system-design",
    googleSkillsUrl: "https://cloud.google.com/architecture",
    mindlusterUrl: "https://www.mindluster.com/certificate/distributed-systems",
    videoEmbedId: "cQP8WApzIQQ",
    videoTitle: "Distributed Systems Complete Academic & Industry Course",
    modules: [
      {
        id: "cse-dist-mod-1",
        slug: "raft-consensus-protocol",
        title: "Module 1: Raft Consensus & Leader Election",
        description: "Terms, randomized election timeouts, and quorum log replication.",
        lessons: [
          {
            id: "cse-dist-les-1",
            slug: "raft-leader-election",
            title: "Raft Consensus: Leader Election & Log Replication",
            summary: "Reaching agreement in an untrusted network with 2F + 1 nodes surviving F failures.",
            content: "Raft decomposes distributed consensus into three independent sub-problems: Leader Election, Log Replication, and Safety.\n\nNodes begin as Followers. If a follower hears no heartbeat within a randomized election timeout (150-300ms), it transitions to Candidate, increments its Term counter, votes for itself, and broadcasts `RequestVote` RPCs. If it receives votes from a majority (quorum > N/2) of nodes, it becomes the Leader.",
            keyTakeaways: [
              "Randomized election timeouts prevent split-vote deadlocks where candidates continuously tie",
              "A candidate's log must be at least as up-to-date as the voter's log to receive a vote (Raft Election Restriction)",
              "Entries are committed once replicated across a majority quorum of active nodes",
            ],
            practiceQuestions: [
              {
                id: "dist-pq-1",
                prompt: "Why must a distributed consensus cluster using Raft contain an odd number of nodes (e.g. 3, 5, or 7) for optimal fault tolerance?",
                type: "multiple-choice",
                options: [
                  "A cluster of 2F+1 nodes can tolerate F node failures; an even cluster of 2F+2 nodes still tolerates only F failures while requiring an extra node to achieve majority quorum",
                  "Consensus algorithms crash when given even numbers",
                  "Network switches only route packets to odd IP addresses",
                  "To save electricity in the datacenter",
                ],
                correctAnswer: 0,
                explanation: "A 3-node cluster needs 2 nodes for quorum, tolerating 1 failure. A 4-node cluster needs 3 nodes for quorum, which STILL only tolerates 1 failure. Adding the 4th node adds cost and communication overhead without increasing fault tolerance.",
              },
            ],
            proofChallenge: {
              id: "dist-proof-1",
              title: "Split-Brain Network Partition in 5-Node Cluster",
              scenario: "A network partition splits a 5-node Raft cluster into two isolated sub-networks: {Node 1, Node 2} and {Node 3, Node 4, Node 5}.",
              questions: [
                {
                  id: "dist-proof-q1",
                  prompt: "Can the minority partition {Node 1, Node 2} commit client write requests while separated?",
                  options: [
                    "No; any write requires a majority quorum of at least 3 nodes (ceil(5/2)), so writes on the minority partition will block or fail",
                    "Yes; both sides commit independently, causing permanent data divergence",
                    "Yes; Node 1 becomes a dictator leader",
                    "The minority side will delete its hard drives",
                  ],
                  correctAnswer: 0,
                  explanation: "Because {Node 1, Node 2} has only 2 nodes, it cannot achieve the required majority of 3. Only the majority partition {Node 3, Node 4, Node 5} can elect a leader and commit new transactions, preventing split-brain corruption.",
                },
              ],
              rubricGuidelines: ["Define majority quorum", "Analyze network partition scenarios"],
            },
          },
        ],
      },
    ],
  }),
];
