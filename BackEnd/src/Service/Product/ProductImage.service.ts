import { ProductImageModel, ProductImageUpdateModel } from "@Model/Product/ProductImage.model";
import { Injectable } from "@nestjs/common";
import { product_image } from "@Root/Database/Table/Product/product_image";
import * as fs from 'fs';
import * as path from 'path';
import { CommonService } from "../Common.service";
@Injectable()
export class ProductImageService {
    constructor(private _CommonService: CommonService) { }

    async UploadFiles(ProductImageData: ProductImageModel, UserId: string) {
      const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('product_image');
      ProductImageData.display_order = nextDisplayOrder;
      ProductImageData.created_by_id = UserId;
      ProductImageData.created_on = new Date();
      await product_image.insert(ProductImageData);
      return ProductImageData as product_image;
  }

    async GetImageUrl(ProductImageId: string) {
        const ProductImageData = await product_image.findOne({ where: { id: ProductImageId } });
        if (!ProductImageData) {
          throw new Error('Image not found.');
        }
        return ProductImageData;
    }

    async GetImagesByProductId(productId: string) {
        const productImages = await product_image.find({
            where: { product_id: productId }, order:{display_order:'ASC'}
        });
        return productImages;
    }

    async DeleteImage(ImageId: string, UserId: string) {
      const productImage = await product_image.findOne({ where: { id: ImageId } });
      if (!productImage) {
          throw new Error('Image not found.');
      }
      const ImagePath = path.resolve(productImage.uploaded_image);
      if (fs.existsSync(ImagePath)) {
          fs.unlinkSync(ImagePath);
      }
      await product_image.delete({ id: ImageId });
      return { message: 'Image deleted successfully.' };
  }

  async Update(Id: string, ProductImageData: ProductImageUpdateModel, UserId: string) {
    const ImageUpdateData = await product_image.findOne({ where: { id: Id } });
    if (!ImageUpdateData) {
        throw new Error('Record not found')
    }
    const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('product_image');
    if (ProductImageData.display_order > nextDisplayOrderUpdate) {
      throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
   }
    ImageUpdateData.display_order = ProductImageData.display_order;
    ImageUpdateData.updated_by_id = UserId;
    ImageUpdateData.updated_on = new Date();
    await product_image.update(Id, ImageUpdateData);
    return ImageUpdateData;
}
}
