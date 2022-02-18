threads.start(main);

function main() {
    var runjs=downGithubZip("https://codeload.github.com/as5307/jinduoduo/zip/refs/heads/main");
    console.info("运行的脚本"+runjs);
    engines.execScript("运行脚本"+runjs); 
}

/**通过get请求从GitHub下载zip文件*/
function downGithubZip(githubUrl) {
    try {
        var r = http.get(githubUrl);
        console.info("请求状态码Code", r.statusCode);
        var zipFile = r.body.bytes();

        if (zipFile) {
            saveMobilePhone(zipFile);
            return files.read(/sdcard/脚本/金多多挂机/jinduoduo-main/jinduoduo.js)
        } else {
            console.error("下载github代码失败");
            exit()
        }
    } catch (err) {
        console.error(err);
        exit();
    }
}

/**将下载好的zip文件保存在手机*/
function saveMobilePhone(zipFile) {
    var path = files.join("/sdcard/脚本", "金多多挂机.zip");
    files.createWithDirs(path);
    console.info("创建好的文件路径path:", path);
    files.writeBytes(path, zipFile);
    unzip(path);
}

/**在同一目录解压zip文件*/
function unzip(path) {
    var zipFolderPath = path.replace(".zip", "") + "/";
    com.stardust.io.Zip.unzip(new java.io.File(path), new java.io.File(zipFolderPath));
    console.log("解压后的路径"+zipFolderPath);
    files.removeDir(files.cwd() + "/" + "金多多挂机.zip");
}
