/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年9月12日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.analysis;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.analysis.qo.BepMonthDetailQo;
import com.okdeer.jxc.report.analysis.service.BepMonthDetailService;

/**
 * ClassName: BepMonthDetailController 
 * @Description: 门店月盈亏平衡明细分析
 * @author zhengwj
 * @date 2017年9月12日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("report/bepMonthDetail")
public class BepMonthDetailController extends BaseController<BepMonthDetailController> {

	/**
	 * @Fields bepMonthDetailService : 门店月盈亏平衡明细分析service
	 */
	@Reference(version = "1.0.0", check = false)
	private BepMonthDetailService bepMonthDetailService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/analysis/bepMonthDetailList");
	}

	private void buildParams(BepMonthDetailQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchId())) {
			qo.setBranchId(getCurrBranchId());
		}
		if (StringUtils.isNotBlank(qo.getMonth())) {
			qo.setMonth(qo.getMonth().replace("-", ""));
		}
	}

	/**
	 * @Description: 查询页面数据
	 * @author zhengwj
	 * @date 2017年9月12日
	 */
	@RequestMapping(value = "getDetail", method = RequestMethod.POST)
	public RespJson getDetail(BepMonthDetailQo qo) {
		try {
			// 构建查询参数
			buildParams(qo);
			LOG.debug("查询门店月盈亏平衡明细分析条件：{}", qo);
			return bepMonthDetailService.getDetailList(qo);
		} catch (Exception e) {
			LOG.error("查询门店月盈亏平衡明细分析异常:", e);
			return RespJson.businessError("查询门店月盈亏平衡明细分析失败");
		}
	}

}
