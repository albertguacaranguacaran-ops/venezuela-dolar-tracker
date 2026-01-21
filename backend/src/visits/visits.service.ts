import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VisitsService {
    private visitsFile = path.join(process.cwd(), 'visits.json');

    private readVisits(): number {
        try {
            if (fs.existsSync(this.visitsFile)) {
                const data = fs.readFileSync(this.visitsFile, 'utf8');
                return JSON.parse(data).count || 0;
            }
        } catch (error) {
            console.error('Error reading visits:', error);
        }
        return 0;
    }

    private writeVisits(count: number): void {
        try {
            fs.writeFileSync(this.visitsFile, JSON.stringify({ count, lastUpdate: new Date().toISOString() }));
        } catch (error) {
            console.error('Error writing visits:', error);
        }
    }

    getVisits(): number {
        return this.readVisits();
    }

    incrementVisits(): number {
        const current = this.readVisits();
        const newCount = current + 1;
        this.writeVisits(newCount);
        return newCount;
    }
}
