import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsNumber()
  @IsOptional()
  rateLimit?: number;
}
