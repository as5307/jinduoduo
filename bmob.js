// text();
function Bmob(url, appId, restKey) {
    this.baseUrl = url;
    this.appId = appId;
    this.restKey = restKey;

    Bmob.prototype.makeRequest = function (method, url, json, callback) {
        url = this.baseUrl + url;
        var options = {};
        options.contentType = "application/json";
        options.method = method;
        if (json) {
            options.body = JSON.stringify(json);
        }
        options.headers = {
            "X-Bmob-Application-Id": this.appId,
            "X-Bmob-REST-API-Key": this.restKey,
            "Content-Type": "application/json"
        }
        return http.request(url, options, callback);
    }

    Bmob.prototype.timestamp = function () {
        return this.makeRequest("GET", "/timestamp", null).body.json();
    }
    Bmob.prototype.createObject = function (className, data) {
        return this.makeRequest("POST", "/classes/" + className, data).body.json();
    }
    Bmob.prototype.findAll = function (className) {
        return this.makeRequest("GET", "/classes/" + className+"?order=-createdAt").body.json();
    }
    Bmob.prototype.findIdObject = function (className, id) {
        return this.makeRequest("GET", "/classes/" + className + "/" + id).body.json();
    }
    Bmob.prototype.updateObject = function (className, data) {
        return this.makeRequest("PUT", "/classes/" + className + "/" + data.objectId, data).body.json();
    }
    Bmob.prototype.deleteObject = function (className, data) {
        var id = typeof (data) == "string" ? data : data.objectId;
        return this.makeRequest("DELETE", "/classes/" + className + "/" + id).body.json();
    }
}
//单独测试
// function text(params) {
//     var bmob = new Bmob("https://api2.bmob.cn/1","a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");
//     var result=bmob.getObjects("GameApp").results;
//     console.log("测试"+result);

//     var e=result[0].appname;

//     console.log("1"+e);
// }

module.exports = Bmob;