import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthController } from "../JWTAuth.controller";
import { StockReportService } from "@Root/Service/Product/StockReport.service";
import { BusinessLedgerModel, MetalStockModel, StockLedgerModel, StockReportModel } from "@Model/Product/StockEntry.model";
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { DateFormatForReport } from "@Root/Helper/Common.helper";
import { company } from "@Root/Database/Table/Admin/company";
import { IsCurrency } from "class-validator";


@Controller({ path: "StockReport", version: '1' })
@ApiTags("StockReport")
export class StockReportController extends JWTAuthController {

    constructor(private _StockReportService: StockReportService) {
        super()
    }

  //   @Post('StockReportFilterList')
  //   async StockReportFilter(@Body() stockReport: StockReportModel) {
  //       const StockReportFilterData =  await this._StockReportService.StockReportFilter(stockReport);
  //       return this.SendResponseData(StockReportFilterData);
  // }

    @Post('ItemLedgerFilterList')
    async ItemLedgerFilter(@Body() StockLedger: StockLedgerModel) {
        const ItemLedgerFilterData =  await this._StockReportService.ItemLedger(StockLedger);
        return this.SendResponseData(ItemLedgerFilterData);
  }

    @Post('BusinessLedgerFilterList')
    async BusinessLedgerFilter(@Body() BusinessLedgerData: BusinessLedgerModel) {
        const BusinessLedgerFilterData =  await this._StockReportService.BusinessLedgerFilter(BusinessLedgerData);
        return this.SendResponseData(BusinessLedgerFilterData);
  }

  @Get('LastTenTransactionList')
    async LastTenTransactionList() {
        const LastTenTransactionListData =  await this._StockReportService.LastTenTransactions();
        return this.SendResponseData(LastTenTransactionListData);
  }

  @Post('MetalStockList')
    async MetalStockList(@Body() MetalStockData: MetalStockModel) {
        const MetalStockListListData =  await this._StockReportService.MetalStockFilter(MetalStockData);
        return this.SendResponseData(MetalStockListListData);
  }

  @Post('ItemLedgerListDownload')
  async ItemLedgerExcelDownload(@Res() res: Response, @Body() StockLedgerData: StockLedgerModel) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ItemLedgerList');
  const FilterListData = await this._StockReportService.ItemLedger(StockLedgerData);
  const ItemName = FilterListData.length > 0 ? FilterListData[0].product_name : '';
  const currentDate = new Date().toLocaleDateString();
  worksheet.mergeCells('A1:M1');
  worksheet.getCell('A1').value = `${ItemName} as on - ${currentDate}`;
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal:'left'} ;
  worksheet.getCell('A1').font = { name: 'Arial', size: 16, bold: true };
  worksheet.getRow(2).values = ['Date & Time', 'Number', 'Narration', 'UOM', 'Qty In', 'Qty Out', 'Qty Balance', 'Stock In', 'Stock Out', 'Stock Balance', 'Fine Weight In', 'Fine Weight Out', 'Fine Weight Balance'];
  worksheet.columns = [
    { key: 'stock_entry_date_time', width: 25 },
    { key: 'stock_number', width: 25 },
    { key: 'narration', width: 30 },
    { key: 'unit_name', width: 15 },
    { key: 'qty_in', width: 25 },
    { key: 'qty_out', width: 25 },
    { key: 'qty_balance', width: 25 },
    { key: 'stock_in', width: 25 },
    { key: 'stock_out', width: 25 },
    { key: 'stock_balance', width: 25 },
    { key: 'fine_weight_in', width: 25 },
    { key: 'fine_weight_out', width: 25 },
    { key: 'fine_weight_balance', width: 25 },
  ];
  worksheet.getRow(2).eachCell((cell) => {
    cell.font = { name: 'Arial', size: 13, bold: true };
  });
  const row = worksheet.getRow(2);
    row.getCell('A').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('B').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('C').alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell('D').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('E').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('F').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('G').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('H').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('I').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('J').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('K').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('L').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('M').alignment = { vertical: 'middle', horizontal: 'right' };

  const ExcelListDownloadData = await this._StockReportService.ItemLedger(StockLedgerData);
  let totalQtyIn = 0;
  let totalQtyOut = 0;
  let totalQtyBalance = 0;
  let totalStockIn = 0;
  let totalStockOut = 0;
  let totalStockBalance = 0;
  let totalFineWeightIn = 0;
  let totalFineWeightOut = 0;
  let totalFineWeightBalance = 0;
  ExcelListDownloadData.forEach(stock_entry => {
    const qty_in = parseFloat(stock_entry['qty_in']) || 0;
    const qty_out = parseFloat(stock_entry['qty_out']) || 0;
    const qty_balance = parseFloat(stock_entry['qty_balance']) || 0;
    const stock_in = parseFloat(stock_entry['stock_in']) || 0;
    const stock_out = parseFloat(stock_entry['stock_out']) || 0;
    const stock_balance = parseFloat(stock_entry['stock_balance']) || 0;
    const fine_weight_in = parseFloat(stock_entry['fine_weight_in']) || 0;
    const fine_weight_out = parseFloat(stock_entry['fine_weight_out']) || 0;
    const fine_weight_balance = parseFloat(stock_entry['fine_weight_balance']) || 0;

    const row = worksheet.addRow({
      stock_entry_date_time: stock_entry['stock_entry_date_time'],
      stock_number: stock_entry['stock_number'],
      narration: stock_entry['narration'],
      unit_name: stock_entry['unit_name'],
      qty_in: qty_in === 0 ? '' : qty_in,
      qty_out: qty_out === 0 ? '' : qty_out,
      qty_balance: qty_balance === 0 ? '' : qty_balance,
      stock_in: stock_in === 0 ? '' : stock_in.toFixed(3),
      stock_out: stock_out === 0 ? '' : stock_out.toFixed(3),
      stock_balance: stock_balance === 0 ? '' : stock_balance.toFixed(3),
      fine_weight_in: fine_weight_in === 0 ? '' : fine_weight_in.toFixed(3),
      fine_weight_out: fine_weight_out === 0 ? '' : fine_weight_out.toFixed(3),
      fine_weight_balance: fine_weight_balance === 0 ? '' : fine_weight_balance.toFixed(3),
    });
    row.getCell('A').alignment = { horizontal: 'center' };
    row.getCell('B').alignment = { horizontal: 'center' };
    row.getCell('C').alignment = { horizontal: 'left' }; 
    row.getCell('D').alignment = { horizontal: 'center' }; 
    row.getCell('E').alignment = { horizontal: 'right' }; 
    row.getCell('F').alignment = { horizontal: 'right' }; 
    row.getCell('G').alignment = { horizontal: 'right' }; 
    row.getCell('H').alignment = { horizontal: 'right' };
    row.getCell('I').alignment = { horizontal: 'right' };
    row.getCell('J').alignment = { horizontal: 'right' };
    row.getCell('K').alignment = { horizontal: 'right' };
    row.getCell('L').alignment = { horizontal: 'right' };
    row.getCell('M').alignment = { horizontal: 'right' };
      totalQtyIn += parseFloat(stock_entry['qty_in']) || 0;
      totalQtyOut += parseFloat(stock_entry['qty_out']) || 0;
      totalQtyBalance = qty_balance;
      totalStockIn += parseFloat(stock_entry['stock_in']) || 0;
      totalStockOut += parseFloat(stock_entry['stock_out']) || 0;
      totalStockBalance = stock_balance;
      totalFineWeightIn += parseFloat(stock_entry['fine_weight_in']) || 0;
      totalFineWeightOut += parseFloat(stock_entry['fine_weight_out']) || 0;
      totalFineWeightBalance = fine_weight_balance;
  });
  const totalRow = worksheet.addRow({
    stock_entry_date_time: '',
    stock_number: '',
    narration: '',
    unit_name: '',
    qty_in: totalQtyIn === 0 ? '' : totalQtyIn,
    qty_out: totalQtyOut === 0 ? '' : totalQtyOut,
    qty_balance: totalQtyBalance === 0 ? '' : totalQtyBalance,
    stock_in: totalStockIn === 0 ? '' : totalStockIn.toFixed(3), 
    stock_out: totalStockOut === 0 ? '' : totalStockOut.toFixed(3),
    stock_balance: totalStockBalance === 0 ? '' : totalStockBalance.toFixed(3),
    fine_weight_in: totalFineWeightIn === 0 ? '' : totalFineWeightIn.toFixed(3),
    fine_weight_out: totalFineWeightOut === 0 ? '' : totalFineWeightOut.toFixed(3),
    fine_weight_balance: totalFineWeightBalance === 0 ? '' : totalFineWeightBalance.toFixed(3)
  });
  totalRow.getCell('E').alignment = { horizontal: 'right' }; 
  totalRow.getCell('F').alignment = { horizontal: 'right' }; 
  totalRow.getCell('G').alignment = { horizontal: 'right' }; 
  totalRow.getCell('H').alignment = { horizontal: 'right' };
  totalRow.getCell('I').alignment = { horizontal: 'right' };
  totalRow.getCell('J').alignment = { horizontal: 'right' };
  totalRow.getCell('K').alignment = { horizontal: 'right' };
  totalRow.getCell('L').alignment = { horizontal: 'right' };
  totalRow.getCell('M').alignment = { horizontal: 'right' };
  worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);
  totalRow.getCell('A').value = 'TOTAL';
  totalRow.getCell('A').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.insertRow(totalRow.number, {
    stock_entry_date_time: '', 
    stock_number: '',
    narration: '', 
    unit_name: '',
    qty_in: '', 
    qty_out: '', 
    qty_balance: '', 
    stock_in: '', 
    stock_out: '',
    stock_balance: '',
    fine_weight_in: '',
    fine_weight_out: '',
    fine_weight_balance: ''
  });
  const totalRows = worksheet.lastRow;
  totalRows.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 13, bold: true };
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  const Name = 'Item Ledger ' + DateFormatForReport(new Date());
  res.setHeader('Content-Disposition', `attachment; filename="${Name}.xlsx"`);
  const buffer = await workbook.xlsx.writeBuffer();
  res.send(buffer);
}

  @Post('BusinessListDownload')
    async BusinessExcelDownload(@Res() res: Response, @Body() BusinessLedgerData: BusinessLedgerModel) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('BusinessLedger');

    let CompanyData = await company.find({ relations: ['currency'] });
    const CurrencySymbol = CompanyData.length > 0 ? CompanyData[0].currency.symbol : '';

    const FilterListData = await this._StockReportService.BusinessLedgerFilter(BusinessLedgerData);
    const BusinessName = FilterListData.length > 0 ? FilterListData[0].
    business_name : '';
    const currentDate = new Date().toLocaleDateString();
    worksheet.mergeCells('A1:P1');
    worksheet.getCell('A1').value = `${BusinessName} as on - ${currentDate}`;
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal:'left'} ;
    worksheet.getCell('A1').font = { name: 'Arial', size: 16, bold: true };
    worksheet.getRow(2).values = ['Date & Time', 'Number', 'Item', 'UOM', 'Qty In', 'Qty Out', 'Qty Balance', 'Stock In', 'Stock Out', 'Stock Balance', 'Fine Weight In', 'Fine Weight Out', 'Fine Weight Balance', 'Amount In', 'Amount Out', 'Amount Balance'];
    worksheet.columns = [
      { key: 'stock_entry_date_time', width: 25 },
      { key: 'stock_number', width: 25 },
      { key: 'product_name', width: 30 },
      { key: 'unit_name', width: 15 },
      { key: 'qty_in', width: 25 },
      { key: 'qty_out', width: 25 },
      { key: 'qty_balance', width: 25 },
      { key: 'stock_in', width: 25 },
      { key: 'stock_out', width: 25 },
      { key: 'stock_balance', width: 25 },
      { key: 'fine_weight_in', width: 25 },
      { key: 'fine_weight_out', width: 25 },
      { key: 'fine_weight_balance', width: 25 },
      { key: 'amount_in', width: 25 },
      { key: 'amount_out', width: 25 },
      { key: 'amount_balance', width: 25 },
    ];
    worksheet.getRow(2).eachCell((cell) => {
      cell.font = { name: 'Arial', size: 13, bold: true };
    });
    const row = worksheet.getRow(2);
    row.getCell('A').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('B').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('C').alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell('D').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('E').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('F').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('G').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('H').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('I').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('J').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('K').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('L').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('M').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('N').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('O').alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell('P').alignment = { vertical: 'middle', horizontal: 'right' };
    
    const ExcelListDownloadData = await this._StockReportService.BusinessLedgerFilter(BusinessLedgerData);
    let totalQtyIn = 0;
    let totalQtyOut = 0;
    let totalQtyBalance = 0;
    let totalStockIn = 0;
    let totalStockOut = 0;
    let totalStockBalance = 0;
    let totalFineWeightIn = 0;
    let totalFineWeightOut = 0;
    let totalFineWeightBalance = 0;
    let totalAmountIn = 0;
    let totalAmountOut = 0;
    let totalAmountBalance = 0;

    ExcelListDownloadData.forEach(stock_entry => {
      const qty_in = parseFloat(stock_entry['qty_in']) || 0;
      const qty_out = parseFloat(stock_entry['qty_out']) || 0;
      const qty_balance = parseFloat(stock_entry['qty_balance']) || 0;
      const stock_in = parseFloat(stock_entry['stock_in']) || 0;
      const stock_out = parseFloat(stock_entry['stock_out']) || 0;
      const stock_balance = parseFloat(stock_entry['stock_balance']) || 0;
      const fine_weight_in = parseFloat(stock_entry['fine_weight_in']) || 0;
      const fine_weight_out = parseFloat(stock_entry['fine_weight_out']) || 0;
      const fine_weight_balance = parseFloat(stock_entry['fine_weight_balance']) || 0;
      const amount_in = parseFloat(stock_entry['amount_in']) || 0;
      const amount_out = parseFloat(stock_entry['amount_out']) || 0;
      const amount_balance = parseFloat(stock_entry['amount_balance']) || 0;
  
      const row = worksheet.addRow({
        stock_entry_date_time: stock_entry['stock_entry_date_time'],
        stock_number: stock_entry['stock_number'],
        product_name: stock_entry['product_name'],
        unit_name: stock_entry['unit_name'],
        qty_in: qty_in === 0 ? '' : qty_in,
        qty_out: qty_out === 0 ? '' : qty_out,
        qty_balance: qty_balance === 0 ? '' : qty_balance,
        stock_in: stock_in === 0 ? '' : stock_in.toFixed(3),
        stock_out: stock_out === 0 ? '' : stock_out.toFixed(3),
        stock_balance: stock_balance === 0 ? '' : stock_balance.toFixed(3),
        fine_weight_in: fine_weight_in === 0 ? '' : fine_weight_in.toFixed(3),
        fine_weight_out: fine_weight_out === 0 ? '' : fine_weight_out.toFixed(3),
        fine_weight_balance: fine_weight_balance === 0 ? '' : fine_weight_balance.toFixed(3),
        amount_in: amount_in === 0 ? '' : amount_in,
        amount_out: amount_out === 0 ? '' : amount_out,
        amount_balance: amount_balance === 0 ? '' : amount_balance,
      });

      row.getCell('A').alignment = { horizontal: 'center' };
      row.getCell('B').alignment = { horizontal: 'center' };
      row.getCell('C').alignment = { horizontal: 'left' }; 
      row.getCell('D').alignment = { horizontal: 'center' }; 
      row.getCell('E').alignment = { horizontal: 'right' }; 
      row.getCell('F').alignment = { horizontal: 'right' }; 
      row.getCell('G').alignment = { horizontal: 'right' }; 
      row.getCell('H').alignment = { horizontal: 'right' }; 
      row.getCell('I').alignment = { horizontal: 'right' };
      row.getCell('J').alignment = { horizontal: 'right' }; 
      row.getCell('K').alignment = { horizontal: 'right' };
      row.getCell('L').alignment = { horizontal: 'right' };
      row.getCell('M').alignment = { horizontal: 'right' };
      row.getCell('N').alignment = { horizontal: 'right' };
      row.getCell('O').alignment = { horizontal: 'right' };
      row.getCell('P').alignment = { horizontal: 'right' };
      row.getCell('N').numFmt = `"${CurrencySymbol}" #,##0.00`;
      row.getCell('O').numFmt = `"${CurrencySymbol}" #,##0.00`;
      row.getCell('P').numFmt = `"${CurrencySymbol}" #,##0.00`;

      totalQtyIn += parseFloat(stock_entry['qty_in']) || 0;
      totalQtyOut += parseFloat(stock_entry['qty_out']) || 0;
      totalQtyBalance = qty_balance;
      totalStockIn += parseFloat(stock_entry['stock_in']) || 0;
      totalStockOut += parseFloat(stock_entry['stock_out']) || 0;
      totalStockBalance = stock_balance;
      totalFineWeightIn += parseFloat(stock_entry['fine_weight_in']) || 0;
      totalFineWeightOut += parseFloat(stock_entry['fine_weight_out']) || 0;
      totalFineWeightBalance = fine_weight_balance;
      totalAmountIn += parseFloat(stock_entry['amount_in']) || 0;
      totalAmountOut += parseFloat(stock_entry['amount_out']) || 0;
      totalAmountBalance = amount_balance;
    });

    const totalRow = worksheet.addRow({
      stock_entry_date_time: '', 
      stock_number: '',
      product_name: '', 
      unit_name: '',
      qty_in: totalQtyIn ===0 ? '' : totalQtyIn,
      qty_out: totalQtyIn ===0 ? '' : totalQtyOut,
      qty_balance: totalQtyIn ===0 ? '' : totalQtyBalance,
      stock_in: totalStockIn ===0 ? '' : totalStockIn.toFixed(3),
      stock_out: totalStockOut ===0 ? '' : totalStockOut.toFixed(3),
      stock_balance: totalStockBalance ===0 ? '' : totalStockBalance.toFixed(3),
      fine_weight_in: totalFineWeightIn ===0 ? '' : totalFineWeightIn.toFixed(3),
      fine_weight_out: totalFineWeightOut ===0 ? '' : totalFineWeightOut.toFixed(3),
      fine_weight_balance: totalFineWeightBalance ===0 ? '' : totalFineWeightBalance.toFixed(3),  
      amount_in: totalAmountIn ===0 ? '' : totalAmountIn,
      amount_out: totalAmountOut ===0 ? '' : totalAmountOut,
      amount_balance: totalAmountBalance ===0 ? '' : totalAmountBalance,
    });

    totalRow.getCell('F').alignment = { horizontal: 'right' }; 
    totalRow.getCell('G').alignment = { horizontal: 'right' }; 
    totalRow.getCell('H').alignment = { horizontal: 'right' };  
    totalRow.getCell('I').alignment = { horizontal: 'right' };  
    totalRow.getCell('J').alignment = { horizontal: 'right' }; 
    totalRow.getCell('K').alignment = { horizontal: 'right' };
    totalRow.getCell('L').alignment = { horizontal: 'right' };
    totalRow.getCell('M').alignment = { horizontal: 'right' };
    totalRow.getCell('N').alignment = { horizontal: 'right' };
    totalRow.getCell('O').alignment = { horizontal: 'right' };
    totalRow.getCell('P').alignment = { horizontal: 'right' };
    totalRow.getCell('N').numFmt = `"${CurrencySymbol}" #,##0.00`;
    totalRow.getCell('O').numFmt = `"${CurrencySymbol}" #,##0.00`;
    totalRow.getCell('P').numFmt = `"${CurrencySymbol}" #,##0.00`;

    worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);
    totalRow.getCell('A').value = 'TOTAL';
    totalRow.getCell('A').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.insertRow(totalRow.number, {
      stock_entry_date_time: '', 
      stock_number: '',
      product_name: '', 
      unit_name: '',
      qty_in: '',
      qty_out: '',
      qty_balance: '',
      stock_in: '', 
      stock_out: '',
      stock_balance: '',
      fine_weight_in: '',
      fine_weight_out: '',
      fine_weight_balance: '',
      amount_in: '',
      amount_out: '',
      amount_balance: '',
    });
    const totalRows = worksheet.lastRow;
    totalRows.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 13, bold: true };
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    let Name = 'Business Ledger' + ' ' + DateFormatForReport(new Date());
    res.setHeader('Content-Disposition', `attachment; filename="${Name}.xlsx"`);
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  }

}