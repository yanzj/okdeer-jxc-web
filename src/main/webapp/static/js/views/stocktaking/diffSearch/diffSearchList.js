var rotaType = '1';
//初始化表格
$(function(){
	initDgTakeStockDiffSearch();
    $(".radioItem").on("change",function(){
    	$("#diffSearchList").datagrid('options').url = "";
    	rotaType = $(this).val()
    	initDgTakeStockDiffSearch();
    	$('#diffSearchList').datagrid({data:[]}); 
//    	页面控制
    	pageChange(rotaType);
    	
    })
});

//页面元素控制
function pageChange(rotaType){
	$('#rotationType').val(rotaType);
	if(rotaType === '1'){
		$('#skuName').prop('disabled','disabled');
		$('#categoryNameCode').prop('disabled','disabled');
		$('#divgood').prop('hidden',true);
		$('#divEqualZero').css('display','none');
		$('#skuId').val("");
    	$('#skuName').val("");
    	$('#categoryNameCode').val("");
		
	}else{
		$('#skuName').removeProp('disabled');
		$('#categoryNameCode').removeProp('disabled');
		$('#divgood').prop('hidden',false);
		$('#divEqualZero').css('display','block');
	}
}


function initDgTakeStockDiffSearch(){
	stockList = $("#diffSearchList").datagrid({
		method:'post',
		align:'center',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		fitColumns:true,    //每列占满
		height:'100%',
		width:'100%',
		columns:getFiledsList(),
		onLoadSuccess : function(data) {
			gridHandel.setDatagridHeader("center");
		}
	});
}
function getFiledsList(){
	if(rotaType === '1'){
		return [ [
		          {field:'check',checkbox:true},
		          {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
		          {field: 'branchName', title: '机构名称', width: 120, align: 'left'},
		          {field: 'batchNo', title: '盘点批号', width: 180, align: 'left'},
		          {field: 'snapshootStockNum', title: '系统库存', width: 140, align: 'left'},
		          {field: 'stocktakingNum', title: '盘点数量', width: 180, align: 'left'},
		          {field: 'profitLossNum', title: '盈亏数量', width: 180, align: 'left'},
		          {field: 'profitLossCostAmount', title: '盈亏金额（成本价）', width: 140, align: 'left'},
		          {field: 'profitLossSaleAmount', title: '盈亏金额（售价）', width: 140, align: 'left'}
		          ] ]
	}else{
		return [ [
		          {field:'check',checkbox:true},
		          {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
		          {field: 'branchName', title: '机构名称', width: 120, align: 'left'},
		          {field: 'batchNo', title: '盘点批号', width: 180, align: 'left'},
		          {field: 'validUserName', title: '审核人', width: 180, align: 'left'},
		          {field: 'skuCode', title: '货号', width: 180, align: 'left'},
		          {field: 'skuName', title: '商品名称', width: 180, align: 'left'},
		          {field: 'snapshootStockNum', title: '系统库存', width: 140, align: 'left'},
		          {field: 'stocktakingNum', title: '盘点数量', width: 180, align: 'left'},
		          {field: 'profitLossNum', title: '盈亏数量', width: 180, align: 'left'},
		          {field: 'handle', title: '是否处理', width: 180, align: 'left'},
		          {field: 'profitLossCostAmount', title: '盈亏金额（成本价）', width: 140, align: 'left'},
		          {field: 'profitLossSaleAmount', title: '盈亏金额（售价）', width: 140, align: 'left'},
		          {field: 'differenceReason', title: '差异原因', width: 140, align: 'left'},
		          {field: 'categoryCode', title: '类别编码', width: 140, align: 'left'},
		          {field: 'categoryName', title: '类别名称', width: 140, align: 'left'}
		          ] ]
	}
}

//查询
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
    fromObjStr.equalZero = $('.checkItem').is(':checked')?'0':'';

	$("#diffSearchList").datagrid("options").method = "post";
	$("#diffSearchList").datagrid('options').url = contextPath + '/stocktaking/diffSearch/getDiffSearchList';
	$("#diffSearchList").datagrid('load', fromObjStr);
}

//重置
function gFunRefresh(){
	$("#queryForm").form('clear');
}
/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchCode").val(data.branchCode);
		$("#branchName").val(data.branchName);
	},'BF','');
}

function searchTakeStock(){
	var branchId = $('#branchId').val();
	var param = {
			branchId:branchId
	}
	new publicStocktakingDialog(param,function(data){
		console.log(data);
		$("#branchId").val(data.branchId);
		$("#branchName").val(data.branchName);
		$("#batchId").val(data.id);
		$("#batchNo").val(data.batchNo);
		$("#scope").val(data.scope==1 ? "类别盘点" : "全场盘点");
		$("#categoryShows").val(data.categoryShowsStr);
	})
}

//选择商品
function selectGoods(){
	var branchId = $("#branchId").val();
	var sourceBranchId = branchId;
	var targetBranchId = branchId;
    if(branchId == ""){
        messager("请先选择机构");
        return;
    }
    
    var param = {
    		type:'',
    		key:"",
    		isRadio:'1',
    		branchId:branchId,
    		sourceBranchId:'',
    		targetBranchId:'',
    		supplierId:'',
    		flag:'0'
    }
    
    new publicGoodsServiceTem(param,function(data){
    	$('#skuId').val(data[0].skuId);
    	$('#skuName').val(data[0].skuName);
    });
}

/**
 * 导出
 */
function toExport(){
	var length = $("#diffSearchList").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	console.log(fromObjStr);
	$("#queryForm").form({
		success : function(data){
			if(data==null){
				$.messager.alert('提示',"导出数据成功！");
			}else{
				$.messager.alert('提示',JSON.parse(data).message);
			}
		}
	});
	$("#queryForm").attr("action",contextPath+"/stocktaking/diffSearch/exportDiffSearchList?"+fromObjStr);
	$("#queryForm").submit();
}

/**
 * 打印
 */
function printDiffSearchList(){
	var length = $("#diffSearchList").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	console.log(fromObjStr);
	var param=setParams("queryForm");
	console.log(param);
	parent.addTabPrint("异常查询","打印",contextPath+"/stocktaking/diffSearch/printDiffSearchList?" + param);
}

function setParams(formId){  
	var param="";
	var arr = $('#' + formId).serializeArray();
	if(arr != null){
		for(var i=0;i<arr.length;i++){
			var _val = encodeURIComponent(arr[i].value);
			if(_val){
				param = param + arr[i].name + "="+_val+"&";
			}
		}
	}
	if(param){
		param = param.substring(0,param.length-1);
	}
	return param;
}