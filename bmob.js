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
module.exports = Bmob;