import type {
  BubbleDataPoint,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  Point,
  ScriptableScaleContext,
  TooltipModel,
} from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
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
}

const renderChartTooltip = (
  context: {
    chart: ChartJS<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint | null)[],
      unknown
    >;
    tooltip: TooltipModel<"line">;
  },
  customizeTooltip: (tooltip: TooltipModel<"line">) => string,
  isMobile: boolean
) => {
  const { chart, tooltip } = context;

  let tooltipEl = chart?.canvas?.parentNode?.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(41, 38, 118, 0.9)";
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
}: LineChartProps) => {
  const isMobile = useMobile();

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
          color: "#D8BEFC",
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
            external: (context) =>
              renderChartTooltip(context, customizeTooltip, isMobile),
          }
        : {
            enabled: true,
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

            return "#343445";
          },
        },
        ticks: {
          padding: isMobile ? 16 : 10,
          maxTicksLimit: isMobile ? 5 : undefined,
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

            return "#343445";
          },
        },
        min: 0,
        max: Math.max(...(dataset.data as number[])),
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          padding: 10,
          callback: (value: string | number) => {
            return Number(value).toFixed(2);
          },
          align: isMobile ? "start" : "center",
          labelOffset: isMobile ? 5 : 0,
        },
      },
    },
    maintainAspectRatio: false,
    animation: {
      easing: "easeInElastic",
    },
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
