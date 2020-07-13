if(!this.myPlugin){
    this.myPlugin = {}
}
//圣杯模式
this.myPlugin.inherit = function(son, father){
    son.prototype = Object.create(father.prototype);
    son.prototype.constructor = son;
    //son.prototype.uber = father.prototype;
    son.prototype.uber = father;
}

//typeof 包括区分数组 对象 包装类
this.myPlugin.type=function(data) {
    var ret = typeof (data);
    var template = {
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Number]": "number - object",
        "[object Boolean]": "boolean - object",
        "[object String]": "string - object",
    }
    if (data === null) {
        return 'null';
    }
    if (ret == "object") {
        var str = Object.prototype.toString.call(data);
        return template[str];
    } else {
        return ret;
    }

}

//数组去重
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = 'abc'; // 附一个不为假的值
            arr.push(this[i]);
        }
    }
    return arr;
}

//封装函数insertAfter();功能类似insertBefore();
Element.prototype.insertAfter = function (targetNode, afterNode) {

    if (afterNode.nextElementSibling == null) {
        this.appendChild(targetNode);
    } else {
        this.insertBefore(targetNode, afterNode.nextElementSibling);
    }
}

// 查看滚动条的滚动距离，解决兼容性问题
this.myPlugin.getScrollOffset = function () {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

//返回浏览器视口尺寸,解决兼容性问题
this.myPlugin.getViewportOffset = function () {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}

//封装兼容性方法getStyle(elem,prop);
this.myPlugin.getStyle = function(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}

//封装兼容性的addEvent(elem,type,handle);方法
this.myPlugin.addEvent = function(elem, type, handle) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on + type', function () {
            handle.call(elem);
        })
    } else {
        elem['on' + type] = handle;
    }
}

//封装取消冒泡的函数stopBubble(event)
this.myPlugin.stopBubble = function(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

//封装阻止默认事件的函数cancelHandler(event);
this.myPlugin.cancelHandler = function (e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

//拖拽小方块的函数
this.myPlugin.drag = function (elem) {
    var disX,
        disY;
    addEvent(elem, 'mousedown', function (e) {
        var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(elem, 'left'));
        disY = event.clientY - parseInt(getStyle(elem, 'top'));
        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        stopBubble(event);
        canceHandler(event);
    });

    function mouseMove(e) {
        var event = e || window.event;
        elem.style.left = event.clientX - disX + "px";
        elem.style.top = event.clientY - disY + "px";
    }

    function mouseUp(e) {
        var event = e || window.event;
        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp)
    }
}

//轮播图
this.myPlugin.slideshow = function (order, srcul, pointul, srcsize, srcnum) {
    var num;
    srcul.style.marginTop = 0;
    if (order > 0) {
        num = 0;
    } else {
        num = -(srcsize * (srcnum - 1));
    }
    var srcli = srcul.children,
        pointli = point.children,
        i;
    if (order > 0) {
        i = 0;
    } else {
        i = srcnum - 1;
    }
    setInterval(function () {
        srcul.style.marginTop = num + 'px';
        for (var j = 0; j < srcnum; j++) {
            pointli[j].style.color = "#fff";
        }
        if (order > 0) {
            num -= srcsize;
            if (parseInt(srcul.style.marginTop) == -(srcsize * (srcnum - 1))) {
                num = 0;
            }
            pointli[i].style.color = "red";
            i++;
            if (i == srcnum) {
                i = 0;
            }
        } else {
            num += srcsize;
            if (parseInt(srcul.style.marginTop) == 0) {
                num = -(srcsize * (srcnum - 1));
            }
            pointli[i].style.color = "red";
            i--;
            if (i == -1) {
                i = srcnum - 1;
            }
        }
    }, 2000);
}
//随机生成颜色
this.myPlugin.randomHexColor = function () {
    var hex = Math.floor(Math.random() * 1677216).toString(16);
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return '#' + hex;
}
//异步加载js
this.myPlugin.loadScript = function (url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () { //ie
            if (script.readyState == "complete" || script.readyState == "loaded") {
                callback()
            }
        }
    } else {
        script.onload = function () {
            callback()
        }
    }
    script.src = url;
    document.head.appendChild(script);
}
//bind模拟实现
Function.prototype.newBind = function (target) {
    var argus = [].slice.call(arguments, 1);
    var self = this;
    var temp = function () {}

    function f() {
        var _argus = [].slice.call(arguments, 0);
        return self.apply(this instanceof temp ? this : (target || window), argus.concat(_argus));
    }
    temp.prototype = self.prototype;
    f.prototype = new temp();
    return f;
}
//优化页面请求性能-防抖
this.myPlugin.debounce = function (handler, delay) {
    var timer = null;
    return function () {
        clearTimeout(timer);
        var _args = arguments;
        var self = this;
        timer = setTimeout(function () {
            handler.apply(self, _args);
        }, delay);
    }
}
//优化网络请求性能-节流
this.myPlugin.throttle = function (handler, wait) {
    var lastTime = 0;
    return function () {
        var nowTime = new Date().getTime();
        if (nowTime - lastTime > wait) {
            handler.apply(this, [arguments]);
            lastTime = nowTime;
        }
    }
}
//多物体多值运动+回调
this.myPlugin.starMove = function (dom, json, callback) {
    clearInterval(dom.timer);
    var iSpeed;
    var iCur;
    dom.timer = setInterval(function () {
        var flag = true;
        for (var arr in json) {
            if (arr == 'opacity') {
                iCur = parseFloat(getStyle(dom, arr)) * 100;
            } else {
                iCur = parseInt(getStyle(dom, arr));
            }
            iSpeed = (json[arr] - iCur) / 7;
            iSpeed = iSpeed < 0 ? Math.floor(iSpeed) : Math.ceil(iSpeed);
            if (arr == 'opacity') {
                dom.style[arr] = (iCur + iSpeed) / 100;
            } else {
                dom.style[arr] = iCur + iSpeed + 'px';
            }
            if (iCur != json[arr]) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(dom.timer);
            typeof callback == 'function' && callback();
        }
    }, 30)
}
//判断密码强度
//密码长度必须是6-12位
//出现小写字母、大写字母、数字、特殊字符(!@#_,.) -> 强
//出现小写字母、大写字母、数字-> 中
//出现小写字母、大写字母 -> 轻
//其它 -> 不满足要求
this.myPlugin.judgePwd = function (pwd) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#_,.]).{6,12}$/.test(pwd)) {
        return "强"
    }
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/.test(pwd)) {
        return "中"
    }
    if (/^(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(pwd)) {
        return "轻"
    }
    return "不满足要求"
}
/**
 * 产生一个在min 和 max 之间的数
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
this.myPlugin.getRandom = function (min,max){
    return Math.floor(Math.random()*(max - min) + min);
}

/**
 * obj2混合到obj1产生新的对象
 */
this.myPlugin.mixin = function (obj1, obj2) {
    return Object.assign({}, obj1, obj2);
}

/**
 * 克隆一个对象
 */
this.myPlugin.clone = function (obj, deep) {
    if (Array.isArray(obj)) {
        if (deep) {
            //深度克隆
            var newArr = [];
            for (var i = 0; i < obj.length; i++) {
                newArr.push(this.clone(obj[i], deep))
            }
            return newArr;
        } else {
            return obj.slice(); //复制数组
        }
    } else if (typeof obj === 'object') {
        var newObj = {};
        for (var prop in obj) {
            if (deep) {
                //深度克隆
                newObj[prop] = this.clone(obj[prop], deep)
            } else {
                newObj[prop] = obj[prop]
            }
        }
        return newObj;
    } else {
        //函数、原始类型
        return obj;
    }
}

/**
 * 科里化函数
 * 在函数式编程中，科里化最重要的作用是把多参函数变为单参函数
 */
this.myPlugin.curry = function(func){
    var that = this;
    var args = Array.prototype.slice.call(arguments,1);
    return function (){
        var curArgs = Array.from(arguments);
        var totalArgs = args.concat(curArgs);
        if(totalArgs.length >= func.length){
            //参数数量够了
            return func.apply(null,totalArgs)
        }else{
            //参数数量不够
            totalArgs.unshift(func);
            return that.curry.apply(that,totalArgs)
        }
    }
}

/**
 * 函数管道
 */
this.myPlugin.pipe = function(){
    var args = Array.from(arguments)
    return function(val){
        //方法一
        return args.reduce(function(result,func){
            return func(result);
        },val);
        //方法二
        // for(var i = 0; i < args.length; i++){
        //     var func = args[i];
        //     val = func(val);
        // }
        // return val;
    }
}