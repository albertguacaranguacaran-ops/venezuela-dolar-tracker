import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [RatesModule, VisitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
