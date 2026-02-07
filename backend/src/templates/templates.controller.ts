import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTemplateDto) {
    return this.templatesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('category') category?: string,
    @Query('isPublic') isPublic?: string,
  ) {
    const isPublicBool = isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;
    return this.templatesService.findAll(req.user.userId, category, isPublicBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.templatesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateTemplateDto) {
    return this.templatesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.templatesService.remove(id, req.user.userId);
  }
}
