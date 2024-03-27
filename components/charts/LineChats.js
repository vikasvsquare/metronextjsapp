import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

//line Chart
const lineChartdata = [
  {
    name: 'Jan',
    'Agg Assault on operator': 110,
    'Homicide': 80,
    'Rape': 30,
    'Sex Offenses': 120
  },
  {
    name: 'Feb',
    'Agg Assault on operator': 100,
    'Homicide': 80  ,
    'Rape': 30,
    'Sex Offenses': 100
  },
  {
    name: 'Mar',
    'Agg Assault on operator': 90,
    'Homicide': 80,
    'Rape': 30,
    'Sex Offenses': 70
  },
  {
    name: 'Apr',
    'Agg Assault on operator': 80,
    'Homicide': 90,
    'Rape': 30,
    'Sex Offenses': 80
  },
  {
    name: 'May',
    'Agg Assault on operator': 70,
    'Homicide': 60,
    'Rape': 30,
    'Sex Offenses': 60
  },
  {
    name: 'Jun',
    'Agg Assault on operator': 60,
    'Homicide': 50,
    'Rape': 30,
    'Sex Offenses': 50
  },
  {
    name: 'Jul',
    'Agg Assault on operator': 40,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 70
  },
  {
    name: 'Aug',
    'Agg Assault on operator': 50,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 70
  },
  {
    name: 'Sep',
    'Agg Assault on operator': 30,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 70
  },
  {
    name: 'Oct',
    'Agg Assault on operator': 20,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 80
  },
  {
    name: 'Nov',
    'Agg Assault on operator': 30,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 80
  },
  {
    name: 'Dec',
    'Agg Assault on operator': 10,
    'Homicide': 70,
    'Rape': 30,
    'Sex Offenses': 70
  }
];
export default function LineChats() {
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
        <Line type="monotone" dataKey="Agg Assault on operator" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Homicide" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Rape" stroke="#f00" />
        <Line type="monotone" dataKey="Sex Offenses" stroke="#000" />
      </LineChart>
    </ResponsiveContainer>
  );
}
