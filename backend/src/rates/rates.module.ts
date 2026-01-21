import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { HistoryService } from './history.service';

@Module({
  controllers: [RatesController],
  providers: [RatesService, HistoryService],
  exports: [RatesService, HistoryService],
})
export class RatesModule { }
