import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsNotEmpty, IsNumber, Min, Max, ArrayNotEmpty, IsString } from 'class-validator';

class ProjectBaseDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  title: string;

  @ApiProperty({
    example: '',
    description: '所有者的钱包地址',
  })
  ownerAddress: string;

  @ApiProperty({
    example: '',
    description: '相关配置',
  })
  config: any;

  @ApiProperty({
    example: '',
    description: '项目状态',
  })
  status: string;


  @ApiProperty({
    example: '',
    description: 'final byteCode',
  })
  byteCode: string;

  @ApiProperty({
    example: '',
    description: '工厂地址',
  })
  factoryAddress: string;

  @ApiProperty({
    example: '["88888888", "/99999999/"]',
    description: 'matchers',
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  matchers: string[];


  @ApiProperty({
    example: '',
    description: '拆分成多少份 default 16', 
  })
  processSplit: number;
}

/**
 * 项目信息 dtos
 */
export class ProjectDto extends ProjectBaseDto {
  @Expose({
    name: 'objectId',
  })
  id: string;
}

export class ProjectCreateDto extends ProjectBaseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ownerAddress: string;

  @IsNotEmpty()
  byteCode: string;

  @IsNotEmpty()
  factoryAddress: string;
  
  @IsNotEmpty()
  matchers: string[];

  @IsNumber()
  @Min(1)
  @Max(10000)
  processSplit: number;
}

export class ProjectUpdateDto {
  @ApiProperty({
    example: '',
    description: '相关配置',
  })
  config?: any;

  @IsNumber()
  @Min(1)
  @Max(10000)
  processSplit: number;
}
