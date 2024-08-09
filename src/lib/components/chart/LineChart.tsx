import type {
  ChartDataset,
  ChartOptions,
  ScriptableScaleContext,
  TooltipModel,
  TooltipOptions,
} from "chart.js";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { CrosshairOptions } from "chartjs-plugin-crosshair";
import Crosshair from "chartjs-plugin-crosshair";
import { Line } from "react-chartjs-2";

import { useMobile } from "lib/app-provider";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Crosshair
);

interface LineChartProps {
  labels: string[];
  dataset: ChartDataset<"line", number[]>;
  customizeTooltip?: (tooltip: TooltipModel<"line">) => string;
  customizeYAxisTicks?: (value: string | number) => string;
}

const renderChartTooltip = (
  context: Parameters<TooltipOptions<"line">["external"]>[0],
  customizeTooltip: (tooltip: TooltipModel<"line">) => string,
  isMobile: boolean
) => {
  const { chart, tooltip } = context;

  let tooltipEl = chart?.canvas?.parentNode?.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(122, 132, 134, 0.4)";
    tooltipEl.style.backdropFilter = "blur(2px)";
    tooltipEl.style.boxShadow = "0px 4px 4px 0px rgba(0, 0, 0, 0.25)";
    tooltipEl.style.borderRadius = "8px";
    tooltipEl.style.opacity = "1";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart?.canvas?.parentNode?.appendChild(tooltipEl);
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  if (tooltip.body) {
    const tableRoot = tooltipEl.querySelector("table");

    if (tableRoot) {
      tableRoot.innerHTML = customizeTooltip(tooltip);
    }
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
  const { caretX, caretY } = tooltip;
  const canvasOffsetLeft = chart.canvas.getBoundingClientRect().left;
  const windowInnerWidth = window.innerWidth;
  const tooltipWidth = tooltipEl.clientWidth;

  const sidebarWidth = isMobile ? 0 : 250;

  const isOverflowLeft =
    canvasOffsetLeft + caretX - tooltipWidth / 2 - sidebarWidth < 0;
  const isOverflowRight =
    canvasOffsetLeft + caretX + tooltipWidth / 2 > windowInnerWidth;

  tooltipEl.style.opacity = "1";
  tooltipEl.style.top = `${positionY + caretY}px`;

  if (isOverflowRight) {
    tooltipEl.style.left = `${positionX + caretX - tooltipWidth / 2}px`;
  } else if (isOverflowLeft) {
    tooltipEl.style.left = `${positionX + caretX + tooltipWidth / 2}px`;
  } else {
    tooltipEl.style.left = `${positionX + caretX}px`;
  }
};

export const LineChart = ({
  labels,
  dataset,
  customizeTooltip,
  customizeYAxisTicks,
}: LineChartProps) => {
  const isMobile = useMobile();

  const maxYValue = Math.max(...dataset.data);
  const yPadding = maxYValue * 0.2 || 1;

  const lineChartDataConfig = {
    borderWidth: 1,
    fill: true,
    pointRadius: 0,
    pointHoverRadius: 3,
    pointHoverBorderWidth: 1.5,
    pointHitRadius: 30,
    tension: 0.5,
  };

  const options: ChartOptions<"line"> & {
    plugins: {
      crosshair: CrosshairOptions;
    };
  } = {
    plugins: {
      legend: {
        display: false,
      },
      crosshair: {
        line: {
          color: "#00B5CE",
          width: 1,
          dashPattern: [5, 5],
        },
        sync: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: customizeTooltip
        ? {
            enabled: false,
            position: "nearest",
            intersect: false,
            external: (context) =>
              renderChartTooltip(context, customizeTooltip, isMobile),
          }
        : {
            enabled: true,
            intersect: false,
          },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawTicks: false,
          color: (ctx: ScriptableScaleContext) => {
            const { index } = ctx;

            if (index === 0 || index === labels.length - 1) {
              return "transparent";
            }

            return "#222424";
          },
        },
        ticks: {
          padding: isMobile ? 16 : 10,
          maxTicksLimit: isMobile ? 8 : 32,
          callback: (_value: string | number, index: number) => {
            if (index === 0) {
              return "";
            }

            return labels[index];
          },
        },
      },
      y: {
        grid: {
          display: true,
          drawTicks: false,
          color: (ctx: ScriptableScaleContext) => {
            const { index } = ctx;

            if (isMobile && (index === 0 || index === labels.length - 1)) {
              return "transparent";
            }

            return "#222424";
          },
        },
        min: 0,
        max: maxYValue + yPadding,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          padding: 10,
          callback: (value: string | number) => {
            return customizeYAxisTicks ? customizeYAxisTicks(value) : value;
          },
          align: isMobile ? "start" : "center",
          labelOffset: isMobile ? 5 : 0,
        },
      },
    },
    maintainAspectRatio: false,
    animation: false,
  };

  return (
    <Line
      options={options}
      data={{
        labels,
        datasets: [
          {
            ...dataset,
            ...lineChartDataConfig,
          },
        ],
      }}
    />
  );
};
