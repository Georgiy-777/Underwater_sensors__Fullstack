'use strict'
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SensorModal from './SensorModal';
import { Box, Progress, Text, useDisclosure } from '@chakra-ui/react';

// Interface for the sensor object, defining the expected structure
export interface ISensor {
    id: string;
    name: string;
    temperature: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    waterSpeedX: number;
    waterSpeedY: number;
    waterSpeedZ: number;
    thrusterSpeedX: number;
    thrusterSpeedY: number;
    thrusterSpeedZ: number;
    initialPositionX: number;
    initialPositionY: number;
    initialPositionZ: number;
}

// Interface for the SensorCard component props
interface SensorCardProps {
    sensor: ISensor;
    index: number;
}

// Constants for tick interval and safe area size
const TICK_INTERVAL = 7000;
const SAFE_AREA_SIZE = 20000;

// SensorCard component
const SensorCard: React.FC<SensorCardProps> = ({ sensor, index }) => {
    // Chakra UI hooks for modal control
    const { isOpen, onOpen, onClose } = useDisclosure();
    // Determine if the index is even
    const isEvenIndex = index % 2 === 0;
    // Safe area size and tick interval constants
    const safeAreaSize = SAFE_AREA_SIZE;
    const tickInterval = TICK_INTERVAL;
    // State for time until the sensor is lost and its color
    const [timeUntilLost, setTimeUntilLost] = useState<any>();
    const [timeUntilLostColor, setTimeUntilLostColor] = useState<string>('green');

    // Sensor units are assumed to be in mm, therefore speed in mm/s == 0.001 * m/s

    useEffect(() => {
        const calculateTimeUntilLost = () => {
            // Calculate the safe area boundaries
            const halfSafeAreaSize = safeAreaSize / 2;

            const minX = sensor.initialPositionX - halfSafeAreaSize;
            const maxX = sensor.initialPositionX + halfSafeAreaSize;
            const minY = sensor.initialPositionY - halfSafeAreaSize;
            const maxY = sensor.initialPositionY + halfSafeAreaSize;

            // Calculate the distances to the boundaries
            const distanceToMinX = minX - sensor.positionX;
            const distanceToMaxX = maxX - sensor.positionX;
            const distanceToMinY = minY - sensor.positionY;
            const distanceToMaxY = maxY - sensor.positionY;

            const distanceX = Math.min(Math.abs(distanceToMinX), Math.abs(distanceToMaxX));
            const distanceY = Math.min(Math.abs(distanceToMinY), Math.abs(distanceToMaxY));

            // Calculate the combined speed in X and Y directions
            const speedX = sensor.waterSpeedX + sensor.thrusterSpeedX;
            const speedY = sensor.waterSpeedY + sensor.thrusterSpeedY;
            // console.log("🚀 ~ calculateTimeUntilLost ~ speedY:", speedY)

            // Calculate the time until the sensor reaches the boundary
            const timeX = speedX !== 0 ? distanceX / speedX : -1;
            // console.log("🚀 ~ calculateTimeUntilLost ~ timeX:", timeX)
            const timeY = speedY !== 0 ? distanceY / speedY : -1;
            // console.log("🚀 ~ calculateTimeUntilLost ~ timeY:", timeY)

            return Math.min(timeX, timeY);
        };

        // Calculate the time until the sensor is lost and convert it to seconds
        const time = calculateTimeUntilLost();
        const res = time * 0.001 * tickInterval / 1000;
        setTimeUntilLost(res);

        // Set the color based on the time until lost
        const color = res > 10 || time === -1 ? 'green' : res > 5 && res < 10 ? 'yellow' : 'red';
        setTimeUntilLostColor(color);
    }, [sensor]);

    return (
        <>
            <Card onClick={onOpen} borderColor={timeUntilLostColor} customIndex={isEvenIndex}>
                <Name>{sensor.name}</Name>
                <Box marginBottom="15px">
                    <Text whiteSpace="nowrap" marginBottom="15px" color={timeUntilLostColor}>Temperature: {sensor.temperature.toFixed(1)}°C</Text>
                    <Progress hasStripe value={sensor.temperature <= 0 ? 0 : sensor.temperature} size={'sm'} colorScheme={timeUntilLostColor }/>
                </Box>
                <Box marginBottom="15px">
                    <Text whiteSpace="nowrap" color={timeUntilLostColor}>Sensor lose: {timeUntilLost?.toFixed(2)} s</Text>
                </Box>
            </Card>
            <SensorModal sensor={sensor} timeUntilLost={timeUntilLost} timeUntilLostColor={timeUntilLostColor} isOpen={isOpen} onClose={onClose} />
        </>
    );
};

// Animation for the card component
const waveAnimation = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    10% {
        transform: translateY(-5px);
    }
    20% {
        transform: translateY(-10px);
    }
    30% {
        transform: translateY(-15px);
    }
    40% {
        transform: translateY(-10px);
    }
    50% {
        transform: translateY(-5px);
    }
    60% {
        transform: translateY(0);
    }
    70% {
        transform: translateY(5px);
    }
    80% {
        transform: translateY(10px);
    }
    90% {
        transform: translateY(15px);
    }
    100% {
        transform: translateY(10px);
    }
`;

// Interface for the Card component props
interface CardProps {
    borderColor: string;
    customIndex: boolean;
}

// Styled component for the Card
const Card = styled.div<CardProps>`
    padding: 16px;
    height: 300px;
    padding-top: 25px;
    width: 200px;
    border: 2px solid ${(props) => props.borderColor};
    border-radius: 70px;
    cursor: pointer;
    background-color: darkcyan;
    animation: ${waveAnimation} 5s infinite;
`;

// Styled component for the Name
const Name = styled.div`
    font-size: 22px;
    font-weight: bold;
    display: flex;
    color: white;
    justify-content: center;
    margin-bottom: 30px;
    text-transform: uppercase;
`;

// Styled component for the Temperature
const Temperature = styled.div`
    font-size: 14px;
    white-space: nowrap;
`;

// Interface for the TimeUntilLost component props
interface TimeUntilLostProps {
    color: string;
}

// Styled component for the TimeUntilLost
const TimeUntilLost = styled.div<TimeUntilLostProps>`
    font-size: 14px;
    color: ${(props) => props.color};
`;

export default SensorCard;
