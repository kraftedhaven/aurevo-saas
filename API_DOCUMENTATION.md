# Aurevo SaaS — Backend API Documentation

This document describes all available tRPC endpoints for the Aurevo call console application. Use this guide when building frontend components with GitHub Copilot.

## Authentication

All protected endpoints require the user to be authenticated via Manus OAuth. The `useAuth()` hook provides:
- `user`: Current authenticated user object
- `isAuthenticated`: Boolean flag
- `logout()`: Function to log out

## API Endpoints

### 1. Call Console Settings

#### Get Call Console Settings
```typescript
trpc.callConsole.getSettings.useQuery()
```
**Type:** Protected Query
**Returns:**
```typescript
{
  id: number;
  userId: number;
  calls: number;           // Missed calls per week
  ticket: number;          // Average ticket size ($)
  close: number;           // Close rate (%)
  weeks: number;           // Weeks per month
  setup: number;           // Setup fee ($)
  retainer: number;        // Monthly retainer ($)
  cost: number;            // Monthly cost ($)
  buildcost: number;       // Build cost ($)
  newclients: number;      // Expected new clients per month
  runningclients: number;  // Currently running clients
  numbersHidden: number;   // Privacy blur toggle (0 or 1)
  createdAt: Date;
  updatedAt: Date;
}
```

#### Upsert Call Console Settings
```typescript
trpc.callConsole.upsertSettings.useMutation()
```
**Type:** Protected Mutation
**Input:**
```typescript
{
  calls: number;
  ticket: number;
  close: number;
  weeks: number;
  setup: number;
  retainer: number;
  cost: number;
  buildcost: number;
  newclients: number;
  runningclients: number;
  numbersHidden: number;
}
```
**Usage Example:**
```typescript
const mutation = trpc.callConsole.upsertSettings.useMutation();
mutation.mutate({
  calls: 5,
  ticket: 1500,
  close: 80,
  weeks: 4.33,
  setup: 995,
  retainer: 500,
  cost: 100,
  buildcost: 200,
  newclients: 4,
  runningclients: 10,
  numbersHidden: 0,
});
```

---

### 2. Tracker Entries (Day-30 Pilot)

#### Get All Tracker Entries for Current User
```typescript
trpc.tracker.getEntries.useQuery()
```
**Type:** Protected Query
**Returns:**
```typescript
Array<{
  id: number;
  userId: number;
  date: string;           // e.g., "2026-08-04"
  client: string;         // Client name
  note: string;           // Optional note
  value: number;          // Revenue captured ($)
  flag: number;           // Flag status (0 or 1)
  createdAt: Date;
  updatedAt: Date;
}>
```

#### Add Tracker Entry
```typescript
trpc.tracker.addEntry.useMutation()
```
**Type:** Protected Mutation
**Input:**
```typescript
{
  date: string;           // "YYYY-MM-DD"
  client: string;
  note?: string;
  value: number;
  flag: number;           // 0 or 1
}
```
**Usage Example:**
```typescript
const addEntry = trpc.tracker.addEntry.useMutation();
addEntry.mutate({
  date: "2026-08-04",
  client: "Smith HVAC",
  note: "Emergency repair call",
  value: 2500,
  flag: 0,
});
```

#### Delete Tracker Entry
```typescript
trpc.tracker.deleteEntry.useMutation()
```
**Type:** Protected Mutation
**Input:**
```typescript
{
  id: number;
}
```

---

### 3. Trade Benchmarks

#### Get All Trade Benchmarks
```typescript
trpc.benchmarks.getBenchmarks.useQuery()
```
**Type:** Public Query
**Returns:**
```typescript
Array<{
  id: number;
  trade: string;          // "HVAC", "Plumbing", "Electrical"
  avgCalls: number;       // Average missed calls per week
  avgTicket: number;      // Average ticket size ($)
  avgClose: number;       // Average close rate (%)
  createdAt: Date;
  updatedAt: Date;
}>
```

#### Add Trade Benchmark
```typescript
trpc.benchmarks.addBenchmark.useMutation()
```
**Type:** Protected Mutation
**Input:**
```typescript
{
  trade: string;
  avgCalls: number;
  avgTicket: number;
  avgClose: number;
}
```
**Usage Example:**
```typescript
const addBenchmark = trpc.benchmarks.addBenchmark.useMutation();
addBenchmark.mutate({
  trade: "HVAC",
  avgCalls: 5,
  avgTicket: 1500,
  avgClose: 80,
});
```

---

### 4. Objection Responses

#### Get Objection Responses (Filtered)
```typescript
trpc.objections.getResponses.useQuery({ trade?, painPoint? })
```
**Type:** Public Query
**Input:**
```typescript
{
  trade?: string;         // Optional: "HVAC", "Plumbing", "Electrical"
  painPoint?: string;     // Optional: e.g., "pricing", "reliability"
}
```
**Returns:**
```typescript
Array<{
  id: number;
  objection: string;      // e.g., "It's too expensive"
  response: string;       // AI-generated or manual response
  trade?: string;         // Optional trade filter
  painPoint?: string;     // Optional pain point filter
  createdAt: Date;
  updatedAt: Date;
}>
```
**Usage Example:**
```typescript
const { data: objections } = trpc.objections.getResponses.useQuery({
  trade: "HVAC",
  painPoint: "pricing",
});
```

#### Add Objection Response
```typescript
trpc.objections.addResponse.useMutation()
```
**Type:** Protected Mutation
**Input:**
```typescript
{
  objection: string;
  response: string;
  trade?: string;
  painPoint?: string;
}
```
**Usage Example:**
```typescript
const addResponse = trpc.objections.addResponse.useMutation();
addResponse.mutate({
  objection: "It's too expensive",
  response: "I understand cost is a factor. But consider this: you're currently losing $X per month in missed calls. Our system captures that revenue and pays for itself in the first week.",
  trade: "HVAC",
  painPoint: "pricing",
});
```

---

## Frontend Integration Patterns

### Pattern 1: Load and Display Data
```typescript
const { data, isLoading, error } = trpc.callConsole.getSettings.useQuery();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return <div>{data?.setup}</div>;
```

### Pattern 2: Mutation with Optimistic Updates
```typescript
const mutation = trpc.callConsole.upsertSettings.useMutation({
  onSuccess: () => {
    // Invalidate query to refetch
    trpc.useUtils().callConsole.getSettings.invalidate();
  },
});

const handleSave = (formData) => {
  mutation.mutate(formData);
};
```

### Pattern 3: Real-time Calculations
```typescript
const [calls, setCalls] = useState(0);
const [ticket, setTicket] = useState(0);
const [close, setClose] = useState(100);
const [weeks, setWeeks] = useState(4.33);

const monthlyLeak = calls * ticket * (close / 100) * weeks;

return <div>${monthlyLeak}</div>;
```

---

## Common Use Cases

### Use Case 1: Calculate Monthly Revenue Loss
```typescript
const calculateMonthlyLeak = (calls: number, ticket: number, close: number, weeks: number) => {
  const weekly = calls * ticket * (close / 100);
  const monthly = weekly * weeks;
  return monthly;
};
```

### Use Case 2: Load Trade Benchmarks and Apply to Form
```typescript
const { data: benchmarks } = trpc.benchmarks.getBenchmarks.useQuery();

const hvacBenchmark = benchmarks?.find(b => b.trade === "HVAC");

const handleApplyBenchmark = () => {
  mutation.mutate({
    calls: hvacBenchmark?.avgCalls || 0,
    ticket: hvacBenchmark?.avgTicket || 0,
    close: hvacBenchmark?.avgClose || 0,
    // ... other fields
  });
};
```

### Use Case 3: Track Revenue and Calculate Progress
```typescript
const { data: entries } = trpc.tracker.getEntries.useQuery();
const { data: settings } = trpc.callConsole.getSettings.useQuery();

const totalCaptured = entries?.reduce((sum, e) => sum + e.value, 0) || 0;
const progressPercent = (totalCaptured / (settings?.retainer || 1)) * 100;

return <ProgressBar value={progressPercent} />;
```

---

## Error Handling

All mutations and queries can throw errors. Handle them gracefully:

```typescript
const mutation = trpc.callConsole.upsertSettings.useMutation({
  onError: (error) => {
    console.error("Failed to save settings:", error.message);
    // Show user-friendly error message
  },
});
```

---

## Notes for Frontend Development

1. **Always check `isAuthenticated`** before rendering protected content
2. **Use optimistic updates** for better UX on mutations
3. **Invalidate queries** after mutations to keep data in sync
4. **Handle loading and error states** in all components
5. **Use TypeScript** for type safety with tRPC
6. **Test with real data** by running the dev server and logging in

---

## Next Steps for Copilot

When building frontend components, reference this documentation and:
1. Import `trpc` from `@/lib/trpc`
2. Use `useAuth()` hook for authentication state
3. Call the appropriate tRPC query or mutation
4. Handle loading, error, and success states
5. Update UI based on returned data
6. Test calculations and data transformations

Good luck with frontend development! 🚀
