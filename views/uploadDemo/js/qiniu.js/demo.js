/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */
$(function() {
    $.get("/spoc/fileService/findUploadQNParam.do", function(result){
        var data = JSON.parse(result);
        if(data.flag == true){
            uploadVideo(data.domain);
        }else{
            alert('session过期，请重新登录');
        }
    });

    function uploadVideo(domain){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',//运行环境
            browse_button: "pickfiles",//上传选择的点选按钮，**必需**//id名

            uptoken_func: function(){
                var ajax = new XMLHttpRequest();
                ajax.open('GET', '/spoc/fileService/findUploadQNParam.do', false);
                ajax.setRequestHeader("If-Modified-Since", "0");
                ajax.send();
                if (ajax.status === 200) {
                    var res = JSON.parse(ajax.responseText);

                    if(res.flag == true){
//                    	 console.log(res);
//                         console.log('custom uptoken_func:' + res.token);
                        return res.token;
                    }else{
                        alert('session过期，请重新登录');
                    }
                } else {
//                     console.log('custom uptoken_func err');
                    return '';
                }
            },
            domain: domain,   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: true, //设置上传文件的时候是否每次都重新获取新的token
            container: 'container',//包含button和input的div
            max_file_size: '300mb',//最大上传文件大小
            flash_swf_url: 'js/Moxie.swf',  //引入flash,相对路径
            max_retries: 3,    //上传失败最大重试次数
            dragdrop: false,  //开启可拖曳上传
            chunk_size: '4mb',//分块大小

            multi_selection: true,
            unique_names: false ,
            save_key: true,
            auto_start: true,//开启选择文件后自动上传

            filters : {//过滤器，用来限制上传文件的类型//打开的选择文件窗口就是只能选择视频文件
                max_file_size : '300mb',
                prevent_duplicates: true,
                // Specify what files to browse for
                mime_types: [
                    {title : "Video files", extensions : "mp4"} // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                ]
            },
            init: {
                'FilesAdded': function(up, files) {//添加上传任务之后的回调函数
                    plupload.each(files, function(file) {
                        setBlockWindow(file);
                    });
                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前,处理相关的事情
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情 ==设置上传的进度条
                    setProgressBar(file);
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                    $('#block_window').remove();
                    $('.tipmsg').remove();
                    alert("上传完成！点击保存按钮进行保存");
                    var domain = up.getOption('domain');
                    var res = JSON.parse(info);
                    var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                    //把七牛返回的url路径返回给后台
//	                console.log(sourceLink);
                    $("#classroomVideoUrl").val(sourceLink);
                },
                'Error': function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                    if(err){
                        switch (err.code){
                            case -602:alert("请勿重复上传同一文件");
                                break;
                            default:
                                break;
                        }
                    }
//	            	console.log(err);
//	            	console.log(errTip);

                }
            }
        });

        function setBlockWindow(file){
            $('#block_window').remove();
            var blockWindow = $('<div id="block_window"><div id="progressWrap"><div class="barOut"> <div class="barIn"> </div></div> <div class="barInfo"><p class="file_name">文件名：<span>修剪草坪的小黄人</span></p> <p class="file_size">文件大小：<span>100MB</span></p> <p class="file_done_chalk">已上传：<span>1.3M</span></p> <p class="file_speed">速度：<span>500kb/s</span></p></div></div></div>');
            blockWindow.css({
                'width':"100%",
                'height':"768px",
                "background":"rgba(0,0,0,0.5)",
                "z-index":"9999",
                "position":"absolute",
                "left":"50%",
                "top":"50%",
                "transform":"translate(-50%,-50%)"
            });
            blockWindow.find('#progressWrap').css({
                'width':"800px",
                'height':"180px",
                "padding":"20px",
                'background':"white",
                "border-radius":"5px",
                "position":"absolute",
                "left":"50%",
                "top":"50%",
                "transform":"translate(-50%,-50%)"
            });
            blockWindow.find('.barOut').css({
                "box-sizing": "border-box",
                'width':"800px",
                'height':"30px",
                "margin-top":"50px",
                "background":"#f2f2f2",
                "border-radius":"15px",
                "border":"2px solid #cacaca",
                "overflow":"hidden"
            });
            blockWindow.find('.barOut').find('.barIn').css({
                'width':"0",
                'height':"100%",
                "background":"linear-gradient(to bottom,#effb8b,#a9d748)",
                "border-radius":"13px"
            });
            blockWindow.find('.barInfo').css({
                'width':"100%",
                'height':"40px"
            });
            blockWindow.find('.barInfo').find('p').css({
                'float':'left',
                "width":"130px",
                "text-align":"left",
                "padding":"0 12px",
                "line-height":"40px",
                "font-size":"14px",
                "overflow": "hidden",
                "white-space": "nowrap",
                "text-overflow": "ellipsis"
            });
            blockWindow.find('.barInfo').find('.file_name').css({
                "width":"280px",
                "overflow": "hidden",
                "white-space": "nowrap",
                "text-overflow": "ellipsis"
            });

            $('body').append(blockWindow);
        }
        function setProgressBar(file){
            var fileName = file.name;
            var fileSize = file.size/1024/1024;
            var formatSize  = fileSize.toFixed(1);
            var filePercent = file.percent == 100 ? file.percent-0.01:file.percent;
            var fileDone = (fileSize*filePercent)/100;
            var fileSpeed = file.speed/(1024);
            var formatSpeed = fileSpeed.toFixed(1);
            $("#progressWrap").find('.barInfo').find('p').find('span').text('');
            $("#progressWrap").find('.barInfo').find('.file_name').find('span').text(fileName);
            $("#progressWrap").find('.barInfo').find('.file_size').find('span').text(formatSize + " MB");
            $("#progressWrap").find('.barInfo').find('.file_done_chalk').find('span').text(filePercent + " %");
            $("#progressWrap").find('.barInfo').find('.file_speed').find('span').text(formatSpeed + " kb/s");
            //进度条内层的宽度
            var barOutWidth = $("#progressWrap").find('.barOut').width();
            var barInWidth = barOutWidth*filePercent/100;
            $("#progressWrap").find('.barIn').width(barInWidth);
        }
    }
});



