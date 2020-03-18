import echarts, { EChartOption } from 'echarts';
import test from './test';

test();
var myChart = echarts.init(document.getElementById('main') as HTMLDivElement);


// 使用刚指定的配置项和数据显示图表。
myChart.setOption({
  title: {
    text: '可视化Ping'
  },
  tooltip: {
    // 在Y轴上显示，而不是在
    trigger: 'axis',
    formatter(params, ticket, callback) {
      params = params as EChartOption.Tooltip.Format[]

      return `${params[0].data[0]}<br>` + params.map(param => {
        return `${param.seriesName}: ${param.data[1]}`
      }).join("<br>")
      return ""
    },
    axisPointer: {
      // 关闭动画
      animation: false
    }
  },
  xAxis: {
    type: 'time',


    splitLine: {
      // 不显示x坐标轴的线
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: []
});

let series: EChartOption.SeriesLine[] = [];
let legends: any[] = [];

var ws = new WebSocket("ws://localhost:8002");

ws.onmessage = (event) => {
  let message = JSON.parse(event.data);
  let name = message[0];
  let delay = message[1];
  let date = message[2];

  let names = series.map((serie) => {
    return serie.name
  })

  let index = names.indexOf(name)
  let dataItem = [date, delay]
  if (index === -1) {
    series.push({
      name,
      type: 'line',
      // 关闭小圆点
      showSymbol: false,
      // 关闭动画
      hoverAnimation: false,
      data: [dataItem]
    })
    legends.push(name)
  } else {
    // @ts-ignore
    series[index].data.push(dataItem)
  }
  myChart.setOption({
    legend: { data: legends },
    series
  });

}
// 出错
ws.onerror = (error) => {
  console.error(error);
}
// 关闭
ws.onclose = () => {
  console.log('webSocket断开连接')
}

console.log(1223)  