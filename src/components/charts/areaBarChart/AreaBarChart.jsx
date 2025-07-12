import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { Icons } from "../../../data/Assets";
import "./AreaBarChart.scss";

/* ─── static dataset ───────────────────────────────────────── */
const CHART_DATA = [
  { index: "A", day: "Sun", used: 4000, remnant: 2400, purchased: 6400 },
  { index: "B", day: "Mon", used: 3000, remnant: 1398, purchased: 4398 },
  { index: "C", day: "Tues", used: 2000, remnant: 9800, purchased: 11800 },
  { index: "D", day: "Wed", used: 2780, remnant: 3908, purchased: 6688 },
  { index: "E", day: "Thurs", used: 1890, remnant: 4800, purchased: 6690 },
  { index: "F", day: "Fri", used: 2390, remnant: 3800, purchased: 6190 },
  { index: "G", day: "Sat", used: 3490, remnant: 4300, purchased: 7790 },
];

/* ─── helpers (pure, defined once) ─────────────────────────── */
const KWH_SUFFIX = "kWh";
const formatKwh = (v) => `${v}${KWH_SUFFIX}`;
const formatLegendText = (key) => key[0].toUpperCase() + key.slice(1);

/* customised label for bar tops */
const CustomizedLabel = ({ x, y, width, value }) => {
  const r = 7;
  const midX = x + width / 2;
  return (
    <g>
      <circle cx={midX} cy={y - r} r={r} fill="#FFF" />
      <text x={midX} y={y - r} textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};

/* ─── component ────────────────────────────────────────────── */
const AreaBarChart = () => {
  /* show the total purchased energy at a glance */
  const totalVoltage = useMemo(
    () => CHART_DATA.reduce((sum, d) => sum + d.purchased, 0).toLocaleString(),
    []
  );

  return (
    <div className="barChart">
      {/* header summary */}
      <div className="barChartInfo">
        <h5 className="barChartTitle">Total Voltage</h5>
        <div className="chartInfoData">
          <div className="infoDataValue">{totalVoltage} kWh</div>

          <div className="infoDataText">
            <Icons.ArrowRise className="infoDataArrow" />
            <p>5% than last month</p>
          </div>
        </div>
      </div>

      {/* actual chart */}
      <div className="barChartWrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHART_DATA} margin={{ top: 5, right: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              padding={{ left: 0, right: 0 }}
              tick={{
                fill: "var(--whiteColor)",
                fontSize: 10,
                fontWeight: 700,
              }}
              tickSize={0}
              axisLine={false}
            />
            <YAxis
              padding={{ top: 10, bottom: 0 }}
              tickFormatter={formatKwh}
              tick={{ fill: "var(--whiteColor)", fontSize: 10 }}
              tickSize={0}
              axisLine={false}
            />

            <Tooltip
              formatter={formatKwh}
              cursor={{ fill: "var(--secondaryColor)" }}
            />
            <Legend
              iconType="circle"
              iconSize={12}
              verticalAlign="top"
              align="right"
              formatter={formatLegendText}
            />

            <Bar
              dataKey="used"
              fill="var(--chartUsed, #ff4d4d)"
              barSize={20}
              radius={[0, 0, 12, 12]}
              minPointSize={5}
              stackId="a"
              activeBar={<Rectangle fill="#ffb3b3" stroke="blue" />}
            />
            <Bar
              dataKey="remnant"
              fill="var(--chartRemnant, #9acd32)"
              barSize={20}
              radius={[12, 12, 0, 0]}
              minPointSize={10}
              stackId="a"
              activeBar={<Rectangle fill="#ffe066" stroke="purple" />}
            >
              <LabelList dataKey="index" content={CustomizedLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(AreaBarChart);
