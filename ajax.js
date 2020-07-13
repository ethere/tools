
//  ajax:  async javascript and xml(json)  
//  同源策略： 协议 域名端口号 均相同的地址 才可以进行数据间的交互
//  简单请求的ajax   请求方式:  get / post / head     请求头： application/x-www-form-urlencoded
/**
 * 
 * @param {*} method 请求方式
 * @param {*} url    请求地址
 * @param {*} data   请求数据
 * @param {*} cb     成功的回调函数
 * @param {*} isAsync 是否异步
 */
function ajax(method, url, data, cb, isAsync) {
    // get   url + '?' + data
    // post 
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // xhr.readyState    1 - 4  监听是否有响应
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            if (xhr.status == 200) {
                cb(JSON.parse(xhr.responseText))
            }
        }
    }

    if (method == 'GET') {
        xhr.open(method, url + '?' + data, isAsync);
        xhr.send();
    } else if (method == 'POST') {
        xhr.open(method, url, isAsync);
        // key=value&key1=valu1
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }


}