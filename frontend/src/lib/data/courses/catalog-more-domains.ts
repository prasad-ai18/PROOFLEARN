import { buildCatalogCourse } from "../course-builder";
import type { Course } from "../course-types";

export const MORE_DOMAINS_COURSES: Course[] = [
  // 1. LangChain & LLM Multi-Agent Systems (AIML)
  buildCatalogCourse({
    id: "course-aiml-langchain-agents",
    slug: "langchain-llm-multi-agent-systems",
    title: "LangChain & LLM Multi-Agent Systems",
    tagline: "Build autonomous multi-agent systems, tool calling, and LangGraph stateful loops.",
    description: "Architect production AI agent systems. Master LangChain expression language (LCEL), LangGraph stateful cyclic graphs, autonomous tool use, ReAct prompting pattern, memory persistence, and multi-agent supervisor hierarchies.",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Bot",
    badgeColor: "purple",
    learningOutcomes: [
      "Compose robust pipelines using LangChain Expression Language (LCEL) chains",
      "Construct cyclic graph workflows with LangGraph StateGraph, nodes, and conditional edges",
      "Implement ReAct (Reasoning + Acting) autonomous agent loops with dynamic tool calling",
      "Persist conversational state and short/long-term memory with Postgres and vector stores",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://cloud.google.com/vertex-ai",
    mindlusterUrl: "https://www.mindluster.com/certificate/langchain",
    videoEmbedId: "2xxziLW_q38",
    videoTitle: "LangChain & LangGraph Multi-Agent Systems Masterclass",
    modules: [
      {
        id: "aiml-lg-mod-1",
        slug: "langgraph-react-loop",
        title: "Module 1: LangGraph & The ReAct Pattern",
        description: "StateGraph, cyclical agent loops, and tool calling.",
        lessons: [
          {
            id: "aiml-lg-les-1",
            slug: "langgraph-state-machines",
            title: "LangGraph StateGraph & Cyclical Agentic Workflows",
            summary: "Building stateful agents that loop until tools finish executing.",
            content: "Traditional DAGs cannot represent autonomous agents because agents need loops: plan -> act -> observe -> decide if finished. LangGraph represents agentic systems as state machines (StateGraph) where nodes represent functions and conditional edges route execution dynamically based on agent decisions.",
            keyTakeaways: [
              "LangGraph enables cycles and loops that standard acyclic DAG chains cannot represent",
              "State is passed as a typed dictionary or Pydantic model with reducer functions like `operator.add`",
              "Human-in-the-loop breakpoints allow manual review before executing sensitive tool actions",
            ],
            practiceQuestions: [
              {
                id: "lg-pq-1",
                prompt: "Why is LangGraph preferred over simple sequential chains for building complex AI agents?",
                type: "multiple-choice",
                options: [
                  "Because LangGraph supports cyclical loops (loops back to the agent after tool execution) and state persistence across multiple steps",
                  "Because LangGraph does not require an LLM",
                  "Because LangGraph runs in browser HTML without a server",
                  "Because sequential chains are banned in Python",
                ],
                correctAnswer: 0,
                explanation: "Real agentic behavior requires iterative reflection: calling a tool, evaluating the output, and deciding whether to call another tool or return the final answer. LangGraph explicitly models these cycles with StateGraph.",
              },
            ],
            proofChallenge: {
              id: "lg-proof-1",
              title: "Infinite Tool Calling Loop Prevention",
              scenario: "An autonomous coding agent gets stuck in an infinite loop calling a broken API tool repeatedly.",
              questions: [
                {
                  id: "lg-proof-q1",
                  prompt: "What safety guardrail prevents autonomous agents from looping indefinitely?",
                  options: [
                    "Configuring a `recursion_limit` threshold in the invocation config and adding a fallback circuit breaker node",
                    "Turning off the internet connection",
                    "Lowering model temperature to 0",
                    "Increasing the system prompt size",
                  ],
                  correctAnswer: 0,
                  explanation: "LangGraph enforces a recursion_limit (default 25) that raises a GraphRecursionError if an agent executes too many state transitions without reaching the END node.",
                },
              ],
              rubricGuidelines: ["Configure recursion limits", "Implement fallback handlers"],
            },
          },
        ],
      },
    ],
  }),

  // 2. Vector Databases & Semantic Search (AIML / Data)
  buildCatalogCourse({
    id: "course-aiml-vector-databases",
    slug: "vector-databases-semantic-search",
    title: "Vector Databases & Semantic Search",
    tagline: "HNSW graphs, Pinecone, Milvus, Qdrant, cosine similarity, and RAG retrieval.",
    description: "Deep dive into vector search indexes powering modern AI. Master vector embeddings, high-dimensional distance metrics (Cosine, Euclidean, Dot Product), indexing algorithms (HNSW, IVF-PQ), hybrid keyword-vector search (BM25 + Dense), and production vector stores (Pinecone, Qdrant, pgvector).",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimatedHours: 32,
    iconName: "Database",
    badgeColor: "indigo",
    learningOutcomes: [
      "Compare vector similarity distance metrics: Cosine Distance, L2 Euclidean, and Inner Product",
      "Understand Hierarchical Navigable Small World (HNSW) graph indexing and trade-offs",
      "Deploy hybrid search combining BM25 keyword matching with dense neural embeddings using Reciprocal Rank Fusion (RRF)",
      "Index millions of vectors using pgvector in PostgreSQL and standalone vector databases",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://cloud.google.com/vertex-ai",
    mindlusterUrl: "https://www.mindluster.com/certificate/vector-databases",
    videoEmbedId: "k_B9_6Fx8Z6",
    videoTitle: "Vector Databases & Semantic Search Complete Course",
    modules: [
      {
        id: "aiml-vdb-mod-1",
        slug: "hnsw-hybrid-search",
        title: "Module 1: HNSW Graph Indexing & Hybrid Retrieval",
        description: "Navigable graphs, quantization, and reciprocal rank fusion.",
        lessons: [
          {
            id: "aiml-vdb-les-1",
            slug: "hnsw-indexing-algorithm",
            title: "Hierarchical Navigable Small World (HNSW) Indexing",
            summary: "Multi-layer skip-list graph algorithm for approximate nearest neighbor (ANN) search.",
            content: "Exact k-Nearest Neighbor search requires scanning every vector in the dataset (O(N)), which fails at scale. HNSW constructs a multi-layer graph where upper layers have long-distance edges (fast skip-list traversal) and bottom layers contain dense local connections.\n\nSearch navigates greedily from the top layer down to the bottom layer, achieving O(log N) approximate nearest neighbor search times with > 95% recall.",
            keyTakeaways: [
              "HNSW provides the best speed-vs-recall trade-off among modern vector indexing algorithms",
              "Product Quantization (PQ) compresses vectors into compact byte codes to fit billions of vectors into RAM",
              "Hybrid search combines sparse BM25 (exact keyword match) with dense embeddings (semantic meaning) via Reciprocal Rank Fusion",
            ],
            practiceQuestions: [
              {
                id: "vdb-pq-1",
                prompt: "Why is Hybrid Search (combining BM25 keyword search with Dense Vector Embeddings) superior to pure vector search alone?",
                type: "multiple-choice",
                options: [
                  "Dense vectors capture conceptual semantics but frequently miss exact alphanumeric keywords like product SKUs, part numbers, and acronyms that BM25 catches easily",
                  "Hybrid search requires 90% less storage space",
                  "Pure vector search cannot run on CPUs",
                  "BM25 is a deep neural network",
                ],
                correctAnswer: 0,
                explanation: "Vector embeddings compress text into general conceptual spaces. They often fail when querying precise unique tokens like 'CVE-2024-3094' or serial numbers. Hybrid search blends keyword precision with semantic breadth.",
              },
            ],
            proofChallenge: {
              id: "vdb-proof-1",
              title: "pgvector Index Recall Degradation",
              scenario: "A production PostgreSQL database using `pgvector` returns irrelevant search results after adding an IVFFlat index.",
              questions: [
                {
                  id: "vdb-proof-q1",
                  prompt: "How can the database engineer increase search recall when querying an IVFFlat index in pgvector?",
                  options: [
                    "Increase the `probes` setting (e.g. `SET ivfflat.probes = 10;`) to search across more cluster lists",
                    "Drop the table and recreate it",
                    "Remove all indexes and do sequential scans only",
                    "Switch to single-precision floats",
                  ],
                  correctAnswer: 0,
                  explanation: "IVFFlat partitions vectors into lists (clusters). Searching only 1 list (default probes=1) misses vectors near cluster boundaries. Increasing the `probes` parameter searches multiple nearby clusters, restoring high recall.",
                },
              ],
              rubricGuidelines: ["Tune vector index parameters", "Balance latency vs recall"],
            },
          },
        ],
      },
    ],
  }),

  // 3. Modern C++20 Systems Programming (CSE)
  buildCatalogCourse({
    id: "course-cse-modern-cpp20",
    slug: "modern-cpp20-systems-programming",
    title: "Modern C++20 Systems Programming",
    tagline: "Concepts, ranges, coroutines, smart pointers, RAII, and template metaprogramming.",
    description: "Write high-performance, memory-safe systems software in modern ISO C++20. Covers RAII resource management, smart pointers (unique_ptr, shared_ptr), move semantics & rvalue references (&&), C++20 Concepts, Ranges library, and thread concurrency (std::jthread).",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 42,
    iconName: "Code",
    badgeColor: "blue",
    learningOutcomes: [
      "Master Resource Acquisition Is Initialization (RAII) and smart pointer memory lifecycles",
      "Eliminate expensive deep copies using move semantics and `std::move` rvalue references",
      "Enforce compile-time template constraints using C++20 Concepts and requires clauses",
      "Transform data pipelines using C++20 functional Ranges and Views (`std::views::filter`)",
    ],
    roadmapSlug: "cpp",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/cpp-course",
    videoEmbedId: "18c3MTX0PK0",
    videoTitle: "Modern C++20 Programming Complete Masterclass",
    modules: [
      {
        id: "cse-cpp-mod-1",
        slug: "raii-and-move-semantics",
        title: "Module 1: Move Semantics & C++20 Concepts",
        description: "Rvalue references, perfect forwarding, and compile-time constraints.",
        lessons: [
          {
            id: "cse-cpp-les-1",
            slug: "move-semantics-rvalues",
            title: "Move Semantics & Rvalue References (&&)",
            summary: "Stealing resources from temporary objects instead of allocating deep copies.",
            content: "Prior to C++11, returning a large `std::vector<int>` from a function required allocating new heap memory and copying every element (O(N)). Move semantics introduces rvalue references (`T&&`). A move constructor 'steals' the internal raw heap pointer from a dying temporary object and sets the source pointer to nullptr, completing in O(1) constant time without heap reallocation.",
            keyTakeaways: [
              "`std::move` does not move anything; it is an unconditional static cast to an rvalue reference",
              "Rule of 5: If you define a custom destructor, you must explicitly declare copy/move constructors and copy/move assignment operators",
              "C++20 Concepts replace clumsy SFINAE template hacks with clean compile-time contract constraints",
            ],
            practiceQuestions: [
              {
                id: "cpp-pq-1",
                prompt: "What does `std::move(my_vector)` actually do at runtime?",
                type: "multiple-choice",
                options: [
                  "It performs a static_cast to an rvalue reference (`std::vector<int>&&`), marking the object as eligible for resource pilfering by a move constructor",
                  "It physically moves memory from RAM to disk",
                  "It creates a second thread to copy the data",
                  "It deletes the vector immediately",
                ],
                correctAnswer: 0,
                explanation: "`std::move` does zero data copying. It merely casts an lvalue expression into an rvalue reference, signaling to the compiler that the caller no longer requires the object's contents.",
              },
            ],
            proofChallenge: {
              id: "cpp-proof-1",
              title: "Dangling Pointer via Use-After-Move",
              scenario: "A developer accesses a std::string after calling std::move on it, encountering undefined behavior and empty output.",
              questions: [
                {
                  id: "cpp-proof-q1",
                  prompt: "In what state is a standard library object left after being moved from?",
                  options: [
                    "A valid but unspecified state (safe to assign or destroy, but not safe to read from expecting previous data)",
                    "A null pointer exception is thrown",
                    "The object is completely erased from memory and cannot be reassigned",
                    "The memory is locked by the OS",
                  ],
                  correctAnswer: 0,
                  explanation: "The C++ standard guarantees that moved-from standard library objects are left in a 'valid but unspecified' state. Their destructors can run cleanly and new values can be assigned, but reading their contents is an antipattern.",
                },
              ],
              rubricGuidelines: ["Explain moved-from object state", "Prevent use-after-move bugs"],
            },
          },
        ],
      },
    ],
  }),

  // 4. Rust Systems Programming & Memory Safety (CSE)
  buildCatalogCourse({
    id: "course-cse-rust-systems",
    slug: "rust-systems-programming-memory-safety",
    title: "Rust Systems Programming & Memory Safety",
    tagline: "Ownership, borrow checker, lifetimes, zero-cost abstractions, and fearless concurrency.",
    description: "Write ultra-fast systems code with guaranteed memory safety and zero garbage collection pauses. Master the Rust Ownership model, borrowing (& and &mut), lifetime annotations ('a), traits, pattern matching, error handling (Result/Option), and fearless multithreading.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 45,
    iconName: "ShieldCheck",
    badgeColor: "rose",
    learningOutcomes: [
      "Master Rust Ownership: Every value has a single owner; when the owner goes out of scope, memory is freed",
      "Pass the Borrow Checker: Either ONE mutable reference (&mut) OR any number of immutable references (&)",
      "Resolve complex compiler lifetime issues with explicit lifetime annotations ('a)",
      "Implement fearless concurrency using Send and Sync marker traits with Arc and Mutex",
    ],
    roadmapSlug: "rust",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/rust-programming",
    videoEmbedId: "MsocPEZBd-M",
    videoTitle: "Rust Programming Course for Beginners to Advanced",
    modules: [
      {
        id: "cse-rust-mod-1",
        slug: "ownership-and-borrowing",
        title: "Module 1: Ownership & The Borrow Checker",
        description: "Move semantics, aliasing XOR mutability, and lifetime rules.",
        lessons: [
          {
            id: "cse-rust-les-1",
            slug: "ownership-borrow-checker",
            title: "Ownership & Aliasing XOR Mutability",
            summary: "Eliminating data races and use-after-free bugs at compile time without a garbage collector.",
            content: "Rust eliminates memory bugs at compile time through the Borrow Checker.\n\nTwo Fundamental Borrowing Rules:\n1. At any given time, you can have either one mutable reference (`&mut T`) OR any number of immutable references (`&T`) to a piece of data.\n2. References must always be valid (lifetimes cannot outlive the referenced data).\n\nThis 'Aliasing XOR Mutability' invariant mathematically prevents data races, iterator invalidation, and dangling pointers before your program ever runs.",
            keyTakeaways: [
              "Data races require three conditions: two pointers accessing the same memory concurrently, at least one write, and no synchronization; Rust bans this at compile time",
              "Rust values are moved by default on assignment unless they implement the `Copy` trait",
              "`Arc<Mutex<T>>` provides atomic reference-counted shared mutable ownership across threads",
            ],
            practiceQuestions: [
              {
                id: "rust-pq-1",
                prompt: "Why does the Rust compiler reject code that holds an immutable reference `&v[0]` to a vector while simultaneously calling `v.push(42)`?",
                type: "multiple-choice",
                options: [
                  "Because `v.push()` requires a mutable reference (`&mut v`) and might reallocate the vector's heap buffer, which would leave `&v[0]` pointing to deallocated memory (dangling pointer)",
                  "Because vectors cannot hold numbers",
                  "Because Rust prohibits vectors from expanding",
                  "Because immutable references make the program read-only permanently",
                ],
                correctAnswer: 0,
                explanation: "This classic 'iterator invalidation' bug plagues C++. If adding an element triggers a heap reallocation, the old memory buffer is freed, instantly turning any existing reference into a dangerous use-after-free vulnerability.",
              },
            ],
            proofChallenge: {
              id: "rust-proof-1",
              title: "Borrow Checker Rejection on Self-Referential Struct",
              scenario: "A developer attempts to write a struct containing both a String buffer and a slice `&str` pointing inside that same buffer.",
              questions: [
                {
                  id: "rust-proof-q1",
                  prompt: "Why does the standard Rust borrow checker reject self-referential structs, and what is the idiomatic solution?",
                  options: [
                    "Moving the struct would change its memory address, invalidating internal pointers; the solution is to store integer indices/offsets or use crates like `ouroboros` or `Pin`",
                    "Rust does not allow structs to have more than one field",
                    "Compile with the `--ignore-borrow-checker` flag",
                    "Use an unsafe pointer without any checks",
                  ],
                  correctAnswer: 0,
                  explanation: "In Rust, values are freely movable in memory. If a struct holds a reference pointing into itself, moving the struct to another stack frame invalidates the reference.",
                },
              ],
              rubricGuidelines: ["Analyze self-referential structs", "Apply Pin and offset patterns"],
            },
          },
        ],
      },
    ],
  }),

  // 5. Go (Golang) Concurrent Systems & Microservices (CSE)
  buildCatalogCourse({
    id: "course-cse-golang",
    slug: "golang-concurrent-systems-microservices",
    title: "Go (Golang) Concurrent Systems & Microservices",
    tagline: "Goroutines, channels, select statements, context package, and gRPC services.",
    description: "Build high-throughput, low-latency microservices with Google's Go language. Master CSP concurrency (Communicating Sequential Processes), lightweight Goroutines, buffered/unbuffered channels, `sync.Mutex` and `sync.WaitGroup`, the `context` package for request cancellation, and gRPC streaming.",
    category: "Computer Science (CSE)",
    difficulty: "Beginner",
    estimatedHours: 35,
    iconName: "Server",
    badgeColor: "cyan",
    learningOutcomes: [
      "Understand the Go M:N runtime scheduler (Goroutines mapped to OS threads)",
      "Communicate between concurrent workers safely using channels and select statements",
      "Propagate deadlines, timeouts, and cancellation signals using `context.Context`",
      "Build high-performance microservices using gRPC and Protocol Buffers (Protobuf)",
    ],
    roadmapSlug: "golang",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/golang",
    videoEmbedId: "yyUHQIecVPg",
    videoTitle: "Go Programming Language Complete Masterclass",
    modules: [
      {
        id: "cse-go-mod-1",
        slug: "goroutines-and-channels",
        title: "Module 1: Concurrency & Channel Patterns",
        description: "Goroutines, select multiplexing, and context cancellation.",
        lessons: [
          {
            id: "cse-go-les-1",
            slug: "goroutines-channels-select",
            title: "Goroutines, Channels & Context Cancellation",
            summary: "Lightweight 2KB green threads and Communicating Sequential Processes (CSP).",
            content: "Unlike OS threads that cost ~1-2 MB of stack memory, Go Goroutines start with only 2 KB of dynamically resizable stack space, allowing a single server to run hundreds of thousands of concurrent goroutines effortlessly.\n\nGo philosophy: 'Do not communicate by sharing memory; instead, share memory by communicating.' Channels allow goroutines to pass typed messages synchronously or asynchronously.",
            keyTakeaways: [
              "Unbuffered channels synchronize sender and receiver simultaneously",
              "Always pass `context.Context` as the first argument in functions to propagate request timeouts and client cancellations",
              "Detect data races in tests using the built-in Go race detector: `go test -race`",
            ],
            practiceQuestions: [
              {
                id: "go-pq-1",
                prompt: "What happens when a goroutine sends data into an unbuffered channel (`ch <- val`) when no other goroutine is actively receiving from it?",
                type: "multiple-choice",
                options: [
                  "The sending goroutine blocks execution until another goroutine executes a receive operation (`<-ch`) on that channel",
                  "The data is immediately discarded",
                  "The program panics with a runtime exception",
                  "The channel automatically buffers up to 100 items",
                ],
                correctAnswer: 0,
                explanation: "Unbuffered channels provide synchronous handoffs. The sender blocks until a receiver is ready, and a receiver blocks until a sender transmits, guaranteeing synchronization without mutexes.",
              },
            ],
            proofChallenge: {
              id: "go-proof-1",
              title: "Goroutine Leak on Unread Channel",
              scenario: "A microservice's memory consumption climbs steadily because worker goroutines block forever trying to send results into an unbuffered channel whose receiver timed out.",
              questions: [
                {
                  id: "go-proof-q1",
                  prompt: "How can you prevent goroutines from leaking when downstream clients cancel or time out?",
                  options: [
                    "Listen on `ctx.Done()` inside a `select` block alongside channel operations to exit cleanly on cancellation",
                    "Restart the container every 10 minutes",
                    "Increase channel buffer size to 1,000,000",
                    "Kill the goroutine using an operating system kill signal",
                  ],
                  correctAnswer: 0,
                  explanation: "Goroutines cannot be forcibly killed externally in Go. To prevent leaks, worker loops must select on `<-ctx.Done()` so that when context cancels, the goroutine unwinds its stack and terminates gracefully.",
                },
              ],
              rubricGuidelines: ["Diagnose goroutine leaks", "Implement context cancellation select"],
            },
          },
        ],
      },
    ],
  }),
];
