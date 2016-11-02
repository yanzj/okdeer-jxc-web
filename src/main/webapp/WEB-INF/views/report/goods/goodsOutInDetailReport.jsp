<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>商品出入库明细查询</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/goods/goodsOutInDetailReport.js"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="JxcSaleFlow:search">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcSaleFlow:export">
	                <div class="ubtns-item" onclick="exportExcel()">导出</div>
	            </shiro:hasPermission>
	              	<div class="ubtns-item" onclick="resetForm()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	          <!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
            </div>
	           
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub  ub-ac">
                   <div class="umar-r10 uw-80 ut-r">店铺名称:</div>
	                    <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId">
                        <input class="uinp ub ub-f1" type="text" id="branchName" readonly="readonly" name="branchName">
                   <div class="uinp-more" onclick="searchBranch()">...</div>
                </div>
                <div class="ub ub-ac  umar-l20">
                    <div class="umar-r10 uw-70 ut-r">货号/条码:</div>
                    <input class="uinp ub ub-f1" type="text" name="skuBarCode" id="skuBarCode">
                </div>  
            </div>
	      <div class="ub umar-t8">
                <div class="ub  ub-ac">
                    <div class="umar-r10 uw-80 ut-r">单号:</div>
                    <input class="uinp ub ub-f1" type="text" name="formNo" id="formNo">
                </div>
                 <div class="ub ub-ac uselectw umar-l20">
                    <div class="umar-r10 uw-70 ut-r">计价方式:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="pricingType" id="pricingType" data-options="editable:false">
							<option value="0" selected="selected">普通</option> 	
							<option value="1">计重</option> 
							<option value="2">计件</option> 
				        </select>
                </div>
            </div>
	      <div class="ub umar-t8">
                  <div class="ub ub-ac uselectw">
                    <div class="umar-r10 uw-80 ut-r">出入库类型:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="formType" id="formType" data-options="editable:false">
								<option value="">全部</option> 
								<option value="PI">采购收货</option> 
								<option value="PR">采购退货</option> 
								<option value="DI">配送入库</option> 
								<option value="DO">配送出库</option> 
								<option value="XS">销售</option> 
								<option value="IO">库存调整</option>
				        </select>
                </div>
                <div class="ub ub-ac umar-l20">
                    <div class="umar-r10 uw-70 ut-r">供应商:</div>
                    <input class="uinp" name="supplierId" id="supplierId" type="hidden">
                    <input class="uinp easyui-validatebox"  readonly="readonly" name="supplierName" id="supplierName" type="text"  onclick="selectSupplier()">
                    <div class="uinp-more" onclick="selectSupplier()">...</div>
                </div>
            </div>
       	</form>
           
       	<div class="ub umar-t8 umar-b8">【查询结果】</div>
        <div class="ub ub-f1">
			 <table id="goodsOutInDetail"></table>
		</div>
    </div>

</body>
</html>