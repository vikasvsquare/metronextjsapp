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
  console.log(lineChartdata);


  function categoryData(chartData) {
    const categoryData = [];
    for (const key in chartData[0]) {
      if (key !== 'name' && chartData[0].hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }

  let categories = categoryData(chartData);
  // let categories = categoryData(chartData).reverse().slice(0, -1);
  let colors = ['#8884d8', '#f00', '#000', '#B34D4D',
  '#E666B3', '#6680B3', '#FF1A66', '#E6331A', '#B366CC', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		   '#CC9999', '#B3B31A',  
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF', '#99FF99', '#80B300', '#CCFF1A','#E6B3B3','#33FFCC','#82ca9d', '#73C7FF','#33991A', '#00E680', '#4D8000',]

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ marginLeft: -10 }} className="linechart-height-mobile">
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
      </LineChart>
    </ResponsiveContainer>
  );
}
