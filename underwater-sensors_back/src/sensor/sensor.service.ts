import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensor.entity';
import { SensorGateway } from '../gateway/sensor.gateway';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class SensorService implements OnModuleInit, OnModuleDestroy {
  // List of predefined sensor names
  private readonly sensorNames = [
    'alpha',
    'beta',
    'gamma',
    'delta',
    'epsilon',
    'zeta',
    'eta',
    'theta',
    'iota',
    'kappa',
    'lambda',
    'mu',
  ];

  // Safe area size and tick interval for updating sensors
  private safeAreaSize: number;
  private tickInterval: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
    @Inject(forwardRef(() => SensorGateway))
    private sensorGateway: SensorGateway,
  ) {
    // Retrieve configuration values from the environment
    this.safeAreaSize = this.configService.get<number>('SAFE_AREA_SIZE');
    this.tickInterval = this.configService.get<number>('TICK_INTERVAL');
  }

  // Called when the module is initialized
  async onModuleInit() {
    await this.loadSensors();
    // Set an interval to update sensors periodically
    setInterval(() => this.updateSensors(), this.tickInterval);
  }

  // Called when the module is destroyed
  async onModuleDestroy() {
    await this.saveSensors();
  }

  // Load sensors from the database, or create them if they do not exist
  private async loadSensors() {
    const sensors = await this.sensorsRepository.find();
    if (sensors.length > 0) {
      return;
    } else {
      for (const name of this.sensorNames) {
        const sensor = this.generateSensor(name);
        await this.sensorsRepository.save(sensor);
      }
    }
  }

  // Generate a new sensor with random attributes
  private generateSensor(name: string) {
    const position = this.randomCoordinates();
    const waterSpeed = this.randomSpeed();
    const thrustersSpeed = {
      x: 0,
      y: 0,
      z: 0,
    };

    return this.sensorsRepository.create({
      name: name,
      positionX: position.x,
      positionY: position.y,
      positionZ: position.z,
      waterSpeedX: waterSpeed.x,
      waterSpeedY: waterSpeed.y,
      waterSpeedZ: waterSpeed.z,
      initialPositionX: position.x,
      initialPositionY: position.y,
      initialPositionZ: position.z,
      thrusterSpeedX: thrustersSpeed.x,
      thrusterSpeedY: thrustersSpeed.y,
      thrusterSpeedZ: thrustersSpeed.z,
      temperature: this.randomTemperature(),
      lost: false,
    });
  }

  // Generate random coordinates for a sensor
  private randomCoordinates() {
    const min = this.configService.get<number>('SENSOR_POSITION_MIN');
    const max = this.configService.get<number>('SENSOR_POSITION_MAX');
    return {
      x: this.randomBetween(min, max),
      y: this.randomBetween(min, max),
      z: this.randomBetween(min, max),
    };
  }

  // Generate random speed values for a sensor
  private randomSpeed() {
    const min = this.configService.get<number>('THRUSTER_SPEED_MIN');
    const max = this.configService.get<number>('THRUSTER_SPEED_MAX');
    return {
      x: this.randomBetween(min, max),
      y: this.randomBetween(min, max),
      z: this.randomBetween(min, max),
    };
  }

  // Generate a random temperature within the specified range
  private randomTemperature() {
    const min = +this.configService.get<number>('WATER_TEMPERATURE_MIN');
    const max = this.configService.get<number>('WATER_TEMPERATURE_MAX');
    return this.randomBetween(min, max);
  }

  // Generate a random number between min and max (inclusive)
  private randomBetween(min: number, max: number): number {
    return Math.round(Math.random() * (max - min + 1)) + min;
  }

  // Placeholder function for saving sensors (currently does nothing)
  private async saveSensors() {
    // Additional saving is not required as updates will be performed in the updateSensors function
  }

  // Update the attributes of all sensors
  private async updateSensors() {
    const sensors = await this.sensorsRepository.find();
    for (const sensor of sensors) {
      this.updateSensor(sensor);
    }
    await this.sensorsRepository.save(sensors);
    await this.sensorGateway.sendSensorsUpdate();
  }

  // Update the attributes of a single sensor
  private updateSensor(sensor: Sensor) {
    // Update the position of the sensor
    sensor.positionX += sensor.waterSpeedX + sensor.thrusterSpeedX;
    sensor.positionY += sensor.waterSpeedY + sensor.thrusterSpeedY;
    sensor.positionZ += sensor.waterSpeedZ + sensor.thrusterSpeedZ;

    // Check if the sensor is out of the safe zone
    if (this.isOutOfSafeZone(sensor)) {
      sensor.lost = true;
      return;
    }

    // Update water speed and temperature
    sensor.waterSpeedX += this.randomSmallIncrement();
    sensor.waterSpeedY += this.randomSmallIncrement();
    sensor.waterSpeedZ += this.randomSmallIncrement();
    sensor.temperature += this.randomTemperatureIncrement();
  }

  // Check if the sensor is out of the safe zone
  private isOutOfSafeZone(sensor: Sensor) {
    const halfSizeX = parseInt(process.env.SENSOR_SIZE_X) / 2; // Half width of the sensor
    const halfSizeY = parseInt(process.env.SENSOR_SIZE_Y) / 2; // Half height of the sensor
    const halfAreaSize = this.safeAreaSize / 2;
    const minX = sensor.initialPositionX - halfAreaSize;
    const maxX = sensor.initialPositionX + halfAreaSize;
    const minY = sensor.initialPositionY - halfAreaSize;
    const maxY = sensor.initialPositionY + halfAreaSize;
    return (
      sensor.positionX - halfSizeX < minX ||
      sensor.positionX + halfSizeX > maxX ||
      sensor.positionY - halfSizeY < minY ||
      sensor.positionY + halfSizeY > maxY
    );
  }

  // Generate a small random increment
  private randomSmallIncrement(): number {
    const min = 0;
    const max = 2;
    return Math.round(Math.random() * (max - min + 1)) + min;
  }

  // Generate a small random temperature increment
  private randomTemperatureIncrement(): number {
    const min = -0.5;
    const max = 0.5;
    return Math.round(Math.random() * (max + min) - 1 + min);
  }

  // Update the thruster speed of a specific sensor
  async updateThrusterSpeed(name: string, thrusters: any) {
    const sensor = await this.sensorsRepository.findOne({ where: { name } });
    if (sensor) {
      if (thrusters.x !== undefined) sensor.thrusterSpeedX = thrusters.x;
      if (thrusters.y !== undefined) sensor.thrusterSpeedY = thrusters.y;
      if (thrusters.z !== undefined) sensor.thrusterSpeedZ = thrusters.z;
      await this.sensorsRepository.save(sensor);
    }
  }

  // Retrieve all sensors from the database
  async getSensors() {
    const sensor = await this.sensorsRepository.find({
      order: { name: 'ASC' },
    });
    return sensor;
  }
}
