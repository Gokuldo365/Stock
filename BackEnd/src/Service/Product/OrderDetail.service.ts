import { Injectable } from '@nestjs/common';
import { OrderDetailFilterModel, OrderDetailModel } from '@Model/Product/OrderDetail.model';
import { order_detail } from '@Root/Database/Table/Product/order_detail';
import { Between, DataSource } from 'typeorm';
import { CommonService } from '../Common.service';
import { order } from '@Root/Database/Table/Product/order';

@Injectable()
export class OrderDetailService {
  constructor(
    private _DataSource: DataSource,
    private _CommonService: CommonService,
) { }

// async GetAllOrder1(OrderDetailFilterModel: OrderDetailFilterModel) {
//   let OrderList = await order.find({ relations: ['customer'] });

//   if (OrderDetailFilterModel.date_from && OrderDetailFilterModel.date_to) {
//     const dateFrom = new Date(OrderDetailFilterModel.date_from);
//     dateFrom.setHours(0, 0, 0, 0);
//     const dateTo = new Date(OrderDetailFilterModel.date_to);
//     dateTo.setHours(0,0,0,0);

//     OrderList = OrderList.find({where:{order_date : Between(dateFrom, dateTo)}});
//   }
//   if (OrderDetailFilterModel.customer_id) {
//     OrderList = OrderList.filter(order => order.customer_id == OrderDetailFilterModel.customer_id);
//   }

//   if (OrderDetailFilterModel.order_no) {
//     OrderList = OrderList.filter(order => order.order_number == OrderDetailFilterModel.order_no);
//   }

//   return OrderList;
// }

async GetAllOrder(OrderDetailFilterModel: OrderDetailFilterModel) {
  const queryBuilder = this._DataSource.manager.createQueryBuilder(order, 'o')
  .select([
    'o.id',
'o.order_number',
'o.order_date',
'b.business_name',
'b.email',
'b.mobile_no',
'b.address'
  ])
  .innerJoin('business', 'b', 'o.business_id = b.id')

  if (OrderDetailFilterModel.date_from && OrderDetailFilterModel.date_to) {
    const dateFrom = new Date(OrderDetailFilterModel.date_from);
    const dateTo = new Date(OrderDetailFilterModel.date_to);
    queryBuilder.andWhere(
      "DATE_FORMAT(o.order_date, '%d-%b-%Y') BETWEEN DATE_FORMAT(:dateFrom, '%d-%b-%Y') AND DATE_FORMAT(:dateTo, '%d-%b-%Y')",
      { dateFrom, dateTo }
    );
  }
  if (OrderDetailFilterModel.business_id) {
    queryBuilder.andWhere('o.business_id = :business_id', { business_id: OrderDetailFilterModel.business_id });
  }

  if (OrderDetailFilterModel.order_no) {
    queryBuilder.andWhere('o.order_number = :order_no', { order_no: OrderDetailFilterModel.order_no });
  }
  const OrderData = await queryBuilder.getRawMany();

  return OrderData;
}



    async GetAll() {
      const OrderDetailData = this._DataSource.manager.createQueryBuilder(order_detail, 'od')
        .select([
          'od.id AS order_detail_id',
          'o.id AS order_id',
          'o.order_number AS order_number',
          'o.order_date AS order_date',
          'b.id AS business_id',
          'b.business_name AS business_name',
          'od.product_id AS product_id',
          'p.name AS product_name',
          'm.name AS metal_name',
          'p2.name AS purity_name',
          'b.name AS category_name',
          'od.quantity AS quantity'
        ])
        .innerJoin('order', 'o', 'o.id = od.order_id')
        .innerJoin('business', 'b', 'o.business_id = b.id')
        .innerJoin('metal', 'm', 'm.id = od.metal.id')
        .innerJoin('purity', 'p2', 'p2.id = od.purity_id')
        .innerJoin('category', 'c', 'c.id = od.category_id')
        .innerJoin('product', 'p', 'od.product_id = p.id')
        .andWhere('od.status = :status', { status: 1 })
        .andWhere('o.status = :status', { status: 1 })
        .orderBy('o.order_date', 'DESC');

      return await OrderDetailData.getRawMany();
    }


    async GetById(OrderId: string) {
      const OrderDetailData = this._DataSource.manager.createQueryBuilder('order_detail', 'od')
      .select([
        'od.id AS order_detail_id',
        'od.combination AS combination',
        'o.id AS order_id',
        'o.order_number AS order_number',
        'o.order_date AS order_date',
        'b.id AS business_id',
        'b.business_name AS business_name ',
        'od.product_id AS product_id',
        'p.name AS product_name',
        'm.name AS metal_name',
        'p2.name AS purity_name',
        'c2.name AS category_name',
        'od.quantity AS quantity'
      ])
      .innerJoin('order', 'o', 'o.id = od.order_id')
      .innerJoin('business', 'b', 'o.business_id = b.id')
      .innerJoin('product', 'p', 'od.product_id = p.id')
      .innerJoin('metal', 'm', 'm.id = od.metal.id')
      .innerJoin('purity', 'p2', 'p2.id = od.purity_id')
      .innerJoin('category', 'c2', 'c2.id = od.category_id')
      .andWhere('od.status = :status', { status: 1 })
      .andWhere('o.status = :status', { status: 1 })
      .andWhere('od.order_id = :order_id', { order_id: OrderId })
      .orderBy('o.order_date', 'DESC');
    return await OrderDetailData.getRawMany();
    }

  async Insert(OrderDetailData: OrderDetailModel, UserId: string) {

    if (OrderDetailData.order_id == null) {

      let OrderNumber = await this._DataSource.query(`SELECT so.order_number
        FROM \`order\` as so
        ORDER BY so.created_on DESC,
                 CAST(REGEXP_REPLACE(so.order_number, '[^0-9]', '0') AS UNSIGNED) DESC;`);

      if (OrderNumber[0]?.order_number) {
        OrderNumber[0].order_number = this._CommonService.AutoGenerateNumber(OrderNumber[0].order_number);
      } else {
        OrderNumber[0] = {};
        OrderNumber[0]['order_number'] = "ORD-00001";
      }
      // Insert into Order Table
      const _Order = new order();
      _Order.order_number = OrderNumber[0].order_number;
      _Order.order_date = OrderDetailData.order_date;
      _Order.business_id = OrderDetailData.business_id;
      _Order.created_by_id = UserId;
      _Order.created_on = new Date();
      await order.insert(_Order);
      // Insert Individual Products

      const ReturnData = []
      for (const individualProduct of OrderDetailData.Individual_product_list) {
        const _OrderDetailData = new order_detail();
        _OrderDetailData.order_id = _Order.id;
        _OrderDetailData.product_id = individualProduct.product_id;
        _OrderDetailData.purity_id = individualProduct.purity_id;
        _OrderDetailData.metal_id = individualProduct.metal_id;
        _OrderDetailData.category_id = individualProduct.category_id;
        _OrderDetailData.quantity = individualProduct.quantity;
        _OrderDetailData.created_by_id = UserId;
        _OrderDetailData.created_on = new Date();
        await order_detail.insert(_OrderDetailData);
        ReturnData.push(_OrderDetailData);
      }
      // Insert Attribute Products
      for (const attributeProduct of OrderDetailData.Attribute_product_list) {
        const _OrderDetailData = new order_detail();
        _OrderDetailData.order_id = _Order.id;
        _OrderDetailData.product_id = attributeProduct.product_id;
        _OrderDetailData.quantity = attributeProduct.quantity;
        _OrderDetailData.combination = attributeProduct.combination;
        _OrderDetailData.product_variants_id = attributeProduct.product_variants_id;
        _OrderDetailData.purity_id = attributeProduct.purity_id;
        _OrderDetailData.metal_id = attributeProduct.metal_id;
        _OrderDetailData.category_id = attributeProduct.category_id;
        _OrderDetailData.created_by_id = UserId;
        _OrderDetailData.created_on = new Date();
        await order_detail.insert(_OrderDetailData);
        ReturnData.push(_OrderDetailData);
      }
      return ReturnData;
    }

    else {
      // Insert Individual Products
      const ReturnData = []
      for (const individualProduct of OrderDetailData.Individual_product_list) {
        const _OrderDetailData = new order_detail();
        _OrderDetailData.order_id = OrderDetailData.order_id;
        _OrderDetailData.product_id = individualProduct.product_id;
        _OrderDetailData.purity_id = individualProduct.purity_id;
        _OrderDetailData.metal_id = individualProduct.metal_id;
        _OrderDetailData.category_id = individualProduct.category_id;
        _OrderDetailData.quantity = individualProduct.quantity;
        _OrderDetailData.created_by_id = UserId;
        _OrderDetailData.created_on = new Date();
        await order_detail.insert(_OrderDetailData);
        ReturnData.push(_OrderDetailData);
      }
      // Insert Attribute Products
      const AttributeProducts = []
      for (const attributeProduct of OrderDetailData.Attribute_product_list) {
        const _OrderDetailData = new order_detail();
        _OrderDetailData.order_id = OrderDetailData.order_id;
        _OrderDetailData.product_id = attributeProduct.product_id;
        _OrderDetailData.quantity = attributeProduct.quantity;
        _OrderDetailData.combination = attributeProduct.combination;
        _OrderDetailData.product_variants_id = attributeProduct.product_variants_id;
        _OrderDetailData.purity_id = attributeProduct.purity_id;
        _OrderDetailData.metal_id = attributeProduct.metal_id;
        _OrderDetailData.category_id = attributeProduct.category_id;
        _OrderDetailData.created_by_id = UserId;
        _OrderDetailData.created_on = new Date();
        await order_detail.insert(_OrderDetailData);
        AttributeProducts.push(_OrderDetailData);
      }
      return ReturnData;
    }
  }

}
