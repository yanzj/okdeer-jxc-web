/**
 * Created by huangj02 on 2016/8/9.
 */

//html5 localStorage 存值永久有效
window.localStorageUtil = {
   setLocalStorageItem:function(localName,localObj){ //设置存储数据，传入key和value；key是任意的字符串，value是一个object
      localStorage.setItem(localName,JSON.stringify(localObj));
   },
   getLocalStorageItem:function(localName){ //获取存储数据，传入之前设置的key
      var data = JSON.parse(localStorage.getItem(localName));
      return data;
   },
   delLocalStorageItem:function(localName){ //删除存储数据，传入之前设置的key
	   localStorage.removeItem(localName);
   },
   clearStorageItem:function(){ //清空所有存储数据
      localStorage.clear()
   }
}

function goodsArchives(){
    this.selectTypeName = "categoryCode"
    //tree的提交参数
    this.treeParam = {
        categoryCode:'',
        supplierId:'',
        brandId:'',
        level:'',
    }
    //获取当前选中的树相关参数
    this.currSelectTreeParam = {
		categoryId:'',
		categoryCode:'',
		categoryName:''
    }
    //树的请求地址
    this.treeUrls = [
        {
            name:'categoryCode',
            url:contextPath+'/common/category/getGoodsCategoryToTree'
        },
        {
            name:'brandId',
            url:contextPath+'/common/brand/getBrandToTree'
        },
        {
            name:'supplierId',
            url:contextPath+'/common/supplier/getSupplierToTree'
        }
   ];
    this.getTreeUrl = function(name){
        var httpUrl = ""
        $.each(this.treeUrls,function(i,v){
            if(v.name==name){
                httpUrl = v.url;
                return false
            }
        });
        return httpUrl
    }
}
var goodsClass = new goodsArchives();

$(function(){
	initView();
	initTreeArchives();
	initDatagridOrders();
	//清楚缓存
	localStorageUtil.clearStorageItem();
});


function initView(){
    $('#goodsType').combobox({
        valueField:'id',
        textField:'text',
        data: [{
            id: 'categoryCode',
            text: '类别',
            selected:true,
        }],
        onSelect: function(record){
            goodsClass.selectTypeName = record.id;
            initTreeArchives();
        },
    });
}

//初始树
function initTreeArchives(){
    var args = { }
    var httpUrl = goodsClass.getTreeUrl(goodsClass.selectTypeName);
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeArchives"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeArchives");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
    });
}
//选择树节点
function zTreeOnClick(event, treeId, treeNode) {
    if(goodsClass.selectTypeName=="categoryCode"){
    	//获取当前选中的”类别“相关参数
    	goodsClass.currSelectTreeParam = {
    		categoryId:treeNode.id,
    		categoryCode:treeNode.code,
    		categoryName:treeNode.text
        }
        goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.code;
        //将选中树参数值传入表单
        $("#categoryCode").val(treeNode.code);
        $("#brandId").val('');
        $("#supplierId").val('');
        $("#startCount").val('');
    	$("#endCount").val('');
    }
    gridReload("goodsTab",goodsClass.treeParam,goodsClass.selectTypeName);
};

function gridReload(gridName,httpParams,selectTypeName){
	switch (selectTypeName){ 
		case "categoryCode":  //类别
			httpParams.supplierId = "";
			httpParams.brandId = "";
			break;
	}
	//将左侧查询条件设置缓存中
	setLocalStorage();
	$("#"+gridName).datagrid("options").url = contextPath+'/goods/report/getList';
	$("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}


//初始化表格
var dg;
function initDatagridOrders(){
	dg=$("#goodsTab").datagrid({
		//title:'普通表单-用键盘操作',
		align:'center',
		method: 'post',
		//url: contextPath+"/goods/report/getList",
		singleSelect:true,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		pageSize:20,
		height:'100%',
		columns:[[  
		          {field:'id',title:'商品id',hidden:true},  
		          {field:'skuCode',title:'货号'},  
		          {field:'skuName',title:'商品名称'}, 
		          {field:"barCode",title:"条码",sortable:true,tooltip:true,width:100},
		          {field:"memoryCode",title:"助记码",sortable:true,tooltip:true,width:80},
		          {field:"oneCategoryName",title:"商品一级类别",sortable:true,tooltip:true,width:80},
		          {field:"category",title:"商品类别",sortable:true,tooltip:true,width:80},
		          {field:"spec",title:"规格",sortable:true,tooltip:true,width:80},
		          {field:"brand",title:"品牌",sortable:true,tooltip:true,width:80},
		          {field:"unit",title:"库存单位",sortable:true,tooltip:true,width:60},
		          {field:"purchaseSpec",title:"进货规格",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }  
		          },
		          {field:"distributionSpec",title:"配送规格",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }  
		          },
		          {field:"vaildity",title:"保质期天数",sortable:true,tooltip:true,width:80,align:'right'},
		          {field:"originPlace",title:"产地",sortable:true,tooltip:true,width:80},
		          {field:"supplier",title:"主供应商",sortable:true,tooltip:true,width:80},
		          {field:"saleWay",title:"经营方式",sortable:true,tooltip:true,width:60,hidden:true},
		          {field:"saleWayName",title:"经营方式",sortable:true,tooltip:true,width:60},
		          {field:"supplierRate",title:"联营扣率/代销扣率",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"purchasePrice",title:"进货价",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"salePrice",title:"零售价",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"distributionPrice",title:"配送价",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"wholesalePrice",title:"批发价",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"vipPrice",title:"会员价",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(row.vipPrice){
		        			  return parseFloat(row.vipPrice).toFixed(2);
		        		  }
		        		  return null;
		        	  }	
		          },
		          {field:"status",title:"商品状态",sortable:true,tooltip:true,width:80,
		        	  formatter : function(status){
		        		  if(status){
		        			  return status.value;
		        		  }
		        		  return null;
		        	  }	
		          },
		          {field:"pricingType",title:"计价方式",sortable:true,tooltip:true,width:80,
		        	  formatter : function(pricingType){
		        		  if(pricingType){
		        			  return pricingType.value;
		        		  }
		        		  return null;
		        	  }

		          },
		          {field:"inputTax",title:"进项税率",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"outputTax",title:"销项税率",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"profitAmtRate",title:"毛利率",sortable:true,tooltip:true,width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }	
		          }
		          ]] ,
		          toolBar : "#tg_tb",
		          /*  onBeforeLoad:function(param){
   			var categoryCodeTree = $("#categoryCodeTree").val();
   			if(categoryCodeTree==null || categoryCodeTree==""){
   				return false;
   			}
   			return true;
   		}, */
		          enableHeaderClickMenu: false,
		          enableHeaderContextMenu: false,
		          enableRowContextMenu: false

	});
}

/**
 * 供应商选择
 */
function searchSupplier(){
	new publicSupplierService(function(data){
		$("#supplierName").val(data.supplierName);
	});
}

/**
 * 品牌选择
 */
function searchBind(){
	new publicBrandService(function(data){
		$("#brandName").val(data.brandName);
	});
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
	$("#branchName").val(data.branchName);
	});
}

/**
 * 商品货号
 */
function selectSkuCode(){
	new publicGoodsService("",function(data){
		$("#skuCode").val(data[0].skuCode);
	},"",1,'','','','');

}
/**
 * 导出
 */
function exportData(){
	var length = $('#goodsTab').datagrid('getData').rows.length;
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

function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");
	$("#queryForm").form({
		success : function(result){
			successTip(result);
		}
	});
	//获取左侧缓存查询数据
	var obj = localStorageUtil.getLocalStorageItem("storge");
	$("#categoryCode").val(obj.categoryCode);
	
	//导出记录上一次查询条件
	$("#queryForm").attr("action",contextPath+"/goods/report/exportList");
	$("#queryForm").submit(); 
}


//搜索导出清除左侧条件
function cleanLeftParam(){
	$("#categoryCode").val('');
}

//将左侧查询条件设置缓存中
function setLocalStorage(){
	var categoryCode = $("#categoryCode").val();
	var obj={"categoryCode":categoryCode}
	localStorageUtil.setLocalStorageItem("storge",obj);
}

//查询
function query(){
	//搜索导出清除左侧条件
	cleanLeftParam();
	$("#startCount").val('');
	$("#endCount").val('');
	
	//将左侧查询条件设置缓存中
	setLocalStorage();
	
	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
	
	$("#goodsTab").datagrid("options").queryParams = $("#queryForm").serializeObject();
	$("#goodsTab").datagrid("options").method = "post";
	$("#goodsTab").datagrid("options").url = contextPath+"/goods/report/getList";
	$("#goodsTab").datagrid("load");
}
//重置
function resetFrom(){
	$("#queryForm").form('clear');
}
//打印
function printReport(){
	var supplierId=$("#supplierId").val();
	var categoryCode=$("#categoryCode").val();
	var brandId=$("#brandId").val();
	var branchId=$("#branchId").val();
	var skuCode=$("#skuCode").val();
	var barCode=$("#barCode").val();
	var operater=$("#operater").val();
	var operaterNum=$("#operaterNum").val();
	var memoryCode=$("#memoryCode").val();
	parent.addTabPrint("reportPrint"+branchId,"打印",contextPath+"/goods/report/printReport?" +"&supplierId="+supplierId
			+"&categoryCode="+categoryCode+"&brandId="+brandId+"&skuCode="+skuCode+"&branchId="+branchId+"&barCode="+barCode
			+"&operater="+operater+"&operaterNum="+operaterNum+"&memoryCode="+memoryCode);
}
