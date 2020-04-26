import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import style from './style.less';


class PieChart extends React.Component {
  render() {
    const upCnt = this.props.upCnt;
    const downCnt = this.props.downCnt;
    const totalCnt = upCnt + downCnt;
    const upPercent = (upCnt*100 / totalCnt).toFixed(2) + '%';
    const downPercent = (downCnt*100 / totalCnt).toFixed(2) + '%';
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: "UP",
        count: upCnt
      },
      {
        item: "DOWN",
        count: downCnt
      },
    ];
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + "%";
          return val;
        }
      }
    };

    return (
      <div style={{ height: '350px' }}>
        <Chart
          height={250}
          width={250}
          data={dv}
          scale={cols}
          padding={[20, 0, 0, 0]}
          forceFit
          z-index={99}
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.6} />

          <Tooltip
            showTitle={false}
          />
          <Geom
            type="intervalStack"
            position="percent"
            color={['item', ['#40DABF', '#E11466']]}
            tooltip={[
              "item*percent",
              (item, percent) => {
                let value = "";
                if (data[0].item == item) {
                  value = data[0].count + " WAN";
                }
                if (data[1].item == item) {
                  value = data[1].count + " WAN";
                }
                return {
                  name: item,
                  value
                };
              }
            ]}
          >
          </Geom>
        </Chart>
        <div className={style.totalText}>Total</div>
        <div className={style.circelText}>{totalCnt}</div>
        <div className={style.wanText}>WAN</div>
        <div className={style.bigCircle} />
        <div className={style.smallCircle} />
        <div className={style.inALine}>
          <div className={style.greenLabel}><div className={style.greenBox} />UP: {upPercent}</div>
          <div className={style.redLabel}><div className={style.redBox} />DOWN: {downPercent}</div>
        </div>
      </div>
    );
  }
}

export default PieChart;