import { Module, forwardRef } from '@nestjs/common';
import { SensorGateway } from './sensor.gateway';
import { SensorModule } from '../sensor/sensor.module';

@Module({
  imports: [forwardRef(() => SensorModule)],
  providers: [SensorGateway],
  exports: [SensorGateway],
})
export class SensorGatewayModule {}
