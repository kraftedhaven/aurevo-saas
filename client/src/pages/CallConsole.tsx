import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

/**
 * Aurevo Call Console - Multi-tab sales tool for service businesses
 * Tabs: Call Script, Leak Calculator, Pilot Terms, Objections, Day-30 Tracker, My Numbers
 */

export default function CallConsole() {
  const { user, isAuthenticated } = useAuth();
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [numbersHidden, setNumbersHidden] = useState(false);
  const [activeTab, setActiveTab] = useState("script");

  // Fetch call console settings
  const { data: settings, isLoading: settingsLoading } = trpc.callConsole.getSettings.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch tracker entries
  const { data: trackerEntries = [] } = trpc.tracker.getEntries.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch trade benchmarks
  const { data: benchmarks = [] } = trpc.benchmarks.getBenchmarks.useQuery();

  // Fetch objection responses
  const { data: objections = [] } = trpc.objections.getResponses.useQuery({});

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-lg font-semibold">Please log in to access the Call Console</p>
        </Card>
      </div>
    );
  }

  if (settingsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with branding and session timer */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Aurevo</h1>
            <p className="text-sm text-slate-600">Elevated Support — Overflow Capture Program</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 uppercase tracking-wider">Session Time</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{formatTime(sessionSeconds)}</p>
          </div>
        </div>

        {/* Tabs Container */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="script">01 Script</TabsTrigger>
            <TabsTrigger value="leak">02 Leak Calc</TabsTrigger>
            <TabsTrigger value="terms">03 Pilot Terms</TabsTrigger>
            <TabsTrigger value="objections">04 Objections</TabsTrigger>
            <TabsTrigger value="tracker">05 Day-30 Tracker</TabsTrigger>
            <TabsTrigger value="numbers">06 My Numbers 🔒</TabsTrigger>
          </TabsList>

          {/* TAB 1: Call Script */}
          <TabsContent value="script" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Call Sequence</h2>
              <div className="space-y-6">
                {/* Step 1: The Opening */}
                <div className="border-l-2 border-slate-300 pl-4">
                  <h3 className="text-base font-semibold mb-2">Step 1: The Opening</h3>
                  <div className="bg-slate-50 p-3 rounded mb-2 text-sm">
                    "Thanks for jumping on. Let's get right into it — what's the most expensive role in your business right now?"
                  </div>
                  <p className="text-xs text-slate-600 italic">Wait. Let them vent about payroll, turnover, or inefficiency.</p>
                </div>

                {/* Step 2: The Leak Math */}
                <div className="border-l-2 border-slate-300 pl-4">
                  <h3 className="text-base font-semibold mb-2">Step 2: The Leak Math</h3>
                  <div className="bg-slate-50 p-3 rounded mb-2 text-sm">
                    "That aligns with what I found. Based on the diagnostic we ran, you're currently missing around <span className="font-semibold">[X calls/week]</span> a week. With an average ticket size of <span className="font-semibold">[X]</span>, that means you are leaking roughly <span className="font-semibold">[X monthly]</span> in revenue every single month."
                  </div>
                  <p className="text-xs text-slate-600 italic">Numbers pull live from the Leak Calc tab once you fill it in.</p>
                </div>

                {/* Step 3: The 30-Day Pilot */}
                <div className="border-l-2 border-slate-300 pl-4">
                  <h3 className="text-base font-semibold mb-2">Step 3: The 30-Day Pilot</h3>
                  <div className="bg-slate-50 p-3 rounded mb-2 text-sm">
                    "Here's how we plug that leak immediately. We start with a 30-day pilot — fully cancelable at any time. We deploy the system to catch every overflow inquiry, and over the next month, we track the exact dollar amount of revenue it captures that you would have otherwise lost."
                  </div>
                </div>

                {/* Step 4: The Close */}
                <div className="border-l-2 border-slate-300 pl-4">
                  <h3 className="text-base font-semibold mb-2">Step 4: The Close</h3>
                  <div className="bg-slate-50 p-3 rounded mb-2 text-sm">
                    "Based on what we've walked through, the next step is straightforward..."
                  </div>
                  <p className="text-xs text-slate-600 italic">Generated from Pilot Terms tab.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: Leak Calculator */}
          <TabsContent value="leak" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Leak Calculator</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="calls">Missed Calls / Week</Label>
                  <Input id="calls" type="number" placeholder="e.g. 5" defaultValue={settings?.calls || ""} />
                </div>
                <div>
                  <Label htmlFor="ticket">Avg Ticket Size ($)</Label>
                  <Input id="ticket" type="number" placeholder="e.g. 1500" defaultValue={settings?.ticket || ""} />
                </div>
                <div>
                  <Label htmlFor="close">Close Rate (%)</Label>
                  <Input id="close" type="number" placeholder="e.g. 80" defaultValue={settings?.close || ""} />
                </div>
                <div>
                  <Label htmlFor="weeks">Weeks / Month</Label>
                  <Input id="weeks" type="number" placeholder="e.g. 4.33" defaultValue={settings?.weeks || ""} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-xs text-slate-600 uppercase">Weekly Revenue Loss</p>
                  <p className="text-2xl font-bold text-slate-900">$0</p>
                </div>
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-xs text-slate-600 uppercase">Monthly Revenue Loss</p>
                  <p className="text-2xl font-bold text-slate-900">$0</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: Pilot Terms */}
          <TabsContent value="terms" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Pilot Terms Generator</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="setup">Setup Fee ($)</Label>
                  <Input id="setup" type="number" placeholder="e.g. 995" defaultValue={settings?.setup || ""} />
                </div>
                <div>
                  <Label htmlFor="retainer">Monthly Retainer ($)</Label>
                  <Input id="retainer" type="number" placeholder="e.g. 500" defaultValue={settings?.retainer || ""} />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded mb-4">
                <h3 className="font-semibold mb-2">Generated Close Script</h3>
                <p className="text-sm text-slate-700">
                  "Based on what we've walked through, the next step is straightforward. To get this launched properly, there's a one-time <span className="font-semibold">[setup fee]</span> implementation fee today..."
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: Objections */}
          <TabsContent value="objections" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Objections Handler</h2>
              <div className="space-y-3">
                {objections.length > 0 ? (
                  objections.map((obj) => (
                    <details key={obj.id} className="border rounded p-3 cursor-pointer">
                      <summary className="font-semibold text-sm">{obj.objection}</summary>
                      <p className="text-sm text-slate-700 mt-2">{obj.response}</p>
                    </details>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No objections loaded. Use Copilot to add common objections.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* TAB 5: Day-30 Tracker */}
          <TabsContent value="tracker" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Day-30 Pilot Tracker</h2>

              {/* Add Entry Form */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                <Input type="date" placeholder="Date" />
                <Input type="text" placeholder="Client Name" />
                <Input type="text" placeholder="Note" />
                <Input type="number" placeholder="Value ($)" />
              </div>

              {/* Tracker Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Client</th>
                      <th className="text-left py-2">Note</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-center py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackerEntries.length > 0 ? (
                      trackerEntries.map((entry) => (
                        <tr key={entry.id} className="border-b">
                          <td className="py-2">{entry.date}</td>
                          <td className="py-2">{entry.client}</td>
                          <td className="py-2">{entry.note}</td>
                          <td className="text-right py-2">${entry.value}</td>
                          <td className="text-center py-2">
                            <button className="text-red-500 hover:text-red-700">✕</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-slate-600">
                          No entries yet. Start logging revenue captures.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <p className="text-xs text-slate-600 mb-2">Progress toward retainer threshold</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-slate-900 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              {/* Adding Machine Tape */}
              <div className="bg-white border-2 border-slate-300 p-4 rounded w-48 mx-auto text-center">
                <p className="text-xs text-slate-600 mb-2">TOTAL CAPTURED</p>
                <p className="text-3xl font-bold text-slate-900">$0</p>
                <p className="text-xs text-slate-600 mt-2">RETAINER STATUS</p>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 6: My Numbers */}
          <TabsContent value="numbers" className="space-y-6">
            <Card className="p-6">
              {/* Privacy Blur Toggle */}
              <div className="flex justify-between items-center mb-6 p-3 bg-red-50 rounded">
                <span className="text-sm font-semibold text-red-700">Sensitive Data</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNumbersHidden(!numbersHidden)}
                  className="text-red-700 border-red-700"
                >
                  {numbersHidden ? "SHOW NUMBERS" : "HIDE NUMBERS"}
                </Button>
              </div>

              <div className={numbersHidden ? "blur-lg" : ""}>
                <h2 className="text-lg font-semibold mb-4">My Numbers</h2>

                {/* Setup & Retainer */}
                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-sm">Setup Fee</span>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Build Cost</span>
                    <span className="font-semibold">−$0</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Day 1 Net</span>
                    <span>$0</span>
                  </div>
                </div>

                {/* Monthly Margin */}
                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Retainer</span>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-semibold">−$0</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Monthly Margin</span>
                    <span>$0</span>
                  </div>
                </div>

                {/* Projections */}
                <h3 className="font-semibold mb-4">Projection</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded text-center">
                    <p className="text-xs text-slate-600 uppercase">New Implementation Revenue / mo</p>
                    <p className="text-2xl font-bold text-slate-900">$0</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded text-center">
                    <p className="text-xs text-slate-600 uppercase">Recurring Margin / mo</p>
                    <p className="text-2xl font-bold text-slate-900">$0</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded text-center">
                    <p className="text-xs text-slate-600 uppercase">Total Profit / mo</p>
                    <p className="text-2xl font-bold text-slate-900">$0</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
