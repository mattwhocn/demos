/**
 * Created by zhang on 2017/3/15.
 */
(function ($GLOBAL, $) {
    /**
     * 静态全局变量
     */
    this.$BASEURL = "http://m.jibanji.com";
    /**
     * 静态全局对象
     */
    this.$window = $(window);
    this.$document = $(document);
    this.$html = $('turnPage');
    this.$body = $('body');
    this.$header = $('header');
    this.$main = $('main');
    this.$footer = $('footer');
    /**
     * 常用类型检测
     */
    this.isDef = function (obj) {
        return (typeof(obj) != 'undefined');
    };
    this.isStr = function (obj) {
        return (typeof(obj) == 'string');
    };
    this.isNum = function (obj) {
        return (typeof(obj) == 'number');
    };
    this.isFunc = function (obj) {
        return (typeof(obj) == 'function');
    };
    this.isArr = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    this.isObj = function (obj) {
        return (typeof(obj) == 'object') && !isArr(obj);
    };
    /**
     * 原子对象
     */
    this.atom = function (obj) {
        return obj || {};
    };
    /**
     * 执行代理
     */
    this.proxy = function (exec, ctx) {
        return function () {
            exec.aplly(ctx || null, arguments);
        };
    };
    /**
     * 自适应的调试输出
     */
    this.cout = function (obj) {
        console ? console.info(obj) : alert(obj);
    };
    /**
     * 获取UNIX时间戳（毫秒）
     */
    this.time = function () {
        return new Date().getTime();
    };
    /**
     * 获取一个(m,n)之间的随机数
     */
    this.random = function (min, max, format) {
        var min = min || 0,
            max = max || 1,
            format = format || 'raw';
        return format == 'raw' ? (max - min) * Math.random() + min : Math[format]((max - min) * Math.random() + min);
    };
    /**
     * 深拷贝
     * @param obj
     */
    this.clone = function (obj) {
        return $.extend(true, {}, obj);
    };
    /**
     * 页面配置功能
     */
    this.$CONF = {};
    /**
     * Config读写
     */
    this.Config = function () {
        if (isStr(arguments[0])) return arguments.length > 1 ? ($CONF[arguments[0]] = arguments[1]) : $CONF[arguments[0]];
        if (isObj(arguments[0]) && arguments.length == 1) {
            for (var o in arguments[0]) {
                $CONF[o] = arguments[0][o];
            }
        }
    };
    /**
     * 页面缓存功能
     */
    this.$CACHE = {};
    /**
     * Cache读写
     */
    this.Cache = function () {
        if (isStr(arguments[0])) return arguments.length > 1 ? ($CACHE[arguments[0]] = arguments[1]) : $CACHE[arguments[0]];
        if (isObj(arguments[0]) && arguments.length == 1) {
            for (var o in arguments[0]) {
                $CACHE[o] = arguments[0][o];
            }
        }
    };
    /**
     * 删除指定Cache键值
     * @param key
     */
    this.removeCache = function (key) {
        delete $CACHE[key];
    };
    /**
     * 将指定Cache键值置为空
     * @param key
     */
    this.clearCache = function (key) {
        arguments.length ? ($CACHE[key] = null) : ($CACHE = {});
    };
    /**
     * 判断是否存在指定的键值
     * @param key
     * @returns {boolean}
     */
    this.existCache = function (key) {
        return key in $CACHE;
    };
    /**
     * cookie操作
     * @param key
     * @param value
     * @param options
     * @returns {*}
     */
    this.Cookie = function (key, value, expires) {
        var arr, expires = expires || 0, now = new Date();
        if (arguments.length > 1) {
            now.setTime(now.getTime() + expires * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + now.toUTCString();
        }
        return (arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"))) ? decodeURIComponent(arr[2]) : null;
    };
    /**
     * 删除cookie
     * @param key
     */
    this.delCookie = function (key) {
        var now = new Date();
        now.setTime(now.getTime() - 1);
        if (Cookie(key) != null) document.cookie = key + "=;expires=" + now.toUTCString();
    };
    /**
     * 判断是否存在指定cookie
     * @param key
     * @returns {boolean}
     */
    this.existCookie = function (key) {
        return isStr(Cookie(key)) && (Cookie(key) != '');
    };
    /**
     * 操作功能容器
     */
    this.Cache('ACTION', {__hash_actions__: {}});
    this.Action = function () {
        if (arguments.length == 1) {
            if (isStr(arguments[0])) return Cache('ACTION')[arguments[0]];
            if (isObj(arguments[0])) {
                for (var o in arguments[0]) {
                    Cache('ACTION')[o] = arguments[0][o];
                }
            }
        }
        if (arguments.length > 1) Cache('ACTION')[arguments[0]] = arguments[1];
        if (arguments[2]) Cache('ACTION').__hash_actions__[arguments[0]] = arguments[1];
    };
    /**
     * AjaxTemplate容器
     */
    this.Cache('AJAXTEMPLATE', {});
    this.AjaxTemplate = function () {
        if (isStr(arguments[0])) return arguments.length > 1 ? (Cache('AJAXTEMPLATE')[arguments[0]] = arguments[1]) : Cache('AJAXTEMPLATE')[arguments[0]];
        if (isObj(arguments[0]) && arguments.length == 1) {
            for (var o in arguments[0]) {
                Cache('AJAXTEMPLATE')[o] = arguments[0][o];
            }
        }
    };
    /**
     * 类容器
     */
    this.Cache('CLASSES', {});
    this.Cache('OBJECTS', {__get__: {}});
    /**
     * 为UIComponent对象特别设置的通过id访问对象的方法
     * @param id 指定元素的ID
     * @returns {Object} 返回这个元素对应的实际对象实例
     */
    this.$$ = function (id) {
        return Cache('OBJECTS').__get__[$('#' + id).attr('instance-id')];
    };
    /**
     * 通过instance-id访问对象的方法
     * @param instanceId 指定元素的instance-id
     * @returns {Object} 返回这个元素对应的实际对象实例
     */
    this.$$$ = function (instanceId) {
        return Cache('OBJECTS').__get__[instanceId];
    };
    /**
     * 类和继承的实现
     * @param name 指定的类名称，可以直接new这个类名称，以创建实例
     * @param definition 类的定义
     * @returns {Function} 返回通用构造函数，包含这个类定义时的闭包环境，不建议使用！
     * @constructor
     */
    this.Class = function (name, definition, parent) {
        Cache('CLASSES')[name] = {__definition__: definition};
        var _CLASS = $GLOBAL[name] = function () {
            var exclusiveness = arguments[0] != 'EXTENDS' && this.__class_name__ == name;
            if (exclusiveness) {
                if (!Cache('OBJECTS')[name]) Cache('OBJECTS')[name] = [];
                this.__instance_id__ = name + '-' + Cache('OBJECTS')[name].length;
                Cache('OBJECTS')[name].push(this);
                Cache('OBJECTS').__get__[this.__instance_id__] = this;
            }
            parent && $GLOBAL[parent].apply(this, Cache('CLASSES')[name].__definition__[parent]);
            for (var m in definition) {
                if (m != name && m != parent && !isFunc(definition[m])) this[m] = definition[m];
            }
            isFunc(definition[name]) && definition[name].apply(this, arguments[0] == 'EXTENDS' ? Cache('CLASSES')[arguments[1]].__definition__[name] : arguments);
            if (exclusiveness) {
                var _this = this;
                (function (c) {
                    Cache('CLASSES')[c].__definition__.afterInitialize && Cache('CLASSES')[c].__definition__.afterInitialize.call(_this);
                    if (Cache('CLASSES')[c].__parent__) arguments.callee(Cache('CLASSES')[c].__parent__);
                })(this.__class_name__);
            }
        };
        if (parent) {
            if (!(Cache('CLASSES')[parent].__children__)) Cache('CLASSES')[parent].__children__ = [];
            Cache('CLASSES')[parent].__children__.push(name);
            Cache('CLASSES')[name].__parent__ = parent;
            _CLASS.prototype = new $GLOBAL[parent]('EXTENDS', name);
        }
        _CLASS.prototype.constructor = _CLASS;
        for (var f in definition) {
            if (f != name && f != 'afterInitialize' && isFunc(definition[f]) && !isFunc(_CLASS.prototype[f])) _CLASS.prototype[f] = definition[f];
        }
        _CLASS.prototype.__class_name__ = name;
        return _CLASS;
    };
    /*******************************************************************************************************************
     *
     * jQuery扩展代码区域
     *
     ******************************************************************************************************************/
    $.extend({
        /**
         * 判断一个元素是否存在于一个数组中。
         * 若存在，第一个值是元素在数组中的位置，否则返回-1
         */
        inArray: function (value, array) {
            if ($.isArray(array)) {
                for (var i = 0, l = array.length; i < l; i++) {
                    if (value == array[i]) return i;
                }
            }
            return -1;
        }
        /**
         * TODO:
         * 在这里扩展jQuery全局方法
         */
    });
    $.fn.extend({
        /**
         * 获取元素本身html代码的方法
         */
        selfHtml: function () {
            return $('<div></div>').append($(this).clone(false)).html();
        }
        /**
         * TODO:
         * 在这里扩展jQuery对象方法
         */
    });
    /*******************************************************************************************************************
     *
     * TODO:
     * 在这里添加全局方法/容器
     * 注意：不要在这里写与业务有关的功能！
     *
     ******************************************************************************************************************/
    /**
     * 触发无关点击事件控件容器
     */
    this.Cache('RELEVANT_CLICK_COMPONENT', []);
    /**
     * 注册无关点击事件对象
     */
    this.regRelevantClick = function ($intercepter) {
        $intercepter.attr('relevant-click-intercepter', Cache('RELEVANT_CLICK_COMPONENT').length);
        Cache('RELEVANT_CLICK_COMPONENT').push($intercepter);
    };
    /**
     * GET方法传递参数的容器
     */
    this.Cache('URL_ARGUMENTS', {});
    /**
     * 获取url中以GET方式传递的参数
     */
    this.GET = function () {
        if (arguments.length) {
            if (arguments[0] in Cache('URL_ARGUMENTS')) {
                return Cache('URL_ARGUMENTS')[arguments[0]];
            }
            else {
                //throw '"' + arguments[0] + '"参数不存在！';
                return false;
            }
        } else {
            return Cache('URL_ARGUMENTS');
        }
    };
    /**
     * 上传控件容器，上传控件初始化方法
     */
    /*this.Cache('FILE_UPLOADER', {});
     this.prepareFileUploader = function ($component, url) {
     var $fileName = $component.find('.file-name');
     $component.find('.file-url').val(url);
     $fileName.attr('text', $fileName.text()).removeClass('hint').removeClass('error').attr('title', url).text(url);
     if ($component.attr('image-preview')) {
     var $oldImage = $component.find('.img-preview'), $img = $('<div class="img-preview"><img src="' + url + '" alt="' + url + '" /></div>');
     $oldImage.length ? $oldImage.replaceWith($img) : $component.append($img);
     }
     };*/
    /**
     * Account数据容器
     */
    Cache('ACCOUNT', {
        ID: null,
        NAME: null,
        FACE_URL: null
    });
    /**
     * 日期相关（似乎不是必须的，可以使用系统自带的）
     */
    this.toDoubleDigits = function (number) {
        return number < 10 ? '0' + number : number;
    };
    this.formatDate = function (timestamp) {
        return timestamp.getFullYear() + "年" + toDoubleDigits(timestamp.getMonth() + 1) + "月" + toDoubleDigits(timestamp.getDate()) + "日";
    };
    this.formatDateTime = function (timestamp) {
        return formatDate(timestamp) + " " + toDoubleDigits(timestamp.getHours()) + ":" + toDoubleDigits(timestamp.getMinutes()) + ":" + toDoubleDigits(timestamp.getSeconds());
    };
    this.formatDateServer = function (timestamp) {
        return timestamp.getFullYear() + "-" + toDoubleDigits(timestamp.getMonth() + 1) + "-" + toDoubleDigits(timestamp.getDate());
    };
    this.formatDateTimeServer = function (timestamp) {
        return formatDateServer(timestamp) + " " + toDoubleDigits(timestamp.getHours()) + ":" + toDoubleDigits(timestamp.getMinutes()) + ":" + toDoubleDigits(timestamp.getSeconds());
    };
})(this, jQuery);

/***********************************************************************************************************************
 *
 * 类定义代码区域
 * TODO:
 * 在这里进行类定义
 *
 **********************************************************************************************************************/

/*
* 重新封装ajax请求
* */
Class('Request', {
    Request: function (options) {
        options.type = options.type || 'POST';
        options.dataType = options.dataType || 'json';
        if (Config('ajax_debug_mode')) {
            if (AjaxTemplate(options.url)) {
                options.success.call(window, AjaxTemplate(options.url)(options.data || {}));
            } else {
                throw 'error:未定义AJAX接口返回数据模板！[ajax-template-name:"' + options.url + '"]';
            }
        } else {
            $.ajax(options);
        }
    }
});


/**
 * UIComponent类
 * 所有页面原件的基类
 */
Class('UIComponent', {
    name: '',
    __self__: null,
    appendTo: function (parent) {
        parent.append(this._self);
    },
    insertAfter: function (previous) {
        this.__self__.insertAfter(previous);
    },
    self: function () {
        return this.__self__;
    },
    UIComponent: function () {
    },
    afterInitialize: function () {
        this.name != this.__instance_id__ && this.__self__.attr('id', this.name);
        this.__self__.attr('instance-id', this.__instance_id__);
    }
});

/***********************************************************************************************************************
 *
 * 全局事件支持
 * TODO:
 * 在这里添加页面功能代码
 *
 **********************************************************************************************************************/
(function ($GLOBAL) {
    /**
     * 页面大小变化时的处理
     */
    document.documentElement.style.fontSize = innerWidth/7.5 + 'px';
    $window.resize(function () {
        document.documentElement.style.fontSize = innerWidth/7.5 + 'px';
    });
    /**
     * 支持a、button元素的点击事件
     */
    $document.click(function (event) {
        var $target = $(event.target), $parent = $target.closest('a'), act = null;
        if ($target.attr('action')) act = $target.attr('action');
        else if ($target.attr('href') && $target.attr('href').charAt(0) == '#') act = $target.attr('href').slice(1);
        else if ($parent.length && $parent.attr('href') && $parent.attr('href').charAt(0) == '#') act = $parent.attr('href').slice(1);
        act && Cache('ACTION')[act] && Cache('ACTION')[act].call(event.target);
    });
    /**
     * 支持页面加载后根据地址#号后面内容执行对应操作
     */
    $document.ready(function () {
        var act = location.hash.slice(1);
        Cache('ACTION').__hash_actions__[act] && Cache('ACTION').__hash_actions__[act].call($document);
    });
    /**
     * 支持页面GET方式传递的参数
     */
    $document.ready(function () {
        if (location.search.length) {
            var args = location.search.slice(1).split('&');
            for (var i = 0; i < args.length; i++) {
                var arg = args[i].split('=');
                Cache('URL_ARGUMENTS')[arg[0]] = arg[1];
            }
        }
    });
    /**
     * 支持页面无关点击事件的功能
     */
    $document.click(function (event) {
        var $intercepter = $(event.target).closest('[relevant-click-intercepter]');
        for (var i = 0; i < Cache('RELEVANT_CLICK_COMPONENT').length; i++) {
            Cache('RELEVANT_CLICK_COMPONENT')[i].attr('relevant-click-intercepter') != $intercepter.attr('relevant-click-intercepter') && Cache('RELEVANT_CLICK_COMPONENT')[i].trigger('irrelevant-click');
        }
        $intercepter.length && $intercepter.trigger('relevant-click');
    });
})(this);


/***********************************************************************************************************************
 *
 * 通用页面代码区域
 * TODO:
 * 在这里写通用页面代码
 * 注意：这些代码会在最后运行，而不是最先
 *
 **********************************************************************************************************************/
$(function(){



});


/***********************************************************************************************************************
 *
 * 封装函数区域
 * TODO:
 * 在这里写通用的函数封装
 *
 **********************************************************************************************************************/

function findInArr(arr, iNum) {
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == iNum) {
                return true;
            }
        }
    }
    return false;
}

function findInArrJson(arr, iNum) {
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].permissionId == iNum) {
                return true;
            }
        }
    }
    return false;
}

/*获取链接后拼接的数据*/
function getArg(arg){
    var userInfoArr=[];//信息拆分后的数组
    var userInfoObj={};//存储成对象
    var userInfo = window.location.href.split('?');
    if(userInfo.length > 1) userInfoArr = userInfo[1].split('&');
    for (var i = 0; i < userInfoArr.length; i++) {
        userInfoObj[userInfoArr[i].split('=')[0]] = userInfoArr[i].split('=')[1];
    }
    if(arg in userInfoObj) return userInfoObj[arg];
}


/*求和函数*/
function sum(arr){
    var result=0;
    for(var i=0;i<arr.length;i++){
        result = result.add(arr[i]);
    }
    return result;
}

/* 拿到文件名的后缀*/
function getExt(fileName){
    return /\.[^\.]+/.exec(fileName);
}

/*把毫秒转换为 xx小时xx分钟xx秒*/
function MillisecondToDate(msd) {
    var time = parseFloat(msd) /1000;
    if (null!= time &&""!= time&&time>0) {
        if(time<=60){
            time =  parseInt(time) + "秒";
        }else if (time >60&& time <60*60) {
            time = parseInt(time /60.0) +"分钟"+ parseInt((parseFloat(time /60.0) -
                    parseInt(time /60.0)) *60) +"秒";
        }else {
            time = parseInt(time /3600.0) +"小时"+ parseInt((parseFloat(time /3600.0) -
                    parseInt(time /3600.0)) *60) +"分钟"+
                parseInt((parseFloat((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60) -
                    parseInt((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60)) *60) +"秒";
        }
    }else{
        time = "";
    }
    return time;
}

/*产生随机的颜色 */
function randomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}
/*随机数函数*/
function randomFn(min,max,except){
    var random = parseInt( Math.random() * ( max - min + 1 ) + min );
    return random == except ? randomFn(min,max,except) : random;
}


/*
* cookie 相关的函数
* */

/*setCookie*/
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    if(expires!=null)
    {
        var LargeExpDate = new Date ();
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
    }
    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
}
/*getCookie*/
function getCookie(Name) {
    var search = Name + "="
    if(document.cookie.length > 0)
    {
        offset = document.cookie.indexOf(search);
        if(offset != -1)
        {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if(end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(offset, end))
        }
        else return ""
    }
}
/*删除cookie*/
function deleteCookie(name) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    setCookie(name, "", expdate);
}

//====================================
// 扩展数字基础算法,解决精度异常的问题
//====================================
//加法
Number.prototype.add = function(arg){
    var r1,r2,m;
    try{r1=this.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (this*m+arg*m)/m
};
//减法
Number.prototype.sub = function (arg){
    return this.add(-arg);
};

//乘法
Number.prototype.mul = function (arg)
{
    var m=0,s1=this.toString(),s2=arg.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
};

//除法
Number.prototype.div = function (arg){
    var t1=0,t2=0,r1,r2;
    try{t1=this.toString().split(".")[1].length}catch(e){}
    try{t2=arg.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(this.toString().replace(".",""));
        r2=Number(arg.toString().replace(".",""));
        return (r1/r2)*pow(10,t2-t1);
    }
};

//清除form中数据
function clearForm(form) {
    // iterate over all of the inputs for the form
    // element that was passed in
    $(':input', form).each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        // it's ok to reset the value attr of text inputs,
        // password inputs, and textareas
        if (type == 'text' || type == 'password' || tag == 'textarea')
            this.value = "";
        // checkboxes and radios need to have their checked state cleared
        // but should *not* have their 'value' changed
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        // select elements need to have their 'selectedIndex' property set to -1
        // (this works for both single and multiple select elements)
        else if (tag == 'select')
        //this.find("option:selected").attr("selected","");
            this.selectedIndex =-1;
    });
}
