/**
 * 报损单-列表
 */
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	initDatagridRequire();
	// 单据状态切换
	changeStatus();
});

// 单据状态切换
function changeStatus() {
	$(".radioItem").change(function() {
		queryForm();
	});
}

var gridHandel = new GridClass();
// 初始化表格
function initDatagridRequire() {
	$("#stockReimburseList")
			.datagrid(
					{
						// title:'普通表单-用键盘操作',
						method : 'post',
						align : 'center',
						// toolbar: '#tb', //工具栏 id为tb
						singleSelect : false, // 单选 false多选
						rownumbers : true, // 序号
						pagination : true, // 分页
						fitColumns : true, // 每列占满
						// fit:true, //占满
						showFooter : true,
						height : '100%',
						width : '100%',
						columns : [ [
								{
									field : 'check',
									checkbox : true
								},
								{
									field : 'formNo',
									title : '单据编号',
									width : '140px',
									align : 'left',
									formatter : function(value, row, index) {
										var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'报损单详情\',\''
												+ contextPath
												+ '/stock/reimburse/edit?id='
												+ row.id
												+ '\')">'
												+ value
												+ '</a>';
										return strHtml;
									}
								},
								{
									field : 'status',
									title : '审核状态',
									width : '100px',
									align : 'left',
									formatter : function(value, row, index) {
										if (value == '0') {
											return '待审核';
										} else if (value == '1') {
											return '审核通过';
										} else if (value == '2') {
											return '审核失败';
										} else {
											return '未知类型：' + value;
										}
									}
								},
								{
									field : 'branchCode',
									title : '机构编号',
									width : '200px',
									align : 'left'
								},
								{
									field : 'branchName',
									title : '机构名称',
									width : '220px',
									align : 'left'
								},
								{
									field : 'createUserName',
									title : '制单人',
									width : '130px',
									align : 'left'
								},
								{
									field : 'createTime',
									title : '制单时间',
									width : '150px',
									align : 'center',
									formatter : function(value, row, index) {
										if (value) {
											return new Date(value)
													.format('yyyy-MM-dd hh:mm');
										}
										return "";
									}
								}, {
									field : 'validUserName',
									title : '审核人',
									width : '130px',
									align : 'left'
								}, {
									field : 'remark',
									title : '备注',
									width : '200px',
									align : 'left',
									onLoadSuccess : function(data) {
										gridHandel.setDatagridHeader("center");
									}
								} ] ],

					});
	queryForm();
}

// 查询报损单
function queryForm() {
	var fromObjStr = $('#queryForm').serializeObject();
	$("#stockReimburseList").datagrid("options").method = "post";
	$("#stockReimburseList").datagrid('options').url = contextPath
			+ '/stock/reimburse/getStockFormList';
	$("#stockReimburseList").datagrid('load', fromObjStr);
}

// 新增报损单
function addStockReimburse() {
	toAddTab("新增报损单", contextPath + "/stock/reimburse/add");
}

//删除报损单
function deleteStockReimburse(){
	var rows =$("#stockReimburseList").datagrid("getChecked");
	if(rows.length <= 0){
		 $.messager.alert('提示','请选中一行进行删除！');
		return null;
	}
	
	var tempIds = [];
	var flag = true;
	rows.forEach(function(data,index){
		var status = data.status;
    	if(status == 0){
    		tempIds.push(data.id);
	   		flag = false;
    	}
    	
	})
    
    if(flag){
    	messager('已经审核的单据不可以删除！');
    	return;
    }
	$.messager.confirm('提示','是否要删除选中数据',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/stock/reimburse/delete",
		    	type:"POST",
		    	data:{
		    		ids:tempIds
		    	},
		    	success:function(result){
		    		console.log(result);
		    		if(result['code'] == 0){
		    			successTip("删除成功");
		    		}else{
		    			successTip(result['message']);
		    		}
		    		$("#stockReimburseList").datagrid('reload');
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}

/**
 * 机构名称
 */
function selectBranches() {
	new publicAgencyService(function(data) {
		// $("#createBranchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	}, 'IU', '');
}

/**
 * 制单人
 */
function selectOperator() {
	new publicOperatorService(function(data) {
		// $("#salesmanId").val(data.id);
		$("#createUserName").val(data.userName);
	});
}

// 打印
/*
 * function printDesign() { var dg = $("#stockReimburseList"); var row =
 * dg.datagrid("getSelected"); if (rowIsNull(row)) { return null; } // 弹出打印页面
 * parent .addTabPrint( 'PASheet' + row.id, row.formNo + '单据打印', contextPath +
 * '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' +
 * row.id + '&gridFlag=PAGrid', ''); }
 */sssss

/**
 * 重置
 */
var resetForm = function() {
	$("#queryForm").form('clear');
};