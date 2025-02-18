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
  UseGuards,
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

import {
  // ParseJsonPipe, ParseArrayInt,
  ParseInt,
} from '../common/pipes';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import { RolesGuard } from '../common/auth';
import { ROLE_ADMIN } from '../common/constants';
import { Roles, SerializerClass } from '../common/decorators';

import { WorkerService } from './workers.server';

import {
  WorkerDto,
  WorkerCreateDto,
  WorkerQueryWhereDto,
  WorkerUpdateDto,
} from './dtos';

@UseGuards(RolesGuard)
@Roles(ROLE_ADMIN)
@Controller('api/workers')
@ApiTags('workers')
@UseInterceptors(SerializerInterceptor)
export class WorkerController {
  private readonly logger = new Logger('app:WorkerController');
  constructor(protected readonly service: WorkerService) {}

  @Post()
  @ApiOperation({
    summary: '创建worker',
  })
  @SerializerClass(WorkerDto)
  async create(
    @Body() dto: WorkerCreateDto,
    // @User() user: RequestUser,
  ): Promise<WorkerDto> {
    const instance = await this.service.create(dto);

    return instance;
  }

  @Put()
  @ApiOperation({
    summary: '更新信息',
  })
  @ApiParam({
    name: 'id',
    example: '',
    type: String,
  })
  @SerializerClass(WorkerDto)
  async updateByPk(
    @Param('id') pk: string,
    @Body() dto: WorkerUpdateDto,
  ): Promise<WorkerDto> {
    const newIns = await this.service.updateByPk(pk, { ...dto });
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
  @SerializerClass(WorkerDto)
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Expose-Headers', 'X-Total-Count')
  async list(
    @ExpressResponse() res: Response,
    @Query() where: WorkerQueryWhereDto = {},
    @Query('ownerAddress') ownerAddress: string,
    @Query('_start', ParseInt) start?: number,
    @Query('_end', ParseInt) end?: number,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
  ): Promise<WorkerDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const offset = start || 0;
    const limit = end - start > 0 ? end - start + 1 : 0;

    const [sortAttr, sortBy] = sort && order ? [sort, order] : ['', ''];

    const eqMapper = {
      ...where,
      ...(ownerAddress ? { ownerAddress } : {}),
    };

    const list = await this.service.findAll(
      eqMapper,
      offset,
      limit,
      sortAttr,
      sortBy,
    );
    const count = await this.service.count(eqMapper);

    res.set('X-Total-Count', `workers ${start}-${end}/${count}`);
    // res.json(list)

    return list;
  }

  @Get('/:pk')
  @ApiOperation({
    summary: '项目信息',
  })
  @SerializerClass(WorkerDto)
  @ApiParam({ name: 'pk', description: 'pk', type: String })
  async findByPk(@Param('pk') pk: string): Promise<WorkerDto> {
    const instance = await this.service.findByPk(pk);

    return instance;
  }

  @Delete('/:pk')
  @ApiOperation({
    summary: '删除',
  })
  @SerializerClass(WorkerDto)
  @ApiParam({ name: 'pk', description: 'pk', type: String })
  async removeByPk(@Param('pk') pk: string): Promise<WorkerDto> {
    const instance = await this.service.removeByPk(pk);

    return instance;
  }
}
