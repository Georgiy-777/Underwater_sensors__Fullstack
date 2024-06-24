import { Controller, Post, Param, Body } from '@nestjs/common';
import { SensorService } from './sensor.service';

// Define a controller for handling requests related to sensors
@Controller('sensor')
export class SensorController {
  // Inject the SensorService into the controller
  constructor(private readonly sensorService: SensorService) {}

  // Define a POST endpoint at 'sensor/:name/thruster' to update thruster speeds
  @Post(':name/thruster')
  async updateThruster(@Param('name') name: string, @Body() thrusters: any) {
    // Call the updateThrusterSpeed method of SensorService with the provided parameters
    await this.sensorService.updateThrusterSpeed(name, thrusters);
    // Return a success status response
    return { status: 'success' };
  }
}
