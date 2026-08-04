# Aurevo Frontend Development Guide for GitHub Copilot

This guide helps you build the Aurevo call console UI using GitHub Copilot. Follow these instructions to create high-quality, consistent React components.

## Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── CallConsole.tsx    ← Main console (partially scaffolded)
│   │   ├── Home.tsx           ← Landing page
│   │   └── NotFound.tsx       ← 404 page
│   ├── components/
│   │   ├── ui/                ← shadcn/ui components (pre-installed)
│   │   ├── DashboardLayout.tsx
│   │   └── ErrorBoundary.tsx
│   ├── lib/
│   │   └── trpc.ts            ← tRPC client
│   ├── App.tsx                ← Router
│   └── main.tsx               ← Entry point
```

## Design System

### Colors (from Tailwind + Custom CSS Variables)
- **Background:** `bg-slate-50` to `bg-slate-100`
- **Text:** `text-slate-900` (dark), `text-slate-600` (muted)
- **Accent:** `text-slate-900` (primary), `text-red-700` (alerts)
- **Borders:** `border-slate-300`

### Typography
- **Headings:** `font-semibold` or `font-bold`
- **Body:** `text-sm` or `text-base`
- **Labels:** `text-xs` with `uppercase` and `tracking-wider`

### Spacing
- Use Tailwind utilities: `p-4`, `mb-6`, `gap-4`, etc.
- Consistent padding: `p-6` for cards, `p-4` for sections

### Components
- Use **shadcn/ui** components: `Button`, `Input`, `Card`, `Tabs`, etc.
- Import from `@/components/ui/*`

---

## Key Features to Build

### 1. **Call Script Tab** ✅ (Scaffolded)
**Status:** Structure in place, needs refinement
**Tasks:**
- [ ] Add dynamic content injection from database
- [ ] Implement "Copy to Clipboard" for script sections
- [ ] Add note-taking sidebar for customization

### 2. **Leak Calculator Tab** (Priority)
**Status:** Input fields scaffolded
**Tasks:**
- [ ] Implement real-time calculations
- [ ] Add formula: `weekly = calls * ticket * (close/100)`
- [ ] Add formula: `monthly = weekly * weeks`
- [ ] Display results with currency formatting
- [ ] Add "Apply Benchmark" button to load HVAC/Plumbing/Electrical presets

**Copilot Prompt:**
```
Create a React component for the Leak Calculator tab that:
1. Has input fields for: Missed Calls/Week, Avg Ticket Size, Close Rate (%), Weeks/Month
2. Calculates weekly and monthly revenue loss in real-time
3. Displays results with $ formatting
4. Has a button to apply trade benchmarks (HVAC, Plumbing, Electrical)
5. Saves values to the database via trpc.callConsole.upsertSettings
6. Uses Tailwind CSS and shadcn/ui Button and Input components
```

### 3. **Pilot Terms Generator Tab** (Priority)
**Status:** Input fields scaffolded
**Tasks:**
- [ ] Implement setup fee and retainer inputs
- [ ] Generate closing script dynamically
- [ ] Display formatted script in a readable box
- [ ] Save to database

**Copilot Prompt:**
```
Create a React component for the Pilot Terms tab that:
1. Has input fields for: Setup Fee ($) and Monthly Retainer ($)
2. Generates a dynamic closing script using these values
3. Displays the generated script in a formatted box
4. Saves values to the database via trpc.callConsole.upsertSettings
5. Uses Tailwind CSS and shadcn/ui components
```

### 4. **Objections Handler Tab** (Medium)
**Status:** Basic structure in place
**Tasks:**
- [ ] Load objections from database
- [ ] Display as expandable accordion
- [ ] Add "Add New Objection" form
- [ ] Filter by trade (HVAC, Plumbing, Electrical)
- [ ] Filter by pain point (pricing, reliability, etc.)

**Copilot Prompt:**
```
Create a React component for the Objections tab that:
1. Loads objection responses from trpc.objections.getResponses
2. Displays them as expandable details/summary elements
3. Has filters for trade and pain point
4. Has a form to add new objections via trpc.objections.addResponse
5. Shows loading and error states
6. Uses Tailwind CSS and shadcn/ui components
```

### 5. **Day-30 Tracker Tab** (High Priority)
**Status:** Table scaffolded
**Tasks:**
- [ ] Implement add entry form (Date, Client, Note, Value)
- [ ] Display entries in a table with delete button
- [ ] Calculate total captured revenue
- [ ] Show progress bar toward retainer threshold
- [ ] Display adding-machine tape summary
- [ ] Flag important entries

**Copilot Prompt:**
```
Create a React component for the Day-30 Tracker tab that:
1. Has a form to add entries: Date (date picker), Client Name (text), Note (text), Value (number)
2. Displays entries in a table with columns: Date, Client, Note, Value, Delete button
3. Calculates total captured revenue
4. Shows a progress bar: (total / retainer) * 100%
5. Displays an adding-machine tape summary showing total
6. Loads entries from trpc.tracker.getEntries
7. Adds entries via trpc.tracker.addEntry
8. Deletes entries via trpc.tracker.deleteEntry
9. Uses Tailwind CSS and shadcn/ui components
```

### 6. **My Numbers Dashboard Tab** (High Priority)
**Status:** Structure scaffolded
**Tasks:**
- [ ] Implement privacy blur toggle
- [ ] Calculate day 1 net: `setup - buildcost`
- [ ] Calculate monthly margin: `retainer - cost`
- [ ] Calculate margin percentage: `(margin / retainer) * 100`
- [ ] Display projections: new revenue, recurring margin, total profit
- [ ] Blur sensitive numbers when toggle is on

**Copilot Prompt:**
```
Create a React component for the My Numbers tab that:
1. Has a privacy toggle button to blur/show sensitive numbers
2. Displays setup fee, build cost, and day 1 net
3. Displays monthly retainer, monthly cost, and monthly margin
4. Calculates and displays margin percentage
5. Has a projection section showing: new implementation revenue, recurring margin, total profit
6. Applies blur filter to all numbers when privacy toggle is ON
7. Saves values to the database via trpc.callConsole.upsertSettings
8. Uses Tailwind CSS and shadcn/ui components
```

---

## Implementation Checklist

### For Each Tab:
- [ ] Create component file in `client/src/pages/`
- [ ] Import necessary hooks: `useAuth()`, `trpc` queries/mutations
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add form validation (if applicable)
- [ ] Test with real data
- [ ] Add TypeScript types
- [ ] Test on mobile (responsive design)

### General:
- [ ] Session timer works (increments every second)
- [ ] Privacy blur toggle works
- [ ] Tab switching is smooth
- [ ] All calculations are accurate
- [ ] Data persists to database
- [ ] Mobile responsive (test at 375px width)
- [ ] No console errors

---

## Common Patterns

### Pattern 1: Query Data
```typescript
const { data, isLoading, error } = trpc.callConsole.getSettings.useQuery();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return <div>{data?.setup}</div>;
```

### Pattern 2: Mutate Data with Optimistic Update
```typescript
const mutation = trpc.callConsole.upsertSettings.useMutation({
  onSuccess: () => {
    trpc.useUtils().callConsole.getSettings.invalidate();
  },
  onError: (error) => {
    console.error("Failed to save:", error.message);
  },
});

const handleSave = (formData) => {
  mutation.mutate(formData);
};
```

### Pattern 3: Real-time Calculations
```typescript
const [calls, setCalls] = useState(settings?.calls || 0);
const [ticket, setTicket] = useState(settings?.ticket || 0);
const [close, setClose] = useState(settings?.close || 100);
const [weeks, setWeeks] = useState(settings?.weeks || 4.33);

const monthlyLeak = calls * ticket * (close / 100) * weeks;

useEffect(() => {
  // Debounce save to database
  const timer = setTimeout(() => {
    mutation.mutate({ calls, ticket, close, weeks });
  }, 1000);
  return () => clearTimeout(timer);
}, [calls, ticket, close, weeks]);
```

### Pattern 4: Currency Formatting
```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

// Usage: {formatCurrency(1500)} → $1,500.00
```

---

## Styling Guidelines

### Card Container
```typescript
<Card className="p-6">
  <h2 className="text-lg font-semibold mb-4">Section Title</h2>
  {/* Content */}
</Card>
```

### Form Inputs
```typescript
<div>
  <Label htmlFor="field">Field Label</Label>
  <Input
    id="field"
    type="number"
    placeholder="e.g. 1500"
    value={value}
    onChange={(e) => setValue(Number(e.target.value))}
  />
</div>
```

### Result Display
```typescript
<div className="bg-slate-50 p-4 rounded text-center">
  <p className="text-xs text-slate-600 uppercase">Label</p>
  <p className="text-2xl font-bold text-slate-900">${value}</p>
</div>
```

### Progress Bar
```typescript
<div className="w-full bg-slate-200 rounded-full h-2">
  <div
    className="bg-slate-900 h-2 rounded-full transition-all"
    style={{ width: `${progressPercent}%` }}
  ></div>
</div>
```

---

## Testing Checklist

Before pushing to GitHub:
1. [ ] All tabs load without errors
2. [ ] Calculations are accurate
3. [ ] Data saves to database
4. [ ] Data persists after page reload
5. [ ] Privacy blur toggle works
6. [ ] Session timer increments
7. [ ] Mobile layout is responsive
8. [ ] No TypeScript errors
9. [ ] No console errors or warnings
10. [ ] Forms validate inputs

---

## Deployment Flow

1. **Local Development:** Build and test locally
2. **Push to GitHub:** `git push origin feature-branch`
3. **GitHub Actions:** Automatically runs linting, type checking, and tests
4. **Vercel Preview:** Automatic preview deployment on PR
5. **Merge to Main:** Triggers production deployment to Vercel
6. **Manus WebDev:** Backend remains on Manus (no changes needed)

---

## Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **shadcn/ui Components:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **tRPC Documentation:** https://trpc.io/
- **React Hooks:** https://react.dev/reference/react/hooks

---

## Questions?

If you encounter issues:
1. Check the API documentation
2. Review the scaffolded CallConsole.tsx component
3. Check console errors in browser DevTools
4. Verify database connection in Manus WebDev
5. Ask GitHub Copilot for help with specific patterns

Good luck! 🚀
