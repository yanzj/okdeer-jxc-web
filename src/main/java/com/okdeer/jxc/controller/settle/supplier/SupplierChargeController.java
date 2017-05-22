package com.okdeer.jxc.controller.settle.supplier;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.supplier.service.SupplierChargeService;

/**
 * 
 *<p></p>
 * ClassName: SupplierChargeController 
 * @Description: 供应商预付，费用
 * @author xuyq
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@RestController
@RequestMapping("/settle/supplierCharge")
public class SupplierChargeController extends BaseController<SupplierChargeController> {

    /**
     * SupplierChargeService
     */
    @Reference(version = "1.0.0", check = false)
    private SupplierChargeService supplierChargeService;
    
    /**
     * 
     * @Description: 供应商预付列表页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "advanceList")
    public ModelAndView advanceList(Model model) {
        return new ModelAndView("settle/supplier/advance/advanceList");
    }
    
    /**
     * 
     * @Description: 供应商费用列表页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chargeList")
    public ModelAndView chargeList(Model model) {
        return new ModelAndView("settle/supplier/charge/chargeList");
    }

}