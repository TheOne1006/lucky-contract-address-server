import { Injectable, Logger } from '@nestjs/common';
// import { AV } from '../common/leancloud';
import { LeanCloudBaseService } from '../common/leancloud';
import {
  WorkerDto,
  WorkerCreateDto,
  WorkerUpdateDto,
  // WorkerQueryWhereDto,
} from './dtos';

const MODEL_NAME = 'workers';

@Injectable()
export class WorkerService extends LeanCloudBaseService<
  WorkerDto,
  WorkerCreateDto,
  WorkerUpdateDto
> {
  private readonly logger = new Logger('app:WorkerService');

  constructor() {
    super(MODEL_NAME);
  }
}
