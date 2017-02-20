/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.enums.GoodsStatusEnum;
import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.goods.service.GoodsBranchPriceServiceApi;
import com.okdeer.jxc.report.qo.GoodsReportQo;
import com.okdeer.jxc.report.service.GoodsReportService;
import com.okdeer.jxc.report.vo.GoodsReportVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * 	
 * ClassName: GoodsReportController 
 * @Description: 库存查询
 * @author dongh
 * @date 2016年8月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.0.0		   2016年9月12日                  dongh            库存查询
 *    商业管理系统 		   2016年9月12日			yangyq02				库存查询完善
 */
@Controller
@RequestMapping("goods/report")
public class GoodsReportController extends
		BaseController<GoodsReportController> {

	@Reference(version = "1.0.0", check = false)
	private GoodsReportService goodsReportService;
	
	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;
	
	@Reference(version = "1.0.0", check = false)
	private GoodsBranchPriceServiceApi goodsBranchPriceService;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	/**
	 * 
	 * @Description: 商品查询跳转页
	 * @return
	 * @author taomm
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		/**
		 * added by zhangqin on 2017-02-16 begin
		 * 需求V2.2,新增计价方式、商品状态、商品类型筛选条件
		 */
		//计价方式
		model.addAttribute("pricingType", PricingTypeEnum.values()); 
		//商品状态
		model.addAttribute("goodsStatus", GoodsStatusEnum.values()); 
		//商品类型
		model.addAttribute("goodsType", GoodsTypeEnum.values()); 
		/**
		 * added by zhangqin on 2017-02-16 end
		 */
		return "report/goods/goodsReport";
	}
	
	/**
	 * 
	 * @Description: 跳转编辑页
	 * @param model
	 * @return String  
	 * @author zhangq
	 * @date 2017年2月16日
	 */
	@RequestMapping(value = "toEdit")
	public String toEdit(GoodsReportQo qo,Model model){
		//计价方式
		model.addAttribute("pricingType", PricingTypeEnum.values()); 
		//商品状态
		model.addAttribute("goodsStatus", GoodsStatusEnum.values()); 
		//商品类型
		model.addAttribute("goodsType", GoodsTypeEnum.values()); 
		return "report/goods/goodsEdit";
	}
	
	/**
	 * 
	 * @Description: 查询商品信息
	 * @param qo
	 * @param model
	 * @return GoodsReportVo  
	 * @author zhangq
	 * @date 2017年2月17日
	 */
	@RequestMapping(value = "getGoodsInfo", method = RequestMethod.GET)
	@ResponseBody
	public RespJson getGoodsInfo(GoodsReportQo qo,Model model){
		GoodsReportVo sku = goodsReportService.queryGoodsInfo(qo);
		//如果编辑的机构为门店，则只可以修改供应商相关信息
		Branches branch = branchesService.getBranchInfoById(sku.getBranchId());//机构类型(0.总部、1.分公司、2.物流中心、3.自营店、4.加盟店B、5.加盟店C)
		RespJson jesp = RespJson.success();
		if(branch.getType()==3 || branch.getType()==4 || branch.getType()==5){
			jesp.put("isStore", true);
		}else{
			jesp.put("isStore", false);
		}
		jesp.put("_data", sku);
		return jesp;
	}
	
	/**
	 * 
	 * @Description: 商品查询
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author dongh
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsReportVo> getList(
			GoodsReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchName())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			String branchName = qo.getBranchName();
			if (StringUtils.isNotBlank(branchName) && branchName.contains("[")
					&& branchName.contains("]")) {
				int length = branchName.indexOf("]");
				qo.setBranchName(branchName.substring(length+1, branchName.length()));
			}
			
			List<Branches> branchList = branchesService.getBranchByKeyword(qo.getBranchName());
			if(branchList.size()==1){
				qo.setBranchId(branchList.get(0).getBranchesId());
				PageUtils<GoodsReportVo> goodsReport = goodsReportService.queryListToPage(qo);
				return goodsReport;
			}
		} catch (Exception e) {
			LOG.error("查询商品选择数据出现异常:", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 商品查询导出
	 * @param response
	 * @param vo
	 * @return
	 * @author dongh
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, GoodsReportQo qo) {

		LOG.info("商品查询导出execl：vo" + qo);
		try {
			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchName())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			String branchName = qo.getBranchName();
			if (StringUtils.isNotBlank(branchName) && branchName.contains("[")
					&& branchName.contains("]")) {
				int length = branchName.indexOf("]");
				qo.setBranchName(branchName.substring(length+1, branchName.length()));
			}
			List<GoodsReportVo> exportList = goodsReportService.queryList(qo);
            if(CollectionUtils.isNotEmpty(exportList)){
			String fileName = "商品查询列表" + "_" + DateUtils.getCurrSmallStr();

			String templateName = ExportExcelConstant.GOODSREPORT;

			exportList = handlePrice(exportList);
			exportListForXLSX(response, exportList, fileName, templateName);
			} else {
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("商品查询导出execl出现错误{}", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}

	// 价格特殊处理
	private List<GoodsReportVo> handlePrice(List<GoodsReportVo> exportList) {
		BigDecimal param = new BigDecimal(100);
		for (GoodsReportVo vo : exportList) {
			// 进货规格
			if (StringUtils.isNotBlank(vo.getPurchaseSpec())) {
				java.math.BigDecimal purchaseSpec = new java.math.BigDecimal(vo.getPurchaseSpec()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setPurchaseSpec(String.valueOf(purchaseSpec));
			}
			// 配送规格
			if (StringUtils.isNotBlank(vo.getDistributionSpec())) {
				java.math.BigDecimal distributionSpec = new java.math.BigDecimal(vo.getDistributionSpec()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setDistributionSpec(String.valueOf(distributionSpec));
			}
			// 联营扣率/代销扣率
			if (StringUtils.isNotBlank(vo.getSupplierRate())) {
				java.math.BigDecimal supplierRate = new java.math.BigDecimal(vo.getSupplierRate()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setSupplierRate(String.valueOf(supplierRate));
			}
			// 进货价
			if (StringUtils.isNotBlank(vo.getPurchasePrice())) {
				java.math.BigDecimal purchasePrice = new java.math.BigDecimal(vo.getPurchasePrice()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setPurchasePrice(String.valueOf(purchasePrice));
			}
			// 零售价
			if (StringUtils.isNotBlank(vo.getSalePrice())) {
				java.math.BigDecimal salePrice = new java.math.BigDecimal(vo.getSalePrice()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setSalePrice(String.valueOf(salePrice));
			}
			// 配送价
			if (StringUtils.isNotBlank(vo.getDistributionPrice())) {
				java.math.BigDecimal distributionPrice = new java.math.BigDecimal(vo.getDistributionPrice()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setDistributionPrice(String.valueOf(distributionPrice));
			}
			// 批发价
			if (StringUtils.isNotBlank(vo.getWholesalePrice())) {
				java.math.BigDecimal wholesalePrice = new java.math.BigDecimal(vo.getWholesalePrice()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setWholesalePrice(String.valueOf(wholesalePrice));
			}
			// 会员价
			if (StringUtils.isNotBlank(vo.getVipPrice())) {
				java.math.BigDecimal vipPrice = new java.math.BigDecimal(vo.getVipPrice()).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setVipPrice(String.valueOf(vipPrice));
			}
			
			// 进项税率
			if (StringUtils.isNotBlank(vo.getInputTax())) {
				BigDecimal inputTax = new BigDecimal(vo.getInputTax());
				BigDecimal inputTax1 =  inputTax.multiply(param).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setInputTax(String.valueOf(inputTax1)+"%");
			}
			
			// 销项税率
			if (StringUtils.isNotBlank(vo.getOutputTax())) {
				BigDecimal outputTax = new BigDecimal(vo.getOutputTax());
				BigDecimal outputTax1 =  outputTax.multiply(param).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setOutputTax(String.valueOf(outputTax1)+"%");
			}
			
			// 毛利率
			if (StringUtils.isNotBlank(vo.getProfitAmtRate())) {
				BigDecimal profitAmtRate = new BigDecimal(vo.getProfitAmtRate());
				BigDecimal profitAmtRate1 =  profitAmtRate.multiply(param).setScale(2,
						java.math.BigDecimal.ROUND_HALF_UP);
				vo.setProfitAmtRate(String.valueOf(profitAmtRate1)+"%");
			}
			
		}
		return exportList;
	}
	// start by lijy02

	/**
	 * @Description: 商品查询打印
	 * @param qo
	 * @param response
	 * @param request
	 * @param pageNumber
	 * @author lijy02
	 * @date 2016年9月13日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(GoodsReportQo qo, HttpServletResponse response,
			HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchName())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			String branchCode = UserUtil.getCurrBranchCode();
			qo.setBranchCode(branchCode);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			if(goodsReportService.queryListCount(qo)>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			List<GoodsReportVo> list = goodsReportService.queryList(qo);
			if(!CollectionUtils.isEmpty(list)&&list.size()>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.GOODS_REPORT;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			JasperHelper.exportmain(request, response, map,
					JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.SALE_FLOW_PRINT_ERROR, e);
		}
		return null;
	}
	// end by lijy02
}
