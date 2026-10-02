import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trendPct?: number;
  isPositiveTrend?: boolean;
  highlight?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trendPct,
  isPositiveTrend = true,
  highlight = false,
}) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  return (
    <div
      className={`p-5 rounded-xl border transition-all relative overflow-hidden ${
        highlight
          ? isDark
            ? 'bg-[#1F2B37] border-[#C87A54] ring-1 ring-[#C87A54]/50'
            : 'bg-white border-[#002D4A] ring-1 ring-[#002D4A]/50'
          : isDark
            ? 'bg-[#182129] border-[#2D3945]'
            : 'bg-white border-slate-200'
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${isDark ? 'bg-[#C87A54]' : 'bg-[#002D4A]'}`} />

      <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {title}
      </p>

      <div className="flex items-baseline justify-between mt-1">
        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h3>

        {trendPct !== undefined && (
          <span
            className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
              isPositiveTrend
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {isPositiveTrend ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trendPct}%
          </span>
        )}
      </div>

      {subtitle && <p className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
    </div>
  );
};
