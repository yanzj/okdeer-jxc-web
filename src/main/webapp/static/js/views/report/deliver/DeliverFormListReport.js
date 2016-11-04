/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单
 */
$(function(){
	//开始和结束时间
	toChangeDatetime(10);
	initDatagridRequireOrders();
	branchId = $("#branchId").val();
	brancheType = $("#brancheType").val();
});

var gridHandel = new GridClass();
//初始化表格
function initDatagridRequireOrders(){
	gridHandel.setGridName("deliverFormList");
    $("#deliverFormList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:'',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize : 50,
		height:'100%',
		width:'100%',
        columns:[[
			{field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',
				formatter:function(value,row,index){
					if(!value){
	                    return '<div class="ub ub-pc ufw-b">合计</div>';
	                }
					var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.deliverFormDetailId+'")';
					return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
				}
			},
            {field: 'sourceBranchCode', title: '发货机构编码', width: '100px', align: 'left'},
            {field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
            {field: 'targetBranchCode', title: '要货机构编码', width: '100px', align: 'left'},
            {field: 'targetBranchName', title: '要货机构', width: '200px', align: 'left'},
            {field:'referenceNo',title:'引用单号',width:'140px',align:'left',
            	formatter:function(value,row,index){
            		if (value == null || value == '') {
            			return '';
            		}
            		var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.referenceId+'")';
					return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
            	}
            },
            {field: 'skuCode', title: '货号', width: '100px', align: 'left'},
            {field: 'skuName', title: '商品名称', width: '100px', align: 'left'},
            {field: 'barCode', title: '条码', width: '100px', align: 'left'},
            {field: 'categoryCode', title: '类别编号', width: '100px', align: 'left'},
            {field: 'categoryName', title: '类别', width: '100px', align: 'left'},
            {field: 'spec', title: '规格', width: '100px', align: 'left'},
            {field: 'unit', title: '单位', width: '100px', align: 'left'},
            {field: 'price', title: '单价', width: '100px', align: 'right',
            	formatter:function(value,row,index){
            		if(!value){
                        return '';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'inputTax', title: '税率', width: '100px', align: 'right',
            	formatter:function(value,row,index){
            		if(!value){
                        return '';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'largeNum', title: '箱数', width: '100px', align: 'right',
            	formatter:function(value,row,index){
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
           },
            {field: 'num', title: '数量', width: '100px', align: 'right',
            	formatter:function(value,row,index){
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
               }
            },
            {field: 'amount', title: '金额', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
            {field: 'userName', title: '制单人', width: '100px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'}
        ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
}


//查询要货单
function queryForm(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	if(!(startDate && endDate)){
		$.messager.alert('提示', '日期不能为空');
		return ;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	$("#deliverFormList").datagrid("options").method = "post";
	$("#deliverFormList").datagrid('options').url = contextPath + '/form/deliverReport/getDeliverFormList';
	$("#deliverFormList").datagrid('load', fromObjStr);
}

/**
 * 查询机构
 */
var branchId;
var brancheType;
function selectBranches(){
	new publicAgencyService(function(data){
        if($("#branchId").val()!=data.branchesId){
            $("#branchId").val(data.branchesId);
            $("#branchName").val(data.branchName);
        }
	},'',branchId);
}
/**
 * 重置
 */
var resetForm = function() {
	location.href=contextPath+"/form/deliverReport/viewDeliverList";
};

/**
 * 导出
 */
function exportData(){
	var length = $('#deliverFormList').datagrid('getData').rows.length;
	if(length == 0){
		successTip("无数据可导");
		return;
	}
	if(length>10000){
		successTip("当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	
	var fromObjStr = $('#queryForm').serializeObject();
	$("#queryForm").form({
		success : function(result){
			//successTip(result);
		}
	});
	$("#queryForm").attr("action",contextPath+'/form/deliverReport/exportDeliverFormList')
	$("#queryForm").submit();
}

//商品分类
function getGoodsType(){
	new publicCategoryService(function(data){
		$("#goodsCategoryId").val(data.goodsCategoryId);
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);
	});
}

