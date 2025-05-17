import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
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
  ParseIntPipe,
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
          destination: (req, file, cb) => {
            if (!req.body.folderName) {
              req.body.folderName = uuidv4();
            }
            const uploadPath = path.join('./uploads/cars', req.body.folderName);
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            const fileName = `${uniqueSuffix}${ext}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async saveCar(
    @Body() body: any,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      specification?: Express.Multer.File[];
    },
  ) {
    const folderName = body.folderName;
    const imageNames = (files.files || []).map(
      (file) => `${folderName}/${file.filename}`,
    );
    const specFilename = files.specification?.[0]
      ? `${folderName}/${files.specification[0].filename}`
      : '';
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

  @Get('featured')
  async getFeaturedCars() {
    return await this.carService.getFeaturedCars();
  }

  @Get(':id')
  async getCar(@Param('id') id: number): Promise<Car> {
    const car = await this.carService.getCarWithDetailsById(id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  @Get('brand/:id')
  async getCarsByBrand(@Param('id', ParseIntPipe) brandId: number) {
    const cars = await this.carService.getCarsByBrand(brandId);
    if (!cars || cars.length === 0) {
      throw new NotFoundException('Cars not found.');
    }
    return { cars };
  }
}
