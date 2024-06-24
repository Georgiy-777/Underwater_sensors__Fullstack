'use client'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SensorCard, { type ISensor } from './SensorCard';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const [sensors, setSensors] = useState<ISensor[]>([]);

  useEffect(() => {
    socket.on('sensors-update', (data) => {
      setSensors(data);
    });

    return () => {
      socket.off('sensors-update');
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'lightskyblue', padding: '30px 70px', borderRadius: '10px', width: '80%!important' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '80px', columnGap: '60px', justifyItems: 'center' }}>
        {sensors.map((sensor: any, index) => (
          <SensorCard key={sensor.name} index={index} sensor={sensor} />
        ))}
      </div>
    </div>

  );
};

export default Dashboard;
