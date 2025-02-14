import { Exclude } from 'class-transformer';
export class ProjectQueryWhereDto {
  title?: string;

  @Exclude()
  _end?: string;

  @Exclude()
  _sort?: string;

  @Exclude()
  _order?: string;

  @Exclude()
  _start?: string;
}
