# SmartResume AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing page with hero, features, about, FAQ, contact sections
- Resume input form: Full Name, Email, Phone, Education, Skills, Projects, Work Experience, Career Objective
- "Generate Resume with AI" button that produces a formatted resume preview
- Multiple resume templates: Modern, Professional, Minimal
- Resume preview panel with professional formatting
- PDF download functionality (print-to-PDF via browser)
- AI suggestions for skills and career summary (client-side heuristics)
- Resume score/feedback section
- Save resume option (stored in backend)
- Responsive mobile + desktop layout
- Smooth animations, cards, icons, modern SaaS UI

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: Store saved resumes (user data + template choice + generated content). Expose create, read, update, delete resume operations.
2. Frontend:
   - Landing page: Hero with CTA, Features grid, About section, FAQ accordion, Contact section
   - Resume builder page: Multi-step or single-page form + template selector
   - Resume preview: Rendered HTML resume in selected template style
   - AI generation: Client-side logic that structures input into polished resume text
   - AI suggestions panel: Tips for improving skills/summary based on input
   - Resume score: Simple scoring based on completeness and keyword density
   - PDF download: window.print() with print-specific CSS targeting the resume preview
   - Save: Persist to backend canister
