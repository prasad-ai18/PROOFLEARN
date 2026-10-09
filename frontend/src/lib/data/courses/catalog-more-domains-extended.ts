import { buildCatalogCourse } from "../course-builder";
import type { Course } from "../course-types";

export const MORE_DOMAINS_EXTENDED_COURSES: Course[] = [
  // 1. Kubernetes & Cloud Native Architecture (Cloud)
  buildCatalogCourse({
    id: "course-cloud-kubernetes",
    slug: "kubernetes-cloud-native-architecture",
    title: "Kubernetes & Cloud-Native Architecture",
    tagline: "Pod scheduling, ReplicaSets, Deployments, Services, Ingress, and Helm charts.",
    description: "Orchestrate production container workloads with Kubernetes (K8s). Covers control plane components (API server, etcd, scheduler), Pod lifecycles, ConfigMaps/Secrets, horizontal pod autoscaling (HPA), and Helm package management.",
    category: "Cloud Computing",
    difficulty: "Intermediate",
    estimatedHours: 40,
    iconName: "Container",
    badgeColor: "blue",
    learningOutcomes: [
      "Navigate Kubernetes control plane architecture and worker node kubelet/kube-proxy mechanics",
      "Deploy self-healing applications using Deployments, DaemonSets, and StatefulSets",
      "Configure ClusterIP, NodePort, and LoadBalancer networking with Ingress controllers",
      "Manage release rollouts and helm charts with Helm templating",
    ],
    roadmapSlug: "devops",
    googleSkillsUrl: "https://cloud.google.com/kubernetes-engine",
    mindlusterUrl: "https://www.mindluster.com/certificate/kubernetes",
    videoEmbedId: "X48VuDVv0do",
    videoTitle: "Kubernetes Complete Course from Zero to Hero",
    modules: [{
      id: "k8s-mod-1", slug: "k8s-core", title: "Module 1: Pods, Services & Networking", description: "Pod scheduling and service routing.",
      lessons: [{
        id: "k8s-les-1", slug: "k8s-pod-networking", title: "Kubernetes Pod Networking & Services", summary: "ClusterIP, kube-proxy, and iptables routing.",
        content: "Every Pod in Kubernetes receives its own unique cluster-routable IP address. A Kubernetes Service acts as an internal load balancer that routes traffic to Pods matching label selectors using iptables or IPVS rules.",
        keyTakeaways: ["Pods are ephemeral; Services provide stable IP addresses", "ClusterIP is internal-only; NodePort exposes static node ports"],
        practiceQuestions: [{
          id: "k8s-pq-1", prompt: "How does a Kubernetes Service discover which Pods to route traffic to?",
          type: "multiple-choice", options: ["Using label selectors matching pod labels", "By hardcoding IP addresses", "Through DNS text files", "By scanning container names"],
          correctAnswer: 0, explanation: "Kubernetes Services use label selectors to dynamically populate an Endpoints/EndpointSlice object with healthy Pod IPs."
        }],
        proofChallenge: {
          id: "k8s-proof-1", title: "CrashLoopBackOff Container Diagnosis",
          scenario: "A newly deployed web server pod enters CrashLoopBackOff immediately after startup.",
          questions: [{
            id: "k8s-q1", prompt: "Which command reveals the container's exit code and termination message?",
            options: ["kubectl describe pod <name> and kubectl logs <name> --previous", "kubectl delete cluster", "kubectl restart all", "kubectl top node"],
            correctAnswer: 0, explanation: "kubectl describe displays exit codes and OOMKilled events, while logs --previous shows why the container died."
          }],
          rubricGuidelines: ["Diagnose container startup errors", "Check pod events and logs"]
        }
      }]
    }]
  }),

  // 2. Terraform & Infrastructure as Code (DevOps)
  buildCatalogCourse({
    id: "course-devops-terraform",
    slug: "terraform-infrastructure-as-code",
    title: "Terraform & Infrastructure as Code (IaC)",
    tagline: "Declarative cloud provisioning, state locking, modules, and multi-cloud management.",
    description: "Automate cloud provisioning on AWS, GCP, and Azure using HashiCorp Terraform. Master HCL syntax, provider plugins, state management (remote backends with S3/DynamoDB locking), modules, and workspace separation.",
    category: "Tools & DevOps",
    difficulty: "Beginner",
    estimatedHours: 32,
    iconName: "Workflow",
    badgeColor: "purple",
    learningOutcomes: [
      "Write declarative infrastructure with HashiCorp Configuration Language (HCL)",
      "Manage remote state securely with state locking and S3/GCS backends",
      "Build reusable infrastructure modules with variable validations",
      "Execute safe plan and apply execution cycles in CI/CD pipelines",
    ],
    roadmapSlug: "devops",
    googleSkillsUrl: "https://cloud.google.com/solutions/infrastructure-as-code",
    mindlusterUrl: "https://www.mindluster.com/certificate/terraform",
    videoEmbedId: "SLB_c_wpmJ8",
    videoTitle: "Terraform Infrastructure as Code Complete Course",
    modules: [{
      id: "tf-mod-1", slug: "tf-state", title: "Module 1: Remote State & Providers", description: "HCL syntax and state locking.",
      lessons: [{
        id: "tf-les-1", slug: "tf-state-locking", title: "Terraform State Locking & Remote Backends", summary: "Preventing concurrent writes with DynamoDB state locks.",
        content: "Terraform maps declarative configuration to real-world infrastructure via a state file (terraform.tfstate). Storing state in remote backends like AWS S3 with DynamoDB locking prevents concurrent runs from corrupting infrastructure state.",
        keyTakeaways: ["Never commit terraform.tfstate containing secrets to Git", "State locking prevents race conditions during concurrent CI/CD applies"],
        practiceQuestions: [{
          id: "tf-pq-1", prompt: "What is the purpose of state locking in Terraform?",
          type: "multiple-choice", options: ["Prevents multiple team members from executing apply simultaneously and corrupting state", "Encrypts HCL code", "Makes cloud resources read-only", "Locks the cloud bill"],
          correctAnswer: 0, explanation: "State locking acquires a mutual exclusion lock before reading or modifying state, serializing applies."
        }],
        proofChallenge: {
          id: "tf-proof-1", title: "State Drift Detection",
          scenario: "An engineer manually deletes an EC2 instance in the AWS console, causing state drift.",
          questions: [{
            id: "tf-q1", prompt: "Which command reconciles real-world state and identifies missing resources?",
            options: ["terraform plan (which runs a refresh phase against real APIs)", "terraform destroy", "terraform init", "terraform fmt"],
            correctAnswer: 0, explanation: "terraform plan queries cloud provider APIs, compares reality with the state file, and plans recreation of missing resources."
          }],
          rubricGuidelines: ["Identify state drift", "Apply terraform plan refresh"]
        }
      }]
    }]
  }),

  // 3. Ethical Hacking & Penetration Testing (Cybersecurity)
  buildCatalogCourse({
    id: "course-sec-penetration-testing",
    slug: "ethical-hacking-penetration-testing",
    title: "Ethical Hacking & Penetration Testing",
    tagline: "Reconnaissance, vulnerability scanning, exploitation, privilege escalation, and reporting.",
    description: "Learn offensive cybersecurity methodologies aligned with CEH and OSCP frameworks. Master network port scanning with Nmap, vulnerability assessment, web application exploitation (SQL injection, XSS, CSRF), Metasploit framework, and Linux privilege escalation.",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    estimatedHours: 42,
    iconName: "ShieldCheck",
    badgeColor: "rose",
    learningOutcomes: [
      "Conduct network reconnaissance and banner grabbing with Nmap and Wireshark",
      "Exploit OWASP Top 10 web vulnerabilities: SQLi, Stored XSS, and Broken Auth",
      "Leverage the Metasploit framework for controlled payload delivery",
      "Perform Linux and Windows privilege escalation audits (SUID binaries, sudo abuse)",
    ],
    roadmapSlug: "cyber-security",
    googleSkillsUrl: "https://cloud.google.com/security",
    mindlusterUrl: "https://www.mindluster.com/certificate/ethical-hacking",
    videoEmbedId: "3Kq1MIfTWCE",
    videoTitle: "Ethical Hacking & Penetration Testing Full Course",
    modules: [{
      id: "sec-mod-1", slug: "recon-and-sqli", title: "Module 1: Web Exploitation & Privilege Escalation", description: "SQL injection and SUID privilege escalation.",
      lessons: [{
        id: "sec-les-1", slug: "sql-injection-privesc", title: "SQL Injection & Linux Privilege Escalation", summary: "Detecting SQL flaws and escalating to root via misconfigured permissions.",
        content: "SQL injection occurs when unvalidated user input is concatenated directly into SQL queries. Parameterized queries (prepared statements) neutralize SQLi completely. On Linux systems, misconfigured SUID binaries or writable /etc/passwd files allow low-privilege users to escalate to root.",
        keyTakeaways: ["Parameterized queries separate code from untrusted data", "SUID binaries execute with the permissions of the file owner (root)"],
        practiceQuestions: [{
          id: "sec-pq-1", prompt: "What is the definitive defense against SQL injection attacks?",
          type: "multiple-choice", options: ["Parameterized queries (prepared statements)", "Blacklisting quote characters", "Firewall rules only", "Base64 encoding user input"],
          correctAnswer: 0, explanation: "Prepared statements treat user input strictly as parameters, ensuring the SQL parser never executes input as code."
        }],
        proofChallenge: {
          id: "sec-proof-1", title: "SUID Misconfiguration Exploitation",
          scenario: "A system administrator set SUID permissions on the vim text editor (`chmod u+s /usr/bin/vim`).",
          questions: [{
            id: "sec-q1", prompt: "How can a low-privilege user exploit SUID vim to obtain a root shell?",
            options: ["Execute vim and spawn a shell from command mode (`:!/bin/sh`)", "Vim cannot be exploited", "By restarting the computer", "By deleting vim"],
            correctAnswer: 0, explanation: "Because vim has the SUID bit set, spawning a subshell from within vim inherits root effective user ID."
          }],
          rubricGuidelines: ["Identify SUID risks", "Harden Linux file permissions"]
        }
      }]
    }]
  }),

  // 4. Reverse Engineering & Binary Exploitation (Cybersecurity)
  buildCatalogCourse({
    id: "course-sec-reverse-engineering",
    slug: "reverse-engineering-binary-exploitation",
    title: "Reverse Engineering & Binary Exploitation",
    tagline: "Ghidra decompilation, x86-64 assembly, stack buffer overflows, and ROP chains.",
    description: "Analyze compiled binary executables without source code. Master Ghidra/IDA Pro disassembly, GDB debugging, ELF binary structures, stack buffer overflows, shellcode development, and bypassing security mitigations (ASLR, DEP/NX, Stack Canaries).",
    category: "Cybersecurity",
    difficulty: "Advanced",
    estimatedHours: 46,
    iconName: "Binary",
    badgeColor: "rose",
    learningOutcomes: [
      "Decompile stripped x86-64 Linux ELF binaries using Ghidra and GDB-PEDA",
      "Craft stack buffer overflow exploits overwriting the instruction pointer (RIP)",
      "Bypass Data Execution Prevention (NX/DEP) using Return-Oriented Programming (ROP)",
      "Analyze malware persistence mechanisms and packed binary droppers",
    ],
    roadmapSlug: "cyber-security",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/reverse-engineering",
    videoEmbedId: "k_B9_7Gx9Z7",
    videoTitle: "Reverse Engineering and Binary Exploitation Course",
    modules: [{
      id: "rev-mod-1", slug: "buffer-overflows-rop", title: "Module 1: Stack Exploitation & ROP", description: "Stack frames, canaries, and gadget chaining.",
      lessons: [{
        id: "rev-les-1", slug: "stack-overflow-rop", title: "Stack Buffer Overflows & Return-Oriented Programming", summary: "Overwriting return addresses and chaining ROP gadgets.",
        content: "When a C program reads input using unsafe functions like `gets()` or `strcpy()`, an attacker can overflow the local buffer and overwrite the saved frame pointer (RBP) and return address (RIP). When NX is enabled, Return-Oriented Programming (ROP) stitches together small assembly snippets ('gadgets' ending in RET) to execute system calls.",
        keyTakeaways: ["Stack Canaries place a random secret value before the return address to detect corruption", "ROP reuses existing executable code in libc or binary sections to bypass NX"],
        practiceQuestions: [{
          id: "rev-pq-1", prompt: "What defense mechanism terminates a program immediately if a stack buffer overflow overwrites the return address?",
          type: "multiple-choice", options: ["Stack Canary (Stack Smashing Protector)", "Address Space Layout Randomization (ASLR)", "Data Execution Prevention (DEP)", "Firewall"],
          correctAnswer: 0, explanation: "The compiler places a canary value right before the return address. If the canary is altered upon function exit, __stack_chk_fail halts the process."
        }],
        proofChallenge: {
          id: "rev-proof-1", title: "ROP Gadget Chaining for execve",
          scenario: "An attacker seeks to execute `/bin/sh` on a binary compiled with NX enabled.",
          questions: [{
            id: "rev-q1", prompt: "Which registers must be controlled to invoke the `execve('/bin/sh', 0, 0)` syscall on x86-64 Linux?",
            options: ["RAX = 59, RDI = pointer to '/bin/sh', RSI = 0, RDX = 0, followed by `syscall`", "EAX = 1, EBX = 0", "RCX = 100", "R8 = 0 only"],
            correctAnswer: 0, explanation: "x86-64 Linux syscall convention requires RAX to hold the syscall number (59 for execve) and RDI, RSI, RDX to hold the 3 arguments."
          }],
          rubricGuidelines: ["Analyze x86-64 syscall convention", "Construct ROP chain"]
        }
      }]
    }]
  }),

  // 5. Apache Kafka Real-Time Event Streaming (Data Science)
  buildCatalogCourse({
    id: "course-ds-apache-kafka",
    slug: "apache-kafka-realtime-event-streaming",
    title: "Apache Kafka: Real-Time Event Streaming",
    tagline: "Distributed commit logs, topics, partitions, consumer groups, and Kafka Streams.",
    description: "Design high-throughput event-driven data streaming architectures. Master Apache Kafka distributed commit logs, partitions, producer acks/idempotence, consumer rebalancing, exactly-once semantics (EOS), and Kafka Streams stateful transformations.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 38,
    iconName: "Activity",
    badgeColor: "amber",
    learningOutcomes: [
      "Understand Kafka log architecture: Topics, Partitions, Segments, and Offsets",
      "Configure Producer durability (acks=all) and idempotent message delivery",
      "Scale consumption across partition rebalances with Consumer Groups",
      "Perform stateful stream processing (windowed aggregations, joins) with Kafka Streams",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/pubsub",
    mindlusterUrl: "https://www.mindluster.com/certificate/apache-kafka",
    videoEmbedId: "R873BlNVUB4",
    videoTitle: "Apache Kafka Complete Event Streaming Masterclass",
    modules: [{
      id: "kafka-mod-1", slug: "partitions-and-consumer-groups", title: "Module 1: Partitions, Offsets & Durability", description: "Partition keys, replication, and consumer groups.",
      lessons: [{
        id: "kafka-les-1", slug: "kafka-partitioning-durability", title: "Kafka Log Partitioning & Consumer Groups", summary: "Total ordering within partitions and consumer group parallelism.",
        content: "Kafka provides strict message ordering ONLY within an individual partition. Producers use partition keys (hashed modulo partition count) to route related events to the same partition. Consumer groups scale consumption: each partition is read by at most one consumer instance in a group.",
        keyTakeaways: ["A topic with N partitions can be read concurrently by at most N active consumers in a group", "Setting `acks=all` ensures the leader waits for all in-sync replicas (ISR) before acknowledging"],
        practiceQuestions: [{
          id: "kf-pq-1", prompt: "If a Kafka topic has 4 partitions and a consumer group has 6 active consumers, how many consumers will remain idle?",
          type: "multiple-choice", options: ["2 consumers will be idle (only 4 can consume simultaneously)", "0 consumers (all 6 share evenly)", "All 6 are idle", "1 consumer"],
          correctAnswer: 0, explanation: "Each partition can be assigned to at most one consumer per consumer group. Extra consumers sit idle as hot standbys in case of a crash."
        }],
        proofChallenge: {
          id: "kf-proof-1", title: "Consumer Group Rebalance Storm",
          scenario: "A slow consumer processing heavy image data times out its heartbeat, triggering constant stop-the-world rebalance storms across the cluster.",
          questions: [{
            id: "kf-q1", prompt: "Which consumer configuration prevents premature ejection from the consumer group during long processing cycles?",
            options: ["Increase `max.poll.interval.ms` or process batches asynchronously in worker threads", "Decrease session timeout to 1 ms", "Disable partitions", "Restart Kafka brokers"],
            correctAnswer: 0, explanation: "If the consumer loop takes longer than max.poll.interval.ms between poll() calls, the coordinator assumes it died and triggers a rebalance. Increasing this threshold resolves the storm."
          }],
          rubricGuidelines: ["Identify consumer timeouts", "Tune max.poll.interval.ms"]
        }
      }]
    }]
  }),

  // 6. Feature Engineering & Preprocessing for ML (Data Science)
  buildCatalogCourse({
    id: "course-ds-feature-engineering",
    slug: "feature-engineering-preprocessing-ml",
    title: "Feature Engineering & Preprocessing for ML",
    tagline: "Handling missing data, categorical encodings, scaling, and feature selection.",
    description: "Transform raw noisy datasets into high-signal feature matrices for predictive models. Master missing value imputation (KNN, iterative MICE), categorical encoding (One-Hot, Target, CatBoost), outlier detection, feature scaling, and PCA dimensionality reduction.",
    category: "Data Science",
    difficulty: "Beginner",
    estimatedHours: 32,
    iconName: "BarChart3",
    badgeColor: "emerald",
    learningOutcomes: [
      "Diagnose missing data mechanisms: MCAR (Completely at Random), MAR, and MNAR",
      "Encode high-cardinality categorical variables with Target Encoding and smoothing",
      "Apply robust scaling techniques resilient to extreme outliers (RobustScaler vs StandardScaler)",
      "Select optimal feature subsets using Recursive Feature Elimination (RFE) and SHAP values",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://developers.google.com/machine-learning/data-prep",
    mindlusterUrl: "https://www.mindluster.com/certificate/feature-engineering",
    videoEmbedId: "k_B9_8Hx0Z8",
    videoTitle: "Feature Engineering for Machine Learning Complete Course",
    modules: [{
      id: "fe-mod-1", slug: "encoding-and-selection", title: "Module 1: Encoding & Target Leakage Prevention", description: "Target encoding, scaling, and leakage prevention.",
      lessons: [{
        id: "fe-les-1", slug: "target-encoding-leakage", title: "Target Encoding & Data Leakage Prevention", summary: "Preventing cross-validation data leakage when transforming features.",
        content: "Data leakage occurs when information from the test dataset contaminates the training feature pipeline (e.g. computing mean imputation on the full dataset before train/test split). Target encoding replaces categorical values with the mean of the target variable, which requires K-fold out-of-fold target encoding to prevent severe overfitting.",
        keyTakeaways: ["Always fit scalers and encoders ONLY on training data; transform validation/test data", "Use Scikit-Learn Pipelines to enforce strict separation between feature transforms and estimators"],
        practiceQuestions: [{
          id: "fe-pq-1", prompt: "Why must `StandardScaler.fit()` be called strictly on training data rather than the entire dataset before splitting?",
          type: "multiple-choice", options: ["Fitting on the full dataset leaks statistical information (mean/variance) from the test set into training, yielding falsely optimistic evaluation metrics", "StandardScaler crashes on large datasets", "It doubles the training time", "The test set has no mean"],
          correctAnswer: 0, explanation: "Fitting scalers or encoders on the combined dataset before splitting is classic data leakage. The model learns statistical properties of the test distribution."
        }],
        proofChallenge: {
          id: "fe-proof-1", title: "Target Leakage in Kaggle Competition",
          scenario: "A model achieves 99.8% cross-validation AUC in training but drops to 61% on the hidden test set.",
          questions: [{
            id: "fe-q1", prompt: "What is the primary indicator of data leakage during feature preprocessing?",
            options: ["A feature directly derived from the target variable or computed using future information not available at inference time", "Having too many features", "Using Python 3.11", "Low learning rate"],
            correctAnswer: 0, explanation: "Near-perfect training metrics that collapse on unseen data indicate that a feature accidentally smuggled the target label into the input vector."
          }],
          rubricGuidelines: ["Audit feature pipelines for leakage", "Construct clean Scikit-Learn Pipelines"]
        }
      }]
    }]
  }),

  // 7. Time Series Analysis & Forecasting (Data Science)
  buildCatalogCourse({
    id: "course-ds-time-series",
    slug: "time-series-forecasting-prophet-arima",
    title: "Time Series Analysis & Forecasting",
    tagline: "Stationarity, ARIMA, SARIMAX, Facebook Prophet, and LSTM sequence models.",
    description: "Analyze and forecast sequential temporal data. Covers trends, seasonality, stationarity tests (Augmented Dickey-Fuller), autocorrelation (ACF/PACF), ARIMA/SARIMAX parameter tuning, Meta's Prophet model for business forecasting, and deep learning sequence models.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Activity",
    badgeColor: "indigo",
    learningOutcomes: [
      "Test time series stationarity using Augmented Dickey-Fuller (ADF) tests",
      "Determine ARIMA orders (p, d, q) by inspecting ACF and PACF correlograms",
      "Model seasonal trends and holiday effects using Facebook Prophet",
      "Evaluate forecasts using rolling-origin cross-validation (TimeSeriesSplit) and MAPE/RMSE metrics",
    ],
    roadmapSlug: "data-scientist",
    googleSkillsUrl: "https://cloud.google.com/vertex-ai",
    mindlusterUrl: "https://www.mindluster.com/certificate/time-series",
    videoEmbedId: "k_B9_9Ix1Z9",
    videoTitle: "Time Series Analysis & Forecasting Complete Course",
    modules: [{
      id: "ts-mod-1", slug: "stationarity-arima", title: "Module 1: Stationarity & ARIMA Modeling", description: "Differencing, ACF/PACF plots, and seasonality.",
      lessons: [{
        id: "ts-les-1", slug: "arima-stationarity", title: "Stationarity, Differencing & ACF/PACF Interpretation", summary: "Transforming non-stationary series and choosing AR/MA orders.",
        content: "A time series is stationary when its mean, variance, and autocorrelation remain constant over time. Most financial and business series exhibit non-stationary trends. Differencing (Y_t - Y_{t-1}) removes trends (order d). Spikes in the Partial Autocorrelation Function (PACF) indicate Auto-Regressive order p; spikes in the Autocorrelation Function (ACF) indicate Moving-Average order q.",
        keyTakeaways: ["Standard k-fold cross-validation is invalid for time series; use rolling time-series splits to prevent lookahead bias", "Prophet models decomposable time series: y(t) = trend(t) + seasonality(t) + holidays(t) + error"],
        practiceQuestions: [{
          id: "ts-pq-1", prompt: "Why cannot standard randomized K-Fold cross-validation be used to evaluate time series forecasting models?",
          type: "multiple-choice", options: ["Random shuffling breaks chronological order and trains the model on future data to predict the past (lookahead bias)", "Time series data cannot be split", "Cross-validation requires at least 1,000,000 rows", "K-fold deletes time stamps"],
          correctAnswer: 0, explanation: "Shuffling temporal data introduces future leakage into training folds. Forward-chaining rolling window validation (TimeSeriesSplit) respects temporal order."
        }],
        proofChallenge: {
          id: "ts-proof-1", title: "False Confidence from Spurious Regression",
          scenario: "Two completely unrelated trending time series show an artificial R^2 correlation of 0.98.",
          questions: [{
            id: "ts-q1", prompt: "How do you test and resolve spurious correlation caused by unit root non-stationarity?",
            options: ["Apply the Augmented Dickey-Fuller (ADF) test to verify stationarity and difference the series before regression", "Increase sample size without differencing", "Use a linear kernel SVM", "Square both variables"],
            correctAnswer: 0, explanation: "Two non-stationary series that drift upward over time exhibit high correlation purely due to shared trends. Differencing both series to stationarity reveals their true relationship."
          }],
          rubricGuidelines: ["Conduct ADF stationarity test", "Difference temporal data"]
        }
      }]
    }]
  }),

  // 8. Tableau Desktop Visual Analytics & BI (Data Science)
  buildCatalogCourse({
    id: "course-ds-tableau",
    slug: "tableau-desktop-visual-analytics",
    title: "Tableau Desktop: Visual Analytics & BI",
    tagline: "Level of Detail (LOD) expressions, parameters, calculated fields, and interactive dashboards.",
    description: "Build executive visual dashboards and interactive reports in Tableau. Master dimension vs measure fields, discrete vs continuous data pills, Level of Detail (LOD) expressions (FIXED, INCLUDE, EXCLUDE), dual-axis charts, dashboard actions, and Tableau Server publishing.",
    category: "Data Science",
    difficulty: "Beginner",
    estimatedHours: 28,
    iconName: "BarChart3",
    badgeColor: "blue",
    learningOutcomes: [
      "Distinguish discrete (blue) vs continuous (green) dimensions and measures",
      "Write complex Level of Detail (LOD) calculations using `{FIXED : ...}` expressions",
      "Design interactive dashboard filter, highlight, and URL actions",
      "Optimize workbook performance by analyzing Tableau performance recorder traces",
    ],
    roadmapSlug: "data-analyst",
    googleSkillsUrl: "https://cloud.google.com/looker",
    mindlusterUrl: "https://www.mindluster.com/certificate/tableau",
    videoEmbedId: "aHaOIvR00So",
    videoTitle: "Tableau Desktop Full Course - Beginner to Advanced",
    modules: [{
      id: "tab-mod-1", slug: "lod-and-dashboards", title: "Module 1: Level of Detail (LOD) Expressions", description: "FIXED, INCLUDE, and EXCLUDE expressions.",
      lessons: [{
        id: "tab-les-1", slug: "fixed-lod-expressions", title: "Tableau FIXED Level of Detail (LOD) Expressions", summary: "Computing aggregations at a different level of granularity than the view.",
        content: "Normally, aggregations in Tableau are calculated strictly at the level of detail dictated by dimensions on the Rows and Columns shelves. A `{FIXED [Region] : SUM([Sales])}` expression computes total regional sales regardless of what sub-category dimensions are present in the view.",
        keyTakeaways: ["FIXED LOD expressions are evaluated BEFORE dimension filters in Tableau's order of operations", "Use context filters if you want a filter to apply before a FIXED LOD expression"],
        practiceQuestions: [{
          id: "tab-pq-1", prompt: "How can you force a normal dimension filter to take effect before a FIXED Level of Detail (LOD) calculation in Tableau?",
          type: "multiple-choice", options: ["Add the filter to Context ('Add to Context')", "Convert the field to a measure", "Use dual-axis", "Publish the workbook to Tableau Server"],
          correctAnswer: 0, explanation: "In Tableau's order of operations, Context Filters execute before FIXED LOD calculations, while regular dimension filters execute afterward."
        }],
        proofChallenge: {
          id: "tab-proof-1", title: "Tableau Dashboard Slow Rendering Bottleneck",
          scenario: "An enterprise Tableau dashboard with 12 worksheets takes 45 seconds to load when users open it.",
          questions: [{
            id: "tab-q1", prompt: "What optimization dramatically accelerates slow Tableau workbooks connected to live databases?",
            options: ["Create a filtered data extract (.hyper) and aggregate unused columns", "Add more worksheets", "Set all filters to multiple values dropdown", "Use custom SQL with unindexed joins"],
            correctAnswer: 0, explanation: "Hyper extracts pre-aggregate data in a high-speed columnar format, eliminating live database network query round-trips."
          }],
          rubricGuidelines: ["Profile workbook performance", "Convert live data to Hyper extract"]
        }
      }]
    }]
  }),

  // 9. Computer Vision with OpenCV & YOLO (AIML)
  buildCatalogCourse({
    id: "course-aiml-computer-vision-yolo",
    slug: "computer-vision-opencv-yolo-detection",
    title: "Computer Vision with OpenCV & YOLO",
    tagline: "Image processing, convolutions, YOLOv8 object detection, and image segmentation.",
    description: "Build computer vision applications processing images and video streams. Master pixel transformations, morphological operations, Sobel/Canny edge detection, convolutional feature maps, real-time object detection with Ultralytics YOLOv8, and instance segmentation.",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimatedHours: 38,
    iconName: "Brain",
    badgeColor: "purple",
    learningOutcomes: [
      "Process digital images with OpenCV: color spaces (BGR/HSV), blurring, and edge detection",
      "Understand CNN architectures: convolutions, pooling, receptive fields, and residual connections",
      "Train custom YOLOv8 object detection models on labeled bounding-box datasets",
      "Evaluate detection models using Intersection over Union (IoU) and mean Average Precision (mAP50)",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://cloud.google.com/vision",
    mindlusterUrl: "https://www.mindluster.com/certificate/computer-vision",
    videoEmbedId: "WQeoO7MI0Bs",
    videoTitle: "Computer Vision & YOLO Complete Masterclass",
    modules: [{
      id: "cv-mod-1", slug: "yolo-object-detection", title: "Module 1: YOLO Real-Time Object Detection", description: "Anchor-free detection, IoU, and NMS suppression.",
      lessons: [{
        id: "cv-les-1", slug: "yolo-nms-iou", title: "Non-Maximum Suppression (NMS) & IoU", summary: "Filtering redundant overlapping bounding box predictions.",
        content: "YOLO (You Only Look Once) frames object detection as a single regression problem, predicting bounding boxes and class probabilities in a single forward pass. Because multiple grid cells predict the same object, Non-Maximum Suppression (NMS) sorts candidate boxes by confidence score and eliminates overlapping boxes having an Intersection over Union (IoU) above a chosen threshold.",
        keyTakeaways: ["IoU = Area of Overlap / Area of Union", "NMS eliminates redundant boxes, leaving exactly one clean prediction per physical object"],
        practiceQuestions: [{
          id: "cv-pq-1", prompt: "What is the purpose of Non-Maximum Suppression (NMS) in object detection algorithms like YOLO?",
          type: "multiple-choice", options: ["Eliminating redundant overlapping bounding boxes that predict the same physical object", "Increasing image resolution", "Converting RGB to grayscale", "Speeding up video capture"],
          correctAnswer: 0, explanation: "Object detectors output dozens of candidate boxes for a single person. NMS keeps only the highest-confidence prediction and discards overlapping duplicates."
        }],
        proofChallenge: {
          id: "cv-proof-1", title: "High False Positives on Small Distant Objects",
          scenario: "A drone camera fails to detect small cars from high altitude using default 640x640 input resolution.",
          questions: [{
            id: "cv-q1", prompt: "How do you improve small object detection accuracy in YOLO models?",
            options: ["Increase input image resolution (e.g. 1280x1280) or apply Sliced Aided Hyper Inference (SAHI)", "Lower confidence threshold to 0.01 only", "Blur the input images", "Remove the backbone"],
            correctAnswer: 0, explanation: "Small objects lose resolution through CNN pooling layers. Increasing input resolution or slicing high-res images into overlapping tiles (SAHI) preserves small object details."
          }],
          rubricGuidelines: ["Tune input image resolution", "Apply SAHI tiling for small targets"]
        }
      }]
    }]
  }),

  // 10. Reinforcement Learning: Q-Learning & Policy Gradients (AIML)
  buildCatalogCourse({
    id: "course-aiml-reinforcement-learning",
    slug: "reinforcement-learning-q-learning-policy-gradients",
    title: "Reinforcement Learning: Q-Learning & Policy Gradients",
    tagline: "Markov Decision Processes, Deep Q-Networks (DQN), PPO, and Gymnasium environments.",
    description: "Train autonomous agents to make sequential decisions under uncertainty. Master Markov Decision Processes (MDP), Bellman equations, tabular Q-Learning, Deep Q-Networks (DQN with replay buffers), Policy Gradients (REINFORCE), and Proximal Policy Optimization (PPO).",
    category: "AI & ML",
    difficulty: "Advanced",
    estimatedHours: 42,
    iconName: "Brain",
    badgeColor: "rose",
    learningOutcomes: [
      "Formulate decision problems as Markov Decision Processes (States, Actions, Rewards, Discount Factor γ)",
      "Derive Bellman Optimality Equations and implement value iteration",
      "Train Deep Q-Networks (DQN) with experience replay buffers and target networks",
      "Implement actor-critic policy gradient algorithms including PPO for continuous robotic control",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/reinforcement-learning",
    videoEmbedId: "k_B9_0Jx2Z0",
    videoTitle: "Reinforcement Learning Full Course - Theory to Practice",
    modules: [{
      id: "rl-mod-1", slug: "bellman-and-dqn", title: "Module 1: Bellman Equation & Deep Q-Networks", description: "Q-Learning, experience replay, and target networks.",
      lessons: [{
        id: "rl-les-1", slug: "dqn-experience-replay", title: "Deep Q-Networks (DQN) & Experience Replay", summary: "Stabilizing neural network value approximation by breaking temporal correlations.",
        content: "Directly training neural networks on consecutive RL transitions causes divergence because sequential states are highly correlated and policy updates shift the target values. DQN introduces two innovations:\n1. Experience Replay: Transitions (s, a, r, s') are stored in a buffer and sampled uniformly at random to break correlation.\n2. Target Network: A separate frozen network computes Q-targets, updated periodically to stabilize learning targets.",
        keyTakeaways: ["The discount factor γ balances immediate vs long-term delayed rewards", "Epsilon-greedy exploration balances exploring new actions vs exploiting known high-reward strategies"],
        practiceQuestions: [{
          id: "rl-pq-1", prompt: "Why does Deep Q-Learning (DQN) require a separate `Target Network` that updates periodically rather than on every step?",
          type: "multiple-choice", options: ["To prevent chasing a moving target where updating the Q-network continuously shifts the target value, causing training instability and divergence", "To run on two GPUs simultaneously", "Because target networks run backward in time", "To double the reward values"],
          correctAnswer: 0, explanation: "If the network updates its own target values every single step, errors compound exponentially. Freezing a separate target network stabilizes target evaluations."
        }],
        proofChallenge: {
          id: "rl-proof-1", title: "Reward Hacking in Game Playing Agent",
          scenario: "An RL racing boat agent discovers an exploit where it circles endlessly in a small loop collecting bonus points rather than finishing the race.",
          questions: [{
            id: "rl-q1", prompt: "What RL design flaw leads to an agent exploiting loopholes rather than achieving the intended objective?",
            options: ["Reward Hacking / Misaligned Reward Function design (rewarding sub-actions rather than terminal goal completion)", "Setting gamma to 0.99", "Using PyTorch instead of TensorFlow", "Slow frame rate"],
            correctAnswer: 0, explanation: "Reward hacking occurs when the agent maximizes its mathematical reward function through unintended behaviors that do not align with the true human goal."
          }],
          rubricGuidelines: ["Analyze reward shaping", "Align agent objectives with terminal metrics"]
        }
      }]
    }]
  }),

  // 11. Semiconductor Device Physics & Fabrication (ECE)
  buildCatalogCourse({
    id: "course-ece-semiconductors",
    slug: "semiconductor-physics-fabrication",
    title: "Semiconductor Physics & Fabrication",
    tagline: "Energy band diagrams, PN junctions, MOSFET physics, photolithography, and cleanrooms.",
    description: "Understand the physics of modern microchips. Covers Fermi-Dirac statistics, direct vs indirect bandgaps, PN junction drift/diffusion currents, breakdown mechanisms, MOSFET channel inversion, photolithography, and wafer fabrication cleanroom processes.",
    category: "Electronics & Embedded (ECE)",
    difficulty: "Advanced",
    estimatedHours: 38,
    iconName: "Cpu",
    badgeColor: "purple",
    learningOutcomes: [
      "Interpret energy band diagrams: conduction, valence bands, and Fermi level shifts",
      "Model PN junction depletion capacitance and avalanche vs Zener breakdown",
      "Derive MOSFET threshold voltage (Vth) and body effect equation",
      "Explain EUV photolithography, chemical vapor deposition (CVD), and reactive ion etching",
    ],
    roadmapSlug: "electronics",
    googleSkillsUrl: "https://developers.google.com/silicon",
    mindlusterUrl: "https://www.mindluster.com/certificate/semiconductors",
    videoEmbedId: "k_C0_1Kx3Z1",
    videoTitle: "Semiconductor Device Physics Complete Course",
    modules: [{
      id: "semi-mod-1", slug: "pn-junctions-mosfet", title: "Module 1: PN Junctions & MOSFET Inversion", description: "Band diagrams and channel formation.",
      lessons: [{
        id: "semi-les-1", slug: "mosfet-inversion-threshold", title: "MOSFET Strong Inversion & Threshold Voltage", summary: "Surface potential pinning and minority carrier channel conduction.",
        content: "In an nMOS capacitor on p-type silicon, applying a positive gate voltage repels majority holes (depletion). When surface potential reaches 2*phi_F, strong inversion occurs: minority electrons accumulate at the Si-SiO2 interface, forming a conductive channel between source and drain.",
        keyTakeaways: ["Strong inversion occurs when surface potential reaches twice the bulk Fermi potential", "Body effect increases threshold voltage when source-to-substrate reverse bias is applied"],
        practiceQuestions: [{
          id: "semi-pq-1", prompt: "What condition defines the onset of strong inversion in a MOS capacitor?",
          type: "multiple-choice", options: ["Surface potential φs equals twice the bulk Fermi potential (2φF)", "Gate voltage reaches 0V", "Electric field drops to zero", "Oxide capacitance reaches infinity"],
          correctAnswer: 0, explanation: "Strong inversion is reached when minority electron density at the silicon surface equals majority hole density in the bulk substrate (φs = 2φF)."
        }],
        proofChallenge: {
          id: "semi-proof-1", title: "Short-Channel Drain-Induced Barrier Lowering",
          scenario: "An advanced 7nm MOSFET exhibits severe leakage current in the OFF state when drain voltage VDS increases.",
          questions: [{
            id: "semi-q1", prompt: "What short-channel electrostatic effect causes threshold voltage to drop at high VDS?",
            options: ["Drain-Induced Barrier Lowering (DIBL)", "Hall effect", "Photoelectric effect", "Skin effect"],
            correctAnswer: 0, explanation: "DIBL occurs when high drain potential lowers the source-channel electrostatic barrier, allowing subthreshold leakage current to flow even when VGS < Vth."
          }],
          rubricGuidelines: ["Analyze short-channel effects", "Mitigate DIBL using FinFET/GAA architecture"]
        }
      }]
    }]
  }),

  // 12. Power Electronics & Motor Drive Inverters (ECE)
  buildCatalogCourse({
    id: "course-ece-power-electronics",
    slug: "power-electronics-motor-drives",
    title: "Power Electronics & Motor Drive Inverters",
    tagline: "Buck/Boost converters, MOSFET/IGBT switching, PWM, and 3-phase BLDC motor drives.",
    description: "Design efficient high-power electrical systems for electric vehicles and renewable energy. Master switch-mode power supplies (SMPS: Buck, Boost, Buck-Boost), GaN and SiC wide-bandgap transistors, thermal management, pulse-width modulation (PWM), and 3-phase inverters for Brushless DC (BLDC) motors.",
    category: "Electronics & Embedded (ECE)",
    difficulty: "Intermediate",
    estimatedHours: 36,
    iconName: "Activity",
    badgeColor: "amber",
    learningOutcomes: [
      "Derive voltage conversion ratios in Continuous Conduction Mode (CCM) and DCM",
      "Select power MOSFETs, IGBTs, and wide-bandgap SiC/GaN switches for high efficiency",
      "Design closed-loop voltage and current mode feedback compensation for SMPS",
      "Generate Space Vector PWM (SVPWM) signals driving 3-phase BLDC/PMSM motor inverters",
    ],
    roadmapSlug: "electronics",
    googleSkillsUrl: "https://developers.google.com/hardware",
    mindlusterUrl: "https://www.mindluster.com/certificate/power-electronics",
    videoEmbedId: "k_C1_2Kx4Z2",
    videoTitle: "Power Electronics and Motor Drives Complete Masterclass",
    modules: [{
      id: "pe-mod-1", slug: "smps-converters-inverters", title: "Module 1: DC-DC Switch-Mode Converters", description: "Inductor volt-second balance and capacitor charge balance.",
      lessons: [{
        id: "pe-les-1", slug: "buck-boost-converter-ccm", title: "Buck & Boost Converters in Continuous Conduction Mode", summary: "Inductor volt-second balance and duty cycle voltage ratios.",
        content: "Linear regulators burn excess voltage as waste heat (Efficiency = Vout / Vin). Switch-mode converters use high-frequency switching and reactive storage (L and C) to transfer power with > 95% efficiency. In CCM, the Buck converter satisfies Inductor Volt-Second Balance:\nVout = D * Vin, where D is the switching duty cycle (0 < D < 1).",
        keyTakeaways: ["Buck steps voltage down (Vout = D*Vin); Boost steps voltage up (Vout = Vin / (1 - D))", "GaN and SiC switches operate at MHz frequencies, shrinking inductor and capacitor size dramatically"],
        practiceQuestions: [{
          id: "pe-pq-1", prompt: "A Boost converter has an input voltage of 12V and operates in CCM with a duty cycle D = 0.75. What is the ideal output voltage?",
          type: "multiple-choice", options: ["48V (Vout = 12 / (1 - 0.75) = 12 / 0.25 = 48V)", "9V", "16V", "24V"],
          correctAnswer: 0, explanation: "In CCM, the Boost transfer ratio is Vout = Vin / (1 - D). For D = 0.75, (1 - D) = 0.25, giving 12 / 0.25 = 48 Volts."
        }],
        proofChallenge: {
          id: "pe-proof-1", title: "Inductor Magnetic Core Saturation",
          scenario: "A 24V-to-5V buck converter runs hot and blows its high-side switching MOSFET under peak 5A load.",
          questions: [{
            id: "pe-q1", prompt: "What failure mechanism causes inductor current to spike uncontrollably when core saturation current Isat is exceeded?",
            options: ["The inductor core saturates, causing magnetic permeability μ to plummet and inductance L to collapse to near zero", "The diode conducts backward", "The clock frequency doubles", "Output capacitor voltage inverts"],
            correctAnswer: 0, explanation: "When B exceeds the core's saturation limit, inductance collapses. Without inductance to oppose current changes (di/dt = V/L), current spikes dangerously, destroying the switching FET."
          }],
          rubricGuidelines: ["Check inductor saturation rating", "Select proper magnetic core material"]
        }
      }]
    }]
  }),

  // 13. Optical Fiber Communication & Photonics (ECE)
  buildCatalogCourse({
    id: "course-ece-optical-fiber",
    slug: "optical-fiber-communication-photonics",
    title: "Optical Fiber Communication & Photonics",
    tagline: "Total internal reflection, single-mode fibers, dispersion, WDM, and optical amplifiers.",
    description: "Explore the physical transmission medium carrying 99% of global internet traffic. Master Snell's law, total internal reflection, numerical aperture, attenuation (0.2 dB/km at 1550nm), chromatic/polarization dispersion, Wavelength Division Multiplexing (WDM), and Erbium-Doped Fiber Amplifiers (EDFA).",
    category: "Electronics & Embedded (ECE)",
    difficulty: "Advanced",
    estimatedHours: 34,
    iconName: "Radio",
    badgeColor: "sky",
    learningOutcomes: [
      "Calculate acceptance angle and Numerical Aperture (NA) using core/cladding refractive indices",
      "Compare modal dispersion in multi-mode fiber with chromatic dispersion in single-mode fiber",
      "Explain DWDM multiplexing and Erbium-Doped Fiber Amplifiers (EDFA) optical gain",
      "Design power budgets and rise-time budgets for multi-gigabit transoceanic optical links",
    ],
    roadmapSlug: "electronics",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/optical-fiber",
    videoEmbedId: "k_C2_3Kx5Z3",
    videoTitle: "Optical Fiber Communications & Photonics Masterclass",
    modules: [{
      id: "opt-mod-1", slug: "fiber-propagation", title: "Module 1: Wave Propagation & Dispersion", description: "Total internal reflection, attenuation, and dispersion limits.",
      lessons: [{
        id: "opt-les-1", slug: "total-internal-reflection-na", title: "Total Internal Reflection & Chromatic Dispersion", summary: "Light guiding in single-mode silica fibers and pulse broadening.",
        content: "Optical fibers guide light through Total Internal Reflection (TIR) at the boundary between a high-index core (n1) and a lower-index cladding (n2). In single-mode fiber (SMF-28), intermodal dispersion is zero, but chromatic dispersion causes different spectral wavelengths of light to travel at different group velocities, causing optical pulses to broaden over distance.",
        keyTakeaways: ["Silica optical fibers achieve minimum optical loss (0.2 dB/km) at the 1550 nm telecommunication window", "EDFA amplifiers amplify 1550 nm optical signals directly in the light domain without O-E-O conversion"],
        practiceQuestions: [{
          id: "opt-pq-1", prompt: "Why is single-mode optical fiber (SMF) preferred over multimode fiber for long-haul internet trunk backbones?",
          type: "multiple-choice", options: ["Single-mode fiber eliminates intermodal dispersion by allowing only a single fundamental optical mode to propagate, enabling hundreds of kilometers of reach without pulse distortion", "Single-mode fiber is made of plastic", "Multimode fiber cannot carry data", "Single-mode fiber carries electricity"],
          correctAnswer: 0, explanation: "In multimode fiber, different light rays take different geometric paths, causing severe intermodal pulse spreading. Single-mode core diameter is so small (~9μm) that only one light path exists."
        }],
        proofChallenge: {
          id: "opt-proof-1", title: "Transoceanic Link Optical Power Budget Deficit",
          scenario: "An 80 km fiber cable link fails bit error rate (BER) tests with -32 dBm received optical power at the photodiode.",
          questions: [{
            id: "opt-q1", prompt: "How do optical engineers calculate whether an optical signal will arrive with sufficient signal-to-noise ratio?",
            options: ["By conducting a link Power Budget calculation (Total Allowed Loss = Tx Power - Rx Sensitivity - Safety Margin)", "By measuring the physical weight of the glass", "By shining a laser pointer into the cable", "By adding more routers"],
            correctAnswer: 0, explanation: "Power Budget analysis compares transmitter optical launch power minus fiber attenuation (0.2 dB/km * distance) minus connector/splice losses against receiver photodiode sensitivity."
          }],
          rubricGuidelines: ["Calculate fiber link loss", "Establish optical power budget"]
        }
      }]
    }]
  }),

  // 14. Biomedical Signal Processing & Instrumentation (ECE)
  buildCatalogCourse({
    id: "course-ece-biomedical",
    slug: "biomedical-signal-processing-instrumentation",
    title: "Biomedical Signal Processing & Instrumentation",
    tagline: "Bio-potentials (ECG, EEG, EMG), electrode-skin interface, isolation amplifiers, and noise filtering.",
    description: "Design safe, precision medical instrumentation acquiring physiological bio-potentials. Master ECG (electrocardiogram), EEG (brain waves), electrode half-cell potentials, driven-right-leg (DRL) 60Hz common-mode noise cancellation, galvanic patient isolation, and QRS wave detection algorithms.",
    category: "Electronics & Embedded (ECE)",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Activity",
    badgeColor: "rose",
    learningOutcomes: [
      "Understand bio-potential generation: action potentials, resting potentials, and electrode-electrolyte interfaces",
      "Eliminate 50/60 Hz powerline interference using Driven-Right-Leg (DRL) circuits",
      "Ensure patient safety using optical/magnetic galvanic isolation complying with IEC 60601",
      "Detect heart cardiac QRS complexes using the Pan-Tompkins DSP algorithm",
    ],
    roadmapSlug: "electronics",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/biomedical-engineering",
    videoEmbedId: "k_C3_4Kx6Z4",
    videoTitle: "Biomedical Instrumentation and Signal Processing Course",
    modules: [{
      id: "bio-mod-1", slug: "ecg-acquisition", title: "Module 1: Bio-potentials & ECG Front-End Design", description: "Electrodes, DRL circuitry, and Pan-Tompkins QRS detection.",
      lessons: [{
        id: "bio-les-1", slug: "drl-circuit-pan-tompkins", title: "Driven-Right-Leg (DRL) & Pan-Tompkins Algorithm", summary: "Canceling massive 60Hz capacitive powerline hum from tiny 1mV ECG signals.",
        content: "Human bodies act as antennas coupling capacitive displacement currents from AC powerlines, producing common-mode voltages up to several volts, which completely swamps tiny 1mV ECG cardiac bio-potentials. A Driven-Right-Leg (DRL) circuit inverts the common-mode signal and drives it back into the patient's right leg, actively canceling ambient AC noise.",
        keyTakeaways: ["Differential instrumentation amplifiers require CMRR > 100 dB to extract bio-potentials", "Pan-Tompkins algorithm uses bandpass filtering, differentiation, squaring, and moving-window integration to identify QRS peaks"],
        practiceQuestions: [{
          id: "bio-pq-1", prompt: "What is the primary function of a Driven-Right-Leg (DRL) circuit in an electrocardiogram (ECG) monitor?",
          type: "multiple-choice", options: ["To actively invert and feedback common-mode body noise, canceling 50/60 Hz mains interference without saturating amplifiers", "To shock the patient's leg muscles", "To measure body temperature", "To ground the patient directly to earth ground without resistors"],
          correctAnswer: 0, explanation: "DRL samples the common-mode voltage from the lead resistors, inverts and amplifies it, and drives it back into the body. This reduces patient common-mode voltage by up to 40 dB."
        }],
        proofChallenge: {
          id: "bio-proof-1", title: "IEC 60601 Patient Leakage Current Compliance",
          scenario: "A medical ECG monitor design fails electrical safety testing because chassis leakage current exceeds 10 microamps.",
          questions: [{
            id: "bio-q1", prompt: "What circuit isolation boundary must separate the patient-connected front end from the AC mains power supply in medical devices?",
            options: ["Medical-grade galvanic isolation barrier (isolated DC-DC converter and optocouplers / digital isolators rated for 4 kV+)", "A standard plastic case", "A ground wire", "A 1-amp fuse"],
            correctAnswer: 0, explanation: "IEC 60601-1 mandates galvanic isolation between patient-applied parts and mains circuits to prevent micro-shock cardiac ventricular fibrillation."
          }],
          rubricGuidelines: ["Implement galvanic isolation", "Enforce patient leakage limits"]
        }
      }]
    }]
  }),

  // 15. Automotive Embedded Systems (CAN Bus & AUTOSAR) (ECE)
  buildCatalogCourse({
    id: "course-ece-automotive-can",
    slug: "automotive-embedded-can-bus-autosar",
    title: "Automotive Embedded Systems (CAN Bus & AUTOSAR)",
    tagline: "CAN, CAN-FD, LIN, FlexRay, AUTOSAR classic layered architecture, and ISO 26262 functional safety.",
    description: "Design mission-critical in-vehicle electronic control units (ECU). Master Controller Area Network (CAN) arbitration, differential physical layer (CAN_H / CAN_L), CAN-FD higher bitrates, LIN bus, AUTOSAR layered architecture (BSW, RTE, Application), and ISO 26262 ASIL safety levels.",
    category: "Electronics & Embedded (ECE)",
    difficulty: "Advanced",
    estimatedHours: 40,
    iconName: "Cpu",
    badgeColor: "amber",
    learningOutcomes: [
      "Understand non-destructive bitwise arbitration on multi-master CAN buses",
      "Decode CAN 2.0A/B and CAN-FD frame fields: Identifier, DLC, Data, CRC, and ACK",
      "Navigate AUTOSAR classic architecture: Microcontroller Abstraction Layer (MCAL), Basic Software (BSW), and Runtime Environment (RTE)",
      "Apply ISO 26262 functional safety processes and Automotive Safety Integrity Levels (ASIL A-D)",
    ],
    roadmapSlug: "embedded-systems",
    googleSkillsUrl: "https://developers.google.com/hardware",
    mindlusterUrl: "https://www.mindluster.com/certificate/can-bus",
    videoEmbedId: "k_C4_5Kx7Z5",
    videoTitle: "Automotive Embedded Systems & CAN Bus Masterclass",
    modules: [{
      id: "auto-mod-1", slug: "can-arbitration-autosar", title: "Module 1: CAN Protocol & Non-Destructive Arbitration", description: "Dominant vs recessive bits and bus arbitration.",
      lessons: [{
        id: "auto-les-1", slug: "can-bus-arbitration", title: "CAN Bus Bitwise Arbitration & Error Handling", summary: "Collision resolution without message destruction using dominant zero bits.",
        content: "CAN is a multi-master broadcast bus operating over twisted-pair wiring. In CAN logic, a '0' is Dominant (transceivers drive CAN_H high and CAN_L low) and a '1' is Recessive (passive termination resistors pull the bus to 2.5V).\n\nIf two ECUs transmit simultaneously, they read back every transmitted bit. When an ECU transmitting a recessive 1 sees a dominant 0, it knows a higher-priority message is active, immediately halts transmission without destroying the higher-priority packet, and retries later.",
        keyTakeaways: ["Lower numerical message identifier (e.g. 0x100 vs 0x200) has strictly higher arbitration priority on CAN", "120-ohm termination resistors at both physical ends of the bus prevent transmission line signal reflections"],
        practiceQuestions: [{
          id: "can-pq-1", prompt: "In automotive CAN bus communication, what happens when two ECUs transmit simultaneously and ECU A transmits ID 0x120 while ECU B transmits ID 0x125?",
          type: "multiple-choice", options: ["ECU A wins arbitration because its identifier has a dominant 0 bit where ECU B has a recessive 1 bit; ECU B backs off gracefully", "Both packets collide and are destroyed", "The bus shuts down", "The ECU with the highest serial number wins"],
          correctAnswer: 0, explanation: "In CAN arbitration, dominant '0' overwrites recessive '1'. Comparing bit patterns, ECU A (0x120 = ...000) has dominant zero bits earlier than ECU B (0x125 = ...101), winning arbitration without collision."
        }],
        proofChallenge: {
          id: "can-proof-1", title: "CAN Node Bus-Off State from Noise Burst",
          scenario: "An electric power steering ECU disconnects from the CAN network and transitions into the fatal `Bus-Off` state after driving through an ignition EMI noise burst.",
          questions: [{
            id: "can-q1", prompt: "What internal CAN controller counter triggers the Bus-Off state when errors exceed 255?",
            options: ["Transmit Error Counter (TEC > 255)", "Receive Packet Counter", "Baud rate register", "CAN clock prescaler"],
            correctAnswer: 0, explanation: "CAN controllers feature fault confinement. If repeated transmit errors push the Transmit Error Counter (TEC) past 255, the node enters Bus-Off, disconnecting its transceiver to prevent paralyzing the vehicle bus."
          }],
          rubricGuidelines: ["Analyze CAN fault confinement", "Recover from Bus-Off condition"]
        }
      }]
    }]
  }),

  // 16. Assembly Language & x86-64 Low-Level Systems (CSE)
  buildCatalogCourse({
    id: "course-cse-assembly-x86",
    slug: "assembly-language-x86-64-systems",
    title: "Assembly Language & x86-64 Systems",
    tagline: "Registers, stack frames, calling conventions, machine instructions, and SIMD AVX.",
    description: "Master the machine instructions executed directly by CPUs. Learn x86-64 general-purpose registers (RAX, RBX, RCX, RDX, RSI, RDI, RSP, RBP), System V AMD64 calling convention, stack frame alignment, bit manipulation, SIMD vectorization (AVX-512), and inline assembly.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 42,
    iconName: "Binary",
    badgeColor: "blue",
    learningOutcomes: [
      "Read and write clean x86-64 assembly in Intel and AT&T syntaxes using NASM",
      "Trace C compiler function prologues, epilogues, and stack frame memory layouts",
      "Implement the System V calling convention passing arguments via registers",
      "Vectorize parallel loops using AVX2 and AVX-512 SIMD instructions",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/assembly-language",
    videoEmbedId: "k_C5_6Kx8Z6",
    videoTitle: "x86-64 Assembly Language Complete Programming Course",
    modules: [{
      id: "asm-mod-1", slug: "registers-stack-calling", title: "Module 1: Registers, Calling Conventions & Stack", description: "RBP/RSP stack frames and System V AMD64 ABI.",
      lessons: [{
        id: "asm-les-1", slug: "x86-calling-convention", title: "System V AMD64 Calling Convention & Stack Alignment", summary: "Passing function arguments in registers and preserving callee-saved registers.",
        content: "Under the System V AMD64 ABI (Linux/macOS), the first 6 integer/pointer arguments are passed directly in CPU registers rather than on the stack:\n1: RDI, 2: RSI, 3: RDX, 4: RCX, 5: R8, 6: R9\nReturn values are placed in RAX. The stack pointer RSP must be 16-byte aligned before any `call` instruction to comply with SSE/AVX vector requirements.",
        keyTakeaways: ["Callee-saved registers (RBX, RBP, R12-R15) must be restored before returning to the caller", "Caller-saved registers (RAX, RCX, RDX, RSI, RDI, R8-R11) can be overwritten freely by the called function"],
        practiceQuestions: [{
          id: "asm-pq-1", prompt: "In 64-bit Linux x86-64 calling conventions, which register holds the FIRST integer argument passed to a function?",
          type: "multiple-choice", options: ["RDI", "RAX", "RSP", "EAX"],
          correctAnswer: 0, explanation: "The System V AMD64 calling convention passes the first integer argument in RDI, the second in RSI, and the third in RDX."
        }],
        proofChallenge: {
          id: "asm-proof-1", title: "Segmentation Fault on `movaps` Instruction",
          scenario: "A handwritten assembly routine crashes with a SIGSEGV segmentation fault when executing `movaps [rsp], xmm0`.",
          questions: [{
            id: "asm-q1", prompt: "Why does `movaps` (Move Aligned Packed Single-Precision) trigger a processor exception on misaligned memory?",
            options: ["The target memory address in RSP is not 16-byte aligned", "The processor does not support floating point", "XMM0 is full", "RSP is pointing to read-only ROM"],
            correctAnswer: 0, explanation: "Aligned SIMD instructions like movaps enforce strict 16-byte address alignment. If RSP is not a multiple of 16, a General Protection Fault (#GP) is raised."
          }],
          rubricGuidelines: ["Verify 16-byte stack alignment", "Enforce ABI compliance"]
        }
      }]
    }]
  }),

  // 17. Web Protocols Deep Dive (HTTP/3, WebSockets, gRPC) (CSE)
  buildCatalogCourse({
    id: "course-cse-web-protocols",
    slug: "web-protocols-http3-websockets-grpc",
    title: "Web Protocols: HTTP/3, WebSockets & gRPC",
    tagline: "QUIC UDP transport, multiplexing, binary framing, bidirectional streaming, and Protobuf.",
    description: "Modern network communication layers powering responsive web applications and microservices. Compare HTTP/1.1 vs HTTP/2 binary framing vs HTTP/3 over QUIC UDP. Master Head-of-Line blocking elimination, 0-RTT handshakes, persistent WebSockets, and gRPC streaming.",
    category: "Computer Science (CSE)",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Globe",
    badgeColor: "indigo",
    learningOutcomes: [
      "Explain how HTTP/3 over QUIC (UDP) eliminates TCP Head-of-Line blocking across packet loss",
      "Implement persistent bidirectional real-time channels using WebSockets",
      "Define type-safe binary microservice contracts with Protocol Buffers (Protobuf v3)",
      "Build unary, client-streaming, server-streaming, and bidirectional gRPC services",
    ],
    roadmapSlug: "backend",
    googleSkillsUrl: "https://developers.google.com/edu",
    mindlusterUrl: "https://www.mindluster.com/certificate/web-protocols",
    videoEmbedId: "k_C6_7Kx9Z7",
    videoTitle: "Modern Web Protocols & HTTP/3 Complete Masterclass",
    modules: [{
      id: "wp-mod-1", slug: "quic-and-grpc", title: "Module 1: HTTP/3 QUIC & gRPC RPCs", description: "QUIC stream multiplexing and binary protocol buffers.",
      lessons: [{
        id: "wp-les-1", slug: "http3-quic-head-of-line", title: "HTTP/3, QUIC Transport & Head-of-Line Blocking", summary: "Replacing TCP with UDP-based encrypted multiplexed transport.",
        content: "In HTTP/2, multiple logical requests are multiplexed over a single TCP connection. If a single TCP packet is dropped by an intermediate router, TCP halts delivery of ALL multiplexed streams until that missing packet is retransmitted (TCP Head-of-Line Blocking).\n\nHTTP/3 runs on top of QUIC (built over UDP). In QUIC, packet loss on Stream A only delays Stream A; Streams B and C continue receiving data without stalling.",
        keyTakeaways: ["QUIC integrates TLS 1.3 encryption directly into the transport layer, achieving 0-RTT connection re-establishment", "gRPC uses binary Protocol Buffers over HTTP/2, achieving 7-10x faster serialization than text JSON"],
        practiceQuestions: [{
          id: "wp-pq-1", prompt: "How does HTTP/3 (QUIC) resolve the TCP Head-of-Line blocking issue present in HTTP/2?",
          type: "multiple-choice", options: ["By using independent multiplexed streams over UDP; packet loss on one stream does not pause or block other streams", "By banning images on web pages", "By increasing TCP window size to infinity", "By sending all data twice"],
          correctAnswer: 0, explanation: "Because QUIC operates over UDP, stream tracking is managed at the transport layer. Dropping a packet in one stream leaves all other concurrent streams streaming uninterrupted."
        }],
        proofChallenge: {
          id: "wp-proof-1", title: "Mobile Device Network Handover Dropping Connections",
          scenario: "A user streaming video steps out of their house, switching from home Wi-Fi to cellular LTE; TCP connections break immediately.",
          questions: [{
            id: "wp-q1", prompt: "What feature of QUIC allows connections to survive IP address changes without renegotiating handshakes?",
            options: ["Connection IDs (opaque 64-bit token independent of client IP/Port)", "Cookies", "DNS caching", "Rebooting the phone"],
            correctAnswer: 0, explanation: "TCP connections are bound to the 4-tuple (Src IP, Src Port, Dst IP, Dst Port). QUIC uses Connection IDs; even if client IP shifts between Wi-Fi and LTE, the connection continues seamlessly."
          }],
          rubricGuidelines: ["Analyze connection migration in QUIC", "Compare TCP vs UDP socket bindings"]
        }
      }]
    }]
  }),

  // 18. High-Performance Computing (HPC) with MPI & OpenMP (CSE)
  buildCatalogCourse({
    id: "course-cse-hpc-mpi",
    slug: "high-performance-computing-mpi-openmp",
    title: "High-Performance Computing (HPC) with MPI & OpenMP",
    tagline: "Supercomputing clusters, distributed memory MPI, shared memory OpenMP, and SIMD.",
    description: "Write massively parallel scientific and computing software scaling across thousands of CPU cores. Master shared-memory multithreading with OpenMP pragmas, distributed-memory message passing with MPI (Message Passing Interface), collective communications (MPI_Bcast, MPI_Reduce), and GPU offloading.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 40,
    iconName: "Cpu",
    badgeColor: "purple",
    learningOutcomes: [
      "Parallelize C/C++ loops using OpenMP shared-memory compiler directives (`#pragma omp parallel for`)",
      "Architect distributed-memory supercomputing applications using the MPI standard",
      "Optimize collective communications: MPI_Bcast, MPI_Scatter, MPI_Gather, and MPI_Allreduce",
      "Measure parallel speedup, scaling efficiency, and analyze Amdahl's Law limits",
    ],
    roadmapSlug: "computer-science",
    googleSkillsUrl: "https://cloud.google.com/hpc",
    mindlusterUrl: "https://www.mindluster.com/certificate/hpc-parallel-programming",
    videoEmbedId: "k_C7_8Kx0Z8",
    videoTitle: "High Performance Computing MPI & OpenMP Full Course",
    modules: [{
      id: "hpc-mod-1", slug: "mpi-openmp-hybrid", title: "Module 1: Distributed MPI & OpenMP Multithreading", description: "Message passing, reductions, and hybrid scaling.",
      lessons: [{
        id: "hpc-les-1", slug: "mpi-point-to-point-collectives", title: "MPI Collectives & Non-Blocking Communications", summary: "Broadcasting, scattering, gathering, and overlapping compute with MPI_Isend.",
        content: "In distributed-memory supercomputers, nodes have private RAM connected via high-speed InfiniBand networks. MPI coordinates processes through message passing. Point-to-point operations (`MPI_Send`/`MPI_Recv`) transfer data between pairs, while collective operations (`MPI_Bcast`, `MPI_Scatter`, `MPI_Reduce`) optimize multi-node distribution using balanced binomial trees.",
        keyTakeaways: ["Non-blocking communications (`MPI_Isend`, `MPI_Irecv`) allow computational loops to overlap with network data transfers", "Amdahl's Law dictates that parallel speedup is strictly bounded by the sequential serial fraction of the code"],
        practiceQuestions: [{
          id: "hpc-pq-1", prompt: "If 10% of a computational algorithm is strictly sequential and cannot be parallelized, what is the theoretical maximum speedup on an infinite number of CPU cores according to Amdahl's Law?",
          type: "multiple-choice", options: ["10x speedup (Speedup = 1 / (s + (1-s)/N) -> 1 / 0.1 = 10x)", "Infinity", "100x", "2x"],
          correctAnswer: 0, explanation: "Amdahl's Law states Speedup = 1 / (Serial_fraction + Parallel_fraction / N). As N approaches infinity, the parallel fraction term vanishes, leaving 1 / 0.1 = 10x maximum theoretical speedup."
        }],
        proofChallenge: {
          id: "hpc-proof-1", title: "False Sharing Degrading OpenMP Performance",
          scenario: "Adding OpenMP threads to compute an array reduction on an 8-core CPU makes the program run 4x SLOWER than single-threaded code.",
          questions: [{
            id: "hpc-q1", prompt: "What CPU cache architecture phenomenon causes threads writing to adjacent memory addresses to invalidate each other's L1 caches?",
            options: ["False Sharing (multiple cores writing to different variables located on the SAME 64-byte cache line)", "Cache overflow", "DRAM refresh stall", "Branch misprediction"],
            correctAnswer: 0, explanation: "When adjacent variables reside on the same 64-byte cache line, each thread's write invalidates the cache line on other cores (MESI protocol bouncing), causing massive bus snooping stalls."
          }],
          rubricGuidelines: ["Diagnose false sharing", "Pad variables to 64-byte cache boundaries"]
        }
      }]
    }]
  }),

  // 19. Cryptographic Engineering & PKI Infrastructure (CSE)
  buildCatalogCourse({
    id: "course-cse-cryptography",
    slug: "cryptographic-engineering-pki-infrastructure",
    title: "Cryptographic Engineering & PKI Infrastructure",
    tagline: "Symmetric AES, asymmetric RSA/ECC, SHA-256 hashing, digital signatures, and TLS 1.3.",
    description: "Implement mathematical security primitives correctly. Master symmetric ciphers (AES-GCM authenticated encryption), asymmetric key exchange (ECDH, RSA), cryptographic hashing (SHA-2/SHA-3), digital signatures (Ed25519), Public Key Infrastructure (X.509 certificates, CRL/OCSP), and TLS 1.3 handshakes.",
    category: "Computer Science (CSE)",
    difficulty: "Advanced",
    estimatedHours: 38,
    iconName: "ShieldCheck",
    badgeColor: "emerald",
    learningOutcomes: [
      "Distinguish stream and block ciphers and avoid dangerous Electronic Codebook (ECB) mode",
      "Deploy Authenticated Encryption with Associated Data (AEAD) using AES-256-GCM and ChaCha20-Poly1305",
      "Understand Elliptic Curve Cryptography (secp256k1, Curve25519) and Diffie-Hellman key exchanges",
      "Architect enterprise Public Key Infrastructure (Root CA, Intermediate CA, Certificate Revocation Lists)",
    ],
    roadmapSlug: "cyber-security",
    googleSkillsUrl: "https://cloud.google.com/security",
    mindlusterUrl: "https://www.mindluster.com/certificate/cryptography",
    videoEmbedId: "k_C8_9Kx1Z9",
    videoTitle: "Applied Cryptography & PKI Engineering Masterclass",
    modules: [{
      id: "crypto-mod-1", slug: "symmetric-asymmetric-pki", title: "Module 1: Authenticated Encryption & Elliptic Curves", description: "AES-GCM, ECDSA, and X.509 certificate chains.",
      lessons: [{
        id: "crypto-les-1", slug: "aes-gcm-aead-encryption", title: "AES-GCM Authenticated Encryption & Nonce Reuse Hazards", summary: "Providing confidentiality and tamper-proof message integrity simultaneously.",
        content: "Traditional encryption (like AES in CBC mode) only encrypts data; it does NOT verify that data was not altered in transit, leaving it vulnerable to padding oracle attacks. Authenticated Encryption with Associated Data (AEAD) modes like AES-GCM produce both ciphertext and a cryptographic authentication tag (GMAC).\n\nFATAL RULE: The Initialization Vector / Nonce in AES-GCM must NEVER be reused with the same key. Reusing a nonce completely compromises the authentication key, allowing attackers to forge arbitrary ciphertexts.",
        keyTakeaways: ["Never use ECB mode (leaks plaintext patterns as seen in the ECB Penguin)", "Digital signatures (ECDSA/Ed25519) prove both authenticity (who sent it) and non-repudiation"],
        practiceQuestions: [{
          id: "cry-pq-1", prompt: "What catastrophic security failure occurs if the same Nonce (Initialization Vector) is reused twice under the same AES-GCM encryption key?",
          type: "multiple-choice", options: ["The internal authentication subkey can be derived by an attacker, completely destroying authenticity and allowing forgery of valid ciphertexts", "The computer locks down", "The key changes automatically", "The ciphertext expands by 10x"],
          correctAnswer: 0, explanation: "Reusing a GCM nonce allows an attacker to XOR the ciphertexts to reveal plaintext XOR differences and solve a system of linear equations in GF(2^128) to recover the GHASH authentication key."
        }],
        proofChallenge: {
          id: "cry-proof-1", title: "TLS Certificate Chain Validation Failure",
          scenario: "An HTTPS API client rejects a server's valid SSL certificate with `unable to get local issuer certificate`.",
          questions: [{
            id: "cry-q1", prompt: "Why must servers transmit the Intermediate CA certificate alongside the leaf certificate during the TLS handshake?",
            options: ["Clients only store Root CAs in their local trust store; the server must provide the intermediate certificates to bridge the cryptographic trust chain", "To make the handshake slower", "Because leaf certificates have no public key", "To encrypt the IP address"],
            correctAnswer: 0, explanation: "Operating systems trust well-known Root CAs. Because intermediate CAs issue the actual server certificates, the server must transmit the intermediate bundle so the client can verify the mathematical signature chain up to the trusted root."
          }],
          rubricGuidelines: ["Audit X.509 certificate chains", "Verify intermediate issuer signatures"]
        }
      }]
    }]
  }),

  // 20. Deep Learning with TensorFlow & Keras (AIML)
  buildCatalogCourse({
    id: "course-aiml-tensorflow-keras",
    slug: "deep-learning-tensorflow-keras-architectures",
    title: "Deep Learning with TensorFlow & Keras",
    tagline: "Sequential/Functional APIs, CNNs, RNNs, transfer learning, and model deployment.",
    description: "Build, train, and export production deep learning models with TensorFlow 2.x and Keras. Covers tf.data high-performance pipelines, Custom Layers and Models (`tf.keras.Model`), Convolutional Neural Networks (ResNet, EfficientNet), Transfer Learning, and TensorFlow Serving.",
    category: "AI & ML",
    difficulty: "Beginner",
    estimatedHours: 35,
    iconName: "Brain",
    badgeColor: "amber",
    learningOutcomes: [
      "Construct flexible model architectures using the Keras Functional API",
      "Build high-throughput data ingestion pipelines with `tf.data.Dataset` (prefetch, cache, batch)",
      "Leverage pretrained weights via Transfer Learning and fine-tuning on domain data",
      "Export production models in SavedModel format and deploy on TensorFlow Serving",
    ],
    roadmapSlug: "ai-engineer",
    googleSkillsUrl: "https://developers.google.com/machine-learning",
    mindlusterUrl: "https://www.mindluster.com/certificate/tensorflow",
    videoEmbedId: "tPYj3fFJGjk",
    videoTitle: "TensorFlow 2.0 Complete Deep Learning Course",
    modules: [{
      id: "tfk-mod-1", slug: "transfer-learning-data", title: "Module 1: Transfer Learning & tf.data Pipelines", description: "Fine-tuning pretrained models and dataset optimization.",
      lessons: [{
        id: "tfk-les-1", slug: "transfer-learning-finetuning", title: "Transfer Learning & Two-Phase Fine-Tuning", summary: "Freezing feature extraction backbones and unfreezing upper layers.",
        content: "Training massive deep networks from scratch requires millions of images. Transfer learning reuses a model (e.g. ResNet50 or EfficientNet) pretrained on ImageNet.\n\nTwo-Phase Strategy:\n1. Freeze the pretrained base (`base_model.trainable = False`), add a custom dense classification head, and train with a moderate learning rate (1e-3).\n2. Unfreeze top layers of the base model and fine-tune with a very small learning rate (1e-5) to avoid catastrophic forgetting of learned features.",
        keyTakeaways: ["Always use tf.data.AUTOTUNE for parallel prefetching to keep the GPU continuously fed with batches", "EarlyStopping with restore_best_weights=True prevents overfitting on small datasets"],
        practiceQuestions: [{
          id: "tfk-pq-1", prompt: "Why must a very small learning rate (e.g. 1e-5) be used during the second fine-tuning phase of transfer learning?",
          type: "multiple-choice", options: ["To prevent large gradient updates from destroying the delicate pretrained feature extraction weights (catastrophic forgetting)", "Because TensorFlow limits learning rate on GPUs", "To make training take longer", "Because learning rate has no effect on frozen layers"],
          correctAnswer: 0, explanation: "Large gradient steps would instantly overwrite and wreck the general image representations learned across millions of ImageNet samples."
        }],
        proofChallenge: {
          id: "tfk-proof-1", title: "GPU Starvation from Bottlenecked Data Pipeline",
          scenario: "GPU utilization sits at 15% because Python CPU data preprocessing cannot feed images fast enough.",
          questions: [{
            id: "tfk-q1", prompt: "Which `tf.data` method overlaps data preprocessing on the CPU with model training on the GPU?",
            options: ["`dataset.prefetch(buffer_size=tf.data.AUTOTUNE)`", "dataset.shuffle(100)", "dataset.repeat()", "dataset.take(5)"],
            correctAnswer: 0, explanation: "Prefetching decouples the producer (CPU preprocessing) from the consumer (GPU forward/backward pass), allowing the CPU to prepare the next batch while the GPU trains the current batch."
          }],
          rubricGuidelines: ["Optimize tf.data pipelines", "Maximize GPU utilization with prefetch"]
        }
      }]
    }]
  }),
];

