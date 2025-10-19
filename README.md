<div align="center">

# ProofCore

### *Hybrid Mathematical Proof Verification Engine*

**Verification for Mathematicians, Students, and Researchers**

[![CI/CD](https://img.shields.io/github/actions/workflow/status/flamehaven/proofcore/ci.yml?branch=main&label=CI%2FCD&logo=github)](https://github.com/flamehaven/proofcore/actions)
[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)](https://github.com/flamehaven/proofcore/pkgs/container/proofcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-green?logo=python)](https://www.python.org/)

**[Demo](https://proofcore.io)** • **[Docs](https://proofcore.readthedocs.io)** • **[Storybook](https://flamehaven.github.io/proofcore/storybook)**

</div>

---

## What is ProofCore?

ProofCore is a **hybrid proof verification engine** that combines symbolic mathematics with AI-powered semantic understanding. Verify mathematical proofs with both rigor and intelligence.

### Why ProofCore?

Traditional proof verification is either:
- **Too Rigid**: Formal systems require perfect syntax
- **Too Shallow**: Syntax checkers miss semantic meaning
- **Too Slow**: Manual review doesn't scale

**ProofCore bridges this gap:**

```
70% Symbolic Verification  ---|
                              |---> Hybrid Intelligence
30% Semantic Evaluation    ---|
```

Real-world example: **Yu Tsumura Problem 554**
- Elementary school problem with 1 million+ solutions
- ProofCore verifies correctness + mathematical reasoning
- Works offline - no external APIs required

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Symbolic Verification** | SymPy + Pyodide in-browser computation, zero backend dependencies |
| **Semantic Analysis** | Multi-LLM consensus (GPT-4o, Claude, Gemini), optional - works offline |
| **Proof Graphs** | Dependency graph construction, circular reasoning detection |
| **Offline-First** | Works completely offline, LLM integration is optional |
| **Research-Grade** | Logic Integrity Index (0-100), confidence intervals |

---

## Quick Start

### Docker (Recommended)

```bash
docker run -p 3000:80 ghcr.io/flamehaven/proofcore:latest
```

Open [http://localhost:3000](http://localhost:3000)

### Local Development

```bash
# Clone repository
git clone https://github.com/flamehaven/proofcore.git
cd proofcore

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

### NPM Package

```bash
npm install @proofcore/engine
```

### Python Backend

```bash
pip install proofcore
```

---

## How It Works

### Step 1: Submit Proof

```typescript
const proof = {
  steps: [
    {
      content: "By assumption A, we have B",
      type: "derivation",
      dependencies: []
    },
    {
      content: "From B and C, we conclude D",
      type: "conclusion",
      dependencies: [0]
    }
  ]
};
```

### Step 2: Hybrid Verification

**Symbolic (70% weight):**
```python
# SymPy verification (in browser via Pyodide)
if lhs - rhs simplifies to 0:
    symbolic_score = 100
```

**Semantic (30% weight):**
```typescript
// Optional: Multi-LLM consensus
const scores = await Promise.allSettled([
  gpt4o.evaluate(proof),
  claude.evaluate(proof),
  gemini.evaluate(proof)
]);
// Offline mode: Uses heuristic (vague language detection, dependencies check)
```

### Step 3: Get Results

```json
{
  "valid": true,
  "score": 92,
  "confidence": [88, 96],
  "depth": 3,
  "cycles": 0,
  "errors": [],
  "graph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

---

## Architecture

```
Frontend (React 18 + TypeScript)
    |
    +---> Core Engines
    |     ├─ Symbolic Verifier (SymPy/WASM)
    |     ├─ Semantic Evaluator (LLM Consensus)
    |     └─ Graph Analyzer (Cycle Detection)
    |
    +---> Optional Backend API (FastAPI)
          ├─ Verification Service
          ├─ Database (PostgreSQL)
          └─ LLM Adapters (OpenAI, Anthropic, Google)
```

### Core Technologies

**Frontend:**
- React 18.3, TypeScript 5.5, Vite 5.3
- Emotion (CSS-in-JS), D3.js (graphs)
- TanStack Query (data fetching)

**Backend (Optional):**
- FastAPI, SQLAlchemy (async), asyncpg (PostgreSQL)
- SymPy (symbolic math), Pyodide (Python in WASM)

**DevOps:**
- Docker, GitHub Actions (CI/CD)
- Storybook (component documentation)

---

## Performance

| Metric | Value |
|--------|-------|
| Response Time | <500ms |
| Bundle Size | ~213 kB (gzipped: 69.8 kB) |
| Test Coverage | 85%+ |
| Python Version | 3.10+ |

---

## Project Structure

```
proofcore/
├── src/
│   ├── core/              # Verification engines
│   │   ├── proof_engine.ts
│   │   ├── symbolic_verifier.ts
│   │   ├── semantic_evaluator.ts
│   │   └── hybrid_engine.ts
│   ├── ai/                # LLM integration
│   ├── metrics/           # Scoring engine
│   ├── design-system/     # UI components
│   └── pages/             # Application pages
├── backend/               # FastAPI server (optional)
├── tests/                 # Test suites
├── .github/workflows/     # CI/CD pipelines
└── docker-compose.yml     # Local development
```

---

## Development

### Prerequisites
- Node.js 18+
- Python 3.10+ (optional, for backend)
- Docker (optional)

### Commands

```bash
# Development
npm run dev

# Testing
npm run test
npm run test:coverage

# Build
npm run build

# Linting
npm run lint
npm run format

# Documentation
npm run storybook
```

---

## Deployment

### Docker Production

```bash
docker build -t proofcore:latest .
docker run -p 3000:80 proofcore:latest
```

### GitHub Actions

Automatic on push to `main`:
1. Lint & Type Check
2. Frontend Tests
3. Backend Tests
4. Build Docker Image
5. Security Scan
6. Deploy to Production

---

## API Reference

### Verify Proof

```bash
POST /api/proofs/verify
Content-Type: application/json

{
  "text": "Mathematical proof text here..."
}
```

Response:
```json
{
  "valid": true,
  "score": 92,
  "confidence": [88, 96],
  "errors": [],
  "graph": {...}
}
```

### Get History

```bash
GET /api/proofs/history?limit=10
```

---

## Documentation

- **[User Guide](https://proofcore.readthedocs.io/)** - Getting started
- **[API Reference](https://proofcore.readthedocs.io/api/)** - Complete API docs
- **[Architecture](https://proofcore.readthedocs.io/architecture/)** - System design
- **[Storybook](https://flamehaven.github.io/proofcore/storybook)** - Component documentation

---

## Roadmap

### v1.0.0 (Current)
- [+] Core hybrid verification engine
- [+] Offline-first operation
- [+] Optional LLM integration
- [+] Graph visualization

### v1.1.0
- [ ] Proof templates library
- [ ] Advanced domain support
- [ ] Performance optimizations

### v2.0.0
- [ ] Real-time collaboration
- [ ] User authentication
- [ ] Proof versioning

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation
test: Tests
chore: Maintenance
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Support

- **GitHub Issues** - [Report bugs](https://github.com/flamehaven/proofcore/issues)
- **Discussions** - [Q&A and ideas](https://github.com/flamehaven/proofcore/discussions)
- **Email** - noreply@flamehaven.com

---

<div align="center">

**ProofCore**: Where Mathematics Meets Meaning

Built with care by [Flamehaven](https://github.com/flamehaven)

[Star on GitHub](https://github.com/flamehaven/proofcore) • [Report Bug](https://github.com/flamehaven/proofcore/issues) • [Request Feature](https://github.com/flamehaven/proofcore/issues)

</div>
