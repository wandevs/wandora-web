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
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: "Up",
        count: 40
      },
      {
        item: "Down",
        count: 20
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
          val = (val * 100).toFixed(1) + "%";
          return val;
        }
      }
    };

    return (
      <div style={{height:'350px'}}>
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
                percent = (percent * 100).toFixed(1) + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
          >
          </Geom>
        </Chart>
        <div className={style.totalText}>Total</div>
        <div className={style.circelText}>2000</div>
        <div className={style.wanText}>WAN</div>
        <div className={style.bigCircle}/>
        <div className={style.smallCircle} />
        <div className={style.inALine}>
          <div className={style.greenLabel}><div className={style.greenBox}/>UP 66.6%</div>
          <div className={style.redLabel}><div className={style.redBox}/>DOWN 33.3%</div>
        </div>
      </div>
    );
  }
}

export default PieChart;