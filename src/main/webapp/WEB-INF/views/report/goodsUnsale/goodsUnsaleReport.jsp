<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>商品滞销报表</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/goodsUnsale/goodsUnsaleReport.js"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	            <input type="hidden" id="startCount" name="startCount" />
				<input type="hidden" id="endCount" name="endCount" />
				<shiro:hasPermission name="JxcGoodsUnsaleReport:print">
                    <div class="ubtns-item" onclick="printReport()">打印</div>
                </shiro:hasPermission>
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	           	<!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
            </div>

	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub ub-ac uw-300 ">
	                    <div class="umar-r10 uw-70 ut-r">机构名称:</div>
	                    <input type="hidden" id="branchId" name="branchId" />
	                    <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName"/>
	                    <div class="uinp-more" onclick="selectBranches()" >...</div>
	                </div>
	                 <div class="ub ub-ac  umar-l20">
                    <div class="umar-r10 uw-120 ut-r">销售小于或等于</div>
                    <input class="uinp ub uw-20" type="text" name="saleNum" id="saleNum" value="0">
                    <div class="umar-r10 uw-120 ut-r">件的商品视为滞销</div>
                </div> 
                </div> 
                <div class="ub umar-t8">
	              <div class="ub ub-ac  umar-l20">
                 <div class="umar-r10 uw-60 ut-r">商品选择:</div>
                 <input class="uinp" name="skuId" id="skuId" type="hidden">
	                <input class="uinp" id="skuName" name="skuName" type="text" maxlength="50">
	                <div class="uinp-more" onclick="selectGoods()">...</div>
                 </div>
                  <div class="ub ub-ac  umar-l20">
                    <input  type="checkbox" name="checkStockTime" id="checkStockTime">
                    <div class="umar-r10 uw-70 ut-r">过滤掉近</div>
                    <input class="uinp ub uw-20" type="text" name="unStockTime" id="unStockTime" value="7">
                    <div class="umar-r10 uw-120 ut-r">天内无入库的商品</div>
                </div> 
                <div class="ub ub-ac  umar-l20">
                    <input  type="checkbox" name="checkPullTime" id="checkPullTime">
                    <div class="umar-r10 uw-70 ut-r">过滤掉</div>
                    <input class="uinp ub uw-20" type="text" name="pullTime" id="pullTime" value="14">
                    <div class="umar-r10 uw-120 ut-r">天前引入的新品</div>
                </div> 
                </div> 
	
       	</form>
           
      
      <div class="ub ub-f1 umar-t20">
			 <table id="goodsUnsale"></table>
		</div>
    </div>

</body>
</html>