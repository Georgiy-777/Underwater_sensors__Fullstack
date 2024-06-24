import { NestFactory } from '@nestjs/core'; // Importing NestFactory to create an instance of the Nest application
import { AppModule } from './app.module'; // Importing the root module of the application
import { IoAdapter } from '@nestjs/platform-socket.io'; // Importing IoAdapter for WebSocket support

async function bootstrap() {
  // The bootstrap function is used to set up and start the NestJS application

  const app = await NestFactory.create(AppModule);
  // Creating an instance of the NestJS application using the root module (AppModule)

  app.useWebSocketAdapter(new IoAdapter(app));
  // Configuring the application to use IoAdapter for WebSocket communication

  app.enableCors({
    origin: 'http://localhost:3000',
    // Allowing CORS requests from 'http://localhost:3000'
    methods: ['GET', 'POST'],
    // Allowing only GET and POST HTTP methods for CORS requests
    credentials: true,
    // Allowing credentials (cookies, authorization headers, etc.) to be included in CORS requests
  });

  await app.listen(5000);
  // Starting the NestJS application to listen on port 5000

  console.log(`Application is running on: ${await app.getUrl()}`);
  // Logging the URL where the application is running
}

bootstrap();
// Calling the bootstrap function to start the application
