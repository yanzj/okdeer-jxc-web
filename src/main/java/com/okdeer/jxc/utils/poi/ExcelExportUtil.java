/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2016年10月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.utils.poi;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.okdeer.jxc.common.utils.DateUtils;

/**
 * ClassName: ExcelExportUtil 
 * @Description: POI导出工具类
 * @author liwb
 * @date 2016年10月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@SuppressWarnings("deprecation")
public class ExcelExportUtil {

	/*** LOG   */
	private static final Logger LOG = LoggerFactory.getLogger(ExcelExportUtil.class);

	/*** 设置响应前缀  */
	private final static String REPORT_HEADER = "Content-Disposition";

	/*** 设置响应后缀  */
	private final static String REPORT_HEADER_TWO = "attachment;filename=";

	/*** 导出为xlsx格式 */
	public final static String REPORT_XLSX = ".xlsx";

	/*** 导出为xls格式 */
	public final static String REPORT_XLS = ".xls";

	/** 
	 * 增加私有构造函数用以隐藏公开构造函数
	 * <p>Title: </p> 
	 * <p>Description: </p>  
	 */
	private ExcelExportUtil() {

	}

	public static void exportExcel(String reportFileName, String[] headers, String[] columns,
			List<JSONObject> dataList, HttpServletResponse response) {
		// 默认Sheet标签名称
		String sheetName = "Sheet0";
		// 默认时间格式
		String pattern = DateUtils.DATE_FULL_STR;
		exportExcel(reportFileName, sheetName, headers, columns, dataList, response, pattern);
	}

	/**  
	 * 导出Excel的方法  
	 * @param sheetName excel中的sheet名称  
	 * @param headers 表头  
	 * @param dataList 结果集  
	 * @param response 输出流  
	 * @param pattern 时间格式  
	 * @throws Exception  
	 */
	public static void exportExcel(String reportFileName, String sheetName, String[] headers, String[] columns,
			List<JSONObject> dataList, HttpServletResponse response, String pattern) {

		if (StringUtils.isBlank(pattern)) {
			pattern = DateUtils.DATE_FULL_STR;
		}

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		OutputStream out = null;

		try {

			// 生成一个表格
			HSSFSheet sheet = workbook.createSheet(sheetName);
			// 设置表格默认列宽度为20个字节
			sheet.setDefaultColumnWidth(20);

			// 表头样式
			HSSFCellStyle headerStyle = getHSSFHeaderCellStyle(workbook);

			// 声明一个画图的顶级管理器
			HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
			/*
			 * 
			 * 以下可以用于设置导出的数据的样式
			 * 
			 * // 生成并设置另一个样式 HSSFCellStyle style2 = workbook.createCellStyle();
			 * style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
			 * style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND); style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			 * style2.setBorderLeft(HSSFCellStyle.BORDER_THIN); style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
			 * style2.setBorderTop(HSSFCellStyle.BORDER_THIN); style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			 * style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); // 生成另一个字体 HSSFFont font2 =
			 * workbook.createFont(); font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL); // 把字体应用到当前的样式
			 * style2.setFont(font2); // 声明一个画图的顶级管理器 HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
			 * 
			 * 
			 * // 定义注释的大小和位置,详见文档 HSSFComment comment = patriarch.createComment(new HSSFClientAnchor(0, 0, 0, 0, (short)
			 * 4, 2, (short) 6, 5)); // 设置注释内容 comment.setString(new HSSFRichTextString("可以在POI中添加注释！")); //
			 * 设置注释作者，当鼠标移动到单元格上是可以在状态栏中看到该内容. comment.setAuthor("leno");
			 */

			// 产生表格标题行
			// 表头的样式
			// HSSFCellStyle titleStyle = workbook.createCellStyle();// 创建样式对象
			// titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);// 水平居中
			// titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中
			// // 设置字体
			// HSSFFont titleFont = workbook.createFont(); // 创建字体对象
			// titleFont.setFontHeightInPoints((short) 15); // 设置字体大小
			// titleFont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 设置粗体
			// // titleFont.setFontName("黑体"); // 设置为黑体字
			// titleStyle.setFont(titleFont);
			// sheet.addMergedRegion(new Region(0, (short) 0, 0, (short)
			// (headers.length - 1)));// 指定合并区域
			// HSSFRow rowHeader = sheet.createRow(0);
			// HSSFCell cellHeader = rowHeader.createCell((short) 0); //
			// 只能往第一格子写数据，然后应用样式，就可以水平垂直居中
			// HSSFRichTextString textHeader = new
			// HSSFRichTextString(sheetName);
			// cellHeader.setCellStyle(titleStyle);
			// cellHeader.setCellValue(textHeader);

			HSSFRow row = sheet.createRow(0);
			for (int i = 0; i < headers.length; i++) {
				HSSFCell cell = row.createCell((short) i);
				cell.setCellStyle(headerStyle);
				HSSFRichTextString text = new HSSFRichTextString(headers[i]);
				cell.setCellValue(text);
			}
			// 遍历集合数据，产生数据行
			generateData(columns, dataList, pattern, workbook, sheet, patriarch, 0);

			out = response.getOutputStream();
			response.reset();// 清空输出流
			response.setHeader(REPORT_HEADER,
					REPORT_HEADER_TWO + URLEncoder.encode(reportFileName + REPORT_XLS, "UTF-8"));
			response.setContentType("application/msexcel");// 定义输出类型
			workbook.write(out);
		} catch (IOException e) {
			LOG.error("导出Excel失败：", e);
		} finally {
			closeIo(workbook, out);
		}
	}

	/**
	 * @Description: 生成数据
	 * @param columns
	 * @param dataList
	 * @param pattern
	 * @param workbook
	 * @param sheet
	 * @param patriarch
	 * @author liwb
	 * @date 2017年9月12日
	 */
	private static void generateData(String[] columns, List<JSONObject> dataList, String pattern,
			HSSFWorkbook workbook, HSSFSheet sheet, HSSFPatriarch patriarch, int rowIndex) {
		HSSFRow row;
		if (CollectionUtils.isNotEmpty(dataList)) {
			
			HSSFCellStyle cellStyle = getHSSFBodyCellStyle(workbook);
			
			for (JSONObject data : dataList) {
				// Field[] fields = t.getClass().getDeclaredFields();
				rowIndex++;
				row = sheet.createRow(rowIndex);
				row.setHeightInPoints(20);
				for (int columnIndex = 0; columnIndex < columns.length; columnIndex++) {
					HSSFCell cell = row.createCell(columnIndex);
					String fieldName = columns[columnIndex];
					Object value = data.get(fieldName);

					// 生成单元格
					generateCell(workbook, cell, value, cellStyle, pattern);
				}
			}
		}
	}

	public static void exportMergeExcel(String reportFileName, String[] headers, String[] columns,
			List<String> mergeColumns, List<JSONObject> dataList, HttpServletResponse response) {
		// 默认Sheet标签名称
		String sheetName = "Sheet0";
		// 默认时间格式
		String pattern = DateUtils.DATE_FULL_STR;
		exportMergeExcel(reportFileName, sheetName, headers, columns, mergeColumns, dataList, response, pattern);
	}

	/**
	 * @Description: 导出Excel，动态合并表头
	 * @param reportFileName 导出文件名
	 * @param headers 表头 
	 * @param columns 字段名
	 * @param dataList 导出数据结果集
	 * @param response 输出流
	 * @param firstColIndex 开始合并表头的列索引，从0开始
	 * @param mergeHeaders 需要合并表头的字段名称
	 * @author liwb
	 * @date 2017年9月12日
	 */
	public static void exportMergeHeaderExcel(String reportFileName, String[] headers, String[] columns,
			List<JSONObject> dataList, HttpServletResponse response, int firstColIndex, String[] mergeHeaders) {

		exportMergeHeaderExcel(reportFileName, null, headers, columns, null, dataList, response, null, firstColIndex,
				mergeHeaders);
	}

	/**
	 * @Description: 导出Excel，动态合并表头
	 * @param reportFileName 导出文件名
	 * @param sheetName excel中的sheet名称  
	 * @param headers 表头 
	 * @param columns 字段名
	 * @param mergeColumns 合并字段名，可以为空，为空则不合并
	 * @param dataList 导出数据结果集
	 * @param response 输出流
	 * @param pattern 日期格式，可以为空，默认为 yyyy-MM-dd HH:mm:ss
	 * @param firstColIndex 开始合并表头的列索引，从0开始
	 * @param mergeHeaders 需要合并表头的字段名称
	 * @author liwb
	 * @date 2017年9月12日
	 */
	public static void exportMergeHeaderExcel(String reportFileName, String sheetName, String[] headers,
			String[] columns, List<String> mergeColumns, List<JSONObject> dataList, HttpServletResponse response,
			String pattern, int firstColIndex, String[] mergeHeaders) {

		if (StringUtils.isBlank(pattern)) {
			pattern = DateUtils.DATE_FULL_STR;
		}

		if (StringUtils.isBlank(sheetName)) {
			sheetName = "Sheet0";
		}

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		OutputStream out = null;
		try {
			// 生成一个表格
			HSSFSheet sheet = workbook.createSheet(sheetName);
			// 设置表格默认列宽度为20个字节
			sheet.setDefaultColumnWidth(20);

			HSSFCellStyle style = getHSSFHeaderCellStyle(workbook);

			// 声明一个画图的顶级管理器
			HSSFPatriarch patriarch = sheet.createDrawingPatriarch();

			// 设置标题头
			HSSFRow row = sheet.createRow(0);
			// 设置行高为28px;
			row.setHeightInPoints(28);
			HSSFCell cell = row.createCell(0);
			cell.setCellStyle(style);
			HSSFRichTextString text = new HSSFRichTextString(reportFileName);
			cell.setCellValue(text);
			// 合并标题单元格
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columns.length - 1));

			// 设置表头 第一行
			row = sheet.createRow(1);

			// 设置行高为20px;
			row.setHeightInPoints(20);

			// 和并列的数量
			int mergeHeaderSize = mergeHeaders.length;
			int realStart = 0;
			int realEnd = 0;

			for (int i = 0; i < headers.length; i++) {
				cell = row.createCell(i);
				cell.setCellStyle(style);

				text = new HSSFRichTextString(headers[i]);

				// 从起始位置开始和并列
				if (i >= firstColIndex && (i - firstColIndex) % mergeHeaderSize == 0) {
					if (realStart == 0) {
						realStart = firstColIndex;
					} else {
						realStart = realEnd + 1;
					}

					realEnd = realStart + mergeHeaderSize - 1;

					// 动态生成第一行表头
					sheet.addMergedRegion(new CellRangeAddress(1, 1, realStart, realEnd));
					text = new HSSFRichTextString(headers[i]);
				}
				cell.setCellValue(text);
			}

			// 设置表头第二行
			row = sheet.createRow(2);

			// 设置行高为20px;
			row.setHeightInPoints(20);

			int columnIndex = firstColIndex;

			for (int i = 0; i < headers.length; i++) {

				// 小于起始位置需要合并行
				if (i < firstColIndex) {
					cell = row.createCell(i);
					cell.setCellStyle(style);
					text = new HSSFRichTextString(headers[i]);
					cell.setCellValue(text);
					sheet.addMergedRegion(new CellRangeAddress(1, 2, i, i));
				}

				// 大于起始位置，按需生成合并表头
				if (i >= firstColIndex) {
					int mergeHeaderI = (i - firstColIndex) % mergeHeaderSize;
					cell = row.createCell(columnIndex);
					cell.setCellStyle(style);
					text = new HSSFRichTextString(mergeHeaders[mergeHeaderI]);
					cell.setCellValue(text);
					sheet.addMergedRegion(new CellRangeAddress(2, 2, columnIndex, columnIndex));
					columnIndex++;
				}
			}

			// 遍历集合数据，产生数据行
			if (CollectionUtils.isEmpty(mergeColumns)) {
				generateData(columns, dataList, pattern, workbook, sheet, patriarch, 2);
			} else {
				writeMergeData(columns, mergeColumns, dataList, pattern, workbook, sheet, patriarch, 2);
			}

			out = response.getOutputStream();
			// 清空输出流
			response.reset();
			response.setHeader(REPORT_HEADER,
					REPORT_HEADER_TWO + URLEncoder.encode(reportFileName + REPORT_XLS, "UTF-8"));
			// 定义输出类型
			response.setContentType("application/msexcel");
			workbook.write(out);
		} catch (IOException e) {
			LOG.error("导出Excel失败：", e);
		} finally {
			closeIo(workbook, out);
		}

	}

	/**
	 * @Description: 导出时段销售对比分析报表
	 * @param reportFileName 报表名称--表头
	 * @param headers 列名
	 * @param columns 列字段名
	 * @param mergeColumns 需要合并的单元格字段名
	 * @param dataList 数据集合
	 * @param response response
	 * @param pattern 时间格式
	 * @author zuowm
	 * @date 2017年7月28日
	 */
	public static void exportPeriodSaleExcel(String reportFileName, String[] headers, String[] columns,
			List<String> mergeColumns, List<JSONObject> dataList, HttpServletResponse response, String pattern) {
		if (StringUtils.isBlank(pattern)) {
			pattern = DateUtils.DATE_FULL_STR;
		}

		HSSFWorkbook workbook = new HSSFWorkbook();
		OutputStream out = null;
		try {
			HSSFSheet sheet = workbook.createSheet("sheet1");
			sheet.setDefaultColumnWidth(15);
			sheet.setDefaultRowHeight((short) 400);

			// 声明一个画图的顶级管理器
			HSSFPatriarch patriarch = sheet.createDrawingPatriarch();

			HSSFCellStyle style = getHSSFHeaderCellStyle(workbook);
			// 设置标题头
			HSSFRow row = sheet.createRow(0);
			HSSFCell cell = row.createCell(0);
			cell.setCellStyle(style);
			HSSFRichTextString text = new HSSFRichTextString(reportFileName.substring(0, reportFileName.indexOf('_')));
			cell.setCellValue(text);
			// 合并标题单元格
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));

			row = sheet.createRow(1);
			for (int i = 0; i < headers.length; i++) {
				cell = row.createCell(i);
				cell.setCellStyle(style);
				text = new HSSFRichTextString(headers[i]);
				if (i == 3) {
					sheet.addMergedRegion(new CellRangeAddress(1, 1, 3, 14));
					text = new HSSFRichTextString("当年销售情况");
				}
				if (i == 15) {
					sheet.addMergedRegion(new CellRangeAddress(1, 1, 15, 26));
					text = new HSSFRichTextString("上年销售情况");
				}
				cell.setCellValue(text);
			}

			// 设置表头
			row = sheet.createRow(2);
			for (int i = 0; i < headers.length; i++) {
				cell = row.createCell(i);
				cell.setCellStyle(style);
				text = new HSSFRichTextString(headers[i]);
				cell.setCellValue(text);
				if (i == 0) {
					sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 1));
				}
				if (i == 2) {
					sheet.addMergedRegion(new CellRangeAddress(1, 2, 2, 2));
				}
			}

			writeMergeData(columns, mergeColumns, dataList, pattern, workbook, sheet, patriarch, 2);

			out = response.getOutputStream();
			// 清空输出流
			response.reset();
			response.setHeader(REPORT_HEADER,
					REPORT_HEADER_TWO + URLEncoder.encode(reportFileName + REPORT_XLS, "UTF-8"));
			// 定义输出类型
			response.setContentType("application/msexcel");
			workbook.write(out);
		} catch (IOException e) {
			LOG.error("导出Excel失败：", e);
		} finally {
			closeIo(workbook, out);
		}
	}

	/**
	 * @Description: 关闭流
	 * @param workbook
	 * @param out
	 * @author liwb
	 * @date 2017年9月12日
	 */
	private static void closeIo(HSSFWorkbook workbook, OutputStream out) {
		try {
			if (workbook != null) {
				workbook.close();
			}
			if (out != null) {
				out.close();
			}
		} catch (IOException e) {
			LOG.error("IO was closed：", e);
		}
	}

	/**  
	 * 导出Excel的方法  
	 * @param sheetName excel中的sheet名称  
	 * @param headers 表头  
	 * @param mergeColumns 需要合并的列
	 * @param dataList 结果集  
	 * @param response 输出流  
	 * @param pattern 时间格式  
	 */
	public static void exportMergeExcel(String reportFileName, String sheetName, String[] headers, String[] columns,
			List<String> mergeColumns, List<JSONObject> dataList, HttpServletResponse response, String pattern) {
		if (StringUtils.isBlank(pattern)) {
			pattern = DateUtils.DATE_FULL_STR;
		}

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		OutputStream out = null;
		try {
			// 生成一个表格
			HSSFSheet sheet = workbook.createSheet(sheetName);
			// 设置表格默认列宽度为20个字节
			sheet.setDefaultColumnWidth(20);

			HSSFCellStyle style = getHSSFHeaderCellStyle(workbook);

			// 声明一个画图的顶级管理器
			HSSFPatriarch patriarch = sheet.createDrawingPatriarch();

			// 设置标题头
			HSSFRow row = sheet.createRow(0);
			// 设置行高为28px;
			row.setHeightInPoints(28);
			HSSFCell cell = row.createCell(0);
			cell.setCellStyle(style);
			HSSFRichTextString text = new HSSFRichTextString(reportFileName);
			cell.setCellValue(text);
			// 合并标题单元格
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));

			// 设置表头
			row = sheet.createRow(1);

			// 设置行高为25px;
			row.setHeightInPoints(25);
			for (int i = 0; i < headers.length; i++) {
				cell = row.createCell(i);
				cell.setCellStyle(style);
				text = new HSSFRichTextString(headers[i]);
				cell.setCellValue(text);
			}

			writeMergeData(columns, mergeColumns, dataList, pattern, workbook, sheet, patriarch, 1);

			out = response.getOutputStream();
			// 清空输出流
			response.reset();
			response.setHeader(REPORT_HEADER,
					REPORT_HEADER_TWO + URLEncoder.encode(reportFileName + REPORT_XLS, "UTF-8"));
			// 定义输出类型
			response.setContentType("application/msexcel");
			workbook.write(out);
		} catch (IOException e) {
			LOG.error("导出Excel失败：", e);
		} finally {
			closeIo(workbook, out);
		}
	}

	/**
	 * @Description: 将数据写到excel中
	 * @param columns 列字段名
	 * @param mergeColumns 合并列字段名
	 * @param dataList 数据集合
	 * @param pattern 时间格式
	 * @param workbook workbook
	 * @param sheet sheet
	 * @param patriarch 图片格式
	 * @author zuowm
	 * @date 2017年7月28日
	 */
	private static void writeMergeData(String[] columns, List<String> mergeColumns, List<JSONObject> dataList,
			String pattern, HSSFWorkbook workbook, HSSFSheet sheet, HSSFPatriarch patriarch, int rowIndex) {
		HSSFRow row;
		HSSFCell cell;

		// 遍历集合数据，产生数据行
		if (CollectionUtils.isNotEmpty(dataList)) {
			
			HSSFCellStyle cellStyle = getHSSFBodyCellStyle(workbook);
			
			// int rowIndex = 1;
			// 记录每列合并单元格的起始位置
			Map<String, String> mergeValue = new HashMap<>();
			for (JSONObject data : dataList) {
				rowIndex++;
				row = sheet.createRow(rowIndex);
				row.setHeightInPoints(20);
				for (int columnIndex = 0; columnIndex < columns.length; columnIndex++) {
					cell = row.createCell(columnIndex);
					String fieldName = columns[columnIndex];
					Object value = data.get(fieldName);

					String textValue = null;
					textValue = generateCell(workbook, cell, value, cellStyle, pattern);

					// 判断是否合并
					if (mergeColumns.contains(fieldName)) {
						if (mergeValue.containsKey(fieldName) && mergeValue.get(fieldName).equals(textValue)) {
							// 与上一行数据一致，需要合并
							sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex, columnIndex, columnIndex));
						} else {
							// 与上一行数据不一致，另起合并
							mergeValue.put(fieldName, textValue);
							// 同时将子列的合并重置
							for (int i = mergeColumns.indexOf(fieldName) + 1; i < mergeColumns.size(); i++) {
								mergeValue.remove(mergeColumns.get(i));
							}
						}
					}
				}
			}
		}
	}

	
	/**
	 * @Description: 生成单元格
	 * @param pattern
	 * @param workbook
	 * @param cell
	 * @param value
	 * @param cellStyle
	 * @return
	 * @author liwb
	 * @date 2017年9月13日
	 */
	private static String generateCell(HSSFWorkbook workbook, HSSFCell cell, Object value, HSSFCellStyle cellStyle, String pattern) {
		String textValue = "";
		
		if (value == null) {
			textValue = "";
			
		} else if (value instanceof Date) {
			Date date = (Date) value;
			SimpleDateFormat sdf = new SimpleDateFormat(pattern);
			textValue = sdf.format(date);
			
		} else if (value instanceof BigDecimal || value instanceof Double) {
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			HSSFDataFormat df = workbook.createDataFormat();
            cellStyle.setDataFormat(df.getFormat("#0.0000"));
            cell.setCellValue(Double.parseDouble(value.toString()));
            cell.setCellStyle(cellStyle);
            return value.toString();
            
		} 
//		else if (value instanceof byte[]) {
//			// 有图片时，设置行高为60px;
//			row.setHeightInPoints(60);
//			// 设置图片所在列宽度为80px,注意这里单位的一个换算
//			sheet.setColumnWidth(columnIndex, (short) (35.7 * 80));
//			// sheet.autoSizeColumn(i);
//			byte[] bsValue = (byte[]) value;
//			HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1023, 255, (short) 6, rowIndex, (short) 6, rowIndex);
//			anchor.setAnchorType(2);
//			patriarch.createPicture(anchor, workbook.addPicture(bsValue, HSSFWorkbook.PICTURE_TYPE_JPEG));
//			
//		} 
		else {
			// 其它数据类型都当作字符串简单处理
			textValue = value.toString();
		}
		
		if (textValue != null) {
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			HSSFDataFormat df = workbook.createDataFormat();
            cellStyle.setDataFormat(df.getFormat("@"));
            
			cell.setCellValue(textValue);
			cell.setCellStyle(cellStyle);
			cell.setCellType(HSSFCell.CELL_TYPE_STRING); 
		}
		return textValue;
	}

	
	/**
	 * @Description: 获取表头单元格样式
	 * @param workbook 工作表workbook
	 * @return 样式
	 * @author zuowm
	 * @date 2017年7月28日
	 */
	private static HSSFCellStyle getHSSFHeaderCellStyle(HSSFWorkbook workbook) {
		// 生成一个样式
		HSSFCellStyle style = workbook.createCellStyle();
		// 设置这些样式
		style.setFillForegroundColor(HSSFColor.GOLD.index);
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.VIOLET.index);
		// font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);

		// 指定当单元格内容显示不下时自动换行
		style.setWrapText(true);
		return style;
	}

	
	/**
	 * @Description: 获取数据内容单元格样式
	 * @param workbook 工作表workbook
	 * @return 样式
	 * @author zuowm
	 * @date 2017年7月28日
	 */
	private static HSSFCellStyle getHSSFBodyCellStyle(HSSFWorkbook workbook) {
		// 生成一个样式
		HSSFCellStyle style = workbook.createCellStyle();
		// 设置这些样式
		// style.setFillForegroundColor(HSSFColor.GOLD.index);
		// style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		// // 生成一个字体
		// HSSFFont font = workbook.createFont();
		// font.setColor(HSSFColor.VIOLET.index);
		// // font.setFontHeightInPoints((short) 12);
		// font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// // 把字体应用到当前的样式
		// style.setFont(font);

		// 指定当单元格内容显示不下时自动换行
		// style.setWrapText(true);
		return style;
	}
}
