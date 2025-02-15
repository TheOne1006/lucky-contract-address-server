/* istanbul ignore file */
import { Module } from '@nestjs/common';

// import {
//   utilities as nestWinstonModuleUtilities,
//   WinstonModule,
// } from 'nest-winston';
import { CoreModule } from './core/core.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './projects/projects.module';
import {
  WorkerModule,
  WorkerController,
  ProjectWorkerController,
} from './workers';

import { ResultModule, ProjectResultController } from './results';

@Module({
  imports: [CoreModule, ProjectModule, WorkerModule, ResultModule],
  controllers: [
    AppController,
    WorkerController,
    ProjectWorkerController,
    ProjectResultController,
  ],
  providers: [AppService],
})
export class AppModule {}
