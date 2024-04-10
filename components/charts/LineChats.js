import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

//line Chart
// const lineChartdata = [
//   {
//     name: 'Jan 2023',
//     'Agg Assault on operator': 110,
//     'Homicide': 80,
//     'Rape': 30,
//     'Sex Offenses': 120
//   },
//   {
//     name: 'Feb 2023',
//     'Agg Assault on operator': 100,
//     'Homicide': 80  ,
//     'Rape': 30,
//     'Sex Offenses': 100
//   },
//   {
//     name: 'Mar 2023',
//     'Agg Assault on operator': 90,
//     'Homicide': 80,
//     'Rape': 30,
//     'Sex Offenses': 70
//   },
// ];
export default function LineChats({ chartData }) {
  let lineChartdata = chartData;

  function categoryData(chartData) {
    const categoryData = [];
    for (const key in chartData[0]) {
      if (chartData[0].hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }

  let categories = categoryData(chartData).reverse().slice(0, -1);
  let colors = ['#8884d8', '#82ca9d', '#f00', '#000', '#73C7FF', '#0D2C46', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF', '#99FF99', ]

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ marginLeft: -10 }}>
      <LineChart
        width={500}
        height={300}
        data={lineChartdata}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {categories.map((item, i) => (
          <Line key={i} type="monotone" dataKey={item} stroke={colors[i]} activeDot={{ r: 8 }} dot={{  strokeWidth: 4, r: 5}} />
        ))}
        {/* <Line type="monotone" dataKey="Homicide" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Rape" stroke="#f00" />
        <Line type="monotone" dataKey="Sex Offenses" stroke="#000" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}
