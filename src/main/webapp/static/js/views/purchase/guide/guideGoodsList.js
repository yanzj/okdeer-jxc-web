//采购向导 第二部

var gridHandel = new GridClass();
var isType_one = true;
var isType_two = false;
var isType_three = false;

var formData;
$(function(){
	
	formData = $("#formData").val();
	formData = $.parseJSON(formData);
	
	var guideType = formData.guideType;
	
	if(guideType === 1){
		isType_one = false;
		isType_two = true;
		isType_three = true;
	}else if(guideType === 2){
		isType_one = true;
		isType_two = false;
		isType_three = true;
	}else{
		isType_one = true;
		isType_two = true;
		isType_three = false;
	}
	
	initPurchaseGuideGoodsListDg();
});

//初始化表格
function initPurchaseGuideGoodsListDg(){
	 gridHandel.setGridName("dgGuideGoodsList");

	$("#dgGuideGoodsList").datagrid({
        method:'post',
        align:'center',
        url:contextPath+'/form/purchaseGuide/getGoodsList',
        queryParams:formData,

        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //pageSize:10,
        //fitColumns:true,    //每列占满
        fit:true,            //占满
        showFooter:true,
        columns:[[
			{field:'cz',title:'操作',width:'60px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str = 
			                '<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    },
			},
        	{field:'supplierName',title:'供应商',width:180,align:'left'},
            {field:'branchName',title:'收货机构',width:80,align:'left'},
            {field:'skuCode',title:'货号',width:120,align:'left'},
            {field:'skuName',title:'商品名称',width:100,align:'center'},
            {field:'barCode',title:'条码',width:120,align:'left'},
            {field:'skuUnit',title:'单位',width:60,align:'left'},
            {field:'skuSpec',title:'规格',width:60,align:'left'},
            {field:'purchaseSpec',title:'采购规格',width:60,align:'left'},
            {field:'purchasePrice',title:'进价',width:120,align:'left'},
            
            {field:'upperLimit',title:'库存上限',width:120,align:'left',hidden:isType_one},
            {field:'lowerLimit',title:'库存下限',width:120,align:'left',hidden:isType_one},
            
            {field:'diliveCycle',title:'订货周期',width:120,align:'left',hidden:isType_two},
            {field:'safetyCoefficient',title:'安全系数',width:120,align:'left',hidden:isType_two},
            
            {field:'totalNum',title:'要贷数量',width:120,align:'left',hidden:isType_three},
            
            {field:'purchaseNum',title:'订货数量',width:120,align:'left',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        
                    if(!value){
                        row["purchaseNum"] = parseFloat(value||0).toFixed(2);
                    }
			        
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
			            onChange:actualStockChange
			        }
			    },
            },
            {field:'totalAmount',title:'金额',width:120,align:'left',
            	formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        
                    if(!value){
                        row["totalAmount"] = parseFloat(value||0).toFixed(2);
                    }
			        
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
			            disabled:true,
			        }
			    },
            },
            
            {field:'lastWeekAvgSales',title:'上周日销量',width:120,align:'left',hidden:isType_two},
            {field:'previousWeekAvgSales',title:'前周日销量',width:120,align:'left',hidden:isType_two},
            
            {field:'actualStock',title:'库存',width:120,align:'left'},
            {field:'remark',title:'备注',width:120,align:'left',editor:"textbox"}
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("purchaseNum");
            }
        },
        onLoadSuccess : function() {
        	if(gridHandel.getRows().length <= 0){
        		$('.devMsg').html('该向导没有可参考的数据。请回到上一步重新选择条件。');
        	}
        	
            gridHandel.setDatagridHeader("center");
            
        }
    });
}

function actualStockChange(newVal,oldVal){
	 var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchasePrice');
		
		gridHandel.setFieldValue('totalAmount',purchasePrice*newVal);  
}

//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

//上一步
function lastStep(){
	//返回到上一步
	$.StandardPost(contextPath+"/form/purchaseGuide/toGuideForm", formData);

}

//下一步
function nextStep (){
	
	 var rows = gridHandel.getRowsWhere({skuName:'1'});
	 var gridRows = [];
	 $.each(rows,function(i,data){
		 var param = {
					branchId:data.branchId,
					supplierId:data.supplierId,
					skuId:data.skuId,
					skuCode:data.skuCode,
					purchaseNum:data.purchaseNum,
					purchasePrice:data.purchasePrice,
					purchaseSpec:data.purchaseSpec,
					salePrice:data.salePrice,
					totalAmount:data.totalAmount,
					inputTax:data.inputTax,
					remark:data.remark,
					deliverId:data.deliverId
		 }
		 gridRows[i] = param;
	 });
	 
    $.ajax({
        url:contextPath+"/form/purchaseGuide/generFormList",
        type:"POST",
        contentType:"application/json",
        data:JSON.stringify(gridRows),
        success:function(result){
            if(result.code == 0){
            	
            	var guideNo = result.data;
            	//提交参数并跳转到第三步
            	location.href = contextPath+"/form/purchaseGuide/toGuideOrderList?guideNo="+guideNo;
            	//$.StandardPost(contextPath+"/form/purchaseGuide/guideOrderList", {guideNo:guideNo});
            }else{
                successTip(result.message);
            }
        },
        error:function(result){
            successTip("请求发送失败或服务器处理失败");
        }
    });
}
