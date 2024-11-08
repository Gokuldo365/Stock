import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { temp_cart } from '@Root/Database/Table/Product/temp_cart';
import { TempCartModel } from '@Model/Product/TempCart.model';
import { DataSource } from 'typeorm';

@Injectable()
export class TempCartService {
    constructor( private _DataSource: DataSource ) {
    }

    async GetAll() {
        const TempCartData = this._DataSource.manager.createQueryBuilder(temp_cart, 'tc')
          .select([
            'tc.product_id as product_id',
            'tc.product_variants_id as product_variants_id',
            'tc.combination as combination',
            'tc.purity_id as purity_id',
            'tc.category_id as category_id',
            'tc.stock as stock',
            'tc.quantity as quantity',
            'tc.is_cart as is_cart',
            'p.name AS product_name',
            'p.product_code as product_code',
            'c.name as category_name',
            'pu.name as purity_name'
          ])
          .leftJoin('product', 'p', 'p.id = tc.product_id')
          .leftJoin('category', 'c', 'c.id = tc.category_id')
          .leftJoin('purity', 'pu', 'pu.id = tc.purity_id')

        return await TempCartData.getRawMany();
      }

    async GetById(UserId: string) {
        const TempCartGetById = await temp_cart.findOne({ where: { created_by_id: UserId } });
        if (!TempCartGetById) {
            throw new Error('Record not found')
        }
        return TempCartGetById;
    }

    async Insert(TempCartData: TempCartModel, UserId: string) {
        const _TempCartData = new temp_cart();
        _TempCartData.product_id = TempCartData.product_id;
        _TempCartData.product_variants_id = TempCartData.product_variants_id;
        _TempCartData.combination = TempCartData.combination;
        _TempCartData.category_id = TempCartData.category_id;
        _TempCartData.purity_id = TempCartData.purity_id;
        _TempCartData.stock = TempCartData.stock;
        _TempCartData.quantity = TempCartData.quantity;
        _TempCartData.is_cart = TempCartData.is_cart;
        _TempCartData.created_by_id = UserId;
        _TempCartData.created_on = new Date();
        await temp_cart.insert(_TempCartData);
        return _TempCartData;
    }

    async Update(Id: string, TempCartData: TempCartModel, UserId: string) {
        const TempCartUpdateData = await temp_cart.findOne({ where: { id: Id } });
        if (!TempCartUpdateData) {
            throw new Error('Record not found')
        }
        if (TempCartData.quantity <= 0 ) {
            const TempCartDataId = await temp_cart.findOne({ where: { id: Id } });
            await TempCartDataId.remove();
            return true; 
        }
        else {
        TempCartUpdateData.product_id = TempCartData.product_id;
        TempCartUpdateData.product_variants_id = TempCartData.product_variants_id;
        TempCartUpdateData.combination = TempCartData.combination;
        TempCartUpdateData.category_id = TempCartData.category_id;
        TempCartUpdateData.purity_id = TempCartData.purity_id;
        TempCartUpdateData.stock = TempCartData.stock;
        TempCartUpdateData.quantity = TempCartData.quantity;
        TempCartUpdateData.is_cart = TempCartData.is_cart;
        TempCartUpdateData.updated_by_id = UserId;
        TempCartUpdateData.updated_on = new Date();
        await temp_cart.update(Id, TempCartUpdateData);
    }
        return TempCartUpdateData;
    }

    async Delete(Id: string) {
      const TempCartData = await temp_cart.findOne({ where: { id: Id } });
      if (!TempCartData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await TempCartData.remove();
      return true;
    }
}
