
var downloadDialog = null;
var downloadId = -1;
var isDown = false;
var isUnZip = false;
var initjs;
var path;
var game;

main();
function main() {
    initStorages();
    threads.start(function () {
        downGithubZip("https://codeload.github.com/as5307/jinduoduo/zip/refs/heads/main")
    });
    startDownload();
}
function startDownload() {
    downloadDialog = dialogs.build({
        title:"更新资源中...",
        progress: {
            max: -1,
            horizontal:true
        },
        canceledOnTouchOutside: false
    }).show();
    downloadId = setInterval(() => {
        var p = downloadDialog.getProgress();
        if (isDown) {
            downloadDialog.dismiss();
            engines.execScript("init.js", files.read("/sdcard/脚本/金多多挂机/jinduoduo-main/init.js"));
            exit();
        } else {
            downloadDialog.setProgress(p + random(1, 5));
        }
    }, 200);
}
/**通过get请求从GitHub下载zip文件*/
function downGithubZip(githubUrl) {
    try {
        var r = http.get(githubUrl);
        console.info("请求状态码Code", r.statusCode);
        var zipFile = r.body.bytes();
        if (r.statusCode == 200) {
            if (game.get("bytesLength",0)!= zipFile.length) {
                saveMobilePhone(zipFile);
                toast("更新完成");
            } else {
                toast("已是最新");
                isDown = true;
            }
        } else {
            console.error("下载github代码失败,,请检查网络");
            exit()
        }
    } catch (err) {
        console.error(err);
        exit();
    }
}
/**将下载好的zip文件保存在手机*/
function saveMobilePhone(zipFile) {
    path = files.join("/sdcard/脚本", "金多多挂机.zip");
    files.createWithDirs(path);
    console.info("创建好的文件路径path:", path);
    files.writeBytes(path, zipFile);
    game.put("bytesLength",zipFile.length);
    unzip(path);
}
/**在同一目录解压zip文件*/
function unzip(path) {
    var zipFolderPath = path.replace(".zip", "") + "/";
    com.stardust.io.Zip.unzip(new java.io.File(path), new java.io.File(zipFolderPath));
    files.removeDir(files.cwd() + "/" + "金多多挂机.zip");
    isDown=true;
}

//初始化本地存储
function initStorages() {
    game = storages.create("game");
}
