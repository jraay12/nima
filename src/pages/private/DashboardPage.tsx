import { useState } from "react";
import {
  Users,
  Archive,
  CalendarDays,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Dashboard } from "../../types";
import { useDashboard } from "../../features/dashboard/dashboard.hook";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YEARS = ["2026", "2025", "2024", "2023"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function totalAdded(monthly: number[]) {
  return monthly?.reduce((a, b) => a + b, 0);
}

function eventDotColor(type: string) {
  if (type === "Conference") return "bg-blue-400";
  if (type === "Workshop") return "bg-[#027027]";
  return "bg-amber-400";
}

function eventTagStyle(variant: "recent" | "upcoming") {
  return variant === "recent"
    ? "bg-green-50 text-green-700 border border-green-200"
    : "bg-blue-50 text-blue-700 border border-blue-200";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  iconColor: string;
  badge?: { text: string; up: boolean } | null;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {badge && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
          ${badge.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}
        >
          {badge.up ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {badge.text}
        </div>
      )}
    </div>
  );
}

function EventItem({
  event,
  variant,
}: {
  event: { title: string; event_date: string; badge: string };
  variant: "recent" | "upcoming";
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 last:pb-0">
      <div
        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${eventDotColor(event.badge)}`}
      />
      <div>
        <p className="text-sm font-semibold text-gray-800">{event.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {event.event_date
            ? new Date(event.event_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "No date"}
        </p>
        <span
          className={`mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${eventTagStyle(variant)}`}
        >
          {event.badge}
        </span>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-md text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-bold text-gray-900">{payload[0].value} members</p>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);
  const { data: dashboard } = useDashboard();

  const addedThis = totalAdded(dashboard?.monthly!);

  const monthlyChartData = MONTHS.map((month, i) => ({
    month,
    members: dashboard?.monthly[i],
  }));

  const donutData = [
    { name: "Active", value: dashboard?.active },
    { name: "Archived", value: dashboard?.archived },
  ];
  const DONUT_COLORS = ["#027027", "#d1d5db"];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">NIMANV member overview</p>
        </div>

        {/* Year selector */}
        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 text-sm font-medium border border-gray-200 rounded-xl bg-white text-gray-700 outline-none cursor-pointer
              focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 hover:border-gray-300 transition-all"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Active members"
          value={dashboard?.active!}
          iconColor="bg-[#ebf5ee] text-[#027027]"
        />
        <StatCard
          icon={Archive}
          label="Archived members"
          value={dashboard?.archived!}
          iconColor="bg-amber-50 text-amber-500"
        />
        <StatCard
          icon={CalendarDays}
          label="Total events"
          value={dashboard?.totalEvents!}
          iconColor="bg-blue-50 text-blue-500"
        />
        <StatCard
          icon={UserPlus}
          label="New this year"
          value={addedThis}
          iconColor="bg-pink-50 text-pink-500"
          badge={null}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900">
            Members added per month
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-5">
            Monthly breakdown for {year}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyChartData}
              barSize={22}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "#f9fafb", radius: 6 }}
              />
              <Bar dataKey="members" fill="#027027" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900">Member status</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            Active vs archived
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-col gap-2 mt-1">
            {donutData.map((entry, i) => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ background: DONUT_COLORS[i] }}
                  />
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {entry.value}{" "}
                  <span className="text-gray-400 font-normal">
                    (
                    {Math.round(
                      (entry.value! /
                        (dashboard?.active! + dashboard?.archived!)) *
                        100,
                    )}
                    %)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-0.5">
            Recent events
          </h2>
          <p className="text-xs text-gray-400 mb-3">Last completed events</p>
          {dashboard?.recent.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4">
              No recent events.
            </p>
          ) : (
            dashboard?.recent.map((e, i) => (
              <EventItem key={i} event={e} variant="recent" />
            ))
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-0.5">
            Upcoming events
          </h2>
          <p className="text-xs text-gray-400 mb-3">Next scheduled events</p>
          {dashboard?.upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4">
              No upcoming events for {year}.
            </p>
          ) : (
            dashboard?.upcoming.map((e, i) => (
              <EventItem key={i} event={e} variant="upcoming" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
