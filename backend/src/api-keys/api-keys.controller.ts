import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.apiKeysService.findAll(req.user.userId);
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string, @Req() req) {
    return this.apiKeysService.revoke(id, req.user.userId);
  }
}
