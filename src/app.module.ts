import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profile/profiles.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger.middleware';
import { BrandModule } from './brand/brand.module';
import { ModelModule } from './model/model.module';
import { CarModule } from './car/car.module';
import { CarSelectionController } from './car-selection/car-selection.controller';
import { CarSelectionService } from './car-selection/car-selection.service';
import { CarSelectionModule } from './car-selection/car-selection.module';
import { OrderModule } from './order/order.module';
import { SellCarRequestModule } from './sell-car-request/sell-car-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProfilesModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 500,
      },
    ]),
    LoggerModule,
    BrandModule,
    ModelModule,
    CarModule,
    CarSelectionModule,
    OrderModule,
    SellCarRequestModule,
  ],
  controllers: [AppController, CarSelectionController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CarSelectionService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
