# Project TODO

## Database Schema & Backend API
- [x] Design database schema for callConsoleSettings, trackerEntries, tradeBenchmarks, objectionResponses
- [x] Add businessId field to users table for multi-tenancy
- [x] Implement database CRUD operations for all tables
- [x] Create tRPC routers for callConsole, tracker, benchmarks, objections
- [x] Implement type-safe database queries with Drizzle ORM
- [x] Create comprehensive API documentation
- [x] Set up GitHub Actions CI/CD pipeline
- [x] Create Vercel configuration for frontend deployment
- [x] Create frontend development guide for Copilot

## Core UI Replication
- [x] Create CallConsole page component with tab structure
- [x] Scaffold all 6 tabs with basic layout
- [ ] Implement the 'Call Script' section (dynamic content).
- [ ] Implement the 'Leak Calculator' section (real-time calculations).
- [ ] Implement the 'Pilot Terms' generator section (dynamic script generation).
- [ ] Implement the 'Objections' handler section (accordion with filters).
- [ ] Implement the 'Day-30 Tracker' section (table + progress bar).
- [ ] Implement the 'My Numbers' section (margin calculations + projections).
- [x] Ensure privacy blur toggle matches original HTML behavior (scaffolded).
- [x] Ensure session timer matches original HTML behavior (implemented).
- [ ] Implement mobile-responsive layout (test and refine).

## User Management & Data Persistence
- [ ] Implement user authentication.
- [ ] Implement multi-tenant accounts for separate business data.
- [ ] Design database schema for calculator inputs, tracker entries, and margin settings.
- [ ] Implement persistent database storage for all user-specific data.

## Automation & AI
- [ ] Implement trade-specific benchmark presets (HVAC, plumbing, electrical) - Copilot task
- [ ] Implement AI-powered automated response suggestions for common objections - Future phase

## Business Dashboard
- [ ] Implement Day-30 pilot tracker with revenue capture logging.
- [ ] Implement progress bar toward retainer threshold.
- [ ] Implement adding-machine tape summary.
- [ ] Implement business owner dashboard showing active pilots.
- [ ] Implement business owner dashboard showing total captured revenue.
- [ ] Implement business owner dashboard showing monthly margin projections.
