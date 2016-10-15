/**
 * Created by huangj02 on 2016/10/13.
 * 公共组件-导入货号或条码
 */
var uploadFileParams;
var uploadFileCallBack ;
//初始化回调函数
function initUploadFileCallBack(cb,params){
    uploadFileParams = params;
    uploadFileCallBack = cb;
}
/**
 * 显示文件路径
 * @param event
 */
function fileUrlChange(event){
    var value=$("#file").val();
    $('#filelink').val(value);
}

/**
 * 开始上传
 */
function toUploadHandel(){
    var formData = new FormData();
    formData.append("file",$("#file")[0].files[0]);
    formData.append("branchId",uploadFileParams.branchId);
    formData.append("type",uploadFileParams.type);
    $.ajax({
        url : uploadFileParams.url,//uploadFileParams.url,
        type : 'POST',
        data : formData,
        processData : false,
        contentType : false,
        success : function(data) {
            if(data.code==0){
                $("#message").html(data.importInfo.message);
                if(data.importInfo.list.length==0){
                    $("#errorUrl").html("<a href='"+data.importInfo.errorFileUrl+"' target='_blank'>导入失败，重新下载</a>");
                }else{
                    uploadFileCallBack(data.importInfo.list);
                }
            }else{
                $("#message").html(data.importInfo.message);
                $("#errorUrl").html("<a href='"+data.importInfo.errorFileUrl+"' target='_blank'>导入失败，重新下载</a>");
            }
        },
        error : function(responseStr) {
            console.log("error");
        }
    });
}
/**
 * 取消
 */
function toCancel(){

}

/**
 * 下载模板文件
 */
function downExportFile(){
    if(uploadFileParams.type==0){//导入货号
        location.href=contextPath+'/form/purchase/exportTemp?type='+type;
    }else if(uploadFileParams.type==1){//导入条码
        location.href=contextPath+'/form/purchase/exportTemp?type='+type;
    }
}
