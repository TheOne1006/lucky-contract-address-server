import { Injectable, Logger } from '@nestjs/common';
// import { AV } from '../common/leancloud';
import { LeanCloudBaseService } from '../common/leancloud';
import {
  ResultDto,
  ResultCreateDto,
  // ResultUpdateDto,
  // ResultQueryWhereDto,
} from './dtos';

const MODEL_NAME = 'results';

@Injectable()
export class ResultService extends LeanCloudBaseService<
  ResultDto,
  ResultCreateDto,
  ResultCreateDto
> {
  private readonly logger = new Logger('app:ResultService');

  constructor() {
    super(MODEL_NAME);
  }
}
