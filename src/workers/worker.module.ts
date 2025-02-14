import { Module } from '@nestjs/common';
import { WorkerController } from './workers.controller';
import { ProjectWorkerController } from './project-workers.controller';
import { WorkerService } from './workers.server';

import { ProjectService } from '../projects';

@Module({
  imports: [],
  controllers: [WorkerController, ProjectWorkerController],
  providers: [WorkerService, ProjectService],
  exports: [WorkerService],
})
export class WorkerModule {}
