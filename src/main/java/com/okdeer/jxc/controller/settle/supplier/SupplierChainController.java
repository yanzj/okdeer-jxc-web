package com.okdeer.jxc.controller.settle.supplier;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.enums.OperateTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.supplier.service.SupplierChainService;
import com.okdeer.jxc.settle.supplier.vo.SupplierChainDetailVo;
import com.okdeer.jxc.settle.supplier.vo.SupplierChainVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * 
 *<p></p>
 * ClassName: SupplierChainController 
 * @Description: 供应商联营账单
 * @author xuyq
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@RestController
@RequestMapping("/settle/supplierChain")
public class SupplierChainController extends BaseController<SupplierChainController> {

    /**
     * SupplierChainService
     */
    @Reference(version = "1.0.0", check = false)
    private SupplierChainService supplierChainService;
    
    /**
     * 
     * @Description: 供应商联营账单列表页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chainList")
    public ModelAndView chainList(Model model) {
        return new ModelAndView("settle/supplier/chain/chainList");
    }

    /**
     * 
     * @Description: 供应商联营账单新增页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chainAdd")
    public ModelAndView chainAdd(Model model) {
        return new ModelAndView("settle/supplier/chain/chainAdd");
    }

    /**
     * 
     * @Description: 供应商联营账单编辑页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chainEdit")
    public ModelAndView chainEdit(Model model,String id) {
        SupplierChainVo chainVo = supplierChainService.getSupplierChainVoById(id);
        model.addAttribute("chainVo", chainVo);
        return new ModelAndView("settle/supplier/chain/chainEdit");
    }

    /**
     * 
     * @Description: 供应商联营账单详情页
     * @param model model
     * @return ModelAndView
     * @author xuyq
     * @date 2017年5月22日
     */
    @RequestMapping(value = "chainView")
    public ModelAndView chainView(Model model,String id) {
        SupplierChainVo chainVo = supplierChainService.getSupplierChainVoById(id);
        model.addAttribute("chainVo", chainVo);
        return new ModelAndView("settle/supplier/chain/chainView");
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
    @RequestMapping(value = "getChainList", method = RequestMethod.POST)
    public PageUtils<SupplierChainVo> getChainList(SupplierChainVo vo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            vo.setPageNumber(pageNumber);
            vo.setPageSize(pageSize);
            LOG.debug(LogConstant.OUT_PARAM, vo.toString());
            PageUtils<SupplierChainVo> advanceList = supplierChainService.getChainPageList(vo);
            LOG.debug(LogConstant.PAGE, advanceList.toString());
            return advanceList;
        } catch (Exception e) {
            LOG.error("供应商费用列表信息异常:{}", e);
        }
        return PageUtils.emptyPage();
    }
    
    /***
     * 
     * @Description:  获取明细信息
     * @param formId 记录ID
     * @return List
     * @author xuyq
     * @date 2017年2月19日
     */
    @RequestMapping(value = "/chainFormDetailList", method = RequestMethod.POST)
    public List<SupplierChainDetailVo> ChainFormDetailList(SupplierChainVo vo) {
        LOG.debug(LogConstant.OUT_PARAM, vo);
        List<SupplierChainDetailVo> detailList = new ArrayList<SupplierChainDetailVo>();
        try {
            detailList = supplierChainService.getChainFormDetailList(vo);
        } catch (Exception e) {
            LOG.error("获取单据明细信息异常:{}", e);
        }
        return detailList;
    }
    
    /**
     * @Description: 保存供应商联营账单
     * @param data 保存JSON数据
     * @return RespJson
     * @author xuyq
     * @date 2017年3月9日
     */
    @RequestMapping(value = "/saveChainForm", method = RequestMethod.POST)
    public RespJson saveChainForm(String data) {
        RespJson respJson = RespJson.success();
        LOG.debug("保存供应商联营账单 ：data{}" + data);
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
            SupplierChainVo vo = JSON.parseObject(data, SupplierChainVo.class);
            if (OperateTypeEnum.ADD.getIndex().equals(vo.getOperateType())) {
                // 新增
                vo.setCreateUserId(user.getId());
                vo.setCreateTime(DateUtils.getCurrDate());
                vo.setUpdateUserId(user.getId());
                vo.setUpdateTime(DateUtils.getCurrDate());
                return supplierChainService.saveChainForm(vo);
            } else {
                // 修改
                vo.setUpdateUserId(user.getId());
                vo.setUpdateTime(DateUtils.getCurrDate());
                return supplierChainService.updateChainForm(vo);
            }
        } catch (Exception e) {
            LOG.error("保存供应商联营账单：{}", e);
            respJson = RespJson.error("保存供应商联营账单异常!");
        }
        return respJson;
    }

    /**
     * @Description: 审核供应商联营账单
     * @param data 保存JSON数据
     * @return RespJson
     * @author xuyq
     * @date 2017年3月11日
     */
    @RequestMapping(value = "/auditChainForm", method = RequestMethod.POST)
    public RespJson auditChainForm(String data) {
        RespJson respJson = RespJson.success();
        try {
            LOG.debug("审核供应商联营账单详情 ：data{}" + data);
            SysUser user = UserUtil.getCurrentUser();
            if (user == null) {
                respJson = RespJson.error("用户不能为空！");
                return respJson;
            }
            if (StringUtils.isBlank(data)) {
                respJson = RespJson.error("审核数据不能为空！");
                return respJson;
            }
            SupplierChainVo vo = JSON.parseObject(data, SupplierChainVo.class);
            if (vo == null) {
                respJson = RespJson.error("审核数据不能为空！");
                return respJson;
            }
            vo.setAuditUserId(user.getId());
            vo.setAuditTime(DateUtils.getCurrDate());
            return supplierChainService.auditChainForm(vo);
        } catch (Exception e) {
            LOG.error("审核供应商联营账单详情:{}", e);
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
    @RequestMapping(value = "deleteChainForm", method = RequestMethod.POST)
    public RespJson deleteChainForm(@RequestParam(value = "ids[]") List<String> ids) {
        RespJson resp;
        try {
            return supplierChainService.deleteChainForm(ids);
        } catch (Exception e) {
            LOG.error("删除账单异常:{}", e);
            resp = RespJson.error("删除账单异常！");
        }
        return resp;
    }
}