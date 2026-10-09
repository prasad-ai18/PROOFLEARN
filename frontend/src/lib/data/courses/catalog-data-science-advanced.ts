import { buildCatalogCourse } from "../course-builder";
import type { Course } from "../course-types";

export const DATA_SCIENCE_ADVANCED_COURSES: Course[] = [
  // 1. Apache Spark & PySpark Big Data Processing
  buildCatalogCourse({
    id: "course-ds-pyspark",
    slug: "apache-spark-pyspark-big-data",
    title: "Apache Spark & PySpark: Big Data Processing",
    tagline: "Process terabytes of distributed data with Spark DataFrames, Catalyst Optimizer, and RDDs.",
    description: "Master distributed computing with Apache Spark and PySpark. Learn resilient distributed datasets (RDD), DataFrames/Datasets, Catalyst query optimizer, Tungsten execution engine, broadcast joins, window functions, and Spark Structured Streaming.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 42,
    iconName: "BarChart3",
    badgeColor: "orange",
    learningOutcomes: [
      "Understand Spark distributed architecture: Driver, Cluster Manager, and Executors",
      "Optimize query plans by inspecting `df.explain(extended=True)` Catalyst logical/physical plans",
      "Eliminate shuffle overhead using Broadcast Hash Joins and bucketed tables",
      "Process streaming data with micro-batches in Spark Structured Streaming",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/dataproc",
    mindlusterUrl: "https://www.mindluster.com/certificate/apache-spark",
    videoEmbedId: "_C8kWso4ne4",
    videoTitle: "Apache Spark & PySpark Complete Big Data Masterclass",
    modules: [
      {
        id: "ds-spark-mod-1",
        slug: "spark-optimization-shuffles",
        title: "Module 1: Catalyst Optimizer & Shuffle Management",
        description: "Execution plans, wide vs narrow transformations, and data skew.",
        lessons: [
          {
            id: "ds-spark-les-1",
            slug: "catalyst-optimizer-joins",
            title: "Catalyst Optimizer & Broadcast Hash Joins",
            summary: "Avoiding expensive cross-cluster network shuffles by broadcasting small lookup tables.",
            content: "Transformations in Spark are either Narrow (map, filter — computed within local executor partitions without network transfer) or Wide (groupBy, join, distinct — requiring an expensive shuffle across cluster network nodes).\n\nWhen joining a huge 100M-row dataset with a small 10,000-row dimension table, a SortMergeJoin requires hashing and shuffling both datasets across the network. A Broadcast Hash Join copies the small table to every executor, completely eliminating network shuffle.",
            keyTakeaways: [
              "Wide transformations trigger stage boundaries and disk/network shuffles in the Spark DAG",
              "Use `broadcast(small_df)` when one table is under spark.sql.autoBroadcastJoinThreshold (default 10MB)",
              "Salting keys with random integers mitigates severe data skew where a single partition stalls an entire job",
            ],
            practiceQuestions: [
              {
                id: "spark-pq-1",
                prompt: "Why is a Broadcast Hash Join dramatically faster than a Sort-Merge Join when joining a 1 TB transaction table with a 5 MB category table?",
                type: "multiple-choice",
                options: [
                  "It broadcasts the 5 MB table to all executors in memory, allowing executors to perform local joins without sorting or shuffling the 1 TB dataset over the network",
                  "It deletes duplicate rows automatically",
                  "It runs on the CPU cache without touching RAM",
                  "It converts the Spark job to run on a single machine",
                ],
                correctAnswer: 0,
                explanation: "Sort-Merge Joins require hashing and redistributing both tables across the network so identical keys land on the same node. Broadcasting the small table allows every executor to stream its local slice of the 1 TB table against the in-memory lookup table with zero network shuffle.",
              },
            ],
            proofChallenge: {
              id: "spark-proof-1",
              title: "Out-Of-Memory (OOM) Container Killed on Skewed Key",
              scenario: "A PySpark job fails repeatedly with `ExecutorLostFailure (Container killed by YARN for exceeding memory limits)` during a `groupBy('country')` aggregation where 90% of rows have country = 'US'.",
              questions: [
                {
                  id: "spark-proof-q1",
                  prompt: "What technique distributes the skewed 'US' key across multiple partitions to prevent a single executor from crashing with OOM?",
                  options: [
                    "Key Salting (appending a random suffix 0-N to the skewed key before grouping, aggregating in two phases)",
                    "Disabling the garbage collector",
                    "Converting the DataFrame to a Python list using collect()",
                    "Reducing executor memory to 512 MB",
                  ],
                  correctAnswer: 0,
                  explanation: "Key salting appends a random integer (e.g. `concat(country, '_', floor(rand() * 10))`) to spread the heavy 'US' keys evenly across 10 partitions. A two-stage aggregation rolls up the salted partitions and then performs a final sum.",
                },
              ],
              rubricGuidelines: ["Identify data skew", "Apply salting technique"],
            },
          },
        ],
      },
    ],
  }),

  // 2. Databricks Lakehouse & Delta Lake
  buildCatalogCourse({
    id: "course-ds-databricks",
    slug: "databricks-lakehouse-delta-lake",
    title: "Databricks Lakehouse & Delta Lake Architecture",
    tagline: "Medallion architecture (Bronze, Silver, Gold), ACID transactions, and Time Travel.",
    description: "Master modern lakehouse architecture with Databricks and Delta Lake. Learn ACID transactions on object storage, Delta transaction log (_delta_log), Medallion data engineering patterns (Bronze raw, Silver cleaned, Gold aggregated), Delta Live Tables (DLT), and Unity Catalog governance.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 38,
    iconName: "Layers",
    badgeColor: "rose",
    learningOutcomes: [
      "Explain how Delta Lake brings ACID transactions to Apache Parquet files on cloud storage",
      "Implement the Medallion Architecture: Bronze (ingest), Silver (curate), and Gold (business KPIs)",
      "Query historical snapshots using Delta Time Travel (`VERSION AS OF` / `TIMESTAMP AS OF`)",
      "Optimize query performance with Z-Ordering clustering and OPTIMIZE compaction commands",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/solutions/data-lake",
    mindlusterUrl: "https://www.mindluster.com/certificate/databricks",
    videoEmbedId: "N1C_K7c26E8",
    videoTitle: "Databricks and Delta Lake Architecture Complete Course",
    modules: [
      {
        id: "ds-dbx-mod-1",
        slug: "delta-acid-medallion",
        title: "Module 1: Delta Transaction Log & Medallion Design",
        description: "ACID guarantees on Parquet files, transaction logs, and compaction.",
        lessons: [
          {
            id: "ds-dbx-les-1",
            slug: "delta-transaction-log",
            title: "Delta Lake Transaction Log & Time Travel",
            summary: "Single source of truth JSON commit logs and zero-copy historical versioning.",
            content: "Delta Lake stores data as standard Apache Parquet files accompanied by a `_delta_log/` directory containing ordered JSON commit records (000000.json, 000001.json). Every commit records added and removed Parquet files atomically.\n\nBecause previous Parquet files are never overwritten in place, users can query earlier table versions seamlessly using Time Travel:\n`SELECT * FROM orders VERSION AS OF 12;`",
            keyTakeaways: [
              "Optimistic Concurrency Control (OCC) ensures serializable ACID transactions without database table locking",
              "Checkpoint Parquet files consolidate every 10 JSON commits to accelerate table state reads",
              "`OPTIMIZE table ZORDER BY (col)` packs small files and co-locates multidimensional data for fast partition pruning",
            ],
            practiceQuestions: [
              {
                id: "dbx-pq-1",
                prompt: "How does Delta Lake achieve ACID transactions on top of immutable cloud object storage like AWS S3 or Google Cloud Storage?",
                type: "multiple-choice",
                options: [
                  "By maintaining an ordered, atomic transaction log (_delta_log) that records all file additions and deletions, using optimistic concurrency control",
                  "By converting object storage into an Oracle database",
                  "By storing all data in Redis cache",
                  "By locking the entire bucket during every write",
                ],
                correctAnswer: 0,
                explanation: "The transaction log is the single source of truth. Writers atomically commit new files to the log; readers parse the log to read only verified committed files, ignoring uncommitted or partial uploads.",
              },
            ],
            proofChallenge: {
              id: "dbx-proof-1",
              title: "Slow Query Performance from Small File Problem",
              scenario: "A streaming ingestion pipeline writes thousands of tiny 50 KB Parquet files every hour, causing downstream dashboard queries to crawl.",
              questions: [
                {
                  id: "dbx-proof-q1",
                  prompt: "Which Delta Lake command consolidates small Parquet files into optimal 1 GB files without interrupting concurrent readers?",
                  options: [
                    "`OPTIMIZE table_name`",
                    "`DELETE FROM table_name`",
                    "`DROP TABLE table_name`",
                    "`TRUNCATE table_name`",
                  ],
                  correctAnswer: 0,
                  explanation: "The `OPTIMIZE` command bins small files into large ~1GB Parquet files and records the change atomically in the transaction log, allowing readers to read fewer files with massive I/O savings.",
                },
              ],
              rubricGuidelines: ["Identify small file problem", "Execute Delta OPTIMIZE"],
            },
          },
        ],
      },
    ],
  }),

  // 3. Snowflake Data Cloud & Data Warehousing
  buildCatalogCourse({
    id: "course-ds-snowflake",
    slug: "snowflake-cloud-data-warehouse",
    title: "Snowflake Data Cloud & Warehousing",
    tagline: "Multi-cluster shared data architecture, virtual warehouses, zero-copy cloning, and Snowpipe.",
    description: "Architect high-performance cloud analytics solutions with Snowflake. Learn the 3-layer decoupled architecture (Storage, Compute, Cloud Services), auto-scaling Virtual Warehouses, Zero-Copy Cloning, Micro-partitioning, Streams & Tasks, and continuous ingestion with Snowpipe.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Database",
    badgeColor: "sky",
    learningOutcomes: [
      "Understand Snowflake's decoupled storage and compute architecture",
      "Size and auto-scale Virtual Warehouses (T-shirt sizing XS to 4XL) to minimize cloud credit costs",
      "Instantaneously duplicate production environments using Zero-Copy Cloning",
      "Automate real-time CDC (Change Data Capture) pipelines with Snowflake Streams and Tasks",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/bigquery",
    mindlusterUrl: "https://www.mindluster.com/certificate/snowflake",
    videoEmbedId: "x0vQfBw2ZqM",
    videoTitle: "Snowflake Data Cloud Architecture Complete Masterclass",
    modules: [
      {
        id: "ds-snow-mod-1",
        slug: "snowflake-architecture-cloning",
        title: "Module 1: Decoupled Architecture & Zero-Copy Cloning",
        description: "Compute vs storage separation, micro-partitions, and metadata cloning.",
        lessons: [
          {
            id: "ds-snow-les-1",
            slug: "zero-copy-cloning-micropartitions",
            title: "Micro-Partitioning & Zero-Copy Cloning",
            summary: "Metadata-only table cloning without duplicating underlying storage bytes.",
            content: "In Snowflake, data is automatically stored in compressed, columnar micro-partitions (50-500MB uncompressed). When you execute `CREATE TABLE dev_orders CLONE prod_orders;`, Snowflake does NOT copy any physical data files. Instead, it merely clones the metadata pointers to the existing immutable micro-partitions, completing in seconds with zero extra storage cost.",
            keyTakeaways: [
              "Compute warehouses can be resized on the fly or suspended during idle periods without terminating running queries",
              "Zero-Copy Cloning enables instant production-like staging environments for testing without cloud storage penalties",
              "Snowpipe uses cloud storage event notifications (SQS/PubSub) to load files continuously into target tables as they land",
            ],
            practiceQuestions: [
              {
                id: "snow-pq-1",
                prompt: "Why does cloning a 50 TB production table in Snowflake (`CREATE TABLE staging CLONE prod;`) take only a few seconds?",
                type: "multiple-choice",
                options: [
                  "It only duplicates the metadata pointers in the Cloud Services layer without physically copying any underlying data blocks",
                  "It compresses all 50 TB into a 1 KB file",
                  "It skips all row data and copies only table schemas",
                  "It downloads the data to the client's laptop",
                ],
                correctAnswer: 0,
                explanation: "Snowflake micro-partitions are immutable. Zero-Copy Cloning creates a new metadata table that references the identical micro-partitions as the source table. Storage costs only accrue when rows in the clone are subsequently modified.",
              },
            ],
            proofChallenge: {
              id: "snow-proof-1",
              title: "Runaway Snowflake Warehouse Credit Burn",
              scenario: "An analytics team accidentally leaves an X-Large virtual warehouse running over the weekend with zero queries executing, burning hundreds of credits.",
              questions: [
                {
                  id: "snow-proof-q1",
                  prompt: "Which warehouse configuration parameters automatically shut down idle warehouses and restart them when queries arrive?",
                  options: [
                    "`AUTO_SUSPEND = 300` (suspend after 5 mins idle) and `AUTO_RESUME = TRUE`",
                    "`MAX_CONCURRENCY_LEVEL = 1`",
                    "`ENABLE_QUERY_ACCELERATION = FALSE`",
                    "Setting warehouse size to Small only",
                  ],
                  correctAnswer: 0,
                  explanation: "Configuring AUTO_SUSPEND automatically halts compute nodes when no queries have run for the specified number of seconds, and AUTO_RESUME powers them back up in milliseconds the instant a query is submitted.",
                },
              ],
              rubricGuidelines: ["Configure warehouse auto-suspend", "Optimize credit consumption"],
            },
          },
        ],
      },
    ],
  }),

  // 4. dbt (Data Build Tool) Modern Analytics Engineering
  buildCatalogCourse({
    id: "course-ds-dbt",
    slug: "dbt-data-build-tool-analytics-engineering",
    title: "dbt (Data Build Tool) Analytics Engineering",
    tagline: "Modular SQL transformations, version control, testing, and DAG lineage graphs.",
    description: "Transform data inside your warehouse using software engineering best practices. Master dbt models, Jinja templating, macros, generic tests (unique, not_null), sources/exposures, incremental materializations, and automated documentation DAG lineage.",
    category: "Data Science",
    difficulty: "Beginner",
    estimatedHours: 30,
    iconName: "Code",
    badgeColor: "amber",
    learningOutcomes: [
      "Structure modular SQL transformation models with `{{ ref('model_name') }}` dependencies",
      "Deploy incremental materializations with `is_incremental()` conditional logic to reduce warehouse costs",
      "Automate data quality testing with schema tests (unique, not_null, accepted_values, relationships)",
      "Write reusable Jinja macros to eliminate boilerplate repetitive SQL code",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/bigquery",
    mindlusterUrl: "https://www.mindluster.com/certificate/dbt-course",
    videoEmbedId: "M2W0d_xP2qM",
    videoTitle: "dbt Data Build Tool Complete Analytics Engineering Course",
    modules: [
      {
        id: "ds-dbt-mod-1",
        slug: "dbt-models-incremental",
        title: "Module 1: Ref Functions & Incremental Models",
        description: "DAG lineage, incremental runs, and schema testing.",
        lessons: [
          {
            id: "ds-dbt-les-1",
            slug: "dbt-ref-and-incremental",
            title: "The `ref()` Function & Incremental Materializations",
            summary: "Building lineage DAGs and transforming only new/updated records.",
            content: "In dbt, instead of hardcoding raw table names (`SELECT * FROM analytics.staging.stg_orders`), you reference upstream models using the Jinja function `{{ ref('stg_orders') }}`. dbt automatically infers the dependency Directed Acyclic Graph (DAG) and executes models in topological order.\n\nIncremental materializations rebuild only new or modified records:\n```sql\n{{ config(materialized='incremental') }}\nSELECT * FROM {{ ref('stg_events') }}\n{% if is_incremental() %}\n  WHERE event_timestamp > (SELECT max(event_timestamp) FROM {{ this }})\n{% endif %}\n```",
            keyTakeaways: [
              "The ref() function builds the DAG and interpolates the appropriate schema for dev vs prod environments",
              "Incremental materialization avoids re-scanning billions of historical rows, saving 90%+ warehouse compute time",
              "`dbt test` validates business assumptions before data lands in executive dashboard reporting tables",
            ],
            practiceQuestions: [
              {
                id: "dbt-pq-1",
                prompt: "Why should analytics engineers use `{{ ref('upstream_model') }}` instead of hardcoded table names in dbt SQL queries?",
                type: "multiple-choice",
                options: [
                  "dbt uses ref() to automatically construct the dependency graph (DAG), determine the correct execution order, and route queries to the correct target database/schema per environment",
                  "ref() makes SQL queries run 10x faster automatically",
                  "Hardcoded table names are illegal in modern SQL",
                  "ref() encrypts the table data",
                ],
                correctAnswer: 0,
                explanation: "The ref() function tells dbt which models depend on which other models. This allows `dbt run` to build models in proper sequence, run tests concurrently, and compile dev/staging/prod database prefixes dynamically.",
              },
            ],
            proofChallenge: {
              id: "dbt-proof-1",
              title: "Duplicate Primary Key Failure in Production",
              scenario: "A production analytics table generates duplicate customer IDs when an upstream source re-delivers webhook events.",
              questions: [
                {
                  id: "dbt-proof-q1",
                  prompt: "How can this issue be caught automatically in the CI pipeline before building production tables?",
                  options: [
                    "Add a `unique` test under the column in the `schema.yml` file and run `dbt test` in CI",
                    "Add a comment in the SQL file",
                    "Reboot the database",
                    "Switch from PostgreSQL to SQLite",
                  ],
                  correctAnswer: 0,
                  explanation: "Defining `tests: - unique - not_null` in the model's schema.yml causes `dbt test` to run an automated assertion query in CI, blocking merging if any duplicated keys exist.",
                },
              ],
              rubricGuidelines: ["Define generic dbt tests", "Enforce CI quality gates"],
            },
          },
        ],
      },
    ],
  }),

  // 5. Apache Airflow Data Pipeline Orchestration
  buildCatalogCourse({
    id: "course-ds-airflow",
    slug: "apache-airflow-data-orchestration",
    title: "Apache Airflow: Data Pipeline Orchestration",
    tagline: "Author, schedule, and monitor robust data workflows with Python DAGs.",
    description: "Industry-standard workflow orchestration. Master Airflow 2.x architecture (Scheduler, Webserver, Celery/Kubernetes Executors), Directed Acyclic Graphs (DAGs), Operators (Bash, Python, Postgres, BigQuery), Sensors, XComs, and TaskFlow API.",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedHours: 35,
    iconName: "Workflow",
    badgeColor: "indigo",
    learningOutcomes: [
      "Write clean Python DAGs using modern TaskFlow API (`@task` and `@dag` decorators)",
      "Configure retries, exponential backoffs, and alerting SLA callbacks",
      "Pass lightweight metadata between tasks using XComs (cross-communication)",
      "Scale task execution across worker nodes with Celery and Kubernetes Executors",
    ],
    roadmapSlug: "data-engineer",
    googleSkillsUrl: "https://cloud.google.com/composer",
    mindlusterUrl: "https://www.mindluster.com/certificate/apache-airflow",
    videoEmbedId: "K9AnJ9_B2qM",
    videoTitle: "Apache Airflow Complete Data Engineering Orchestration Course",
    modules: [
      {
        id: "ds-air-mod-1",
        slug: "taskflow-and-scheduling",
        title: "Module 1: TaskFlow API & Execution Models",
        description: "Decorators, execution dates, backfilling, and XComs.",
        lessons: [
          {
            id: "ds-air-les-1",
            slug: "taskflow-and-idempotency",
            title: "TaskFlow API & Pipeline Idempotency",
            summary: "Building deterministic, reproducible data pipelines with logical execution dates.",
            content: "In Airflow, pipelines are declared as Directed Acyclic Graphs (DAGs) in Python. Modern Airflow uses the TaskFlow API (`@dag` and `@task`), where return values automatically create XComs and dependencies are defined as Python function calls.\n\nGolden Rule of Orchestration: Pipeline tasks MUST be Idempotent — running a task multiple times with the same logical execution date (`data_interval_start`) must produce identical results without duplicating data.",
            keyTakeaways: [
              "Never use `datetime.now()` inside data transformation queries; use Airflow's logical execution date parameters",
              "XComs are designed for metadata (file paths, record counts, IDs), NOT for transferring multi-gigabyte pandas DataFrames",
              "Sensors (e.g. S3KeySensor, SqlSensor) wait for external files or conditions to be met before unblocking downstream tasks",
            ],
            practiceQuestions: [
              {
                id: "air-pq-1",
                prompt: "Why should data engineers NEVER pass a 2 GB Pandas DataFrame between Airflow tasks via XCom?",
                type: "multiple-choice",
                options: [
                  "XCom values are serialized into the Airflow metadata database (Postgres/MySQL); large objects bloat and crash the database backend",
                  "Airflow does not support Python objects",
                  "XCom deletes files automatically",
                  "Pandas is not compatible with Airflow",
                ],
                correctAnswer: 0,
                explanation: "XCom is stored directly in the relational metadata database. Passing large datasets overwhelms database memory and storage. Instead, tasks should write data to Cloud Storage (S3/GCS) and pass only the URI path string through XCom.",
              },
            ],
            proofChallenge: {
              id: "air-proof-1",
              title: "Sensor Deadlock Worker Starvation",
              scenario: "All 16 Celery worker slots in an Airflow cluster are permanently occupied by sleeping Sensors waiting for an FTP file, preventing all other DAGs from running.",
              questions: [
                {
                  id: "air-proof-q1",
                  prompt: "Which sensor configuration parameter frees up the worker slot while waiting between poke intervals?",
                  options: [
                    "`mode='reschedule'` instead of `mode='poke'`",
                    "`poke_interval = 1`",
                    "`timeout = 10`",
                    "Disabling the sensor",
                  ],
                  correctAnswer: 0,
                  explanation: "In default 'poke' mode, the sensor holds the worker slot continuously even while sleeping. Setting `mode='reschedule'` releases the worker process between checks and re-queues the sensor task, avoiding worker starvation.",
                },
              ],
              rubricGuidelines: ["Configure Airflow sensors", "Prevent worker slot starvation"],
            },
          },
        ],
      },
    ],
  }),
];
