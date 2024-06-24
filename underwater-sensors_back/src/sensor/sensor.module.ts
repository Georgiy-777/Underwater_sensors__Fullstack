import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';
import { SensorService } from './sensor.service';
import { SensorGateway } from '../gateway/sensor.gateway';
import { SensorGatewayModule } from '../gateway/sensor-gateway.module';
import { SensorController } from './sensor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor]), // Import TypeOrmModule to work with the Sensor entity
    forwardRef(() => SensorGatewayModule), // Import SensorGatewayModule with forward reference to handle circular dependency
  ],
  controllers: [SensorController], // Specify the controller for handling HTTP requests
  providers: [SensorService, SensorGateway], // Provide SensorService and SensorGateway for dependency injection
  exports: [SensorService], // Export SensorService to be available in other modules
})
export class SensorModule {}
