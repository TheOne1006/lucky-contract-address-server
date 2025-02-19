import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

class WorkerBaseDto {
  @ApiProperty({
    example: '',
    description: '所属项目 id',
  })
  projectId: string;

  @ApiProperty({
    example: '',
    description: '所有者的钱包地址',
  })
  ownerAddress: string;

  @ApiProperty({
    example: '',
    description: '开始的 slat 值',
  })
  startSalt: string;

  @ApiProperty({
    example: '',
    description: '当前的 slat 值',
  })
  currentSalt: string;

  @ApiProperty({
    example: '',
    description: '结束的 slat 值',
  })
  endSalt: string;

  @ApiProperty({
    example: '',
    description: '顺序 不保证统一',
  })
  order: number;

  @ApiProperty({
    example: '',
    description: '状态',
  })
  status: string;

  @ApiProperty({
    example: '',
    description: '每分钟算力',
  })
  rateMin: number;
}

/**
 * 项目信息 dtos
 */
export class WorkerDto extends WorkerBaseDto {
  @Expose({
    name: 'objectId',
  })
  id: string;
}

export class WorkerCreateDto extends WorkerBaseDto {
  @IsNotEmpty()
  ownerAddress: string;

  @IsNotEmpty()
  currentSalt: string;

  @IsNotEmpty()
  startSalt: string;

  @IsNumber()
  @Min(1)
  @Max(10000)
  order: number;

  @IsNotEmpty()
  status: string;
}

export class WorkerUpdateDto {
  @IsNotEmpty()
  currentSalt: string;
}
