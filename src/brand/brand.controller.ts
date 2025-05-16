import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/createBrand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  async getBrands() {
    const result = await this.brandService.getBrands();
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (req, file, cb) => {
          const fileName = req.body.brandName.toLowerCase().replace(/ /g, '_');
          const ext = extname(file.originalname);
          cb(null, `${fileName}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = file.filename;
    const brandName = createBrandDto.brandName;
    return this.brandService.createBrand(brandName, fileName);
  }
}
