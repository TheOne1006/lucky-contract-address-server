import { Module } from '@nestjs/common';
import { ProjectResultController } from './project-results.controller';
import { ResultService } from './results.server';

import { ProjectService } from '../projects';

@Module({
  imports: [],
  controllers: [ProjectResultController],
  providers: [ResultService, ProjectService],
  exports: [ResultService],
})
export class ResultModule {}
