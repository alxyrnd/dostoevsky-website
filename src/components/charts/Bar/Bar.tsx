import React, { PureComponent } from "react";
import ChartWrapper from "src/components/ChartWrapper";
import Chartist, {
  IChartistStepAxis,
  ChartDrawData,
  IChartDrawLabelData,
  IChartDrawGridData,
} from "chartist";
import classes from "./Bar.module.css";
import cn from "clsx";
import he from "he";
import Typography from "src/components/ui-kit/Typography";

interface BarProps extends React.ComponentProps<typeof ChartWrapper> {
  charts: {
    groups: {
      values: number[];
      title: string;
    }[];
    title?: React.ReactNode;
    tooltipDescription: {
      [key: string]: string;
    };
  }[];
  labels: string[];
}

const ROW_HEIGHT = 50;
const Y_LABEL_MARGIN = 15;

class Bar extends PureComponent<BarProps> {
  private chartRefs: React.RefObject<HTMLDivElement>[];

  public constructor(props: BarProps) {
    super(props);
    this.chartRefs = [];
    for (let i = 0; i < props.charts.length; i++) {
      this.chartRefs[i] = React.createRef<HTMLDivElement>();
    }
  }

  public componentDidMount(): void {
    const { charts, labels } = this.props;
    for (let i = 0; i < charts.length; i++) {
      const { groups, tooltipDescription } = charts[i];
      const series: { value: number }[][] = groups.map((g) =>
        g.values
          .slice()
          .reverse()
          .map((v) => ({ value: v, meta: { tooltip: tooltipDescription } }))
      );
      const chartLabels: string[] = labels.slice().reverse();

      const plugins = [];

      if (typeof window !== `undefined`) {
        require("chartist-plugin-tooltips");
        plugins.push(
          Chartist.plugins.tooltip({
            appendToBody: true,
            tooltipFnc: this.getTooltipText,
          })
        );
      }
      const chart = new Chartist.Bar(
        this.chartRefs[i].current,
        {
          labels: chartLabels,
          series,
        },
        {
          stackBars: true,
          horizontalBars: true,
          axisX: {
            onlyInteger: true,
            showGrid: true,
            labelOffset: {
              y: Y_LABEL_MARGIN,
            },
          },
          axisY: {
            stretch: true,
            showGrid: true,
            labelOffset: {
              x: 0,
              y: -17,
            },
            offset: 0,
            fullWidth: true,
          } as IChartistStepAxis,
          plugins,
        }
      );

      chart.on("draw", (data: ChartDrawData) => {
        this.positionXLabel(data);
        this.styleVerticalGrid(data);
        this.styleHorizontalGrid(data);
      });
    }
  }

  render(): React.ReactNode {
    const { labels, charts, ...wrapperProps } = this.props;

    return (
      <ChartWrapper {...wrapperProps} labels={this.getLabels()}>
        {charts.map((c, i) => (
          <div key={i} style={{ width: `${100 / charts.length}%` }}>
            <Typography className={cn(classes.chartTitle)} isUpperCased>
              <b>
                <small>{c.title}</small>
              </b>
            </Typography>
            <div
              ref={this.chartRefs[i]}
              className={
                charts.length > 1
                  ? `ct-chart-${String.fromCharCode(97 + i)}`
                  : undefined
              }
              style={{
                height: labels.length * ROW_HEIGHT,
              }}
            ></div>
          </div>
        ))}
      </ChartWrapper>
    );
  }

  private getLabels = () => {
    const { charts } = this.props;
    if (charts.length === 1) {
      return charts[0].groups.map((g) => g.title);
    }
    return undefined;
  };

  private positionXLabel = (data: ChartDrawData): void => {
    if (!this.isLabel(data) || !this.isXLabel(data)) {
      return;
    }
    if (data.index === 0) {
      return;
    }
    const x = data.x || 0;

    if (data.index === data.axis.ticks.length - 1) {
      data.element.attr({
        x: x - 15,
      });
      return;
    }

    data.element.attr({
      x: x - 6,
    });
  };

  /** Function to remove all horizontal lines, except for the last one */
  private styleHorizontalGrid = (data: ChartDrawData): void => {
    if (!this.isGrid(data) || !this.isYGrid(data)) {
      return;
    }
    if (data.index !== 0) {
      data.element.remove();
    }
  };

  /** Function to show vertical grid under the canvas */
  private styleVerticalGrid = (data: ChartDrawData): void => {
    if (!this.isGrid(data) || !this.isXGrid(data)) {
      return;
    }
    data.element.attr({
      y1: data.y2,
      y2: data.y2 + Y_LABEL_MARGIN - 5,
    });
  };

  private getTooltipText = (meta: string, value: number) => {
    let metaDeserialized: {
      data: {
        tooltip: {
          [key: string]: string;
        };
      };
    };
    try {
      metaDeserialized = JSON.parse(he.decode(meta));
    } catch (e) {
      console.error(e);
      return '<span class="chartist-tooltip-meta">Error</span>';
    }
    const lines = [];
    for (const [lineKey, lineValue] of Object.entries(
      metaDeserialized.data.tooltip
    )) {
      lines.push(`${lineKey}: ${lineValue.replace("%%", value.toString())}`);
    }
    return `<span class="chartist-tooltip-meta">${lines.join("<br>")}</span>`;
  };

  private isLabel = (data: ChartDrawData): data is IChartDrawLabelData =>
    data.type === "label";

  private isXLabel = (data: IChartDrawLabelData) =>
    data.axis?.units.pos === "x";

  private isGrid = (data: ChartDrawData): data is IChartDrawGridData =>
    data.type === "grid";

  private isYGrid = (data: IChartDrawGridData) => data.axis?.units.pos === "y";

  private isXGrid = (data: IChartDrawGridData) => data.axis?.units.pos === "x";
}

export default Bar;
