import { Typography } from '@mui/material';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: PieChartData[];
  title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <Typography sx={{fontWeight: "bold", marginY: 5, marginX: 2}}>{title}</Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="membros"
            nameKey="municipio"
            label
            
          >
            {data.map((d, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} values={d.name} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
