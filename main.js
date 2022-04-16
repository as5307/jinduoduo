
importClass(java.io.FileOutputStream);
importClass(java.net.URL);
var downloadDialog = null;
var testDialog = null;
var downloadId = -1;
var isDown = false;
var isUnZip = false;
var initjs;
var path;
var game;
progress = 0;
running = false;
//初始化下载参数
running = false
byteSum = 0; //总共读取的文件大小
byteRead = 0; //每次读取的byte数
buffer = util.java.array('byte', 1024); //byte[]
var url = "https://codeload.github.com/as5307/jinduoduo/zip/refs/heads/main";
var filepath = "/sdcard/脚本/金多多挂机.zip";
main();
function main() {
    game = storages.create("game");
    startDownload();
    threads.start(function () {
        downGithubZip();
    });
}
function startDownload() {
    downloadDialog = dialogs.build({
        title: "下载资源中。。。",
        progress: {
            max: 100
        },
        canceledOnTouchOutside: false
    });

    testDialog = dialogs.build({
        title: "检查资源中...",
        progress: {
            max: -1,
            horizontal:true
        },
        canceledOnTouchOutside: false
    });

    downloadId = setInterval(() => {
        if (progress >= 1) {
            downloadDialog.dismiss();
            engines.execScript("init.js", files.read("/sdcard/脚本/金多多挂机/jinduoduo-main/init.js"));
            exit();
        } else {
            downloadDialog.setProgress((progress * 100).toFixed(1));
        }
    }, 20);
}
/**通过get请求从GitHub下载zip文件*/
function downGithubZip() {
    try {
        testDialog.show();
        var myUrl = new URL(url);
        var conn = myUrl.openConnection();
        conn.connect();
        inStream = conn.getInputStream(); 
        connLength = conn.getContentLength(); 
        fs = new FileOutputStream(filepath);
        console.log("connLength"+connLength);
        if (game.get("bytesLength", 0) != connLength) {
            testDialog.dismiss();
            downloadDialog.show();
            while ((byteRead = inStream.read(buffer)) != -1) {
                byteSum += byteRead;
                fs.write(buffer, 0, byteRead);
                progress = byteSum/connLength;
                console.log(progress);
            }
            inStream.close();
            fs.close();
            game.put("bytesLength", byteSum);
            unzip(filepath);
            toast("更新完成，加载页面中。。。");
        } else {
            testDialog.dismiss();
            toast("已是最新，加载页面中。。。");
            progress =1;
        }
    } catch (err) {
        console.error(err);
        exit();
    }
}

/**在同一目录解压zip文件*/
function unzip(path) {
    var zipFolderPath = path.replace(".zip", "") + "/";
    com.stardust.io.Zip.unzip(new java.io.File(path), new java.io.File(zipFolderPath));
    files.removeDir(files.cwd() + "/" + "金多多挂机.zip");
}

