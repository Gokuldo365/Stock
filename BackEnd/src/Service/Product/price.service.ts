import { PriceModel } from "@Model/Product/Price.model";
import { Injectable } from "@nestjs/common";
import { price } from "@Root/Database/Table/Product/price";
import { purity } from "@Root/Database/Table/Product/purity";
import { DataSource } from "typeorm";

@Injectable()
export class PriceService {
    constructor(private _DataSource: DataSource) {
    }


    async GetAll() {
      const PriceList = await this._DataSource.query(`
          select
	p.date_time,
	m.name as metal_name,
	p2.name as purity_name,
	p.price
from
	price p
inner join
	purity p2
on
	p2.id = p.purity_id
inner join
	metal m
on
	m.id = p.metal_id
order by
	p2.display_order asc
        `)
      return PriceList;
  }


  async Insert(priceData : PriceModel, UserId: string){
    const PurityData = await purity.find({where:{metal_id : priceData.metal_id}});
    const PriceCalculation = PurityData.map(purityData => {
      const calculatedPrice = Math.ceil(priceData.price * (purityData.melting / 100));
      return {
        purity: purityData.id,
        calculatedPrice,
      };
    });

    const ExistingData = await price.find({ where: { metal_id: priceData.metal_id } });

    if (ExistingData.length > 0) {
      await price.delete({ metal_id: priceData.metal_id });
    }

    for (const priceInfo of PriceCalculation) {
      const _priceData = new price();
      _priceData.date_time = priceData.date_time;
      _priceData.metal_id = priceData.metal_id;
      _priceData.purity_id = priceInfo.purity;
      _priceData.price = priceInfo.calculatedPrice;
      _priceData.created_by_id = UserId;
      _priceData.created_on = new Date();
      await price.insert(_priceData);
    }
    return PriceCalculation;
  }


  }
