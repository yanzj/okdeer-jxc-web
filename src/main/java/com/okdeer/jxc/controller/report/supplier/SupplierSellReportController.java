/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer-jxc-
 * @Package: com.okdeer.jxc.controller.report.supplier
 * @author songwj
 * @date 2017年07月14 17:18
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.report.supplier;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.rpc.RpcContext;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.finance.iccard.enums.BranchesTypeEnum;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.PageUtils;
import com.okdeer.retail.facade.report.entity.SupplierSell;
import com.okdeer.retail.facade.report.facade.SupplierSellFacade;
import com.okdeer.retail.facade.report.qo.SupplierSellQo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.Future;

/**
 *
 * @ClassName: SupplierStockReportController
 * @Description: 供应商销售报表
 * @project okdeer-jxc-
 * @author songwj
 * @date 2017年07月14 17:18
 * =================================================================================================
 *     Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     V2.7         2017年07月14   songwj             TODO
 */
@RestController
@RequestMapping("/report/supplier/sell")
public class SupplierSellReportController extends BaseController<SupplierSellReportController> {

    //@Reference(version = "1.0.0", check = false)
    @Resource
    private SupplierSellFacade supplierSellFacade;

    @Reference(version = "1.0.0", check = false)
    BranchesServiceApi branchesServiceApi;

    @RequestMapping(value = "")
    public ModelAndView list() {
        return new ModelAndView("/report/supplier/selllist");
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public PageUtils<SupplierSell> getReportList(SupplierSellQo vo,
                                                 @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                                                 @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        //Optional<SupplierSellQo> optional = Optional.ofNullable(vo);
        //vo = optional.orElse(new SupplierSellQo());
        vo.setPageNum(pageNumber);
        vo.setPageSize(pageSize);
        if(StringUtils.isBlank(vo.getBranchCompleCode())){
            vo.setBranchCode(getCurrBranchCompleCode());
        }else{
            vo.setBranchCode(vo.getBranchCompleCode());
        }
        try {
            if (StringUtils.isNotBlank(vo.getStartTime())) {
                PageUtils<SupplierSell> pageUtils = supplierSellFacade.getSupplierSells(vo);

                supplierSellFacade.sumSupplierSells(vo);
                Future<SupplierSell> sumSupplierSells = RpcContext.getContext().getFuture();
                List<SupplierSell> lists = pageUtils.getList();
                SupplierSell supplierSell;
                BigDecimal skuCount = BigDecimal.ZERO;
                BigDecimal allskuCount = BigDecimal.ZERO;
                //Map<String,BigDecimal> allSkuCount = future.get();
                for (int i = 0,length = lists.size();i<length;++i){
                    supplierSell = lists.get(i);

                    if(StringUtils.isNotBlank(vo.getBranchId())){

                        skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(vo.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                    }else {
                        Branches branches = branchesServiceApi.getBranchInfoById(UserUtil.getCurrBranchId());
                        if(branches.getType().equals(BranchesTypeEnum.HEAD_QUARTERS.getCode())||branches.getType().equals(BranchesTypeEnum.BRANCH_COMPANY.getCode())) {
                            skuCount = supplierSellFacade.getAllSupplierSkuCount(supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }else{
                            skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(branches.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }
                    }
                    supplierSell.setSkuCount(skuCount==null?BigDecimal.ZERO:skuCount);
                    lists.set(i,supplierSell);
                    allskuCount = allskuCount.add(supplierSell.getSkuCount());
                }
                SupplierSell reportVo = sumSupplierSells.get();
                if (reportVo != null) {
                    reportVo.setSupplierCode("SUM");
                    reportVo.setSkuCount(allskuCount);
                    pageUtils.setFooter(new ArrayList<>(Arrays.asList(reportVo)));
                } else {
                    pageUtils.setFooter(new ArrayList<>());
                }
                // 过滤数据权限字段
                cleanAccessData(pageUtils);

                pageUtils.setList(lists);
                return pageUtils;

            }
        }catch (Exception e){
            LOG.error("查询供应商销售报表异常!",e);
            PageUtils<SupplierSell> pageUtils = PageUtils.emptyPage();
            pageUtils.setFooter(new ArrayList<SupplierSell>());
            return pageUtils;
        }
        return PageUtils.emptyPage();
    }

    @RequestMapping(value = "/export/list", method = RequestMethod.POST)
    public RespJson exportList(HttpServletResponse response, SupplierSellQo vo) {
        RespJson resp = RespJson.success();
        //Optional<SupplierSellQo> optional = Optional.ofNullable(vo);
        //vo = optional.orElse(new SupplierSellQo());

        if(StringUtils.isBlank(vo.getBranchCompleCode())){
            vo.setBranchCode(getCurrBranchCompleCode());
        }else{
            vo.setBranchCode(vo.getBranchCompleCode());
        }
        try {
            if (StringUtils.isNotBlank(vo.getStartTime())) {
                List<SupplierSell> exportList = supplierSellFacade.exportSupplierSells(vo);
                // 过滤数据权限字段
                cleanAccessData(exportList);
                String fileName = "供应商销售报表_" + DateUtils.getCurrSmallStr();
                String templateName = ExportExcelConstant.SUPPLIER_SELL_REPORT;
                SupplierSell supplierSell;
                BigDecimal skuCount;
                //Map<String,BigDecimal> allSkuCount = future.get();
                for (int i = 0,length = exportList.size();i<length;++i){
                    supplierSell = exportList.get(i);

                    if(StringUtils.isNotBlank(vo.getBranchId())){

                        skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(vo.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                    }else {
                        Branches branches = branchesServiceApi.getBranchInfoById(UserUtil.getCurrBranchId());
                        if(branches.getType().equals(BranchesTypeEnum.HEAD_QUARTERS.getCode())||branches.getType().equals(BranchesTypeEnum.BRANCH_COMPANY.getCode())) {
                            skuCount = supplierSellFacade.getAllSupplierSkuCount(supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }else{
                            skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(branches.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }
                    }
                    supplierSell.setSkuCount(skuCount==null?BigDecimal.ZERO:skuCount);
                    exportList.set(i,supplierSell);
                }
                exportListForXLSX(response, exportList, fileName, templateName);
            } else {
                resp = RespJson.error();
            }
        }catch (Exception e){
            LOG.error("供应商销售报表导出异常!",e);
            resp = RespJson.error("供应商销售报表导出异常!");
        }
        return resp;
    }

    @RequestMapping(value = "/print", method = RequestMethod.GET)
    public String printReport(SupplierSellQo vo, HttpServletResponse response, HttpServletRequest request) {
        //Optional<SupplierSellQo> optional = Optional.ofNullable(vo);
        //vo = optional.orElse(new SupplierSellQo());
        vo.setPageNum(Integer.valueOf(PAGE_NO));
        vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
        // 默认当前机构
        if(StringUtils.isBlank(vo.getBranchCompleCode())){
            vo.setBranchCode(getCurrBranchCompleCode());
        }else{
            vo.setBranchCode(vo.getBranchCompleCode());
        }
        try {

            if (StringUtils.isNotBlank(vo.getStartTime())) {
                List<SupplierSell> exportList = supplierSellFacade.exportSupplierSells(vo);
                // 过滤数据权限字段
                cleanAccessData(exportList);
                if (exportList.size() > PrintConstant.PRINT_MAX_ROW) {
                    return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
                }

                String path = PrintConstant.SUPPLIER_SELL_REPORT;
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("startDate", vo.getStartTime());
                map.put("endDate", vo.getStartTime());
                map.put("printName", getCurrentUser().getUserName());
                SupplierSell supplierSell;
                BigDecimal skuCount;
                //Map<String,BigDecimal> allSkuCount = future.get();
                for (int i = 0,length = exportList.size();i<length;++i){
                    supplierSell = exportList.get(i);

                    if(StringUtils.isNotBlank(vo.getBranchId())){

                        skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(vo.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                    }else {
                        Branches branches = branchesServiceApi.getBranchInfoById(UserUtil.getCurrBranchId());
                        if(branches.getType().equals(BranchesTypeEnum.HEAD_QUARTERS.getCode())||branches.getType().equals(BranchesTypeEnum.BRANCH_COMPANY.getCode())) {
                            skuCount = supplierSellFacade.getAllSupplierSkuCount(supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }else{
                            skuCount = supplierSellFacade.getSupplierSkuCountByBranchId(branches.getBranchId(),supplierSell.getSupplierId(),vo.getStartTime(),vo.getEndTime());
                        }
                    }
                    supplierSell.setSkuCount(skuCount==null?BigDecimal.ZERO:skuCount);
                    exportList.set(i,supplierSell);
                }

                JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, exportList, "");
            }
        }catch (Exception e){
            LOG.error("供应商销售报表打印异常!",e);
            return null;
        }
        return null;
    }
}
