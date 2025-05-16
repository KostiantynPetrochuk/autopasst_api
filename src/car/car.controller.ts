import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CarService } from './car.service';

import { CreateCarDto } from './dto/createCar.dto';
import { Car } from './car.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CarFilterDto } from './dto/car-filter.dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async getFilteredCars(@Query() filter: CarFilterDto) {
    return this.carService.getFilteredCars(filter);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 50 },
        { name: 'specification', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/cars',
          filename: (req, file, cb) => {
            const fileName = `${Date.now()}${extname(file.originalname)}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async uploadFile(
    @Body() body: any,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      specification?: Express.Multer.File[];
    },
  ) {
    const imageNames = files.files?.map((file) => file.filename) || [];
    const specFilename = files.specification?.[0]?.filename || '';
    const createCarDto = plainToInstance(CreateCarDto, {
      ...body,
      imageNames,
      specFilename,
      status: 'in_stock',
    });
    const errors = await validate(createCarDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return this.carService.createCar(createCarDto);
  }

  @Get(':id')
  async getCar(@Param('id') id: number): Promise<Car> {
    const car = await this.carService.getCarById(id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }
}
