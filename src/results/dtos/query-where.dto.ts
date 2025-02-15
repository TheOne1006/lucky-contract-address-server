import { Exclude } from 'class-transformer';
export class ResultQueryWhereDto {
  projectId?: string;

  @Exclude()
  _end?: string;

  @Exclude()
  _sort?: string;

  @Exclude()
  _order?: string;

  @Exclude()
  _start?: string;
}
