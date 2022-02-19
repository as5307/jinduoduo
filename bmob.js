function Bmob(appId, restKey) {
    this.appId = appId;
    this.restKey = restKey;

    function init(appId, restKey) {
        var Bmob = require('/sdcard/脚本/金多多挂机/jinduoduo-main/dist/Bmob-1.6.1.min.js');
        Bmob.initialize(appId, restKey);
    }

    function findAll(tableName) {
        const query = Bmob.Query(tableName);
        query.find().then(res => {
            console.log(res)

            return res;
        });
    }
    init(this.appId ,this.restKey);
}
module.exports = Bmob;