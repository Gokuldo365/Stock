import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { CurrentUser, DateFormatForReport } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { StockEntryService } from '@Root/Service/Product/StockEntry.service';
import { StockEntryModel, StockFilterListModel } from '@Model/Product/StockEntry.model';
import { DataSource } from 'typeorm';
import { Response } from "express";
import * as ExcelJS from 'exceljs';

@Controller({ path: "StockEntry", version: '1' })
@ApiTags("StockEntry")
export class StockEntryController extends JWTAuthController {

  constructor(
    private _StockEntryService: StockEntryService,
    private _DataSource: DataSource
  ) { super() }

      @Get('List')
      async List() {
        const StockEntryListData = await this._StockEntryService.GetAll();
        return this.SendResponseData(StockEntryListData);
      }
      @Get('OutwardList')
      async OutwardList() {
        const StockEntryListData = await this._StockEntryService.OutwardGetAll();
        return this.SendResponseData(StockEntryListData);
      }

      @Get('StockEntry/:Id')
      async ById(@Param('Id') StockEntryId: string) {
        const StockEntryData = await this._StockEntryService.GetById(StockEntryId);
        return this.SendResponseData(StockEntryData);
      }

      // @Post('Insert')
      // async Insert(@Body() StockEntryData: StockEntryModel, @CurrentUser() UserId: string) {
      //   const Data = await this._StockEntryService.Insert(StockEntryData, UserId);
      //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
      // }

      // @Put('Update/:StockEntryId')
      // async Update(@Param('StockEntryId') StockEntryId: string, @Body() StockEntryData: StockEntryModel, @CurrentUser() UserId: string) {
      //   await this._StockEntryService.Update(StockEntryId, StockEntryData, UserId);
      //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
      // }

      @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @CurrentUser() UserId: string) {
        try {
            await this._StockEntryService.Delete(Id, UserId);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Stock Entry Beacuse Its Already Used');
            }
        }
    }

    @Post('StockEntryList')
    async StockEntryList(@Body() stockFilterData: StockFilterListModel) {
      const ListData = await this._StockEntryService.StockEntryList(stockFilterData);
      return this.SendResponseData(ListData);
    }

    @Post('StockEntryListDownload')
    async DownloadExcel(@Res() res: Response, @Body() stockFilterData: StockFilterListModel) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('StockEntryList');
    worksheet.columns = [
        { header: 'Number', key: 'stock_number', width: 25 },
        { header: 'Metal', key: 'metal_name', width: 25 },
        { header: 'Purity', key: 'purity_name', width: 25 },
        { header: 'Business From', key: 'business_from', width: 35 },
        { header: 'Business To', key: 'business_to', width: 35 },
        { header: 'Fine weight', key: 'fine_weight', width: 30 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { name: 'Arial', size: 12, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const ExcelListDownloadData = await this._StockEntryService.StockEntryList(stockFilterData);
    ExcelListDownloadData.forEach(stock_entry => {
        const row = worksheet.addRow([
            stock_entry.stock_number,
            stock_entry.metal_name,
            stock_entry.purity_name,
            stock_entry.business_from,
            stock_entry.business_to,
            stock_entry.fine_weight
        ]);

        row.getCell(1).alignment = { horizontal: 'center' };
        row.getCell(2).alignment = { horizontal: 'center' };
        row.getCell(3).alignment = { horizontal: 'center' };
        row.getCell(4).alignment = { horizontal: 'left' };
        row.getCell(5).alignment = { horizontal: 'left' };
        row.getCell(6).alignment = { horizontal: 'right' };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    let Name = stockFilterData.stock_entry_type + ' ' + DateFormatForReport(new Date());
    res.setHeader('Content-Disposition', `attachment; filename="${Name}.xlsx"`);
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
}

}
