import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { RefreshJwtGuard } from './refresh.guard';
import { AuthService } from './auth.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from './roles.decorator';
import { SignUpDto } from './dto/signUpDto.dto';
import { SignInDto } from './dto/signInDto.dto';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new LoggerService(AuthController.name);

  // @Throttle({ short: { ttl: 1000, limit: 1 } })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.login, signInDto.pwd);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.login, signUpDto.pwd);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req['user']);
  }
}
