
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>新增编辑财务代码</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/financeCode/editFinance.js?V=${versionNo}"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="saveFinanceCode()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeFinanceDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="financeAdd">
	<input type="hidden" name="dictTypeId" id="dictTypeId" />
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">编号:</div>
					<c:if test="${dictTypeCode eq '101004' }">
						<input class="uinp  ub ub-f1" type="text" id="value" name="value" 
							onkeyup="this.value=this.value.replace(/[^A-Z]/g,'')"
							onafterpaste="this.value=this.value.replace(/[^A-Z]/g,'')"
							placeholder="编号为3位大写字母"
							maxlength="3"/>
					</c:if>
					<c:if test="${dictTypeCode ne '101004' }">
						<input class="uinp  ub ub-f1" type="text" id="value" name="value" 
							onkeyup="this.value=this.value.replace(/\D/g,'')"
							onafterpaste="this.value=this.value.replace(/\D/g,'')"
							placeholder="编号为4位数字"
							maxlength="4"/>
					</c:if>
					
					<input type="hidden" name="id" id="id" />
				</div>
			<i class="ub uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">名称:</div>
					<input class="uinp ub ub-f1 easyui-validatebox" type="text" id="label"
						name="label" maxlength="20"/>
				</div>
			<i class="ub uc-red">*</i>
			</div>


			<div class="ub upad-4 umar-t10 uhide" id="dvRefund">
			<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r">退货类型:</div>
				<select class="uselect easyui-combobox" style="width: 204px;"
				data-options="editable:false" name="refundType" id="refundType">
					<c:if test="${not empty refundTypeList }">
					<c:forEach items="${refundTypeList }" var="i">
						<option value="${i.value}">${i.name}</option>
					</c:forEach>
					</c:if>
				</select>
			</div>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark"
						name="remark" maxlength="20" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10" id="dvFixed">

			<div class="ub ub-ac" >
			<div class="umar-r10 uw-30 ut-r"></div>
			<div id="cbDiv">
				<span class="uw-150"><label for="isFixed" class="uhide" id="isFixedLabel"><input id="isFixed" type="checkbox" name="isFixed">是否固定支出</label>
				</span>
				
				<label for="ckbSave" id="ckbSaveLabel"><input id="ckbSave" type="checkbox" checked="checked">保存后自动更新</label>
			</div>
			</div>
			</div>

			<div class="ub upad-4 umar-t10 uhide" id="dvPost">
				<div class="ub ub-ac">
				<div class="umar-r10 uw-70 ut-r"></div>
					<label for="isClientDisplay"><input id="isClientDisplay" type="checkbox" checked="checked" />是否前台显示</label>&nbsp;&nbsp;
					<label for="isSystemDefault"><input id="isSystemDefault" type="checkbox" checked="checked" />是否系统默认</label>
				</div>
			</div>

		</div>
	</form>
</div>

