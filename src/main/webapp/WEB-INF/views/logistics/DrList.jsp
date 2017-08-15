<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>物流配送点退货导出</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/logistics/DrList.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<shiro:hasPermission name="JxcDeliverDrLogistic:search">
						<div class="ubtns-item" onclick="queryForm()">查询</div>
					</shiro:hasPermission>
					<div class="ubtns-item" id="set" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
			</div>
			<div class="ub uline umar-t8"></div>
			<input type="hidden" id="deliverType" name="deliverType" value="DR"/>
			<div class="ub umar-t8">
				<div class="ub ub-ac" id="sourceBranch">
					<div class="umar-r10 uw-70 ut-r">退货机构:</div>
					<input type="hidden" id="sourceBranchId" name="sourceBranchId" />
					<input type="hidden" id="sourceBranchType" name="sourceBranchType" />
					<input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" maxlength="50"/>
					<div class="uinp-more">...</div>
				</div>

				<div class="ub ub-ac umar-l40">
					<div class="umar-r10 uw-70 ut-r">制单人:</div>
					<input class="uinp" name="operateUserId" id="operateUserId" type="hidden">
					<input class="uinp ub ub-f1" id="operateUserName" name="operateUserName" type="text" maxlength="50">
					<div class="uinp-more" onclick="selectOperator()">...</div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac" id="targetBranch">
					<div class="umar-r10 uw-70 ut-r">收货机构:</div>
					<input type="hidden" id="targetBranchId" name="targetBranchId" />
					<input type="hidden" id="targetBranchType" name="targetBranchType" />
					<input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" maxlength="50" />
					<div class="uinp-more">...</div>
				</div>

				<div class="ub ub-ac umar-l40">
					<div class="umar-r10 uw-70 ut-r">单据编号:</div>
					<input class="uinp" type="text" id="formNo" name="formNo">
				</div>
				<div class="ub ub-ac uw-300 umar-l20">
					<div class="umar-r10 uw-70 ut-r">单据状态:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="deliverStatus" value="" id="orstatus_5" checked="checked" /><label for="orstatus_5">全部</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="deliverStatus" value="0" id="orstatus_1" /><label for="orstatus_1">未处理</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="deliverStatus" value="1" id="orstatus_2" /><label for="orstatus_2">部分发货</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="deliverStatus" value="2" id="orstatus_3" /><label for="orstatus_3">全部发货</label>
					</div>
				</div>
			</div>

		</form>
		<div class="ub ub-f1  umar-t8 umar-b8">
			<table id="saleReturnList"></table>
		</div>
	</div>

</body>
</html>