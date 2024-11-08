import { BusinessLedgerModel, MetalStockModel, StockLedgerModel, StockReportModel } from "@Model/Product/StockEntry.model";
import { Injectable } from "@nestjs/common";
import { company } from "@Root/Database/Table/Admin/company";
import { stock_entry } from "@Root/Database/Table/Product/stock_entry";
import { stock_entry_detail } from "@Root/Database/Table/Product/stock_entry_detail";
import { productTypeEnum } from "@Root/Helper/Enum/InwardTypeEnum";
import { DataSource } from "typeorm";

@Injectable()
export class StockReportService {
    constructor( private _DataSource: DataSource ) {
    }

    async StockReportFilter(stockReport: StockReportModel) {
        const query = this._DataSource.manager.createQueryBuilder(stock_entry_detail, 'sed')
            .select([
                'c.id AS category_id',
                'c.name AS category',
                'p.id AS product_id',
                'p.name AS item',
                'p.product_code AS model',
                'pv.id AS product_variants_id',
                `CASE
                    WHEN p.product_type = :individualProduct THEN NULL
                    ELSE MAX(sed.combination) -- Use MAX() to handle the grouping issue
                END AS variants`,
                'uom.name AS unit',
                'm.id as metal_id',
                'm.name as metal_name',
                'pur.id as purity_id',
                'pur.name as purity_name',
                `SUM(
                    CASE
                        WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
                        WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
                        ELSE 0
                    END
                ) AS total_quantity`
            ])
            .innerJoin('product', 'p', 'sed.product_id = p.id')
            .innerJoin('category', 'c', 'p.category_id = c.id')
            .leftJoin('product_variants', 'pv', 'sed.product_variants_id = pv.id')
            .innerJoin('unit_of_measurement', 'uom', 'p.unit_of_measurement_id = uom.id')
            .innerJoin('stock_entry', 'se', 'se.id = sed.stock_entry_id')
            .innerJoin('metal', 'm', 'm.id = p.metal_id')
            .innerJoin('purity', 'pur', 'pur.id = p.purity_id')
            .groupBy('c.id')
            .addGroupBy('c.name')
            .addGroupBy('p.id')
            .addGroupBy('p.name')
            .addGroupBy('p.product_code')
            .addGroupBy('pv.id')
            .addGroupBy('uom.name')
            .addGroupBy('m.id')
            .addGroupBy('m.name')
            .addGroupBy('pur.id')
            .addGroupBy('pur.name')
            .having(
                `SUM(
                    CASE
                        WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
                        WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
                        ELSE 0
                    END
                ) > 0`
            )
            .setParameter('individualProduct', productTypeEnum.Indivudual_Product);

        if (stockReport.metal_id) {
            query.andWhere('m.id = :metal_id', { metal_id: stockReport.metal_id });
        }

        if (stockReport.purity_id) {
            query.andWhere('pur.id = :purity_id', { purity_id: stockReport.purity_id });
        }

        if (stockReport.category_id) {
            query.andWhere('c.id = :category_id', { category_id: stockReport.category_id });
        }

        if (stockReport.item_name_code) {
            const itemNameCodeLower = stockReport.item_name_code.toLowerCase();
            query.andWhere(
                '(LOWER(p.name) LIKE :nameOrCode OR LOWER(p.product_code) LIKE :nameOrCode)',
                { nameOrCode: `%${itemNameCodeLower}%` }
            );
        }

        const StockReportData = await query.getRawMany();
        return StockReportData;
    }


    async ItemLedger(StockLedgerData: StockLedgerModel){
      const queryBuilder = this._DataSource.manager.createQueryBuilder('stock_entry_detail', 'sed')
      .select([
        'se.stock_entry_date_time as stock_entry_date_time',
        'se.stock_number as stock_number',
        'se.stock_entry_type',
        'sed.product_id',
        'p.name as product_name',
        'sed.stock_qty AS Qty',
        'uom.name AS unit_name',
        `
          CASE
            WHEN se.stock_entry_type IN ('Receipt') THEN b.business_name
            ELSE b.business_name
          END AS narration
        `,
        `
          CASE
            WHEN se.stock_entry_type IN ('Receipt') THEN sed.stock_qty
            ELSE 0
          END AS qty_in
        `,
        `
          CASE
            WHEN se.stock_entry_type IN ('Issue') THEN sed.stock_qty
            ELSE 0
          END AS qty_out
        `,
        `
          SUM(
          CASE
            WHEN se.stock_entry_type IN ('Receipt') THEN sed.stock_qty
            WHEN se.stock_entry_type IN ('Issue') THEN -sed.stock_qty
            ELSE 0
          END
        ) OVER (
          ORDER BY se.stock_entry_date_time
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS qty_balance
        `,
        `
        CASE
          WHEN se.stock_entry_type IN ('Receipt') THEN sed.net_weight
          ELSE 0
        END AS stock_in
        `,
        `
        CASE
          WHEN se.stock_entry_type IN ('Issue') THEN sed.net_weight
          ELSE 0
        END AS stock_out
        `,
        `
        SUM(
        CASE
            WHEN se.stock_entry_type IN ('Receipt') THEN sed.net_weight
            WHEN se.stock_entry_type IN ('Issue') THEN -sed.net_weight
            ELSE 0
          END
        ) OVER (
          ORDER BY se.stock_entry_date_time
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS stock_balance
        `,
        `
        CASE
            WHEN se.stock_entry_type IN ('Receipt') THEN sed.fine_weight
            ELSE 0
        END AS fine_weight_in
        `,
        `
        CASE
          WHEN se.stock_entry_type IN ('Issue') THEN sed.fine_weight
          ELSE 0
        END AS fine_weight_out
        `,
        `
        SUM(
      CASE
        WHEN se.stock_entry_type IN ('Receipt') THEN sed.fine_weight
        WHEN se.stock_entry_type IN ('Issue') THEN -sed.fine_weight
        ELSE 0
      END
      ) OVER (
        ORDER BY se.stock_entry_date_time
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS fine_weight_balance
        `
      ])
      .innerJoin('stock_entry', 'se', 'se.id = sed.stock_entry_id')
      .innerJoin('product', 'p', 'p.id = sed.product_id')
      .innerJoin('category', 'c', 'c.id = p.category_id')
      .innerJoin('metal', 'm', 'm.id = se.metal_id')
      .innerJoin('purity', 'p2', 'p2.id = se.purity_id')
      .innerJoin('unit_of_measurement', 'uom', 'uom.id = p.unit_of_measurement_id')
      .leftJoin('product_variants', 'pv', 'pv.id = sed.product_variants_id')
      .innerJoin('business', 'b', 'b.id = se.business_id')
      .orderBy('se.stock_entry_date_time', 'ASC');

      if (StockLedgerData.metal_id) {
        queryBuilder.andWhere('m.id = :metal_id', { metal_id: StockLedgerData.metal_id });
      }

      if (StockLedgerData.purity_id) {
        queryBuilder.andWhere('p2.id = :purity_id', { purity_id: StockLedgerData.purity_id });
      }

      if (StockLedgerData.category_id) {
        queryBuilder.andWhere('c.id = :category_id', { category_id: StockLedgerData.category_id });
      }

      if (StockLedgerData.product_id) {
        queryBuilder.andWhere('p.id = :product_id', { product_id: StockLedgerData.product_id });
      }

      if (StockLedgerData.product_variant_id) {
        queryBuilder.andWhere('pv.id = :product_variant_id', { product_variant_id: StockLedgerData.product_variant_id });
      }

      const Result = await queryBuilder.getRawMany();
      return Result;
    }

    async BusinessLedgerFilter(BusinessLedgerData: BusinessLedgerModel) {
      let query = `
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
      WHERE 1=1
      `;

      if (BusinessLedgerData.business_id) {
          query += ` AND se.business_id = '${BusinessLedgerData.business_id}'`;
      }
      if (BusinessLedgerData.metal_id) {
          query += ` AND se.metal_id = '${BusinessLedgerData.metal_id}'`;
      }
      if (BusinessLedgerData.purity_id) {
          query += ` AND se.purity_id = '${BusinessLedgerData.purity_id}'`;
      }

      query += ` ORDER BY se.stock_entry_date_time ASC;`;

      const BusinessLedgerList = await this._DataSource.query(query);
      return BusinessLedgerList;
  }

    async LastTenTransactions() {
      let query = `
      SELECT
        sed.id AS stock_entry_detail_id,
        sed.stock_entry_id AS stock_entry_id,
        se.stock_entry_date_time AS stock_entry_date_time,
        se.stock_number AS stock_number,
        se.stock_entry_type AS stock_entry_type,
        se.business_id AS business_id,
        b.business_name AS narration,
        se.metal_id AS metal_id,
        m.name AS metal_name,
        se.purity_id AS purity_id,
        p.name AS purity_name,
        p.code AS purity_code,
        p.melting AS melting,
        sed.product_id AS product_id,
        pr.name AS product_name,
        uom.name AS unit_name,
        sed.gross_weight AS gross_weight,
        sed.other_weight AS other_weight,
        sed.other_charges AS other_charges,
        sed.net_weight AS net_weight,
        sed.fine_weight AS fine_weight,
        sed.mc_amount AS mc_amount,
        (
            SELECT
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'id', sow.id,
                            'stock_entry_detail_id', sow.stock_entry_detail_id,
                            'product_mixed_material_id', sow.product_mixed_material_id,
                            'weight', sow.weight,
                            'amount', sow.amount,
                            'name', mm.name
                        ) ORDER BY mm.display_order ASC
                    ),
                    ']'
                )
            FROM
                stock_entry_detail_other_weight sow
                INNER JOIN product_mixed_material pmm ON pmm.id = sow.product_mixed_material_id
                INNER JOIN mixed_material mm ON mm.id = pmm.mixed_material_id
            WHERE
                sow.stock_entry_detail_id = sed.id
        ) AS mixed_material
    FROM
        stock_entry se
        JOIN stock_entry_detail sed ON se.id = sed.stock_entry_id
        JOIN business b ON se.business_id = b.id
        JOIN metal m ON se.metal_id = m.id
        JOIN purity p ON se.purity_id = p.id
        JOIN product pr ON sed.product_id = pr.id
        LEFT JOIN unit_of_measurement uom ON pr.unit_of_measurement_id = uom.id
    GROUP BY
        sed.id
    ORDER BY
        se.stock_entry_date_time DESC
    LIMIT 10; `
      const LastTenTransactionsList = await this._DataSource.query(query);
      return LastTenTransactionsList;
    }

  async MetalStockFilter(MetalStockData: MetalStockModel) {
    let query = `
        SELECT
            vblln.metal_name AS metal_name,
            vblln.purity_code AS purity_code,
            vblln.melting AS purity,
            sum(vblln.stock_weight) AS stock_weight,
            sum(vblln.fine_weight) AS fine_weight
        FROM
            vw_business_ledger_list_new vblln
    `;
    const params = [];
    if (MetalStockData.metal_id && MetalStockData.metal_id.length > 0) {
        const MetalData = MetalStockData.metal_id.map(() => '?').join(', ');
        query += ` WHERE vblln.metal_id IN (${MetalData})`;
        params.push(...MetalStockData.metal_id);
    }
    query += `
       GROUP BY
            vblln.metal_name,
            vblln.purity_code,
            vblln.melting
        ORDER BY
            vblln.metal_name,
            vblln.melting DESC;
    `;
    const MetalStockList = await this._DataSource.query(query, params);
    return MetalStockList;
}


}
