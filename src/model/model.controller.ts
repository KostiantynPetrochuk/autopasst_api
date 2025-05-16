import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/createModel.dto';
import { UpdateModelDto } from './dto/updateModel.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  async createModel(@Body() createModelDto: CreateModelDto) {
    return this.modelService.createModel(
      createModelDto.brandId,
      createModelDto.modelName,
    );
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Patch()
  async updateModel(@Body() updateModelDto: UpdateModelDto) {
    return this.modelService.updateModel(
      updateModelDto.modelId,
      updateModelDto.modelName,
    );
  }
}
