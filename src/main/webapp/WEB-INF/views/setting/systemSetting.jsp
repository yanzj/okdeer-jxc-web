<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>系统设置</title>
	
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<shiro:hasPermission name="JxcSaleSetting:save">
				<div id="btnSave" class="ubtns-item">保存</div>
		   	</shiro:hasPermission>
			<div class="ubtns-item" onclick="toClose()">关闭</div>
		</div>
	</div>
	<div class="ub ub-ver ub-f1 umar-4 ubor upad-10">
		<div class="ub ub-ver umar-t20">
			<form id="settingForm" action="${ctx}/branchSetting/save" method="post">
				<input type="hidden" id="branchId" name="branchId">
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-200 ut-r">后台单据允许负库存出库:</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStock1" name="isAllowMinusStock" value="1" /><span>启用</span>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStock0" name="isAllowMinusStock" value="0" /><span>不启用</span>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-200 ut-r">系统月结日:</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input class="ub" type="radio" id="isNaturalMonth0" name="isNaturalMonth" /><span>自然月</span>
					</div>
				</div>
				<div class="ub ub-ac upad-16">
					<div class="ub uw-200 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input class="ub" type="radio" id="isNaturalMonth1" name="isNaturalMonth" value="0" /><span>指定日期</span>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="monthReportDay" name="monthReportDay" style="width:100px" class="easyui-numberbox easyui-validatebox" data-options="min:0,precision:0,max:28" type="text">
					</div>
				</div>
			</form>
		</div>
	</div>
</body>

<script type="text/javascript">
	$(function() {
		//初始页面
		$.ajax({
			url : contextPath + "/branchSetting/getSetting",
			type : "POST",
			success : function(result) {
				if(result.code == 0){
					init(result.data);
				}else{
					disableSaveBtn();
					successTip(result.message);
				}
			},
			error : function(result) {
				disableSaveBtn();
				successTip("请求发送失败或服务器处理失败");
			}
		});
		
		//保存事件
		$("#btnSave").click(function (){
			save();
		});
		
		//切换是否为自然月
		$("#isNaturalMonth0").click(function (){
			changeIsNaturalMonth();
		});
		$("#isNaturalMonth1").click(function (){
			changeIsNaturalMonth();
		});
	});
	
	//初始页面
	function init(data){
		//获取值
		var branchId = data.branchId;
		var isAllowMinusStock = data.isAllowMinusStock;
		var monthReportDay = data.monthReportDay;
		
		//页面赋值
		$("#branchId").val(branchId);
		//后台单据允许负库存出库
		if(isAllowMinusStock == 0){
			$("#isAllowMinusStock0").attr("checked",true);
		}else{
			$("#isAllowMinusStock1").attr("checked",true);
		}
		//月结日（0-28），0为自然月
		if(monthReportDay==0){
			$("#isNaturalMonth0").attr("checked",true);
		}else{
			$("#isNaturalMonth1").attr("checked",true);
			$("#monthReportDay").numberbox("setValue",monthReportDay);
		}
		//切换是否为自然月
		changeIsNaturalMonth();
	}
	
	//禁用保存
	function disableSaveBtn(){
		$("#btnSave").removeClass("ubtns-item").addClass("ubtns-item-disabled").unbind("click");
	}
	
	//切换是否为自然月
	function changeIsNaturalMonth(){
		if($("#isNaturalMonth0").is(':checked')){
			//自然月
			$("#monthReportDay").numberbox("setValue","0");
			$("#monthReportDay").numberbox("readonly");
		}else{
			//指定日期
			$("#monthReportDay").numberbox("readonly", false);
		}
	}
	
	//保存
	function save() {
		$("#settingForm").form({
			onSubmit : function() {
				gFunStartLoading('正在保存，请稍后...');
				return true;
			},
			success : function(data) {
				var result = JSON.parse(data);
				gFunEndLoading();
				if (result['code'] == 0) {
					messager("保存成功！");
				} else {
					successTip(result['message']);
				}
			},
			error : function(data) {
				successTip("请求发送失败或服务器处理失败");
			}
		});
		$("#settingForm").submit();
	}
</script>
</html>