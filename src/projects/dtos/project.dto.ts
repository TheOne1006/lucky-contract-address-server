import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

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
  config: any;

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
