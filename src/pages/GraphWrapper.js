import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Icon } from '../components/Component';
import './GraphWrapper.scss';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthsLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GraphWrapper = ({ graphData = [], weeklyInterest = [] }) => {
  // Normalize graphData safely without altering any data
  const safeGraphData = useMemo(() => {
    const list = Array.isArray(graphData) ? graphData : [];
    return monthsLabels.map((month, idx) => {
      const match = list[idx] || list.find(item => item?.month?.toLowerCase() === month.toLowerCase());
      return {
        month,
        invested: Number(match?.invested) || 0,
        withdrawn: Number(match?.withdrawn) || 0,
        deposited: Number(match?.deposited) || 0,
        interest: Number(match?.interest) || 0,
      };
    });
  }, [graphData]);

  // Normalize weeklyInterest safely without altering any data
  const safeWeeklyInterest = useMemo(() => {
    if (!Array.isArray(weeklyInterest) || weeklyInterest.length === 0) return [];
    return weeklyInterest.map(item => ({
      day: item?.day || '',
      interest: Number(item?.interest) || 0,
      time: item?.time,
    }));
  }, [weeklyInterest]);

  // 1. Existing Main Investment / Payout / Deposit / Investment Bonus Chart (Full Width)
  const annualLineChartData = {
    labels: monthsLabels,
    datasets: [
      {
        label: "Investment",
        borderColor: "#5ce0aa",
        backgroundColor: "rgba(92, 224, 170, 0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#0d1f14",
        pointBorderColor: "#5ce0aa",
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        data: safeGraphData.map(item => item.invested),
      },
      {
        label: "Deposite",
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#0a1924",
        pointBorderColor: "#38bdf8",
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        data: safeGraphData.map(item => item.deposited),
      },
      {
        label: "Payout",
        borderColor: "#ff5c75",
        backgroundColor: "rgba(255, 92, 117, 0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#240e12",
        pointBorderColor: "#ff5c75",
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        data: safeGraphData.map(item => item.withdrawn),
      },
      {
        label: "Investment Bonus",
        borderColor: "#f9db7b",
        backgroundColor: "rgba(249, 219, 123, 0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#241f0a",
        pointBorderColor: "#f9db7b",
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        data: safeGraphData.map(item => item.interest),
      },
    ],
  };

  // 2. Existing Weekly Interest Chart (Full Width)
  const weeklyInterestLineData = {
    labels: safeWeeklyInterest.map(item => item.day),
    datasets: [
      {
        label: "Weekly Interest (%)",
        borderColor: "#818cf8",
        backgroundColor: "rgba(129, 140, 248, 0.15)",
        borderWidth: 2.5,
        pointBackgroundColor: "#131733",
        pointBorderColor: "#818cf8",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.38,
        fill: true,
        data: safeWeeklyInterest.map(item => item.interest),
      },
    ],
  };

  // 3. Daily Interest Yield Breakdown
  const dailyYieldBarData = {
    labels: safeWeeklyInterest.map(item => item.day),
    datasets: [
      {
        label: "Daily Yield (%)",
        backgroundColor: "rgba(129, 140, 248, 0.85)",
        hoverBackgroundColor: "#818cf8",
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.55,
        data: safeWeeklyInterest.map(item => item.interest),
      },
    ],
  };

  // Shared dark chart options for fintech look
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(12, 20, 15, 0.95)",
        titleColor: "#ffffff",
        titleFont: { size: 12, weight: "bold" },
        bodyColor: "#cbd5e1",
        bodyFont: { size: 11 },
        borderColor: "rgba(92, 224, 170, 0.35)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('%') || label.includes('Yield') || label.includes('Interest')) {
              return ` ${label}: ${value}%`;
            }
            return ` ${label}: $${Number(value).toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 8,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="graph-dashboard-flow">
      {/* 1. Existing Main Investment Chart (Full Width) */}
      <div className="dashboard-chart-card">
        <div className="chart-card-header">
          <div className="header-title-wrap">
            <div className="card-icon-box green">
              <Icon name="trend-up" />
            </div>
            <div className="header-texts">
              <h5>Portfolio Inflow & Outflow Trends</h5>
              <p>Monthly overview of Investment, Deposite, Payout and Investment Bonus</p>
            </div>
          </div>

          <div className="header-legend-wrap">
            <span className="legend-chip investment">
              <span className="chip-dot"></span> Investment
            </span>
            <span className="legend-chip deposit">
              <span className="chip-dot"></span> Deposite
            </span>
            <span className="legend-chip payout">
              <span className="chip-dot"></span> Payout
            </span>
            <span className="legend-chip bonus">
              <span className="chip-dot"></span> Investment Bonus
            </span>
          </div>
        </div>

        <div className="chart-canvas-box tall">
          <Line data={annualLineChartData} options={commonChartOptions} />
        </div>
      </div>

      {/* 2. Existing Weekly Interest Chart (Full Width) */}
      <div className="dashboard-chart-card">
        <div className="chart-card-header">
          <div className="header-title-wrap">
            <div className="card-icon-box purple">
              <Icon name="line-chart-up" />
            </div>
            <div className="header-texts">
              <h5>Weekly Interest Performance</h5>
              <p>Daily percentage rate credited across the active trading cycle</p>
            </div>
          </div>

          <div className="header-legend-wrap">
            <span className="legend-chip interest">
              <span className="chip-dot"></span> Weekly Interest (%)
            </span>
            {safeWeeklyInterest.length > 0 && (
              <span className="stat-badge">
                {safeWeeklyInterest.length} Active Days
              </span>
            )}
          </div>
        </div>

        <div className="chart-canvas-box medium">
          <Line data={weeklyInterestLineData} options={commonChartOptions} />
        </div>
      </div>

      {/* 3. Daily Interest Yield Breakdown */}
      <div className="dashboard-chart-card">
        <div className="chart-card-header">
          <div className="header-title-wrap">
            <div className="card-icon-box gold">
              <Icon name="coins" />
            </div>
            <div className="header-texts">
              <h5>Daily Yield Breakdown</h5>
              <p>Interest rate percentage per trading day</p>
            </div>
          </div>

          <div className="header-legend-wrap">
            <span className="legend-chip interest">
              <span className="chip-dot"></span> Daily Yield (%)
            </span>
          </div>
        </div>

        <div className="chart-canvas-box medium">
          <Bar data={dailyYieldBarData} options={commonChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default GraphWrapper;
