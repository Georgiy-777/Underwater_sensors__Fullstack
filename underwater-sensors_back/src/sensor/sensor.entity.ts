import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define the Sensor entity for the database
@Entity()
export class Sensor {
  // Primary key with auto-generated value
  @PrimaryGeneratedColumn()
  id: number;

  // Column to store the name of the sensor
  @Column()
  name: string;

  // Columns to store the position coordinates (X, Y, Z)
  @Column('float')
  positionX: number;

  @Column('float')
  positionY: number;

  @Column('float')
  positionZ: number;

  // Columns to store the water speed in three dimensions (X, Y, Z)
  @Column('float')
  waterSpeedX: number;

  @Column('float')
  waterSpeedY: number;

  @Column('float')
  waterSpeedZ: number;

  // Columns to store the thruster speed in three dimensions (X, Y, Z)
  @Column('float')
  thrusterSpeedX: number;

  @Column('float')
  thrusterSpeedY: number;

  @Column('float')
  thrusterSpeedZ: number;

  // Column to store the temperature value
  @Column('float')
  temperature: number;

  // Column to indicate whether the sensor is lost, with a default value of false
  @Column({ default: false })
  lost: boolean;

  // Columns to store the initial position coordinates (X, Y, Z)
  @Column('float')
  initialPositionX: number;

  @Column('float')
  initialPositionY: number;

  @Column('float')
  initialPositionZ: number;
}

// Corresponding SQL CREATE TABLE statement
// CREATE TABLE sensor (
//   id SERIAL PRIMARY KEY,                     // Auto-incrementing primary key
//   name VARCHAR(255) NOT NULL,                // Name of the sensor, cannot be null
//   positionX FLOAT NOT NULL,                  // Position coordinate X, cannot be null
//   positionY FLOAT NOT NULL,                  // Position coordinate Y, cannot be null
//   positionZ FLOAT NOT NULL,                  // Position coordinate Z, cannot be null
//   waterSpeedX FLOAT NOT NULL,                // Water speed in X direction, cannot be null
//   waterSpeedY FLOAT NOT NULL,                // Water speed in Y direction, cannot be null
//   waterSpeedZ FLOAT NOT NULL,                // Water speed in Z direction, cannot be null
//   thrusterSpeedX FLOAT NOT NULL,             // Thruster speed in X direction, cannot be null
//   thrusterSpeedY FLOAT NOT NULL,             // Thruster speed in Y direction, cannot be null
//   thrusterSpeedZ FLOAT NOT NULL,             // Thruster speed in Z direction, cannot be null
//   temperature FLOAT NOT NULL,                // Temperature value, cannot be null
//   lost BOOLEAN DEFAULT FALSE,                // Indicator if the sensor is lost, defaults to false
//   initialPositionX FLOAT NOT NULL,           // Initial position coordinate X, cannot be null
//   initialPositionY FLOAT NOT NULL,           // Initial position coordinate Y, cannot be null
//   initialPositionZ FLOAT NOT NULL            // Initial position coordinate Z, cannot be null
// );
