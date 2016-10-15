/**
 * Created by wxl on 2016/10/12.
 * 库存调整-编辑
 */
$(function(){
    initDatagridEditRequireOrder();
    $("div").delegate("button","click",function(){
    	$("p").slideToggle();
    });
    oldData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").html(),                 // 单号
    }
});
var gridDefault = {
    realNum:0,
    largeNum:0,
    isGift:0,
}
var oldData = {};
var gridHandel = new GridClass();
function initDatagridEditRequireOrder(){
    gridHandel.setGridName("gridEditRequireOrder");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
                selectGoods(arg);
            }
        },
    })
	var formId = $("#formId").val();
    $("#gridEditRequireOrder").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
    	url:contextPath+"/stock/adjust/getStcokFormDetailList?id="+formId,
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
                  {field:'ck',checkbox:true},
                  {field:'cz',title:'操作',width:'60px',align:'center',
                      formatter : function(value, row,index) {
                          var str = "";
                          if(row.isFooter){
                              str ='<div class="ub ub-pc">合计</div> '
                          }else{
                              str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                                  '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                          }
                          return str;
                      },
                  },
                  {field:'skuCode',title:'货号',width:'70px',align:'left'},
                  {field:'skuName',title:'商品名称',width:'200px',align:'left'},
                  {field:'barCode',title:'国际条码',width:'150px',align:'left'},
                  {field:'unit',title:'单位',width:'60px',align:'left'},
                  {field:'spec',title:'规格',width:'90px',align:'left'},
                  {field:'price',title:'单价',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          options:{
                          	disabled:true,
                              min:0,
                              precision:2,
                              onChange: onChangePrice,
                          }
                      },
                  },
                  {field:'stockNum',title:'当前库存',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:0,
                          options:{
                        	  disabled:true,
                              min:0,
                              precision:4,
                              onChange: onChangeLargeNum,
                          }
                      },
                  },
                  {field:'sellable',title:'当前可销售库存',width:'100px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:0,
                          options:{
                        	  disabled:true,
                              min:0,
                              precision:4,
                              onChange: onChangeLargeNum,
                          }
                      },
                  },
                  {field:'largeNum',title:'箱数',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:0,
                          options:{
                              min:0,
                              precision:4,
                              onChange: onChangeLargeNum,
                          }
                      },
                  },
                  {field:'skuId',hidden:'true'},
                  {field:'realNum',title:'数量',width:'80px',align:'right',
                  	formatter:function(value,row){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          if(!value||value==""||parseFloat(value)==0.0){
                          	row["realNum"] = row["dealNum"];
                        	  value = row["realNum"];
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:'0',
                          options:{
                              min:0,
                              precision:4,
                              onChange: onChangeRealNum,
                          }
                      },
                  },
                 
                  {field:'amount',title:'金额',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          options:{
                          	disabled:true,
                              min:0,
                              precision:2,
                              onChange: onChangeAmount,
                          }
                      },

                  },
                  {field:'reason',title:'调整原因',width:'200px',align:'left',editor:'textbox'},
                  {field:'remark',title:'备注',width:'200px',align:'left',editor:'textbox'}
              ]],
        onClickCell:function(rowIndex,field,value){
        	gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
        onLoadSuccess:function(data){
        	if(!oldData["grid"]){
            	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
            		return $.extend(true,{},obj);//返回对象的深拷贝
            	});
            }
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });

}
//监听商品箱数
function onChangeLargeNum(newV,oldV){
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        messager("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        messager("配送规格不能为0");
        return;
    }
    if(gridHandel.getSelectFieldName()!="realNum"){
	   gridHandel.setFieldValue('realNum',purchaseSpecValue*newV);//数量=商品规格*箱数
	}
   
    updateFooter();
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        messager("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        messager("配送规格不能为0");
        return;
    }
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',priceValue*newV);                         //金额=数量*单价
    gridHandel.setFieldValue('largeNum',(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格
    updateFooter();
}
//监听商品单价
function onChangePrice(newV,oldV) {
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    gridHandel.setFieldValue('amount',realNumVal*newV);                          //金额=数量*单价
    updateFooter();
}
//监听商品金额
function onChangeAmount(newV,oldV) {
    //获取税率
    var taxVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    gridHandel.setFieldValue('taxAmount',(taxVal*(newV/(1+parseFloat(taxVal)))).toFixed(2));
}
//监听是否赠品
function onSelectIsGift(data){
    var checkObj = {
        skuCode: gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'skuCode'),
        isGift:data.id,
    };
    var arrs = gridHandel.searchDatagridFiled(gridHandel.getSelectRowIndex(),checkObj);
    if(arrs.length==0){
        var targetPrice = gridHandel.getFieldTarget('price');
        if(data.id=="1"){
            var priceVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
            $("#"+gridHandel.getGridName()).datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"] = priceVal;
            $(targetPrice).numberbox('setValue',0);
            $(targetPrice).numberbox('disable');
        }else{
            $(targetPrice).numberbox('enable');
            var oldPrice =  $("#"+gridHandel.getGridName()).datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"];
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
        }
        updateFooter();
    }else{
        var targetIsGift = gridHandel.getFieldTarget('isGift');
        $(targetIsGift).combobox('select', data.id=='1'?'0':'1');
        messager(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}
//合计
function updateFooter(){
    var fields = {largeNum:0,realNum:0,amount:0,isGift:0, };
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    if($("#referenceId").val()){
        messager("已选配送单号，不允许添加其他商品");
        return;
    }
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}
//选择商品
function selectGoods(searchKey){
	var branchId = $("#branchId").val();
    //判定发货分店是否存在
    if($("#branchId").val()==""){
        messager("请先选择发货分店");
        return;
    }
    new publicGoodsService("",function(data){
        if(searchKey){
            $("#"+gridHandel.getGridName()).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridHandel.getGridName()).datagrid("acceptChanges");
        }
        selectStockAndPrice(branchId,data);
      
    },searchKey);
}

//二次查询设置值
function setDataValue(data) {
	for(var i in data){
    	var rec = data[i];
    	rec.remark = "";
    }
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var addDefaultData  = gridHandel.addDefault(data,gridDefault);
    var keyNames = {
		distributionPrice:'price',
        id:'skuId',
        disabled:'',
        pricingType:'',
        inputTax:'tax'
    };
    var rows = gFunUpdateKey(addDefaultData,keyNames);
    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    $("#gridEditRequireOrder").datagrid("loadData",newRows);
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}
//查询价格、库存
function selectStockAndPrice(branchId,data){
	var GoodsStockVo = {
			branchId : branchId,
			fieldName : 'id',
			goodsSkuVo : [],
		}; 
	$.each(data,function(i,val){
		var temp = {
				id : val.skuId
		};
		GoodsStockVo.goodsSkuVo[i] = temp;
	});
	$.ajax({
    	url : contextPath+"/goods/goodsSelect/selectStockAndPriceToDo",
    	type : "POST",
    	data : {
    		goodsStockVo : JSON.stringify(GoodsStockVo)
    	},
    	success:function(result){
    		setDataValue(result);
    	},
    	error:function(result){
    		successTip("请求发送失败或服务器处理失败");
    	}
    });
}

//保存
function saveOrder(){
	// 要活分店id
	var branchId = $("#branchId").val();
    // 备注
    var remark = $("#remark").val();
    var rows = gridHandel.getRows();
   /* if(rows.length==0){
        messager("表格不能为空");
        return;
    }
    var isCheckResult = true;
    $.each(rows,function(i,v){
        if(!v["skuCode"]){
            messager("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        if(v["largeNum"]<=0){
            messager("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["realNum"]<=0){
            messager("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }*/
    var saveData = JSON.stringify(rows);
    var stockFormDetailList = tableArrayFormatter(rows,"stockFormDetailList");
    var reqObj = $.extend({
    	createBranchId : branchId,
    	id : $("#formId").val(),
        remark : remark,
        reason :'',
        io :'1'
    }, stockFormDetailList);
    $.ajax({
        url:contextPath+"/stock/adjust/updateStockForm",
        type:"POST",
        data:reqObj,
        success:function(result){
            if(result['code'] == 0){
            	$.messager.alert("操作提示", "操作成功！", "info");
            }else{
                successTip(result['message']);
            }
        },
        error:function(result){
            successTip("请求发送失败或服务器处理失败");
        }
    });
}

//审核
function check(){
	//验证数据是否修改
    $("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        branchId:$("#branchId").val(), // 要活分店id
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid:gridHandel.getRows(),
    }

   /* if(!gFunComparisonArray(oldData,newData)){
        messager("数据已修改，请先保存再审核");
        return;
    }*/
	$.messager.confirm('提示','是否审核通过？',function(data){
		if(data){
			$.ajax({
		    	url : contextPath+"/stock/adjust/check",
		    	type : "POST",
		    	data : {
		    		id : $("#formId").val()
		    	},
		    	success:function(result){
		    		console.log(result);
		    		if(result['code'] == 0){
		    			$.messager.alert("操作提示", "操作成功！", "info",function(){
		    				location.href = contextPath +"/stock/adjust/list";
		    			});
		    		}else{
		    			successTip(result['message']);
		    		}
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}

//删除
function delStockForm(){
	$.messager.confirm('提示','是否要删除此条数据',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	type:"POST",
		    	data:{
		    		formId : $("#formId").val()
		    	},
		    	success:function(result){
		    		console.log(result);
		    		if(result['code'] == 0){
		    			successTip("删除成功");
		    			back();
		    		}else{
		    			successTip(result['message']);
		    		}
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}

//合计
function toFooter(){
	$('#gridEditRequireOrder').datagrid('reloadFooter',[{"isFooter":true,"receivablesAccount":$('#receivablesAccount').val()||0,"collectAccount":$('#collectAccount').val()||0}]);
}

/**
 * 机构名称
 */
function searchBranch (){
	new publicAgencyService(function(data){
	$("#branchId").val(data.branchesId);
	$("#branchName").val(data.branchName);
	});
}
/**
 * 申请人
 */
function selectOperator(){
	new publicOperatorService(function(data){
		$("#salesmanId").val(data.id);
		$("#salesmanName").val(data.userName);
	});
}


function loadLists(referenceId){
	$("#gridEditRequireOrder").datagrid("options").method = "post";
	$("#gridEditRequireOrder").datagrid('options').url = contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+referenceId;
	$("#gridEditRequireOrder").datagrid('load');
}
/**
 * 机构名称
 */
function selectBranchesadd(){
	new publicAgencyService(function(data){
		$("#targetBranchId").val(data.branchesId);
		$("#brancheName").val(data.branchName);
	},'DO','');
}

function toBack(){
	location.href = contextPath+"/stock/adjust/list";
}
/**
 * 导入
 */
function importHandel(){
	postelsxDeliver('gridEditOrder','/goods/goodsSelect',$("#sourceBranchId").val(),$("#targetBranchId").val(),"DA");
}

/**
 * 获取导入的数据
 * @param data
 */
function getImportData(data){
    $.each(data,function(i,val){
        data[i]["oldPurPrice"] = data[i]["purchasePrice"];
        data[i]["oldSalePrice"]=data[i]["salePrice"];
        data[i]["oldWsPrice"]=data[i]["wholesalePrice"];
        data[i]["oldVipPrice"]=data[i]["vipPrice"];
        data[i]["oldDcPrice"]=data[i]["distributionPrice"];
        data[i]["price"] = data[i]["oldPurPrice"];
        data[i]["realNum"]=data[i]["realNum"]||0;
      
        data[i]["amount"]  = parseFloat(data[i]["price"]||0)*parseFloat(data[i]["realNum"]||0);
        if(parseInt(data[i]["distributionSpec"])){
        	 data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["distributionSpec"])).toFixed(4);
        }else{
        	 data[i]["largeNum"]  =  0;
        	 data[i]["distributionSpec"] = 0;
        }
        
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    messager("导入成功");
}