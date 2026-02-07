import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum TemplateCategory {
  CRYPTO_EDUCATION = 'CRYPTO_EDUCATION',
  ECOMMERCE = 'ECOMMERCE',
  BANKING = 'BANKING',
  LOGISTICS = 'LOGISTICS',
  CUSTOM = 'CUSTOM',
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @IsString()
  subject: string;

  @IsString()
  htmlBody: string;

  @IsString()
  @IsOptional()
  textBody?: string;
}

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TemplateCategory)
  @IsOptional()
  category?: TemplateCategory;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  htmlBody?: string;

  @IsString()
  @IsOptional()
  textBody?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
