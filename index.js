'use strict'

const { Workbook } = require('exceljs');
const path = require('path');
const fs = require('fs');
const cloneDeep = require('./lib/cloneDeep');

/**
 * excel 差异比较
 * pathA: a excel路径
 * pathB: b excel路径
 * outputPath: excel比较文件生成路径，如果未设置则生成到 pathA，pathB 相同路径。
 * @param {object} options
 */
async function ExcelDiffYu(options) {
  checkOptions(options);
  const { excel_workbook_a, excel_workbook_b } = await readExcel(options);
  const { worksheet_names_a, worksheet_names_b, worksheet_common_names } = getWorksheetNames(excel_workbook_a, excel_workbook_b);
  worksheet_common_names.forEach((name) => {
    const worksheet_a = excel_workbook_a.getWorksheet(name);
    const worksheet_b = excel_workbook_b.getWorksheet(name);
    const { worksheet_row_cnt, worksheet_column_cnt } = getRowColumnCount(worksheet_a, worksheet_b);
    for (let row = 1; row < worksheet_row_cnt + 1; row++) {
      for (let column = 1; column < worksheet_column_cnt + 1; column++) {
        const worksheet_cell_a = worksheet_a.getCell(row, column);
        const worksheet_cell_b = worksheet_b.getCell(row, column);
        diffHandle(worksheet_cell_a, worksheet_cell_b);
      }
    }
  });
  worksheet_names_a.forEach((name) => {
    const worksheet_a = excel_workbook_a.getWorksheet(name);
    worksheet_a.properties.tabColor = {argb:'FFFF0000'};
    for (let row = 1; row < worksheet_a.rowCount + 1; row++) {
      for (let column = 1; column < worksheet_a.columnCount + 1; column++) {
        const worksheet_cell_a = worksheet_a.getCell(row, column);
        diffHandle(worksheet_cell_a, null);
      }
    }
  });
  worksheet_names_b.forEach((name) => {
    const worksheet_b = excel_workbook_b.getWorksheet(name);
    worksheet_b.properties.tabColor = {argb:'FF92D050'};
    for (let row = 1; row < worksheet_b.rowCount + 1; row++) {
      for (let column = 1; column < worksheet_b.columnCount + 1; column++) {
        const worksheet_cell_b = worksheet_b.getCell(row, column);
        diffHandle(null, worksheet_cell_b);
      }
    }
  });
  writeExcel(excel_workbook_a, excel_workbook_b, options);
}

/**
 * 参数 check
 */
function checkOptions(options) {
  if (!(options && options.pathA && options.pathB)) {
    throw Error('Incorrect parameter');
  }
  if (options.outputPath && !fs.existsSync(options.outputPath)) {
    throw Error(`outputPath is not exist: ${options.outputPath}`);
  }
}

async function readExcel(options) {
  const workbook_a = new Workbook();
  const workbook_b = new Workbook();
  const excel_workbook_a = await workbook_a.xlsx.readFile(path.resolve(options.pathA));
  const excel_workbook_b = await workbook_b.xlsx.readFile(path.resolve(options.pathB));
  return { excel_workbook_a, excel_workbook_b };
}

async function writeExcel(excel_workbook_a, excel_workbook_b, options) {
  let dirname = path.dirname(options.pathA);
  const extname_a = path.extname(options.pathA);
  const extname_b = path.extname(options.pathB);
  const basename_a = path.basename(options.pathA, extname_a);
  const basename_b = path.basename(options.pathB, extname_b);
  const format_time = getFormatTime();
  const format_base_name_a = `${basename_a}_${format_time}${extname_a}`;
  const format_base_name_b = `${basename_b}_${format_time}${extname_b}`;
  // 如果指定了输出路径，则用指定的
  if (options.outputPath) {
    dirname = options.outputPath;
  }
  const result_path_a = path.format({
    dir: dirname,
    base: format_base_name_a
  });
  const result_path_b = path.format({
    dir: dirname,
    base: format_base_name_b
  });
  excel_workbook_a.xlsx.writeFile(path.resolve(result_path_a));
  excel_workbook_b.xlsx.writeFile(path.resolve(result_path_b));
  console.log('sucess', path.resolve(result_path_a), path.resolve(result_path_b));
}

function getWorksheetNames(excel_workbook_a, excel_workbook_b) {
  let worksheet_names_a = [];
  let worksheet_names_b = [];
  // 相同sheet名list
  const worksheet_common_names = [];
  excel_workbook_a.eachSheet((worksheet) => {
    worksheet_names_a.push(worksheet.name);
  });
  excel_workbook_b.eachSheet((worksheet) => {
    if (worksheet_names_a.includes(worksheet.name)) {
      worksheet_common_names.push(worksheet.name);
    }
    worksheet_names_b.push(worksheet.name);
  });
  worksheet_names_a = worksheet_names_a.filter((worksheet) => !worksheet_common_names.includes(worksheet));
  worksheet_names_b = worksheet_names_b.filter((worksheet) => !worksheet_common_names.includes(worksheet));
  return { worksheet_names_a, worksheet_names_b, worksheet_common_names };
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
  if (!worksheet_cell_a) {
    worksheet_cell_b.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF92D050' },
      bgColor: { indexed: 64 }
    };
    return;
  }
  if (!worksheet_cell_b) {
    worksheet_cell_a.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF0000' },
      bgColor: { indexed: 64 }
    };
    return;
  }
  if (worksheet_cell_a.value == worksheet_cell_b.value) {
    return;
  }
  worksheet_cell_a.style = cloneDeep(worksheet_cell_a.style);
  worksheet_cell_b.style = cloneDeep(worksheet_cell_b.style);
  worksheet_cell_a.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF0000' },
    bgColor: { indexed: 64 }
  };
  worksheet_cell_b.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF92D050' },
    bgColor: { indexed: 64 }
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

module.exports.ExcelDiffYu = ExcelDiffYu;
