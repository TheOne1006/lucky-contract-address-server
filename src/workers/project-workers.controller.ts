import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { AV } from '../common/leancloud';
import { input_2_hex } from '../utils/hex';

import {
  ApiOperation,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import { SerializerClass } from '../common/decorators';

import { WorkerService } from './workers.server';
import { ProjectService, ProjectDto } from '../projects/';

import { WorkerDto, WorkerUpdateDto, ProjectSetWorkersDto } from './dtos';

import { MAX_SALT } from '../constants';

@Controller('api/projects')
@ApiTags('projects')
@UseInterceptors(SerializerInterceptor)
export class ProjectWorkerController {
  private readonly logger = new Logger('app:ProjectWorkerController');
  constructor(
    protected readonly projectService: ProjectService,
    protected readonly workerService: WorkerService,
  ) {}

  @Post('/:pk/setWorkers')
  @ApiOperation({
    summary: '更新 worker 数量',
  })
  @SerializerClass(ProjectDto)
  async setWorkers(
    @Param('pk') pk: string,
    @Body() dto: ProjectSetWorkersDto,
    // @User() user: RequestUser,
  ): Promise<ProjectDto> {
    const { processSplit } = dto;

    // 必须是 8 的 倍数
    if (processSplit % 8 !== 0) {
      throw new Error(`processSplit must be a multiple of 8`);
    }

    const project = await this.projectService.findOne({
      objectId: pk,
    });

    if (!project) {
      throw new Error(`Project ${pk} not found`);
    }

    const workerSize = MAX_SALT / BigInt(processSplit);

    const allStartSalt: bigint[] = Array.from(
      { length: processSplit },
      (_, i) => BigInt(i) * workerSize + 1n,
    );
    // 0x1000000000000000000000000000000000000000000000000000000000000000
    const allStartSaltStrings = allStartSalt.map(
      (salt) => `0x${salt.toString(16).padStart(64, '0')}`,
    );

    const eqMapper = {
      projectId: project.id,
    };

    // find all workers
    const originWorkers = await this.workerService.findAll(eqMapper);

    const deleteWorkers: (AV.Queriable & WorkerDto)[] = [];
    const createWorkers: (AV.Object & WorkerDto)[] = [];
    const sortOrderWorkers: (AV.Queriable & WorkerDto)[] = [];

    // update workers
    allStartSaltStrings.forEach((startSaltStr, index) => {
      const worker = originWorkers.find(
        (worker) => startSaltStr == worker.get('startSalt'),
      );
      const endSalt =
        index !== processSplit - 1
          ? allStartSaltStrings[index + 1]
          : `0x${MAX_SALT.toString(16)}`;

      // 批量 upsert workers
      if (!worker) {
        const newWorker = this.workerService.createInstanceForBatch({
          ownerAddress: project.get('ownerAddress'),
          currentSalt: startSaltStr,
          startSalt: startSaltStr,
          order: index + 1,
          projectId: project.id,
          status: 'waiting',
          rateMin: 0,
          endSalt,
        });
        createWorkers.push(newWorker);
        sortOrderWorkers.push(newWorker);
      } else {
        worker.order = index + 1;
        worker.endSalt = endSalt;
        sortOrderWorkers.push(worker);
      }
    });
    // delete workers
    for (const worker of originWorkers) {
      if (!allStartSaltStrings.includes(worker.startSalt)) {
        deleteWorkers.push(worker);
      }
    }

    if (createWorkers.length) {
      await this.workerService.batchCreate(createWorkers);
    }
    if (deleteWorkers.length) {
      await this.workerService.batchDelete(deleteWorkers);
    }

    const instance = await this.projectService.updateByInstance(project, {
      processSplit,
    });

    return instance;
  }

  @Get('/:pk/allowWorker')
  @ApiOperation({
    summary: '更新 worker 数量',
  })
  @SerializerClass(WorkerDto)
  async providerAllowWorker(
    @Param('pk') pk: string,
    // @User() user: RequestUser,
  ): Promise<WorkerDto> {
    const workers = await this.workerService.findAll({
      projectId: pk,
    });

    // 查找 workers 中包含 status = 'waiting' 或者 updatedAt 距离现在超过 60 分钟的 worker
    // const expired = 1000
    const expired = 60 * 60 * 1000;
    const findIndex = workers.findIndex(
      (worker) =>
        worker.get('status') === 'waiting' ||
        new Date().getTime() - new Date(worker.get('updatedAt')).getTime() >
          expired,
    );

    if (findIndex === -1) {
      throw new Error(`No worker available`);
    }
    const worker = workers[findIndex];

    const currentStatus = worker.get('status');
    const currentVersion = worker.get('v');
    const nextVersion = parseInt(currentVersion) + 1;
    const cql = `update ${this.workerService.modelName} set status = 'running', v = ${nextVersion} where v = ${currentVersion} and objectId='${worker.id}' and status = '${currentStatus}'`;

    const result: any = await AV.Query.doCloudQuery(cql);

    if (result.results.length !== 1) {
      throw new Error(`No worker available`);
    }

    worker.set('status', 'running');
    worker.set('version', nextVersion);
    return worker;
  }

  @Get('/:pk/updateSalt/:startSalt/:currentSalt')
  @ApiOperation({
    summary: '更新 currentSalt',
  })
  @SerializerClass(WorkerDto)
  async updateSalt(
    @Param('pk') pk: string,
    @Param('startSalt') _startSalt: string,
    @Param('currentSalt') _currentSalt: string,
    // @User() user: RequestUser,
  ): Promise<WorkerDto> {
    const startSalt = input_2_hex(_startSalt);
    const currentSalt = input_2_hex(_currentSalt);

    const worker = await this.workerService.findOne({
      projectId: pk,
      startSalt,
    });

    if (!worker) {
      throw new Error(`Worker ${startSalt} not found`);
    }

    const prevCurrentSalt = worker.get('currentSalt');

    const hashSaltCount = BigInt(currentSalt) - BigInt(prevCurrentSalt);
    const hashSaltCountInt = Number(hashSaltCount);

    const prevUpdatedAt = new Date(worker.get('updatedAt')).getTime();
    const now = new Date().getTime();
    // 每分钟的 hash 数量
    const hashRateMin = hashSaltCountInt / (now - prevUpdatedAt) / (60 * 1000);

    const instance = await this.workerService.updateByInstance(worker, {
      currentSalt,
      v: worker.get('v') + 1,
      rateMin: hashRateMin,
    } as WorkerUpdateDto);
    return instance;
  }
}
