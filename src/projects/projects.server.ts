import { Injectable, Logger } from '@nestjs/common';
// import { AV } from '../common/leancloud';
import { LeanCloudBaseService } from '../common/leancloud';
import {
  ProjectDto,
  ProjectCreateDto,
  ProjectUpdateDto,
  // ProjectQueryWhereDto,
} from './dtos';

const MODEL_NAME = 'projects';

@Injectable()
export class ProjectService extends LeanCloudBaseService<
  ProjectDto,
  ProjectCreateDto,
  ProjectUpdateDto
> {
  private readonly logger = new Logger('app:ProjectService');

  constructor() {
    super(MODEL_NAME);
  }

}
