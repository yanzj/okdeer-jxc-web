/**
 * Created by wxl on 2016/08/17.
 * 促销方案明细
 */
$(function() {
	//选择报表类型
	initActivityCX();
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	
	//促销类型 change 事件
	$("input[name='queryType']").on('change',function(){
		cxType = $(this).val();
		//类别 启用类别选择
		$("#categoryName").prop('disabled',cxType == 'category'?false:true);
		//类别 禁用货号
		$("#codeKeyWord").prop('disabled',cxType == 'category'?true:false);
		//类别 禁用商品名称
		$("#skuName").prop('disabled',cxType == 'category'?true:false);
		
		$("#"+datagridID).datagrid("options").url =  '';
		initActivityCX();
		
		purchaseTotalCx();
		
	})
	
});

var datagridID = 'activityCXList';
var gridHandel = new GridClass();

var cxType = 'goods';//促销类型 商品促销    category-类别    fullReduction-满减



/**
 * 初始化表格按  商品
 * @param queryType
 */
function initActivityCX() {
	gridHandel.setGridName("#"+datagridID);
   dg =  $("#"+datagridID).datagrid({
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: true,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
//        fitColumns:true,    //占满
        showFooter:true,
        pageSize : 50,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        showFooter:true,
        height:'100%',
        columns: [[
            {field: 'branchName', title: '活动店铺', width:120, align: 'left'},
            {field: 'activityTypeStr', title: '活动类型', width:120, align: 'center',hidden:cxType != 'fullReduction'?false:true},
            {field: 'activityScopeStr', title: '满减类型', width:120, align: 'center',hidden:cxType == 'fullReduction'?false:true},
            {field: 'goodCategoryName', title: '商品类别', width:120, align: 'center',hidden:cxType != 'goods'?false:true},
            {field: 'goodCategoryCode', title: '类别编码', width:120, align: 'center',hidden:cxType == 'category'?false:true},
            {field: 'skuCode', title: '货号', width:100, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'skuName', title: '商品名称', width:150, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'barCode', title: '条码', width:120, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'spec', title: '规格', width:50, align: 'left',hidden:cxType == 'goods'?false:true},
            {field: 'unit', title: '单位', width:50, align: 'center',hidden:cxType == 'goods'?false:true},
            {field: 'activityCode', title: '活动编号', width:140, align: 'left'},
            {field: 'discount', title: '折扣', width:80, align: 'right',hidden:cxType == 'category'?false:true,
            	formatter:function(value,row,index){
            		return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field: 'salePrice', title: '售价', width:80, align: 'right',hidden:cxType == 'goods'?false:true,
            	formatter:function(value,row,index){
            		return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field: 'fullMoney', title: '买满金额', width:80, align: 'right',hidden:cxType == 'fullReduction'?false:true,
            	formatter:function(value,row,index){
            		return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field: 'yhMoney', title: '优化金额', width:80, align: 'right',hidden:cxType == 'fullReduction'?false:true,
            	formatter:function(value,row,index){
            		return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field: 'activityPlan', title: '促销方案', width:80, align: 'right',hidden:cxType == 'goods'?false:true,
            	formatter:function(value,row,index){
            		var str = "";
            		if(isNaN(value)){
            			str = '<b>'+value+'</b>';
            		}else{
            			str = '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            		}
            		return str;
            	}
            },
            {field: 'startTime', title: '开始时间', width:140, align: 'left'},
            {field: 'endTime', title: '结束时间', width:140, align: 'left',
            	formatter:function(value,row,index){
            		return formatDate(value);
            	}
            },
            
            {field: 'createUserName', title: '制单人', width:100, align: 'left'},
            {field: 'validUserName', title: '审核人', width:120, align: 'left'},
            {field: 'validTime', title: '审核时间', width:140, align: 'left',
            	formatter:function(value,row,index){
            		return formatDate(value);
            	}
            }
        ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
  
}



/**
 * 查询
 */
function purchaseTotalCx(){
	$("#startCount").val('');
	$("#endCount").val('');
	var formData = $("#queryForm").serializeObject();
	$("#"+datagridID).datagrid("options").url = "";
	$("#"+datagridID).datagrid({showFooter:true});
	$("#"+datagridID).datagrid("options").queryParams = formData;
	$("#"+datagridID).datagrid("options").method = "post";
	$("#"+datagridID).datagrid("options").url =  contextPath+"/sale/activityDetailReport/reportListPage";
	$("#"+datagridID).datagrid("load");
}

/**
 * 导出
 */
function exportData(){
	var length = $("#"+datagridID).datagrid('getData').total;
	if(length == 0){
		successTip("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}
/**
 * 导出
 */
function exportExcel(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	var branchCompleCode = $("#branchCompleCode").val();
	var categoryType=$('input[name="searchType"]:checked ').val();
	if(!(startDate && endDate)){
		$.messager.alert('提示', '日期不能为空');
		return ;
	}
	
	var length = $("#"+datagridID).datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"没有数据");
		return;
	}
	if(length>10000){
		$.messager.alert("当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#queryForm").attr("action",contextPath+'/sale/activityDetailReport/exportExcelList');
	$("#queryForm").submit();	
}
/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchCompleCode").val(data.branchCompleCode);
		$("#branchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}
/**
 * 商品类别
 */
function searchCategory(){
	if($("#categoryName").prop('disabled'))return;
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val('['+data.categoryCode+']'+data.categoryName);
	});
}
/**
 * 重置
 */
var resetForm = function(){
	location.href=contextPath+"/report/purchase/total";
	
};