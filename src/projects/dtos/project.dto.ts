import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ArrayNotEmpty,
  IsString,
  IsObject,
  Matches,
} from 'class-validator';

class ProjectBaseDto {
  @ApiProperty({
    example: 'demo',
    description: '',
  })
  title: string;

  @ApiProperty({
    example: '0x111',
    description: '所有者的钱包地址',
  })
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
  })
  ownerAddress: string;

  @ApiProperty({
    example: '{}',
    description: '相关配置',
  })
  @Exclude()
  config: Record<string, any>;

  @ApiProperty({
    example: 'waiting',
    description: '项目状态',
  })
  status: string;

  @ApiProperty({
    example: '0x22222',
    description: 'final byteCode',
  })
  @Exclude()
  @IsNotEmpty()
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
  })
  byteCode: string;

  @ApiProperty({
    example: '0x33333',
    description: 'final byteCode hash',
  })
  @IsNotEmpty()
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
  })
  byteCodeHash: string;

  @ApiProperty({
    example: '0x38888888',
    description: '工厂地址',
  })
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
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
    example: '8',
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

  @IsObject()
  config: Record<string, any>;

  @IsNotEmpty()
  byteCodeHash: string;
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
