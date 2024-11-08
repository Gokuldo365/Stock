import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@Controller/Admin/User.controller';
import { UserRoleController } from '@Controller/Admin/UserRole.controller';
import { LoginController } from '@Controller/Auth/Login.controller';
import { ExceptionHelper } from '@Helper/Exception.helper';
import { UserService } from '@Service/Admin/User.service';
import { UserRoleService } from '@Service/Admin/UserRole.service';
import { AuthService } from '@Service/Auth/Auth.service';
import { JwtStrategy } from '@Service/Auth/JwtStrategy.service';
import { EmailService } from '@Service/Email.service';
import { EmailConfigController } from '@Controller/Admin/EmailConfig.controller';
import { EmailConfigService } from '@Service/Admin/EmailConfig.service';
import { CountryController } from '@Controller/Admin/Country.controller';
import { CurrencyController } from '@Controller/Admin/Currency.controller';
import { CountryService } from '@Service/Admin/Country.service';
import { CurrencyService } from '@Service/Admin/Currency.service';
import { CompanyController } from '@Controller/Admin/Company.controller';
import { CompanyService } from '@Service/Admin/Company.service';
import { CommonService } from '@Service/Common.service';
import Configuration from './Config/Configuration';
import { EncryptionService } from '@Service/Encryption.service';
import { CommonSeederService } from '@Database/Seeds/CommonSeeder.service';
import { MailerService } from '@Service/Mailer.service';
import { ErrorLogService } from '@Service/Admin/ErrorLog.service';
import { ErrorLogController } from '@Controller/Admin/ErrorLog.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuditLogService } from '@Service/Admin/AuditLog.service';
import { AuditLogController } from '@Controller/Admin/AuditLog.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AutoNumberController } from '@Controller/Admin/AutoNumber.controller';
import { Redis } from 'ioredis';
import { CacheService } from '@Service/Cache.service';
import { MetalController } from './Controller/Product/Metal.controller';
import { MetalService } from './Service/Product/Metal.service';
import { CategoryController } from './Controller/Product/Category.controller';
import { CategoryService } from './Service/Product/Category.service';
import { ProductController } from './Controller/Product/Product.controller';
import { ProductService } from './Service/Product/Product.service';
import { OrderDetailController } from './Controller/Product/OrderDetail.controller';
import { OrderDetailService } from './Service/Product/OrderDetail.service';
import { ProductImageController } from './Controller/Product/ProductImage.controller';
import { ProductImageService } from './Service/Product/ProductImage.service';
import { join } from 'path';
import { StockEntryService } from './Service/Product/StockEntry.service';
import { StockEntryController } from './Controller/Product/StockEntry.controller';
import { PurityController } from './Controller/Product/Purity.controlleer';
import { PurityService } from './Service/Product/Purity.service';
import { EmployeeController } from './Controller/Product/Employee.controller';
import { EmployeeService } from './Service/Product/Employee.service';
import { MixedMaterialController } from './Controller/Product/MixedMaterial.controller';
import { MixedMaterialService } from './Service/Product/MixedMaterial.service';
import { AttributeController } from './Controller/Product/Attribute.controller';
import { AttributeService } from './Service/Product/Attribute.service';
import { AttributeDetailController } from './Controller/Product/AttributeDetail.controller';
import { AttributeDetailService } from './Service/Product/AttributeDetail.service';
import { UnitOfMeasurementController } from './Controller/Product/UnitOfMeasurement.controller';
import { UnitOfMeasurementService } from './Service/Product/UnitOfMeasurement.service';
import { StockEntryDetailController } from './Controller/Product/StockEntryDetail.controller';
import { StockEntryDetailService } from './Service/Product/StockEntryDetail.service';
import { ProductVariantsController } from './Controller/Product/ProductVariants.controller';
import { ProductVariantsService } from './Service/Product/ProductVariants.service';
import { StockReportService } from './Service/Product/StockReport.service';
import { StockReportController } from './Controller/Product/StockReport.controller';
import { BusinessCategoryService } from './Service/Product/BusinessCategory.service';
import { BusinessService } from './Service/Product/Business.service';
import { BusinessCategoryController } from './Controller/Product/BusinessCategory.controller';
import { BusinessController } from './Controller/Product/Business.controller';
import { StockEntryDetailOtherWeightController } from './Controller/Product/StockEntryDetailOtherWeight.controller';
import { StockEntryDetailOtherWeightService } from './Service/Product/StockEntryDetailOtherWeight.service';
import { BranchService } from './Service/Product/Branch.service';
import { BranchController } from './Controller/Product/Branch.controller';
import { PriceService } from './Service/Product/price.service';
import { PriceController } from './Controller/Product/Price.controller';
import { TempCartController } from './Controller/Product/TempCart.controller';
import { TempCartService } from './Service/Product/TempCart.service';
import { StockRateCutService } from './Service/Product/StockRateCutCalculation.service';
import { StockRateCutController } from './Controller/Product/StockRateCutCalculation.conntroller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/var/www/jewelStorage',
      serveRoot: '/jewelStorage',
      exclude: ['/api*', 'swagger'],
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/client',
      exclude: ['/api/*', 'swagger'],
    }),
    EventEmitterModule.forRoot({ maxListeners: 0 }),
    ConfigModule.forRoot({ isGlobal: true, load: [Configuration] }),
    MulterModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        type: 'mysql',
        host: _ConfigService.get("Database.Host"),
        port: _ConfigService.get("Database.Port"),
        username: _ConfigService.get("Database.User"),
        password: _ConfigService.get("Database.Password"),
        database: _ConfigService.get("Database.Name"),
        synchronize: _ConfigService.get("Database.Sync"),
        keepConnectionAlive: true,
        entities: [__dirname + '/Database/**/*.{ts,js}'],
        logger: "advanced-console",
        logging: _ConfigService.get("Database.LOG"),
        bigNumberStrings: false,
        supportBigNumbers: true,
        dateStrings: true,
        timezone: "local"
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
      property: 'user',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        secret: _ConfigService.get("JWT.SecertToken"),
        signOptions: { expiresIn: _ConfigService.get("JWT.ExpiresIn") },
      }),
      inject: [ConfigService]

    }),
  ],
  controllers: [
    LoginController,
    UserController,
    UserRoleController,
    EmailConfigController,
    CountryController,
    CurrencyController,
    CompanyController,
    ErrorLogController,
    AuditLogController,
    AutoNumberController,
    MetalController,
    CategoryController,
    ProductController,
    OrderDetailController,
    ProductImageController,
    StockEntryController,
    PurityController,
    EmployeeController,
    MixedMaterialController,
    AttributeController,
    AttributeDetailController,
    UnitOfMeasurementController,
    ProductVariantsController,
    StockEntryDetailController,
    StockReportController,
    BusinessCategoryController,
    BusinessController,
    StockEntryDetailOtherWeightController,
    BranchController,
    PriceController,
    TempCartController,
    StockRateCutController,
  ],
  providers: [
    AuthService,
    UserService,
    UserRoleService,
    EmailService,
    EmailConfigService,
    CountryService,
    CurrencyService,
    CompanyService,
    CommonService,
    JwtStrategy,
    ErrorLogService,
    MetalService,
    CategoryService,
    ProductService,
    OrderDetailService,
    ProductImageService,
    StockEntryService,
    PurityService,
    EmployeeService,
    MixedMaterialService,
    AttributeService,
    AttributeDetailService,
    UnitOfMeasurementService,
    ProductVariantsService,
    StockEntryDetailService,
    StockReportService,
    BusinessCategoryService,
    BusinessService,
    StockEntryDetailOtherWeightService,
    BranchService,
    PriceService,
    TempCartService,
    StockRateCutService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHelper,
    },
    MailerService,
    EncryptionService,
    CommonSeederService,
    AuditLogService,
    CacheService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          maxRetriesPerRequest: null,
          enableReadyCheck: false
        });
      },
    },
    CacheService
  ],
  exports: [AuthService, EncryptionService],
})
export class AppModule {
}
