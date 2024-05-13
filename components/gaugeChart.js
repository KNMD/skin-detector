"use client"

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GaugeChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(chartRef.current);
    const value = parseInt(props.value, 10)
    // 指定图表的配置项和数据
    const option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          itemStyle: {
            color: '#FFAB91'
          },
          progress: {
            show: true,
            width: 30
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 30
            }
          },
          axisTick: {
            show: false,
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            show: false,
            distance: -20,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 60,
            fontWeight: 'bolder',
            formatter: '{value}',
            color: 'inherit'
          },
          data: [
            {
              value: value
            }
          ]
        },
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          itemStyle: {
            color: '#FD7347'
          },
          progress: {
            show: true,
            width: 8
          },
          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: value + 10
            }
          ]
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }, []);

  return (
    <div className='wrapper flex justify-center'>
      <div ref={chartRef} style={{ width: '384px', height: '300px' }}></div>
    </div>
    
  ) 
 ;
};

export default GaugeChart;
