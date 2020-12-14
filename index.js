'use strict'

const { Workbook } = require("exceljs");
const path = require('path');

const DEFAULT_PATH_A = './test_a.xlsx';
const DEFAULT_PATH_B = './test_b.xlsx';

async function excelDiffYu(options) {
    const { excel_workbook_a, excel_workbook_b } = await readExcel(options);
    const { worksheet_names_a, worksheet_names_b } = getWorksheetNames(excel_workbook_a, excel_workbook_b);
    // TODO sheet数目不一样，或是有名称不一样，报错。用数组差值方式。
    console.log(worksheet_names_a, worksheet_names_b);
    // TODO 暂时先修改原文件，在有差别的单元格标红，以后可以改为新建两个备份文件。文件名加后缀可以防止下载到一个目录下重名。
    worksheet_names_a.forEach(name => {
        let worksheet_a = excel_workbook_a.getWorksheet(name);
        let worksheet_b = excel_workbook_b.getWorksheet(name);
        let { worksheet_row_cnt, worksheet_column_cnt } = getRowColumnCount(worksheet_a, worksheet_b);
        for (let row = 1; row < worksheet_row_cnt + 1; row++) {
            for (let column = 1; column < worksheet_column_cnt + 1; column++) {
                const worksheet_cell_a = worksheet_a.getCell(row, column);
                const worksheet_cell_b = worksheet_b.getCell(row, column);
                diffHandle(worksheet_cell_a, worksheet_cell_b);
            }
        }
    });
    writeExcel(excel_workbook_a, excel_workbook_b, options);
}

async function readExcel(options) {
    const workbook_a = new Workbook();
    const workbook_b = new Workbook();
    const excel_path_a = options.pathA || DEFAULT_PATH_A;
    const excel_path_b = options.pathB || DEFAULT_PATH_B;
    // TODO try catch add
    const excel_workbook_a = await workbook_a.xlsx.readFile(excel_path_a);
    const excel_workbook_b = await workbook_b.xlsx.readFile(excel_path_b);
    return { excel_workbook_a, excel_workbook_b };
}

async function writeExcel(excel_workbook_a, excel_workbook_b, options) {
    // TODO 最好下载到系统目录，linux也是
    const excel_path_a = options.pathA || DEFAULT_PATH_A;
    const excel_path_b = options.pathB || DEFAULT_PATH_B;
    const dirname_a = path.dirname(excel_path_a);
    const dirname_b = path.dirname(excel_path_b);
    const extname_a = path.extname(excel_path_a);
    const extname_b = path.extname(excel_path_b);
    const basename_a = path.basename(excel_path_a, extname_a);
    const basename_b = path.basename(excel_path_b, extname_b);
    const format_time = getFormatTime();
    const format_base_name_a = basename_a + '_' + format_time + extname_a;
    const format_base_name_b = basename_b + '_' + format_time + extname_b;
    const result_path_a = path.format({
        dir: dirname_a,
        base: format_base_name_a
    });
    const result_path_b = path.format({
        dir: dirname_b,
        base: format_base_name_b
    });
    // TODO try catch add
    excel_workbook_a.xlsx.writeFile(result_path_a);
    excel_workbook_b.xlsx.writeFile(result_path_b);
}

function getWorksheetNames(excel_workbook_a, excel_workbook_b) {
    const worksheet_names_a = [];
    const worksheet_names_b = [];
    excel_workbook_a.eachSheet((worksheet) => {
        worksheet_names_a.push(worksheet.name);
    });
    excel_workbook_b.eachSheet((worksheet) => {
        worksheet_names_b.push(worksheet.name);
    });
    return { worksheet_names_a, worksheet_names_b };
}

function getRowColumnCount(worksheet_a, worksheet_b) {
    const worksheet_row_cnt_a = worksheet_a.rowCount;
    const worksheet_column_cnt_a = worksheet_a.columnCount;
    const worksheet_row_cnt_b = worksheet_b.rowCount;
    const worksheet_column_cnt_b = worksheet_b.columnCount;
    let worksheet_row_cnt = worksheet_row_cnt_a;
    let worksheet_column_cnt = worksheet_column_cnt_a;
    if (worksheet_row_cnt_b > worksheet_row_cnt_a) {
        worksheet_row_cnt = worksheet_row_cnt_b;
    }
    if (worksheet_column_cnt_b > worksheet_column_cnt_a) {
        worksheet_column_cnt = worksheet_column_cnt_b;
    }
    return { worksheet_row_cnt, worksheet_column_cnt };
}

function diffHandle(worksheet_cell_a, worksheet_cell_b) {
    if (worksheet_cell_a.value == worksheet_cell_b.value) {
        return;
    }
    worksheet_cell_a.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
    };
    worksheet_cell_b.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00BC00' }
    };
}

function getFormatTime() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${month}${day}${hours}${minutes}${seconds}`;
}

module.exports.excelDiffYu = excelDiffYu;