import React from 'react';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 }
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF', '#99FF99'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <g>
      <text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
        {`${payload.name}`}
      </text>
      <text x={x} y={y} dy={24} textAnchor={'middle'} fill="#000">
        {`${payload.value}`}
      </text>
    </g>
  );
};
function PieCharts({ chartData, female }) {
  function objectToArray(obj) {
    return Object.keys(obj).map((name) => ({ name, value: obj[name] }));
  }

  const arrayOfObjects = objectToArray(chartData);

  console.log('vikas' + JSON.stringify(arrayOfObjects));

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart width={500} height={500}>
          <Pie
            data={objectToArray(chartData)}
            // cx="50%"
            // cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            // outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            // label
          >
            {objectToArray(chartData).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      {female ? (<Image alt="female" src="/assets/female.svg" width={50} height={50} style={{ width: '44px', position: 'absolute', top: '135px', left: 0, right: 0, margin: '0 auto', }} />) : (
        <Image alt="male" src="/assets/male.svg" width={50} height={50}  style={{ width: '35px', position: 'absolute', top: '135px', left: 0, right: 0, margin: '0 auto', }}/>
      )}
      </ResponsiveContainer>
    </div>
  );
}

export default PieCharts;
