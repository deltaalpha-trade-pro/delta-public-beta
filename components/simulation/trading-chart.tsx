"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function TradingChart() {
  const data = [
    { name: "EUR/USD", value: 1.085 },
    { name: "GBP/USD", value: 1.27 },
    { name: "USD/JPY", value: 149.5 },
    { name: "AUD/USD", value: 0.66 },
    { name: "USD/CHF", value: 0.88 },
    { name: "EUR/GBP", value: 0.86 },
    { name: "BTC/USD", value: 43000 },
    { name: "ETH/USD", value: 2400 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" />
      </LineChart>
    </ResponsiveContainer>
  );
}
