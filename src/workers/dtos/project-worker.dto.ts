import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';


export class ProjectSetWorkersDto {
    @IsNumber()
    @Min(1)
    @Max(10000)
    processSplit: number;
}
