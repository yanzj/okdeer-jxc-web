package com.okdeer.jxc.controller.settle.supplier;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.OperateTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.settle.supplier.service.SupplierChargeService;
import com.okdeer.jxc.settle.supplier.vo.SupplierChargeDetailVo;
import com.okdeer.jxc.settle.supplier.vo.SupplierChargeVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

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
public class SupplierChargeController extends BasePrintController<SupplierChargeController, SupplierChargeDetailVo> {

    /**
     * SupplierChargeService
     */
    @Reference(version = "1.0.0", check = false)
    private SupplierChargeService supplierChargeService;

    private static final String KEYSTR = "chargeVo";
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
     * @Description: 查询列表
     * @param vo 参数VO
     * @param pageNumber 页码
     * @param pageSize 页数
     * @return PageUtils
     * @author xuyq
     * @date 2017年3月7日
     */
    @RequestMapping(value = "getChargeList", method = RequestMethod.POST)
    @ResponseBody
    public PageUtils<SupplierChargeVo> getChargeList(SupplierChargeVo vo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            vo.setPageNumber(pageNumber);
            vo.setPageSize(pageSize);
            vo.setBranchCompleCode(getCurrBranchCompleCode());
            LOG.debug(LogConstant.OUT_PARAM, vo);
            return supplierChargeService.getChargePageList(vo);
        } catch (Exception e) {
            LOG.error("供应商费用列表信息异常:{}", e);
        }
        return PageUtils.emptyPage();
    }

    /**
     * 
     * @Description: 供应商预付列表页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "advanceAdd")
    public ModelAndView advanceAdd(Model model) {
        return new ModelAndView("settle/supplier/advance/advanceAdd");
    }

    /**
     * 
     * @Description: 供应商预付编辑页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "advanceEdit")
    public ModelAndView advanceEdit(Model model, String id) {
        SupplierChargeVo chargeVo = supplierChargeService.getSupplierChargeVoById(id);
        model.addAttribute(KEYSTR, chargeVo);
        if (FormStatus.CHECK_SUCCESS.getValue().equals(chargeVo.getAuditStatus())) {
            return new ModelAndView("settle/supplier/advance/advanceView");
        }
        return new ModelAndView("settle/supplier/advance/advanceEdit");
    }

    /***
     * 
     * @Description:  获取明细信息
     * @param formId 记录ID
     * @return List
     * @author xuyq
     * @date 2017年2月19日
     */
    @RequestMapping(value = "/chargeFormDetailList", method = RequestMethod.GET)
    public List<SupplierChargeDetailVo> chargeFormDetailList(String formId) {
        LOG.debug(LogConstant.OUT_PARAM, formId);
        List<SupplierChargeDetailVo> detailList = new ArrayList<>();
        try {
            detailList = supplierChargeService.getChargeFormDetailList(formId);
        } catch (Exception e) {
            LOG.error("获取单据明细信息异常:{}", e);
        }
        return detailList;
    }

    /**
     * @Description: 保存供应商预付，费用
     * @param data 保存JSON数据
     * @return RespJson
     * @author xuyq
     * @date 2017年3月9日
     */
    @RequestMapping(value = "/saveChargeForm", method = RequestMethod.POST)
    public RespJson saveChargeForm(String data) {
        RespJson respJson = null;
        LOG.debug("保存供应商预付，费用 ：data{}" , data);
        SysUser user = UserUtil.getCurrentUser();
        if (user == null) {
            respJson = RespJson.error("用户不能为空！");
            return respJson;
        }
        try {
            if (StringUtils.isBlank(data)) {
                respJson = RespJson.error("保存数据不能为空！");
                return respJson;
            }
            SupplierChargeVo vo = JSON.parseObject(data, SupplierChargeVo.class);
            if (OperateTypeEnum.ADD.getIndex().equals(vo.getOperateType())) {
                // 新增
                vo.setCreateUserId(user.getId());
                vo.setCreateTime(DateUtils.getCurrDate());
                vo.setUpdateUserId(user.getId());
                vo.setUpdateTime(DateUtils.getCurrDate());
                // 生成单号时，取当前登录账号机构编码
                vo.setBranchCode(getCurrBranchCode());
                return supplierChargeService.saveChargeForm(vo);
            } else {
                // 修改
                vo.setUpdateUserId(user.getId());
                vo.setUpdateTime(DateUtils.getCurrDate());
                return supplierChargeService.updateChargeForm(vo);
            }
        } catch (Exception e) {
            LOG.error("保存供应商预付，费用：{}", e);
            respJson = RespJson.error("保存供应商费用异常!");
        }
        return respJson;
    }

    /**
     * @Description: 审核供应商预付，费用
     * @param data 保存JSON数据
     * @return RespJson
     * @author xuyq
     * @date 2017年3月11日
     */
    @RequestMapping(value = "/auditChargeForm", method = RequestMethod.POST)
    public RespJson auditChargeForm(String data) {
        RespJson respJson = RespJson.success();
        try {
            LOG.debug("审核供应商预付，费用详情 ：data{}" , data);
            SysUser user = UserUtil.getCurrentUser();
            if (user == null) {
                respJson = RespJson.error("用户不能为空！");
                return respJson;
            }
            if (StringUtils.isBlank(data)) {
                respJson = RespJson.error("审核数据不能为空！");
                return respJson;
            }
            SupplierChargeVo vo = JSON.parseObject(data, SupplierChargeVo.class);
            if (vo == null) {
                respJson = RespJson.error("审核数据不能为空！");
                return respJson;
            }
            vo.setAuditUserId(user.getId());
            vo.setAuditTime(DateUtils.getCurrDate());
            return supplierChargeService.auditChargeForm(vo);
        } catch (Exception e) {
            LOG.error("审核供应商预付，费用详情:{}", e);
            respJson = RespJson.error("账单审核异常！");
        }
        return respJson;
    }

    /**
     * 
     * @Description: 供应商费用删除
     * @param ids 记录IDS
     * @return RespJson
     * @author xuyq
     * @date 2017年2月19日
     */
    @RequestMapping(value = "deleteChargeForm", method = RequestMethod.POST)
    public RespJson deleteChargeForm(@RequestParam(value = "ids[]") List<String> ids) {
        RespJson resp;
        try {
            return supplierChargeService.deleteChargeForm(ids);
        } catch (Exception e) {
            LOG.error("删除账单异常:{}", e);
            resp = RespJson.error("删除账单失败");
        }
        return resp;
    }

    /**
     * 
     * @Description: 供应商预付详情页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "advanceView")
    public ModelAndView advanceView(Model model, String id) {
        SupplierChargeVo chargeVo = supplierChargeService.getSupplierChargeVoById(id);
        model.addAttribute(KEYSTR, chargeVo);
        return new ModelAndView("settle/supplier/advance/advanceView");
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

    /**
     * 
     * @Description: 供应商费用新增页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chargeAdd")
    public ModelAndView chargeAdd(Model model) {
        return new ModelAndView("settle/supplier/charge/chargeAdd");
    }

    /**
     * 
     * @Description: 供应商费用编辑页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chargeEdit")
    public ModelAndView chargeEdit(Model model, String id) {
        SupplierChargeVo chargeVo = supplierChargeService.getSupplierChargeVoById(id);
        if(chargeVo == null){
            return new ModelAndView("/error/500");
        }
        model.addAttribute(KEYSTR, chargeVo);
        return new ModelAndView("settle/supplier/charge/chargeEdit");
    }

    /**
     * 
     * @Description: 供应商费用详情页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chargeView")
    public ModelAndView chargeView(Model model, String id) {
        SupplierChargeVo chargeVo = supplierChargeService.getSupplierChargeVoById(id);
        model.addAttribute(KEYSTR, chargeVo);
        return new ModelAndView("settle/supplier/charge/chargeView");
    }

    /**
     * 
     * (non-Javadoc)
     * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintReplace(java.lang.String)
     */
    @Override
    protected Map<String, Object> getPrintReplace(String formId) {
        Map<String, Object> replaceMap = new HashMap<>();
        SupplierChargeVo vo = supplierChargeService.getSupplierChargeVoById(formId);
        if (null != vo) {
            replaceMap.put("_订单编号", vo.getFormNo());
            replaceMap.put("formNo", vo.getFormNo());
            replaceMap.put("branchName", vo.getBranchName());
            replaceMap.put("supplierName", vo.getSupplierName());
            replaceMap.put("payTime", vo.getPayTime() != null ? DateUtils.getSmallRStr(vo.getPayTime()) : "");
            replaceMap.put("remark", vo.getRemark());
            replaceMap.put("sumAmount", vo.getSumAmount());
            replaceMap.put("createUserName", vo.getCreateUserName());
            replaceMap.put("createTime", vo.getCreateTime() != null ? DateUtils.getFullStr(vo.getCreateTime()) : "");
            replaceMap.put("updateUserName", vo.getUpdateUserName());
            replaceMap.put("updateTime", vo.getUpdateTime() != null ? DateUtils.getFullStr(vo.getUpdateTime()) : "");
            replaceMap.put("auditUserName", vo.getAuditUserName());
            replaceMap.put("auditTime", vo.getAuditTime() != null ? DateUtils.getFullStr(vo.getAuditTime()) : "");
        }
        return replaceMap;
    }

    /**
     * 
     * (non-Javadoc)
     * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.lang.String)
     */
    @Override
    protected List<SupplierChargeDetailVo> getPrintDetail(String formId) {
        return supplierChargeService.getChargeFormDetailList(formId);
    }

    /**
     * 
     * (non-Javadoc)
     * @see com.okdeer.jxc.common.controller.BasePrintController#getBranchSpecService()
     */
    @Override
    protected BranchSpecServiceApi getBranchSpecService() {
        return null;
    }

}