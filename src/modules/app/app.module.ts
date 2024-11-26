import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';
import { JwtStrategy } from '@libs/auth-lib/stratery/jwt.stratery';
import { AuthConfigModule } from '@modules/auth/auth.config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import { typeOrmConfig } from '@modules/db/data.initial';
import { FileUploadModule } from '@modules/files/files.module';
import { ProductsModule } from '@modules/products/products.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers';
import { AppService } from './services';
import { ColorModule } from '@modules/color-variant/color.module';
import { SizeModule } from '@modules/size-variant/size.module';
import { StorageModule } from '@modules/storage-variant/storage.module';
import { StoreModule } from '@modules/store/store.module';
import { BrandModule } from '@modules/brand/brand.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { BillboardModule } from '@modules/billboard/billboard.module';
import { ProductVariantModule } from '@modules/products-variant/variant.module';
import { OrderModule } from '@modules/order/order.module';
import { OrderItemModule } from '@modules/order-items/orderItem.module';
import { CartModule } from '@modules/cart/cart.module';
import { PromotionModule } from '@modules/promotion/promotion.module';

// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthConfigModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthLibModule,
    CloudinaryModule,
    UsersModule,
    FileUploadModule,
    AuthModule,
    StoreModule,
    BrandModule,
    BillboardModule,
    CategoriesModule,
    ProductsModule,
    ProductVariantModule,
    ColorModule,
    SizeModule,
    OrderItemModule,
    OrderModule,
    CartModule,
    PromotionModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, CloudinaryService],
  exports: [],
})
export class AppModule {}
// implements OnModuleInit {
//   constructor(private dataSource: DataSource) {}

//   async onModuleInit() {
//     await this.dataSource.runMigrations();
//   }
// }
