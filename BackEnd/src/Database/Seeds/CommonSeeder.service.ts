import { DataSource } from 'typeorm';
import { user_role } from '../Table/Admin/user_role';
import { user } from '../Table/Admin/user';
import { currency } from '../Table/Admin/currency';
import { country } from '../Table/Admin/country';
import { company } from '../Table/Admin/company';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@Service/Encryption.service';

@Injectable()
export class CommonSeederService {
  constructor(
    private readonly _EncryptionService: EncryptionService,
    private _DataSource: DataSource
  ) {
  }
  async Run() {
    try {
      await this.UserRoleSeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.UserSeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CurrencySeed();
    }
    catch (e) {
      console.log(e);
    }
    try {
      await this.CountrySeed();
    }
    catch (e) {
      console.log(e);
    }
    try {
      await this.CreateMainQueryView();
    }
    catch (e) {
      console.log(e);
    }
  }


  UserRoleSeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user_role)
      .values([
        { name: 'Super Admin', code: '', created_by_id: "0", created_on: new Date() }
      ])
      .execute()
  }

  UserSeed = async () => {
    const UserRoleData = await user_role.findOne({ where: { name: "Super Admin" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user)
      .values([
        {
          user_role_id: UserRoleData.id,
          email: 'admin@user.com',
          password: this._EncryptionService.Encrypt('Login123!!'),
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CurrencySeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(currency)
      .values([
        {
          name: 'Afghan Afghani',
          code: 'AFN',
          symbol: '؋',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Albanian Lek',
          code: 'ALL',
          symbol: 'L',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Algerian Dinar',
          code: 'DZD',
          symbol: 'د.ج',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Argentine Peso',
          code: 'ARS',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Australian Dollar',
          code: 'AUD',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Brazilian Real',
          code: 'BRL',
          symbol: 'R$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'British Pound Sterling',
          code: 'GBP',
          symbol: '£',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Canadian Dollar',
          code: 'CAD',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Chilean Peso',
          code: 'CLP',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Chinese Yuan',
          code: 'CNY',
          symbol: '¥',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Cuban Peso',
          code: 'CUP',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Danish Krone',
          code: 'DKK',
          symbol: 'kr',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Egyptian Pound',
          code: 'EGP',
          symbol: '£',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Euro',
          code: 'EUR',
          symbol: '€',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Hong Kong Dollar',
          code: 'HKD',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Indian Rupee',
          code: 'INR',
          symbol: '₹',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Indonesian Rupiah',
          code: 'IDR',
          symbol: 'Rp',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Israeli New Shekel',
          code: 'ILS',
          symbol: '₪',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Japanese Yen',
          code: 'JPY',
          symbol: '¥',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Kenyan Shilling',
          code: 'KES',
          symbol: 'KSh',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Malaysian Ringgit',
          code: 'MYR',
          symbol: 'RM',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Mexican Peso',
          code: 'MXN',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Nigerian Naira',
          code: 'NGN',
          symbol: '₦',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Norwegian Krone',
          code: 'NOK',
          symbol: 'kr',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Pakistani Rupee',
          code: 'PKR',
          symbol: '₨',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Philippine Peso',
          code: 'PHP',
          symbol: '₱',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Russian Ruble',
          code: 'RUB',
          symbol: '₽',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Saudi Riyal',
          code: 'SAR',
          symbol: '﷼',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Singapore Dollar',
          code: 'SGD',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'South African Rand',
          code: 'ZAR',
          symbol: 'R',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'South Korean Won',
          code: 'KRW',
          symbol: '₩',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Swedish Krona',
          code: 'SEK',
          symbol: 'kr',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Swiss Franc',
          code: 'CHF',
          symbol: 'CHF',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Thai Baht',
          code: 'THB',
          symbol: '฿',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Turkish Lira',
          code: 'TRY',
          symbol: '₺',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'UAE Dirham',
          code: 'AED',
          symbol: 'د.إ',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'US Dollar',
          code: 'USD',
          symbol: '$',
          created_by_id: "0",
          created_on: new Date()
        },
        {
          name: 'Vietnamese Dong',
          code: 'VND',
          symbol: '₫',
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute();
  }


  CountrySeed = async () => {
    const CurrencyData = await currency.findOne({ where: { name: "Indian Rupee" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(country)
      .values([
        {
          name: 'India',
          code: 'IND',
          currency_id: CurrencyData.id,
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CreateMainQueryView = async () => {
    await this._DataSource.query(`
    create view vw_business_ledger_list_new as
	SELECT
        se.stock_entry_date_time AS stock_entry_date_time,
        se.stock_number AS stock_number,
        se.business_id AS business_id,
        b.business_name AS business_name,
        b.business_category_id AS business_category_id,
        bc.name AS business_category_name,
        se.metal_id AS metal_id,
        m.name AS metal_name,
        se.purity_id AS purity_id,
        p.code AS purity_code,
        p.melting AS melting,
        sed.product_id AS product_id,
        sed.combination AS combination,
        pr.name AS product_name,
        pr.product_code AS product_code,
        uom.name AS unit_name,
        CASE 
            WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
            WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
            ELSE 0
        end AS stock_qty,
        CASE WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty ELSE 0 END AS qty_in,
        CASE WHEN se.stock_entry_type = 'Issue' THEN sed.stock_qty ELSE 0 END AS qty_out,
        SUM(
            CASE 
                WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
                WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
                ELSE 0
            END
        ) OVER (ORDER BY se.stock_entry_date_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qty_balance,
        CASE 
            WHEN se.stock_entry_type = 'Receipt' THEN sed.net_weight
            WHEN se.stock_entry_type = 'Issue' THEN -sed.net_weight
            ELSE 0
        end as stock_weight,
        CASE WHEN se.stock_entry_type = 'Receipt' THEN sed.net_weight ELSE 0 END AS stock_in,
        CASE WHEN se.stock_entry_type = 'Issue' THEN sed.net_weight ELSE 0 END AS stock_out,
        SUM(
            CASE 
                WHEN se.stock_entry_type = 'Receipt' THEN sed.net_weight
                WHEN se.stock_entry_type = 'Issue' THEN -sed.net_weight
                ELSE 0
            END
        ) OVER (ORDER BY se.stock_entry_date_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS stock_balance,
        CASE 
            WHEN se.stock_entry_type = 'Receipt' THEN sed.fine_weight
            WHEN se.stock_entry_type = 'Issue' THEN -sed.fine_weight
            ELSE 0
        end as fine_weight,
        CASE WHEN se.stock_entry_type = 'Receipt' THEN sed.fine_weight ELSE 0 END AS fine_weight_in,
        CASE WHEN se.stock_entry_type = 'Issue' THEN sed.fine_weight ELSE 0 END AS fine_weight_out,
        SUM(
            CASE 
                WHEN se.stock_entry_type = 'Receipt' THEN sed.fine_weight
                WHEN se.stock_entry_type = 'Issue' THEN -sed.fine_weight
                ELSE 0
            END
        ) OVER (ORDER BY se.stock_entry_date_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS fine_weight_balance,
        CASE 
            WHEN se.stock_entry_type = 'Receipt' THEN (sed.mc_amount + sed.other_charges)
            WHEN se.stock_entry_type = 'Issue' THEN -(sed.mc_amount + sed.other_charges)
            ELSE 0
        end as other_amount,
        CASE WHEN se.stock_entry_type = 'Receipt' THEN (sed.mc_amount + sed.other_charges) ELSE 0 END AS amount_in,
        CASE WHEN se.stock_entry_type = 'Issue' THEN (sed.mc_amount + sed.other_charges) ELSE 0 END AS amount_out,
        
        SUM(
            CASE 
                WHEN se.stock_entry_type = 'Receipt' THEN (sed.mc_amount + sed.other_charges)
                WHEN se.stock_entry_type = 'Issue' THEN -(sed.mc_amount + sed.other_charges)
                ELSE 0
            END
        ) OVER (ORDER BY se.stock_entry_date_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS amount_balance
    FROM
        stock_entry se
        JOIN stock_entry_detail sed ON sed.stock_entry_id = se.id
        JOIN business b ON b.id = se.business_id
        JOIN business_category bc ON bc.id = b.business_category_id
        JOIN metal m ON m.id = se.metal_id
        JOIN purity p ON p.id = se.purity_id
        JOIN product pr ON pr.id = sed.product_id
        JOIN unit_of_measurement uom ON uom.id = pr.unit_of_measurement_id
    ORDER BY business_id, stock_entry_date_time;
      `)
  }
}
