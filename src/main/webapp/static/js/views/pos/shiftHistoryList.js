/**
 * Created by wxl on 2016/11/21.
 * pos登记-列表
 */
$(function(){
    initDatagridPosOrders();
});
var gridHandel = new GridClass();
//初始化表格
function initDatagridPosOrders(){
    $("#registerList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
		height:'100%',
		width:'100%',
		singleSelect: true,
        columns:[[
            {field: 'id', title: ' ID', width: '100px', align: 'left',hidden:true},
			{field: 'createUserCode', title: ' 用户编码', width: '150px', align: 'left'},
			{field: 'createUserName', title: '姓名', width: '150px', align: 'left'},
			{field: 'loginTime', title: '登录时间', width: '150px', align: 'left',
				 formatter: function(value,row,index){
						if (value) {
							return new Date(value).format('yyyy-MM-dd hh:mm:ss');
						}
						return "";
                 }
			},
			{field: 'exitTime', title: '交班时间', width: '150px', align: 'left'
			,
			 formatter: function(value,row,index){
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm:ss');
					}
					return "";
          }
			},
			{field: 'operate', title: '操作', width: '100px', align: 'center',
				 formatter: function(value,row,index){
                     if (row.isFinish==1){
                    	   return '<span onClick="getShift(\''+row.id+'\')" style="color:#4395ff">详情</span>';
                     }
                     else {
                         return '<span onClick="shiftChange(\''+row.id+'\')" style="color:#4395ff">交班</span>';;
                     }
                 }
			},
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
        
    });
    queryForm();
}

//新增dalog

function shiftChange(id){
	var dg = $("#registerList");
	$.messager.confirm('提示','是否交班',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/pos/shiftHistory/shiftExchange",
		    	type:"POST",
		    	data:{
		    		id: id
		    	},
		    	success:function(result){
		    		console.log(result);
		    		if(result['code'] == 0){
		    			successTip("交班成功");
		    			dg.datagrid('reload');
		    		}else{
		    			$.messager.alert((result['message']));
		    		}
		    	},
		    	error:function(result){
		    		$.messager.alert(("请求发送失败或服务器处理失败"));
		    	}
		    });
			
		}
		
	})
	
}
function getShift(id){
	var  dalogTemp = $('<div id="#regadd"/>').dialog({
		    href:contextPath + "/pos/shiftHistory/shiftDetail?id="+id,
		    width:400,
		    height:450,
		    title:"班次详情",
		    closable:true,
		    resizable:true,
		    onClose:function(){
		        $(dalogTemp).panel('destroy');
		    },
		    modal:true,
		    onLoad:function(){
		    	setDolgObj(dalogTemp);
		    },
		});
	}

//查询pos
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	$("#registerList").datagrid("options").method = "post";
	$("#registerList").datagrid('options').url = contextPath + '/pos/shiftHistory/queryList';
	$("#registerList").datagrid('load', fromObjStr);
}


