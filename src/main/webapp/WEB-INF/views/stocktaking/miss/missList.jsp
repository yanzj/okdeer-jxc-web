<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>漏盘商品查询</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/stocktaking/miss/missList.js"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
   <div class="ub ub-ver ub-f1 umar-4 upad-4">
	<form id="queryForm" action="" method="post">
		<div class="ub ub-ac">
            <div class="ubtns">
                <div class="ubtns-item" onclick="queryForm()">查询</div>
                <div class="ubtns-item" onclick="toPrint()">打印</div>
                <div class="ubtns-item" onclick="toExport()">导出</div>
                <div class="ubtns-item" id="set" onclick="gFunRefresh()" >重置</div>
                <div class="ubtns-item" onclick="toClose()">退出</div>
            </div>
			<div class="ub">
				<div class="ub ub-ac">
					<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				</div>
			</div>
		</div>
		<div class="ub uline umar-t8"></div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-300 umar-l20">
				<div class="umar-r10 uw-70 ut-r">机构:</div>
				<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
				<input class="uinp ub ub-f1" type="text" id="branchCodeName" name="branchCodeName" maxlength="50" readonly="readonly" />
				<div class="uinp-more" onclick="selectBranches()" id="selectBranchMore" >...</div>
			</div>
			<div class="ub ub-ac uw-300 umar-l20">
				<div class="umar-r10 uw-70 ut-r">盘点批号:</div>
				<input class="uinp ub ub-f1" type="text" id="batchNo" name="batchNo">
				<div class="uinp-more" onClick="searchTakeStock()">...</div>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-300 umar-l20">
				<div class="umar-r10 uw-70 ut-r">商品选择:</div>
				<input type="hidden" name="skuId" id="skuId" />
				<input class="uinp ub ub-f1" type="text" name="skuCodeOrName" id="skuCodeOrName" />
				<div class="uinp-more" onClick="selectGoods()">...</div>
			</div>
			<div class="ub ub-ac uw-300 umar-l20">
				<div class="umar-r10 uw-70 ut-r">类别:</div>
				<input type="hidden" name="categoryCode" id="categoryCode" />
				<input class="uinp ub ub-f1" type="text" name="categoryCodeOrName" id="categoryCodeOrName" />
				<div class="uinp-more" onClick="searchCategory()">...</div>
			</div>
		</div>
      	</form>
       <div class="ub ub-f1  umar-t8 umar-b8">
		<table id="dgMissList"></table>
	</div>
   </div>
</body>
</html>