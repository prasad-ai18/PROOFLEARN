# Contributing to PROOFLEARN

Thank you for your interest in contributing to **PROOFLEARN**! We welcome contributions that align with our core mission:
> *"AI should help students learn, not replace their ability to think."*

---

## 1. Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

---

## 2. Development Setup

### 2.1 Prerequisites
- **Node.js**: v20.x or higher
- **Python**: v3.12 or v3.14
- **Git**
- **Docker** (Optional, for containerized local execution)

### 2.2 Local Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/prasad-ai18/PROOFLEARN.git
   cd PROOFLEARN
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # On Windows (or source .venv/bin/activate on Unix)
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   ```

---

## 3. Branching & Commit Guidelines

- **Branch Naming**: Use descriptive prefixes:
  - `feat/feature-name`
  - `fix/bug-fix-name`
  - `docs/documentation-update`
  - `test/test-suite-expansion`
- **Commit Messages**: Follow Conventional Commits format:
  ```
  feat: add subject filter to curriculum selector
  fix: handle empty history items list gracefully
  test: add unit tests for LEI penalty boundary
  docs: update deployment architecture diagram
  ```

---

## 4. Code Quality & Testing Expectations

Before opening a Pull Request:

1. **Run Backend Test Suite**:
   ```bash
   cd backend
   .\.venv\Scripts\pytest.exe -v
   ```
   All unit, integration, and security tests must pass with 100% success rate.

2. **Run Frontend Linting & Build**:
   ```bash
   cd frontend
   npm run lint
   npm run build
   ```

3. **Security Standards**:
   - Never commit API keys, service role secrets, or passwords.
   - Never bypass server-side Proof Mode AI lockouts.
   - Ensure all database queries respect Supabase Row Level Security (RLS).

---

## 5. Submitting a Pull Request (PR)

1. Push your branch to GitHub.
2. Open a Pull Request against the `main` branch.
3. Describe the change, the problem it solves, and how it was tested.
4. Ensure all CI checks pass.
