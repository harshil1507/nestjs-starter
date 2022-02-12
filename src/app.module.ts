import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
console.log(path.join(__dirname, '/**/*.entity{.ts,.js}'));

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      isGlobal: true,
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string()
        //   .valid('development', 'production')
        // .default('development'),
        APP_PORT: Joi.number().required(),
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_PORT: Joi.number().required(),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required(),
        TYPEORM_SYNCHRONIZE: Joi.boolean().required(),
        TYPEORM_CONNECTION: Joi.string().required(),
        TYPEORM_ENTITIES: Joi.string().required(),
        TYPEORM_MIGRATIONS_DIR: Joi.string().required(),
        SALT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        TYPEORM_RUN_MIGRATION: Joi.string().required(),
      }),
      validationOptions: {
        // allowUnknown: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: +configService.get<number>('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
        entities: ['dist/**/*.entity{ .ts,.js}', '**/*.entity{ .ts,.js}'],
        migrations: ['dist/migration/*{.ts,.js}'],
        migrationsTableName: 'migrations_typeorm',
        migrationsRun: configService.get('TYPEORM_RUN_MIGRATION'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
