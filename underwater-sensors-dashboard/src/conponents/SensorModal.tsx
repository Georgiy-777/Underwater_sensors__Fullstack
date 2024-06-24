import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';

// Define the interface for the SensorModal props
interface ISensorModal {
  sensor: any;
  onClose: () => void;
  isOpen: boolean;
  timeUntilLostColor: string;
  timeUntilLost: number;
}

// Component for the Sensor Modal
const SensorModal = ({ sensor, isOpen, onClose, timeUntilLostColor, timeUntilLost }: ISensorModal) => {
  // State to manage thrusters speed
  const [thrusters, setThrusters] = useState({
    x: sensor.thrustersSpeedX,
    y: sensor.thrustersSpeedY,
    z: sensor.thrustersSpeedZ
  });

  // Refs to manage initial and final focus elements in the modal
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  // Hook to display toast notifications
  const toast = useToast();

  // Effect to update thrusters state when sensor data changes
  useEffect(() => {
    setThrusters({
      x: sensor.thrustersSpeedX,
      y: sensor.thrustersSpeedY,
      z: sensor.thrustersSpeedZ
    });
  }, [sensor.thrustersSpeedX, sensor.thrustersSpeedY, sensor.thrustersSpeedZ]);

  // Function to update thruster speed
  const updateThrusterSpeed = async (axis: string, value: number) => {
    const newThrusters = { ...thrusters, [axis]: value };
    setThrusters(newThrusters);
    try {
      // Sending a POST request to update thruster speed
      await axios.post(`http://localhost:5000/sensor/${sensor.name}/thruster`, { [axis]: value });
      // Show success toast notification
      toast({
        title: "Success",
        status: 'success',
        isClosable: true,
      });
    } catch (error: any) {
      // Show error toast notification in case of failure
      toast({
        title: `Error send`,
        description: `${error.message}`,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Modal closeOnOverlayClick={false} size={'sm'} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='80%' backdropBlur='2px' />
      <ModalContent border={`3px solid ${timeUntilLostColor}`} color={timeUntilLostColor}>
        <ModalHeader>{sensor.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box marginBottom="15px">
            <Text whiteSpace="nowrap" color={timeUntilLostColor}>Sensor lose: {timeUntilLost?.toFixed(2)} s</Text>
          </Box>

          {['x', 'y', 'z'].map((axis) => (
            <FormControl
              key={axis}
              sx={{ display: 'flex', flexDir: 'row', w: '100%', mt: '12px', alignItems: 'center', gap: '8px' }}
            >
              <FormLabel textTransform="capitalize">{axis}: </FormLabel>
              <Text whiteSpace="nowrap" color={timeUntilLostColor}>
                {(sensor[`waterSpeed${axis.toUpperCase()}`] * 0.001).toFixed(1)} m/sec
              </Text>
              <Input
                type='number'
                placeholder={`Set ${axis.toUpperCase()} speed`}
                onChange={(e) => updateThrusterSpeed(axis, parseFloat(e.target.value))}
              />
            </FormControl>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SensorModal;
