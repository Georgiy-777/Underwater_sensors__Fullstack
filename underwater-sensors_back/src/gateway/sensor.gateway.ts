import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SensorService } from '../sensor/sensor.service';
import { forwardRef, Inject } from '@nestjs/common';

// Decorator to define this class as a WebSocket gateway
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Update to match your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // Property to hold the WebSocket server instance
  @WebSocketServer() server: Server;

  // Injecting SensorService using forwardRef to handle circular dependency
  constructor(
    @Inject(forwardRef(() => SensorService))
    private readonly sensorService: SensorService,
  ) {}

  // Method called after WebSocket server initialization
  afterInit(server: Server) {
    console.log('WebSocket server initialized', server);
  }

  // Method called when a client connects to the WebSocket server
  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`, args);
  }

  // Method called when a client disconnects from the WebSocket server
  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Method to send sensor updates to connected clients
  async sendSensorsUpdate() {
    // Check if sensorService is initialized
    if (!this.sensorService) {
      console.error('SensorService is not initialized');
      return;
    }

    // Get sensor data from the service
    const sensors = await this.sensorService.getSensors();

    // Emit the sensor data to all connected clients
    this.server.emit('sensors-update', sensors);
  }
}
