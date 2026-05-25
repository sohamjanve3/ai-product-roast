# 🔥 AI Product Roast

An interactive, brutally honest landing page & SaaS teardown tool designed for Product Managers, founders, and builders. Powered by the **Gemini Multimodal API**, it audits screenshots to point out conversion leaks, copy fails, and layout friction in real-time.

---

## ⚡ Features

### 1. Interactive Visual Teardown
Upload a screenshot and watch the teardown pop numbered hotspot markers directly onto your UI. Hovering over a pulsing badge displays a popup detailing a specific PM critique (e.g. hero headline readability, stripe billing friction, or visual clutter).
* **Demo Mode:** Click **Try Demo Roast** to test the dashboard offline with a mock SVG wireframe.

### 2. "Thinking Scanner" Lab
A premium scanning experience. A red laser sweep sweeps down your screenshot while a simulated terminal console logs real-time heuristic milestones (e.g. `[SCAN] Checking OCR copy readability...`, `[CRITICAL] Buzzword soup detected...`).

### 3. Gamified Viral Metrics
Visualize growth readiness with four distinct PM meters:
* **Startup Delusion Index:** Founder hype vs actual value proposition.
* **Buzzword Density:** Concentration of marketing-hype terms.
* **VC Bait Potential:** Likelihood of raising a round before closing down.
* **PM Sanity Score:** Funnel health from a product perspective.

### 4. Story-Driven Scorecards
Detailed ratings across key product dimensions (Value Prop, Visual Hierarchy, Cognitive Load, Trust/Credibility) with color-coded risk flags (`HEALTHY`, `WARNING`, `CRITICAL`) and descriptive interpretations.

### 5. Landscape PDF Presentation Deck
Export your report into a beautiful, presentation-ready **6-slide landscape PDF deck** with a single click. Ideal for sharing on LinkedIn, Substack, or with your product team.

### 6. Viral Copy Generator
Quickly generate opinionated post templates for LinkedIn and Substack featuring your teardown score and a copy-paste referral prompt.

---

## 🛠️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Gemini API Key](https://aistudio.google.com/) (to run live audits)

### 1. Clone & Install
```bash
git clone https://github.com/sohamjanve3/ai-product-roast.git
cd ai-product-roast
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```
Open the local URL output by Vite (usually `http://localhost:5173`) in your browser.

### 3. Build for Production
```bash
npm run build
```
This compiles the code into optimized, static HTML/JS/CSS assets in the `dist/` directory.

---

## 💻 Tech Stack
* **Framework:** React 18 + TypeScript + Vite
* **Styling:** Vanilla CSS (Tailored variables & @media print landscape rules)
* **Icons:** Lucide React
* **AI Model:** Gemini Multimodal (Computer Vision & Structured JSON schema response)

---

## 📄 License
This project is open-sourced under the MIT License.

---

## 👑 Created By
Designed and developed by **[Soham Janve](https://www.linkedin.com/in/sohamjanve)**. Feel free to connect on LinkedIn!
