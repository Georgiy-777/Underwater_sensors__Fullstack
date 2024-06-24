import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorModule } from './sensor/sensor.module';
import { SensorGatewayModule } from './gateway/sensor-gateway.module';
import { Sensor } from './sensor/sensor.entity';

@Module({
  imports: [
    // ConfigModule for handling environment variables, set to be globally available across the application
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeOrmModule for database connection configuration
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: process.env.DB_HOST || 'localhost', // Database host
      port: parseInt(process.env.DB_PORT, 10), // Database port
      username: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      database: process.env.DB_NAME, // Database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to the entities
      synchronize: true, // Auto synchronize schema with database
      // logging: true, // Uncomment to enable query logging
    }),

    // TypeOrmModule for the Sensor entity
    TypeOrmModule.forFeature([Sensor]), // Import Sensor entity for use with TypeORM

    // Importing the SensorModule which contains the logic for the sensor operations
    SensorModule,

    // Importing the SensorGatewayModule which contains the logic for WebSocket communications
    SensorGatewayModule,
  ],
})
export class AppModule {}
