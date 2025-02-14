import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  Query,
  UseInterceptors,
  Header,
  // Res,
  // Ip,
  // ParseIntPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { ExpressResponse } from '../common/decorators';

import {
  ApiOperation,
  // ApiResponse,
  ApiTags,
  // ApiSecurity,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { SerializerClass } from '../common/decorators';
import {
  // ParseJsonPipe, ParseArrayInt,
  ParseInt,
} from '../common/pipes';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
// import { ParseStringPipe } from '@nestjs/common';

import { ProjectService } from './projects.server';

import {
  ProjectDto,
  ProjectCreateDto,
  ProjectQueryWhereDto,
  ProjectUpdateDto,
} from './dtos';

@Controller('api/projects')
@ApiTags('projects')
@UseInterceptors(SerializerInterceptor)
export class ProjectController {
  private readonly logger = new Logger('app:ProjectController');
  constructor(protected readonly service: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: '创建项目',
  })
  @SerializerClass(ProjectDto)
  async create(
    @Body() dto: ProjectCreateDto,
    // @User() user: RequestUser,
  ): Promise<ProjectDto> {
    const instance = await this.service.create(dto);

    return instance ;
  }

  @Put()
  @ApiOperation({
    summary: '创建或者更新信息',
  })
  @ApiParam({
    name: 'id',
    example: '',
    type: String,
  })
  @ApiQuery({
    name: 'ownerAddress',
    example: '0x11233',
    type: String,
    required: true,
  })
  @SerializerClass(ProjectDto)
  async updateByPk(
    @Param('id') pk: string,
    @Query('ownerAddress') ownerAddress: string = "0x00",
    @Body() dto: ProjectUpdateDto,
  ): Promise<ProjectDto> {

    const newIns = await this.service.updateOne({
      pk,
      ownerAddress,
    }, { ...dto });

    return newIns;
  }

  @Get()
  @ApiOperation({
    summary: '项目列表',
  })
  @ApiQuery({
    name: '_sort',
    description: '排序字段',
    required: false,
  })
  @ApiQuery({
    name: '_order',
    description: '排序方式',
    required: false,
  })
  @ApiQuery({
    name: 'filter',
    description: 'filter',
    required: false,
  })
  @ApiQuery({
    name: '_end',
    description: '结束索引',
    required: false,
  })
  @ApiQuery({
    name: '_start',
    description: '开始索引',
    required: false,
  })
  @ApiQuery({
    name: 'ownerAddress',
    description: '所有者的地址',
    required: true,
  })
  @SerializerClass(ProjectDto)
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Expose-Headers', 'X-Total-Count')
  async list(
    @ExpressResponse() res: Response,
    @Query() where: ProjectQueryWhereDto = {},
    @Query('ownerAddress') ownerAddress: string = "0x00",
    @Query('_start', ParseInt) start?: number,
    @Query('_end', ParseInt) end?: number,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
  ): Promise<ProjectDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const offset = start || 0;
    const limit = end - start > 0 ? end - start + 1 : 0;

    const [sortAttr, sortBy] = sort && order ? [sort, order] : ['', ''];

    const eqMapper = {
      ...where,
      ownerAddress,
    };

    const list = await this.service.findAll(
      eqMapper,
      offset,
      limit,
      sortAttr,
      sortBy,
    );
    const count = await this.service.count(eqMapper);

    res.set('X-Total-Count', `projects ${start}-${end}/${count}`);
    // res.json(list)

    return list;
  }

  @Get('/:pk')
  @ApiOperation({
    summary: '项目信息',
  })
  @SerializerClass(ProjectDto)
  @ApiParam({ name: 'pk', description: 'pk', type: String })
  async findByPk(@Param('pk') pk: string): Promise<ProjectDto> {
    const instance = await this.service.findByPk(pk);

    return instance;
  }

  @Delete('/:pk')
  @ApiOperation({
    summary: '删除',
  })
  @SerializerClass(ProjectDto)
  @ApiParam({ name: 'pk', description: 'pk', type: String })
  async removeByPk(@Param('pk') pk: string): Promise<ProjectDto> {
    const instance = await this.service.removeByPk(pk);

    return instance;
  }
}
