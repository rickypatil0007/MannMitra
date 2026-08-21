"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { getRiskHistory } from "@/backend/actions/risk";
import { auth } from "@/frontend/lib/firebase";
import { Loader2 } from "lucide-react";

interface RiskGraphProps {
  refreshTrigger?: number; // pass a counter to force refresh if mood changes
}

export function RiskGraph({ refreshTrigger = 0 }: RiskGraphProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchRisk = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const res = await getRiskHistory(user.uid, 14); // get last 14 assessments
      if (res.success && res.records) {
        // Format for recharts
        const formatted = res.records.map((r: any) => ({
          date: new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          score: r.riskScore,
          band: r.riskBand
        }));
        setData(formatted);
      }
      setLoading(false);
    };

    setLoading(true);
    fetchRisk();
    
    interval = setInterval(() => {
      fetchRisk();
    }, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [refreshTrigger]);

  if (loading && data.length === 0) {
    return (
      <Card className="w-full h-80 flex items-center justify-center border-emerald-100 dark:border-emerald-900 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full border-emerald-100 dark:border-emerald-900 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Risk Insights</CardTitle>
          <CardDescription>Not enough data to calculate risk yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const latestScore = data[data.length - 1].score;
  let riskColor = "#10b981"; // green (LOW)
  if (latestScore >= 85) riskColor = "#ef4444"; // red (CRISIS)
  else if (latestScore >= 65) riskColor = "#f97316"; // orange (HIGH)
  else if (latestScore >= 40) riskColor = "#eab308"; // yellow (MODERATE)

  return (
    <Card className="w-full border-emerald-100 dark:border-emerald-900 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Psychological Risk Score
          <span className="text-xs font-normal px-2 py-1 rounded-full text-white" style={{ backgroundColor: riskColor }}>
            Current: {Math.round(latestScore)}
          </span>
        </CardTitle>
        <CardDescription>Real-time analysis derived from mood, planner, and conversations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={riskColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={riskColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="date" tick={{fontSize: 10}} tickMargin={10} strokeOpacity={0.2} />
              <YAxis domain={[0, 100]} tick={{fontSize: 10}} strokeOpacity={0.2} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [Math.round(value as number), "Score"]}
              />
              
              {/* Threshold Lines */}
              <ReferenceLine y={40} stroke="#eab308" strokeOpacity={0.3} strokeDasharray="3 3" />
              <ReferenceLine y={65} stroke="#f97316" strokeOpacity={0.3} strokeDasharray="3 3" />
              <ReferenceLine y={85} stroke="#ef4444" strokeOpacity={0.3} strokeDasharray="3 3" />
              
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={riskColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
