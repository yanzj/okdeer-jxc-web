
var targetBranchTypeTemp = "";
var branchId = '';	
var gridDefault = {
	    applyNum:0,
	    largeNum:0,
	    isGift:0,
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "gridRequireOrder";
var deliverStatus;
var editRowData = null;
$(function(){
	deliverStatus = $('#deliverStatus').val();
	if(deliverStatus === 'add'){
		  $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm')); 
		  initDatagridRequireOrder();
		    targetBranchTypeTemp = $("#targetBranchType").val();
	}else if(deliverStatus === 'edit'){
		var formId = $("#formId").val();
		url = contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DD";
		initDatagridRequireOrder();
	    $("div").delegate("button","click",function(){
	    	$("p").slideToggle();
	    });
	    oldData = {
	        targetBranchId:$("#targetBranchId").val(), // 要活分店id
	        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
	        /*validityTime:$("#validityTime").val(), */     //生效日期
	        remark:$("#remark").val(),                  // 备注
	        formNo:$("#formNo").val(),                 // 单号
	    }
	}
})

$(document).on('input','#remark',function(){
	var val=$(this).val();
	var str = val;
	   var str_length = 0;
	   var str_len = 0;
	      str_cut = new String();
	      str_len = str.length;
	      for(var i = 0;i<str_len;i++)
	     {
	        a = str.charAt(i);
	        str_length++;
	        if(escape(a).length > 4)
	        {
	         //中文字符的长度经编码之后大于4
	         str_length++;
	         }
	         str_cut = str_cut.concat(a);
	         if(str_length>200)
	         {
	        	 str_cut.substring(0,i)
	        	 remark.value = str_cut;
	        	 break;
	         }
	    }
	
});

var gridHandel = new GridClass();
function initDatagridRequireOrder(){
    gridHandel.setGridName(gridName);
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
            	branchId = $("#sourceBranchId").val();
                selectGoods(arg);
            }
        },
    })

    $("#"+gridName).datagrid({
        method:'post',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
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
			    }
			},
            {field:'rowNo',hidden:'true'},
            {field:'skuCode',title:'货号',width: '70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'150px',align:'left',
            },
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            /*{field:'twoCategoryCode',title:'类别编号',width:'90px',align:'left'},
            {field:'twoCategoryName',title:'类别名称',width:'90px',align:'left'},*/
            {field:'distributionSpec',title:'配送规格',width:'90px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeLargeNum,
                    }
                }
            },
            {field:'applyNum',title:'数量',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value){
                        row["applyNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                }
            },
            {field:'untaxedPrice',title:'不含税单价',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return
            		}
            		if(!row.untaxedPrice){
            			row.untaxedPrice = parseFloat(value||0).toFixed(4);
            		}
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            },
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.price){
                    	row.price = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'untaxedAmount',title:'不含税金额',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            		}
            		
            		if(!row.untaxedAmount){
            			row.untaxedAmount = parseFloat(value||0).toFixed(4);
            		}
            		
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			disabled:true,
            			min:0,
            			precision:4,
            		}
            	}
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(4);
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:4,
                    }
                }
            },
            {field:'isGift',title:'赠送',width:'80px',hidden:true,align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        required:true,
                        data: [{
                            "id":'1',
                            "text":"是",
                        },{
                            "id":'0',
                            "text":"否",
                        }],
                       /* onSelect:onSelectIsGift*/
                    }
                }
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
            		return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
                options:{
                    min:0,
                    disabled:true,
                    precision:4,
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!row.taxAmount){
                    	row.taxAmount = parseFloat(value||0).toFixed(4);
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:4,
                    }
                }
            },
            {field: 'targetStock', title: '店铺库存', width: '80px', hidden:true,align: 'right',
                formatter: function (value, row, index) {
                    if (row.isFooter) {
                        return
                    }
                    if (!row.sourceStock) {
                        row.sourceStock = parseFloat(value || 0).toFixed(2);
                    }
                    return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
                }
            },
            {field:'sourceStock',title:'目标库存',width:'80px',hidden:true,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    
                    if(!row.sourceStock){
                        row.sourceStock = parseFloat(value||0).toFixed(2);
                    }
                    
                    if(parseFloat(row.applyNum)+parseFloat(row.alreadyNum) > parseFloat(row.sourceStock)){
                     	 return '<span style="color:red;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
  	           		}else{
  	           			return '<span style="color:black;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
  	           		}
                    
                }
            },
            {field:'alreadyNum',title:'已订数量',width:'80px',hidden:true,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!row.alreadyNum){
                        row.alreadyNum = parseFloat(value||0).toFixed(2);
                    }
                    
                    if(parseFloat(row.applyNum)+parseFloat(row.alreadyNum) > parseFloat(row.sourceStock)){
                      	 return '<span style="color:red;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
   	           		}else{
   	           			return '<span style="color:black;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
   	           		}

                }
            },
            {field:'remark',title:'备注',width:'200px',align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            }
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
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
                // $("#"+gridName).datagrid('acceptChanges');
            }else{
                if(editRowData.skuCode != changes.skuCode){
                    rowData.skuCode = editRowData.skuCode;
                    gridHandel.setFieldTextValue('skuCode',editRowData.skuCode);
                }
            }
        },
        onLoadSuccess:function(data){
        	if(deliverStatus==='edit'){
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
                }
        	}

            gridHandel.setDatagridHeader("center");
            //updateRowsStyle();
            updateFooter();
        },
    });
    
    if(deliverStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
    }

    var param = {
        distributionPrice:["price","amount","taxAmount","untaxedAmount","untaxedPrice"],
    }
    priceGrantUtil.grantPrice(gridName,param);

}

//限制转换次数
var n = 0;
var m = 0;
//监听商品箱数
function onChangeLargeNum(newV,oldV){
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		m = 2;
		 $_jxc.alert("商品箱数输入有误");
		 gridHandel.setFieldValue('largeNum',oldV); 
	     return;
	}

	if(m > 0){
		m = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }

    //金额 = 规格 * 单价 * 箱数
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(purchaseSpecValue*priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);
    var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPrice');
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'applyNum');
    var newRealNum = parseFloat(purchaseSpecValue*newV).toFixed(4);
    calcUntaxedPriceAndAmount(newRealNum,amount,untaxedPrice);// 计算不含税单价，金额  
    if(realNumVal&& oldV){
    	n=1;
        gridHandel.setFieldValue('applyNum',newRealNum);//数量=商品规格*箱数 
    }
    updateFooter();
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		n= 2;
		 $_jxc.alert("商品数量输入有误");
		 gridHandel.setFieldValue('applyNum',oldV);
	     return;
	}
	
	if(n > 0){
		n = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);                         //金额=数量*单价
    var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPrice');
    calcUntaxedPriceAndAmount(newV,amount,untaxedPrice);// 计算不含税单价，金额  
    var largeNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'largeNum');

    if(largeNumVal&& oldV){
    	m=1;
        var largeNumVal = parseFloat(newV/purchaseSpecValue).toFixed(4);
        gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格
    }
    /*gridHandel.setFieldValue('largeNum',(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格*/
    updateFooter();
}
//计算不含税单价，金额
function calcUntaxedPriceAndAmount(realNum,amount,untaxedPrice){
	var untaxedAmount = parseFloat(untaxedPrice*realNum).toFixed(4);
	gridHandel.setFieldValue('untaxedAmount',untaxedAmount);
	gridHandel.setFieldValue('taxAmount',parseFloat(amount-untaxedAmount).toFixed(4));//=金额-不含税金额
}
//合计
function updateFooter(){
    var fields = {largeNum:0,applyNum:0,amount:0,isGift:0,untaxedAmount:0,taxAmount:0};
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
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
	var sourceBranchId = $("#sourceBranchId").val();
	var targetBranchId = $("#targetBranchId").val();
    //判定发货分店是否存在
    if($("#sourceBranchId").val()==""){
        $_jxc.alert("请先选择发货机构");
        return;
    }
    
    var param = {
    		type:'DD',
    		key:searchKey,
    		isRadio:'',
    		sourceBranchId:sourceBranchId,
    		targetBranchId:targetBranchId,
    		branchId:branchId,
    		supplierId:'',
    		flag:'0',
    }

    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
	        $("#gridEditOrder").datagrid("deleteRow", gridHandel.getSelectRowIndex());
	        $("#gridEditOrder").datagrid("acceptChanges");
	    }
    	setDataValue(data);
    	
        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("largeNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
        },500)
    	
    });
    branchId = '';
}

//二次查询设置值
function setDataValue(data) {
    	for(var i in data){
	        var rec = data[i];
	        rec.remark = "";
//	        rec.untaxedAmount = 0;
//			rec.taxAmount = 0;
        }
        var nowRows = gridHandel.getRowsWhere({skuName:'1'});
        var addDefaultData = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
            costPrice:'price',
            id:'skuId',
            disabled:'',
            taxRate:'inputTax',
            pricingType:''
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1};   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        $("#"+gridName).datagrid("loadData",newRows);
        
        oldData["grid"] = $.map(rows, function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        });
}

//保存
function saveOrder(){
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //总金额
    var untaxedAmount=0;
	// 要活分店id
	var targetBranchId = $("#targetBranchId").val();
	if(targetBranchId==""){
		 $_jxc.alert("要货机构不能为空");
	        return;
	}
	
	//发货分店id
    var sourceBranchId = $("#sourceBranchId").val();
    //生效日期
   /* var validityTime = $("#validityTime").val();*/
    // 备注
    var remark = $("#remark").val();
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#"+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["applyNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
        untaxedAmount = parseFloat(footerRows[0]["untaxedAmount"]||0.0).toFixed(4);
    }

    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }

    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    var isCheckResult = true;
    $.each(rows,function(i,v){
        if(!v["skuCode"]){
            $_jxc.alert("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        if(v["largeNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["applyNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }

        var _realNum = parseFloat(v["largeNum"] * v["distributionSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["applyNum"]/v["distributionSpec"]).toFixed(4);
        if(parseFloat(_realNum ).toFixed(4) != parseFloat(v["applyNum"]).toFixed(4)
            && parseFloat(_largeNum ).toFixed(4) != parseFloat(v["largeNum"]).toFixed(4)){
            $_jxc.alert("第"+(i+1)+"行，箱数和数量的数据异常，请调整");
            isCheckResult = false;
            return false;
        }

        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }
    var saveData = JSON.stringify(rows);
    var reqObj = {
    	formType:'DD',
    	sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
        untaxedAmount:untaxedAmount,
        totalNum:totalNum,
        amount:amount,
        remark:remark,
        branchCode:$("#branchCode").val(),
        deliverFormListVo : []
    };
    
    $.each(rows,function(i,data){
    	var temp = {
    		skuId : data.skuId,
    		skuCode : data.skuCode,
    		skuName : data.skuName,
    		barCode : data.barCode,
    		spec : data.spec,
    		rowNo : data.rowNo,
    		applyNum : data.applyNum,
    		largeNum : data.largeNum,
    		price : data.price,
    		amount : data.amount,
    		untaxedPrice : data.untaxedPrice,
    		untaxedAmount : data.untaxedAmount,
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/insertDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj)
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
            });
        }else{
            var strResult = "";
            if (result.dataList) {
                $.each(result.dataList,function(i,item){
                    strResult += item.goodsName+" ,库存数量： "+item.number+",";
                })
            }
            $_jxc.alert(result['message']);
        }
    });
}

//审核
function check(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid:gridHandel.getRows(),
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否终止店间配送申请单？',function(data){
		if(data){
//            gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverForm/toEnd",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DD'
		    	}
		    },function(result){
//                gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
	    			});
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//删除
function delDeliverForm(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids)
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("form/deliverForm/viewsDD","deliverFormList");
	    			toClose();
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


function toEnd(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid:gridHandel.getRows(),
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
//            gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverForm/check",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DD'
		    	}
		    },function(result){
//                gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
	    			});
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

/**
 * 要货机构
 */
var branchCode = '';
function selectTargetBranch(){
	/*var targetBranchType = $("#targetBranchType").val();
	if(targetBranchTypeTemp != '0' && targetBranchTypeTemp != '1'){
		return;
	}*/
	new publicAgencyService(function(data){
        $("#targetBranchId").val(data.branchesId);
        //$("#targetBranchName").val(data.branchName);
        $("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
        /*branchCode = data.branchCode;*/
        $("#targetBranchType").val(data.type);
        // 为店铺时
        /*if (data.type != '1' && data.type != '0') {
        	getSourceBranch(data.branchesId);
        }
        if (data.type == '1') {
        	$("#salesman").val(data.salesman);
        	$("#spanMinAmount").html(data.minAmount);
        	$("#minAmount").val(data.minAmount);
        	$("#sourceBranchId").val('');
            $("#sourceBranchName").val('');
        }*/
	},'DD','',"3");
}

function getSourceBranch(branchesId) {
	$_jxc.ajax({
    	url : contextPath+"/form/deliverForm/getSourceBranch",
    	data : {
    		branchesId : branchesId,
    	}
    },function(result){
		if(result['code'] == 0){
			$("#sourceBranchId").val(result['sourceBranchId']);
            $("#sourceBranchName").val(result['sourceBranchName']);
            $("#validityTime").val(new Date(result['validityTime']).format('yyyy-MM-dd'));
            $("#salesman").val(result['salesman']);
            $("#spanMinAmount").html(result['minAmount']);
            $("#minAmount").val(result['minAmount']);
		}else{
            $_jxc.alert(result['message']);
		}
    });
}

/**
 * 发货机构
 */
function selectSourceBranch(){
	
	var targetBranchType = $("#targetBranchType").val();
	if(targetBranchType != '0' && targetBranchType != '1'){
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'',"","");
	} else {
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'DD',"","");
    }
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	// 要货机构id
	var targetBranchId = $("#targetBranchId").val();
	// 发货机构id
    var sourceBranchId = $("#sourceBranchId").val();
    if(sourceBranchId === '' || sourceBranchId === null){
        $_jxc.alert("请先选择发货机构");
        return;
    }
    
    var param = {
        url:contextPath+"/form/deliverForm/importList",
        tempUrl:contextPath+"/form/deliverForm/exportTemp",
        type:type,
        formType:'DD',
        targetBranchId:targetBranchId,
        sourceBranchId:sourceBranchId
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(data);
    	}
    },param)
}

//查询价格、库存
function selectStockAndPriceImport(data){
	//updateListData(data);
    var GoodsStockVo = {
        branchId : $("#sourceBranchId").val(),
        fieldName : 'id',
        goodsSkuVo : []
    };
    $.each(data,function(i,val){
        var temp = {
            id : val.skuId
        };
        GoodsStockVo.goodsSkuVo[i] = temp;
    });
    $_jxc.ajax({
        url : contextPath+"/goods/goodsSelect/queryAlreadyNum",
        data : {
            goodsStockVo : JSON.stringify(GoodsStockVo)
        }
    },function(result){
        $.each(data,function(i,val){
            $.each(result.data,function(j,obj){
                if(val.skuId==obj.skuId){
                    data[i].alreadyNum = obj.alreadyNum;
                }
            })
        })
        updateListData(data);
    });
}

function updateListData(data){
     var keyNames = {
		 costPrice:'price',
         id:'skuId',
         disabled:'',
         pricingType:'',
         taxRate:'inputTax',
         num : 'applyNum'
     };
     var rows = gFunUpdateKey(data,keyNames);
     for(var i in rows){
         rows[i].remark = "";
         rows[i].isGift = 0;
    	 var applyNum = parseFloat(rows[i]["applyNum"]||0).toFixed(4);
		 var price = parseFloat(rows[i]["price"]||0).toFixed(4);
		 var untaxedPrice = parseFloat(rows[i]["untaxedPrice"]||0).toFixed(4);
         rows[i]["amount"] = parseFloat(price*applyNum).toFixed(4);
         rows[i]["untaxedAmount"]  = parseFloat(untaxedPrice*applyNum).toFixed(4);
         rows[i]["taxAmount"] = rows[i]["amount"]-rows[i]["untaxedAmount"];
         if(parseInt(rows[i]["distributionSpec"])){
        	 // 如果导入数量为1，规则为9时，后台反正出箱数为0.1111，此处通过后台反算的箱数*规则时，得出数量为0.9999，故导入不需要前端返算数量
        	 // rows[i]["applyNum"]  = (parseFloat(rows[i]["largeNum"]||0)*parseFloat(rows[i]["distributionSpec"])).toFixed(4);
         }else{
        	 rows[i]["largeNum"]  =  0;
        	 rows[i]["distributionSpec"] = 0;
         }
     }
     var argWhere ={skuCode:1};  //验证重复性
     var isCheck ={isGift:1 };   //只要是赠品就可以重复
     var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);
     
     $("#"+gridName).datagrid("loadData",newRows);
 
}
//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDD";
}

//新增要货单
function addDeliverForm(){
	toAddTab("新增店间配送申请单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DD");
}

