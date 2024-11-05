import { Typography } from '@mui/material';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: BarChartData[];
  title: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, title }) => {
  return (
    <div style={{ width: '100%', height: 300, marginTop: 50}}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="municipio" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="membros" 
            fill="#374edf"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
