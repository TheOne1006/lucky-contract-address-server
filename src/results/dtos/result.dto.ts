import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, Matches } from 'class-validator';

class ResultBaseDto {
  @ApiProperty({
    example: '',
    description: 'projectId',
  })
  projectId: string;

  @ApiProperty({
    example: '0x111',
    description: '合约地址',
  })
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
  })
  address: string;

  @ApiProperty({
    example: '0x111',
    description: 'lucky salt',
  })
  @Matches(/^0x[0-9a-fA-F]+$/, {
    message: '必须是有效的十六进制字符串，以0x开头',
  })
  salt: string;
}

/**
 * 项目信息 dtos
 */
export class ResultDto extends ResultBaseDto {
  @Expose({
    name: 'objectId',
  })
  id: string;
}

export class ResultCreateDto extends ResultBaseDto {
  // @IsNotEmpty()
  // projectId: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  salt: string;
}
