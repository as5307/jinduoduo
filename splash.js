"ui";

importClass(java.io.FileOutputStream);
importClass(java.io.FileInputStream);
importClass(java.net.URL);
importClass(java.util.zip.ZipFile);
importClass(java.util.zip.ZipEntry);
importClass(java.util.zip.ZipInputStream);
importClass(java.io.File);
importClass(android.net.Uri);

downloadDialog = null;
testDialog = null;
downloadId = -1;
downProgress = 0;
unzipProgress = 0;

//初始化下载参数
byteSum = 0; //总共读取的文件大小
byteRead = 0; //每次读取的byte数
unzipLenght = 0; //每次读取的byte数
buffer = util.java.array('byte', 1024); //byte[]
url = "https://codeload.github.com/as5307/jinduoduo/zip/refs/heads/main";
zipFilePath = "/sdcard/脚本/jinduoduo-main.zip";
filePath = "/sdcard/脚本";

ui.layout(
    <vertical>
        <img w="*" h="0" layout_weight="1" src="https://api.dujin.org/bing/m.php" scaleType="fitXY" />
        <frame gravity="center" height="180">
            <horizontal gravity="center">
                <img src="https://gitee.com/chengxinruan/jinduoduo/raw/master/res/logo.png" w="60" h="60" scaleType="fitXY" />
                <text text="欢迎使用金多多" w="auto" h="auto" textSize="24" textColor="#212121"
                    textStyle="bold" layout_gravity="center" margin="16" />
            </horizontal>
        </frame>
    </vertical >
)

splash();
function splash() {
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
        title: "检查资源中",
        progress: {
            max: -1,
            horizontal: true
        },
        canceledOnTouchOutside: false
    });
    downloadId = setInterval(() => {
        if (unzipProgress >= 1) {
            clearInterval(downloadId);
            downloadDialog.dismiss();
            downloadDialog = null;
            toast("解压完成");
            engines.execScriptFile("/sdcard/脚本/jinduoduo-main/main.js");
        } else {
            if (downProgress >= 1) {
                downloadDialog.setProgress((unzipProgress * 100).toFixed(1));
            } else {
                downloadDialog.setProgress((downProgress * 100).toFixed(1));
            }
        }
    }, 20);
}

/*通过get请求从GitHub下载zip文件*/
function downGithubZip() {
    try {
        testDialog.show()
        myUrl = new URL(url);
        conn = myUrl.openConnection();
        conn.connect();
        inStream = conn.getInputStream();
        fs = new FileOutputStream(zipFilePath);
        testDialog.dismiss();
        downloadDialog.show();
        while ((byteRead = inStream.read(buffer)) != -1) {
            byteSum += byteRead;
            fs.write(buffer, 0, byteRead);
            downProgress = byteSum / 446464
        }
        inStream.close();
        fs.close();
        downloadDialog.setTitle("解压中");
        unZip(new File(zipFilePath), filePath);
    } catch (err) {
        console.error(err);
    }
}
/**
 * 将sourceFile解压到targetDir
 * @param sourceFile
 * @param targetDir
 * @throws RuntimeException
 */
function unZip(sourceFile, targetDir) {
    if (!sourceFile.exists()) {
        throw new FileNotFound
        Exception("cannot find the file = " + sourceFile.getPath());
    }
    try {
        zipFile = new ZipFile(sourceFile);
        // console.log("length"+sourceFile.length());
        entries = zipFile.entries();
        byteSum = 0;
        while (entries.hasMoreElements()) {
            entry = entries.nextElement();
            if (entry.isDirectory()) {
                dirPath = targetDir + "/" + entry.getName();
                // console.log("创建文件夹" + entry.getName())
                createDirIfNotExist1(dirPath);
            } else {
                // console.log("创建文件" + entry.getName())
                targetFile = new File(targetDir + "/" + entry.getName());
                createFileIfNotExist(targetFile);
                is = null;
                fos = null;
                try {
                    is = zipFile.getInputStream(entry);
                    fos = new FileOutputStream(targetFile);
                    while ((byteRead = is.read(buffer)) != -1) {
                        byteSum += byteRead;
                        fos.write(buffer, 0, byteRead);
                        unzipProgress = byteSum / 446464;
                    }
                } finally {
                    try {
                        fos.close();
                    } catch (error) {
                        log.warn("close FileOutputStream exception", e);
                    }
                    try {
                        is.close();
                    } catch (error) {
                        log.warn("close InputStream exception", e);
                    }
                }
            }
        }
        // log.info("解压完成");
    } finally {
        if (zipFile 
             != null) {
            try {
                zipFile.close();
            } catch (error) {
                log.warn("close zipFile exception", e);
            }
        }
    }
}

function createDirIfNotExist1(path) {
    file = new File(path);
    createDirIfNotExist2(file);
}

function createDirIfNotExist2(file) {
    if (!file.exists()) {
        file.mkdirs();
    }
}
function createFileIfNotExist(file) {
    createParentDirIfNotExist(file);
    file.createNewFile();
}

function createParentDirIfNotExist(file) {
    createDirIfNotExist2(file.getParentFile());
}
