import { Controller, Get, Post } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
    constructor(private readonly visitsService: VisitsService) { }

    @Get()
    getVisits() {
        return { count: this.visitsService.getVisits() };
    }

    @Post('increment')
    incrementVisits() {
        const count = this.visitsService.incrementVisits();
        return { count };
    }
}
