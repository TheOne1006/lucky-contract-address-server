import { encodePacked, keccak256, getAddress } from 'viem/utils';
import {
  Controller,
  Post,
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

import { ProjectService, ProjectDto } from '../projects';

import { ResultCreateDto, ResultDto } from './dtos';

import { ResultService } from './results.server';

@Controller('api/projects')
@ApiTags('projects')
@UseInterceptors(SerializerInterceptor)
export class ProjectResultController {
  private readonly logger = new Logger('app:ProjectResultController');
  constructor(
    protected readonly projectService: ProjectService,
    protected readonly resultService: ResultService,
  ) {}

  checkOnServer(
    project: AV.Queriable & ProjectDto,
    salt: ResultCreateDto['salt'],
    input_address: ResultCreateDto['address'],
  ) {
    const byteCodeHash = project.get('byteCodeHash');
    const factoryAddress = getAddress(project.get('factoryAddress'));
    const address = getAddress(input_address);

    const encodedData = encodePacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', factoryAddress, salt as `0x${string}`, byteCodeHash],
    );
    const addressBytes = keccak256(encodedData);
    // 取后 20 字节（160 位）作为地址，与 Solidity 中的 uint160 转换一致
    const _serverComputedAddrress = `0x${addressBytes.slice(26)}`;
    const serverComputedAddrress = getAddress(_serverComputedAddrress);

    if (serverComputedAddrress !== address) {
      this.logger.error(
        `salt: ${salt}, address: ${address}, serverComputedAddrress: ${serverComputedAddrress}`,
      );
      throw new Error('address not match');
    }
  }

  async _setResult(
    project: AV.Queriable & ProjectDto,
    salt: ResultCreateDto['salt'],
    address: ResultCreateDto['address'],
  ): Promise<ResultDto> {
    const instance = await this.resultService.create({
      salt,
      address,
      projectId: project.id,
    });
    return instance;
  }

  @Post('/:pk/luckAddress')
  @ApiOperation({
    summary: '设置幸运地址',
  })
  @SerializerClass(ResultDto)
  async setResult(
    @Param('pk') pk: string,
    @Body() dto: ResultCreateDto,
    // @User() user: RequestUser,
  ): Promise<ResultDto> {
    const { salt, address: _address } = dto;
    const address = input_2_hex(_address);

    const project = await this.projectService.findByPk(pk);

    if (!project) {
      this.logger.error(
        `project ${pk} not found, salt: ${salt}, address: ${address}`,
      );
      throw new Error('project not found');
    }

    this.checkOnServer(project, salt, address);

    return {
      salt,
      address,
      projectId: pk,
      id: '0x11',
    };
  }
}
