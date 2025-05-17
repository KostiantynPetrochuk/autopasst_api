import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { SellCarRequestService } from './sell-car-request.service';
import { SellCarRequest } from './sell-car-request.entity';
import { SellCarRequestFilterDto } from './dto/sell-car-request-filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('sell-car-request')
export class SellCarRequestController {
  constructor(private readonly sellCarRequestService: SellCarRequestService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!req.body.folderName) {
            req.body.folderName = uuidv4();
          }
          const uploadPath = path.join(
            './uploads/sell_car_requests',
            req.body.folderName,
          );
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addSellCarRequest(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<SellCarRequest> {
    const folderName = body.folderName;
    const imagePaths = files.map((file) => `${folderName}/${file.filename}`);
    const sellCarRequest: Partial<SellCarRequest> = {
      brand: body.brand,
      model: body.model,
      year: body.year,
      mileage: body.mileage,
      price: body.price,
      name: body.name,
      phone: body.phone,
      infoMethod: body.infoMethod,
      contact: body.contact,
      countryOfExploitation: body.countryOfExploitation,
      status: 'new',
      imageNames: imagePaths,
    };
    const id = await this.sellCarRequestService.save(sellCarRequest);
    return this.sellCarRequestService.getSellCarRequestById(id);
  }

  @Get()
  async getSellCarRequests(@Query() filter: SellCarRequestFilterDto) {
    const { data, total } =
      await this.sellCarRequestService.getSellCarRequests(filter);
    return { sellCarRequests: data, total };
  }

  @Get(':id')
  async getSellCarRequest(@Param('id', ParseIntPipe) id: number) {
    const sellCarRequest =
      await this.sellCarRequestService.getSellCarRequestById(id);
    if (!sellCarRequest) {
      throw new NotFoundException('SellCarRequest not found');
    }
    return { sellCarRequest };
  }

  @Patch('status')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  async setSellCarRequestStatus(
    @Body() body: { id: number; status: string },
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User not found');
    }
    const updatePayload: Partial<SellCarRequest> = {
      id: body.id,
      status: body.status,
      updatedAt: new Date(),
    };
    await this.sellCarRequestService.editSellCarRequest(updatePayload);
    return { message: 'SellCarRequest status edited successfully!' };
  }
}
