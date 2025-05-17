import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CarSelectionService } from './car-selection.service';
import { CarSelection } from './car-selection.entity';
import { CarSelectionFilterDto } from './dto/car-selection-filter.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('car-selection')
export class CarSelectionController {
  constructor(private readonly carSelectionService: CarSelectionService) {}

  @Post()
  async addCarSelection(
    @Body() carSelectionData: Partial<CarSelection>,
  ): Promise<CarSelection> {
    carSelectionData.status = 'new';
    const id = await this.carSelectionService.save(carSelectionData);
    return this.carSelectionService.getCarSelectionById(id);
  }

  @Get()
  async getCarSelections(@Query() filter: CarSelectionFilterDto) {
    const { data, total } =
      await this.carSelectionService.getCarSelections(filter);
    return { carSelections: data, total };
  }

  @Get(':id')
  async getCarSelection(@Param('id', ParseIntPipe) id: number) {
    const carSelection = await this.carSelectionService.getCarSelectionById(id);
    if (!carSelection) {
      throw new NotFoundException('Car selection not found');
    }
    return { carSelection };
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Patch('status')
  async setCarSelectionStatus(
    @Body() requestData: { id: number; status: string },
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const updatePayload: Partial<CarSelection> = {
      id: requestData.id,
      status: requestData.status,
      updatedAt: new Date(),
    };

    await this.carSelectionService.editCarSelection(updatePayload);

    return { message: 'Car Selection status edited successfully!' };
  }
}
