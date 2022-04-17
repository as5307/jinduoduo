"ui";
importClass(android.widget.CheckBox);
importClass(java.io.FileOutputStream);
importClass(java.net.URL);
require("/sdcard/脚本/金多多挂机/jinduoduo-main/FloatButton/FloatButton.js");
Bmob = require("/sdcard/脚本/金多多挂机/jinduoduo-main/bmob.js");
Game = require("/sdcard/脚本/金多多挂机/jinduoduo-main/game.js");

var game;
var fb;
var autoDialog;
var rb;

var packageName2;
var appName;
var color

var runThread;
var inputTime;
var index;
var suspend;
wait = false;
isRun = false;

d_width = device.width;
d_height = device.height;

downloadDialog = null;
testDialog = null;
downloadId = -1;
progress = 0;
//初始化下载参数
byteSum = 0; //总共读取的文件大小
byteRead = 0; //每次读取的byte数
buffer = util.java.array('byte', 1024); //byte[]
url = "https://codeload.github.com/as5307/jinduoduo/zip/refs/heads/main";
filepath = "/sdcard/脚本/金多多挂机.zip";
var point;
var rect;
listView = [];
initStorages(); 

var serverList = [
    {
        title: "无障碍服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: auto.service != null
    },
    {
        title: "保持前台服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("reception_isShow")
    },
    {
        title: "显示控制台",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("console_isShow")
    }
];

var recordList = [
    {
        title: "悬浮窗",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("dialog_isShow")
    },
    {
        title: "音量下键关闭",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("down_isShow")
    }
];

var otherList = [
    {
        title: "主题色",
        icon: "@drawable/ic_android_black_48dp",
    },
    {
        title: "QQ交流群",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "检测更新",
        icon: "@drawable/ic_android_black_48dp"
    }
];

var downGameList = [];
var noDownGameList = [];
var gameList = [];
var runGameList = [];

var img;
var pattern;
ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="金多多挂机" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <vertical>
                    <frame layout_weight="1" bg="#FAF0E6" >
                        <list id="gameList" >
                            <card w="*" h="55" margin="10 5" cardCornerRadius="2dp" layout_gravity="center" id="gameCard" bg="{{this.color}}" >
                                <horizontal h="*" >
                                    <View bg="#4caf50" h="*" w="10" />
                                    <checkbox id="game1" clickable="{{this.isClickable}}" textSize="15" text="{{this.appName}}" layout_gravity="center" layout_weight="1" />
                                    <text text="运行" />
                                    <input inputType="number" id="inputTime" text="{{this.runTime}}" />
                                    <text text="分钟" />
                                </horizontal>
                            </card>
                        </list>
                        <linear w="*" h="*" bg="#FAF0E6" id="refresh" gravity="center" visibility="gone">
                            <vertical w="100" h="100" padding="10" >
                                <progressbar />
                            </vertical>
                        </linear>
                    </frame>
                    <horizontal>
                        <horizontal id="control2" w="*">
                            <spinner id="spl" entries="单个循环|顺序循环" layout_weight="1" />
                            <button id="startGame" text="开始运行" />
                            <button id="save" text="保存配置" />
                            {/* <button id="save" text="保存" /> */}
                        </horizontal>
                    </horizontal>
                </vertical>
                <frame>
                    <text text="项目配置" />
                </frame>
            </viewpager>
        </vertical >
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="150" scavarype="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />
            <text text="服务" margin="10" />
            <list id="server_menu">
                <horizontal w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" />
                    <Switch id="isShow" checked="{{this.isShow}}" text="{{this.title}}" layout_gravity="center" w="*" />
                </horizontal>
            </list>
            <View bg="#FFF5EE" h="10" />
            <text text="录制脚本" margin="10" />
            <list id="record_menu">
                <horizontal w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" />
                    <Switch id="isShow" checked="{{this.isShow}}" text="{{this.title}}" layout_gravity="center" w="*" />
                </horizontal>
            </list>

            <View bg="#FFF5EE" h="10" />
            <text text="其他" margin="10" />
            <list id="other_menu">
                <horizontal w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" layout_weight="1" />
                </horizontal>
            </list>
        </vertical>
    </drawer >
);
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
            horizontal: true
        },
        canceledOnTouchOutside: false
    });
    downloadId = setInterval(() => {
        if (progress >= 1) {
            downloadDialog.dismiss();
            initFloatDialog();
            initAutoDialog();
            initData();
            activity.setSupportActionBar(ui.toolbar);
            ui.viewpager.setTitles(["推荐项目", "录制脚本"]);
            ui.tabs.setupWithViewPager(ui.viewpager);
            ui.toolbar.setupWithDrawer(ui.drawer);
            ui.server_menu.setDataSource(serverList);
            ui.gameList.setDataSource(gameList);
            ui.record_menu.setDataSource(recordList);
            ui.other_menu.setDataSource(otherList);
            clearInterval(downloadId);
        } else {
            downloadDialog.setProgress((progress * 100).toFixed(1));
        }
    }, 20);
}

/**通过get请求从GitHub下载zip文件*/
function downGithubZip() {
    try {
        testDialog.show()
        var myUrl = new URL(url);
        var conn = myUrl.openConnection();
        conn.connect();
        inStream = conn.getInputStream();
        connLength = conn.getContentLength();
        fs = new FileOutputStream(filepath);
        if (game.get("bytesLength", 0) != connLength && connLength != -1) {
            testDialog.dismiss();
            downloadDialog.show();
            while ((byteRead = inStream.read(buffer)) != -1) {
                byteSum += byteRead;
                fs.write(buffer, 0, byteRead);
                progress = byteSum / connLength;
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
            progress = 1;
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

//服务选择
ui.server_menu.on("item_bind", function (itemView, itemHolder) {
    itemView.isShow.on("check", function (checked) {
        var item = itemHolder.item;
        switch (item.title) {
            case "无障碍服务":
                if (checked && auto.service == null) {
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                    toast("请开启无障碍权限")
                }
                if (!checked && auto.service != null) {
                    auto.service.disableSelf();
                    toast("已经关闭无障碍权限");
                }
                break;
            case "保持前台服务":
                if (checked) {
                    serverList[1].isShow = true;
                } else {
                    serverList[1].isShow = false;
                }
                console.log(serverList[1].isShow);
                break;
            case "显示控制台":
                threads.start(function () {
                    if (checked) {
                        console.show();
                        console.setPosition(0, d_height / 3);
                    } else {
                        console.hide();
                    }
                })
                break;
        }
    })
})

//录制脚本
ui.record_menu.on("item_bind", function (itemView, itemHolder) {
    itemView.isShow.on("check", function (checked) {
        var item = itemHolder.item;
        switch (item.title) {
            case "悬浮窗":
                if (checked) {
                    fb.show();
                    game.put("dialog_isShow", true);
                } else {
                    fb.hide();
                    game.put("dialog_isShow", false);
                }
                break;
            case "音量下键关闭":
                if (checked && auto.service == null) {
                    toast("请开启无障碍权限");
                    itemView.isShow.checked = false;
                } else {
                    if (checked) {
                        game.put("down_isShow", true);
                    } else {
                        game.put("down_isShow", false);
                    }
                    initKeyDown();
                }
                break;
        }
    })
})
// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.isShow.checked = auto.service != null;
});

//点击开始按钮 
ui.startGame.on("click", () => {
    startOrStopGame();
})

// //刷新列表
// ui.bt_refresh.click(function () {
//     gameList = [];
//     noDownGameList = [];
//     downGameList = [];
//     runGameList = [];
//     initData();
// })

ui.save.click(function () {
    for (var index = 0; index < listView.length; index++) {
        var element = listView[index];
        var runTime = element.inputTime.text();
        var appName = gameList[index].appName;
        game.put(gameList[index].appName, runTime)
    }
    toast("保存成功")
})
//检测是否在游戏界面
function isBackGame(b_packageName) {
    rect = packageName(b_packageName).findOnce();
    if (rect == null) {
        console.log("返回到本游戏界面");
        app.launchPackage(packageName2);
        sleep(3000)
    }
}
//运行游戏的线程
function gameThread() {
    runThread = threads.start(function () {
        var element;
        auto.waitFor();
        rb.setIcon('@drawable/ic_stop_black_48dp');
        rb.setTint('#FFFFFF');
        rb.setColor('#ED524E');
        if (!requestScreenCapture()) {
            console.log("请求截图失败");
            exit();
        };
        for (index = 0; index < runGameList.length; index++) {
            console.log("执行第" + index + "个");
            element = runGameList[index];
            packageName2 = element.packageName;
            appName = element.appName;
            console.log("开始运行" + appName);
            ui.run(function () {
                runTime(parseInt(game.get(appName)));
            })
            switch (appName) {
                case "快手极速版":
                    快手极速版();
                    break;
                case "特工先生":
                    长沙嘟游();
                    break;
                case "美妞求生记":
                    长沙嘟游();
                    break;
                case "我要修理你":
                    长沙嘟游();
                    break;
            }
            isWait();
        }
    })
}
//土豪游戏
function 土豪游戏() {
    while (suspend) {
        isBackGame(packageName2);
        img = captureScreen();
        uninstallApp("垃圾分类指南")
        point = findImage("土豪游戏", "redenvelope", 0.6, 0, 0, d_width, d_height / 3);
        pressPoint(point, 100, 100);

        point = findIm + age("土豪游戏", "receive", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 0, 0);

        point = findImage("土豪游戏", "redenvelope2", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            sleep(5000);
            point = findImage("土豪游戏", "receive", 0.6, 0, 0, d_width, d_height);
            pressPoint(point, 0, 0);
            img = captureScreen();
            point = findImage("土豪游戏", "redenvelope2", 0.6, 0, 0, d_width, d_height);
            if (point == null) {
                sleep(10000);
                installApp("垃圾分类指南");
            }
        }
        point = findImage("土豪游戏", "open", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 0, 0);

        point = findImage("土豪游戏", "read", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            click(d_width / 4, d_height * 0.1);
        }
        point = findImage("土豪游戏", "close", 0.8, d_width / 2, 0, d_width / 2, d_height / 5);
        pressPoint(point, 0, 0);

        point = findImage("土豪游戏", "know", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 50, 50);

        point = findImage("土豪游戏", "receive2", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 50, 50);

        rect = findTextButton("| 跳过");
        pressRect(rect);

        rect = findTextButton("继续观看");
        pressRect(rect);

        rect = findTextButton("抓住奖励机会");
        pressRect(rect);
    };
}
//快手极速版
function 快手极速版() {
    while (suspend) {
        isBackGame(packageName2);
        if (findTextButton("福利") != null) {
            pressRect(findTextButton("福利"));
            sleep(40000);
            pressRect(findIdButton("video_close_icon"));
            pressRect(findTextButton("已成功领取奖励"));
        } else if (findTextButton("领福利") != null) {
            pressRect(findTextButton("领福利"));
            sleep(75000);
            pressRect(findIdButton("live_close_place_holder"));
            sleep(1000);
            pressRect(findIdButton("exit_btn"));
            sleep(1000);
            pressRect(findIdButton("live_exit_button"));
        } else {
            pressRect(findTextButton("首页"));
            var delayTime = random(7000, 10000);
            sleep(delayTime);
        }
    }
}
//长沙嘟游
function 长沙嘟游() {
    while (suspend) {
        isBackGame(packageName2);
        img = captureScreen();
        uninstallApp("垃圾分类指南");
        pressRect(findIdButton("btn"));
        pressRect(findTextContains("允许", 1));
        pressRect(findCustomizButton("红包群", 10, 1));
        pressRect(findCustomizButton("世界群", 12, 3));

        pressRect(findIdButton("text_switcher"));

        point = findImage("长沙嘟游", "redenvelope", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 0, 0);

        point = findImage("长沙嘟游", "redenvelope2", 0.8, 0, 0, d_width, d_height);
        if (point != null) {
            pressPoint(point, 50, 50);
            sleep(5000);
            installApp("垃圾分类指南");
        }
        if (findIdButton("getRedBagRl") != null) {
            sleep(5000);
            pressRect(findIdButton("getRedBagRl"));
        }
        point = findImage("长沙嘟游", "read", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            click(d_width / 4, d_height * 0.1);
        }
        point = findImage("长沙嘟游", "close", 0.6, d_width * 0.85, 0, d_width * 0.15, d_height * 0.09);
        pressPoint(point, 0, 0);

        point = findImage("长沙嘟游", "openApp", 0.8, 0, 0, d_width, d_height);
        pressPoint(point, 50, 50);
        if (findIdButton("open") != null) {
            pressRect(findIdButton("open"));
            closeData();
        }

        if (findIdButton("sure") != null || findTextButton("坚持退出") != null) {
            pressRect(findIdButton("sure"));
            closeData();
        }
    }
}
//卸载应用
function uninstallApp(appName) {
    var packname = getPackageName(appName);
    if (packname != null) {
        app.openAppSetting(packname);
        sleep(5000);
        pressRect(findTextButton("卸载"))
        sleep(2000);
        pressRect(findTextButton("卸载"));
        sleep(2000)
        pressRect(findTextButton("确定"));
        sleep(5000);
    }
}

//应用市场安装APP
function installApp(appName) {
    app.launchApp("华为应用市场");
    sleep(5000);
    pressRect(findIdButton("search_bar"));
    sleep(5000);
    var et = className("android.widget.EditText").depth(13).drawingOrder(2).findOnce();
    if (et) {
        et.setText(appName);
    }
    sleep(2000);
    if (findTextButton("打开") == null) {
        pressRect(findTextButton("安装"));
    }
    sleep(5000);
    back();
}
//勾选的游戏的监听
ui.gameList.on("item_bind", function (itemView, itemHolder) {
    listView.push(itemView);
    console.log(listView.length);
    itemView.game1.on("check", (checked) => {
        var position = itemHolder.position;
        if (checked) {
            pattern = ui.spl.getSelectedItemPosition();
            if (pattern == 0) {
                for (let index = 0; index < listView.length; index++) {
                    if (index != position) {
                        listView[index].game1.checked = false;
                    }
                }
            }
            add(gameList[position].appName, gameList[position]);
        } else {
            remove(gameList[position].appName)
        }
    })
})

function indexOf(val) {
    for (var index = 0; index < runGameList.length; index++) {
        if (runGameList[index].appName == val) {
            return index;
        }
    }
    return -1;
}

function remove(val) {
    var index = indexOf(val)
    if (index > -1) {
        runGameList.splice(index, 1);
    }
}

function add(val, data) {
    var index = indexOf(val)
    if (index > -1) {
        runGameList.splice(index, 0, data);
    } else {
        runGameList.splice(runGameList.length, 0, data);
    }
}

//根据id找控件点击
function findIdButton(b_id) {
    rect = id(b_id).findOnce();
    if (rect != null) {
        console.log("找到id控件" + b_id + "坐标" + "：" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect
    }
    return null;
}

//根据text找控件点击
function findTextButton(b_text) {
    rect = text(b_text).findOnce();
    if (rect != null) {
        console.log("找到控件" + b_text + "坐标" + "：" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect;
    }
    return null
}

function findTextContains(str, i) {
    rect = textContains(str).findOnce(i);
    if (rect != null) {
        ;
        console.log("找到匹配控件");
        return rect;
    }
    return null;
}

//根据属性className、classNane、drawOrder找控件点击
function findCustomizButton(b_text, b_depth, b_drawingOrder) {
    rect = text(b_text).depth(b_depth).drawingOrder(b_drawingOrder).findOnce();
    if (rect != null) {
        console.log("找到控件坐标" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect;
    }
    return null;
}

//找图方法
function findImage(gameName, imgName, rate, s_width, s_height, r_width, r_height) {
    var imgPath = "/sdcard/脚本/金多多挂机/jinduoduo-main/res/" + gameName + "/" + imgName + ".jpg";
    var templ = images.read(imgPath);
    point = images.findImage(img, templ, {
        threshold: rate,
        region: [s_width, s_height, r_width, r_height]
    });
    if (point != null) {
        console.log("找到图片" + imgName + ":" + "(" + point.x + "," + point.y + ")");
        return point;
    }
    return null;
}

//根据Point点击坐标
function pressPoint(point, a, b) {
    if (point != null) {
        click(point.x + a, point.y + b);
    }
    sleep(100);
}

//根据Rect点击坐标
function pressRect(rect) {
    if (rect != null) {
        click(rect.bounds().centerX(), rect.bounds().centerY());
    }
    sleep(100);
}
//初始化ui界面
function initFloatDialog() {
    //悬浮框
    fb = new FloatButton();
    fb.setIcon('http://www.autojs.org/assets/uploads/profile/3-profileavatar.png');
    fb.setAllButtonSize(50)
    rb = fb.addItem('run');
    rb.setIcon('@drawable/ic_play_arrow_black_48dp');
    rb.setTint('#FFFFFF');
    rb.setColor('#41A4F5');
    rb.onClick((view, name, state) => {
        startOrStopGame();
        return true;
    })

    fb.show();
}
//开始运行或者停止运行游戏
function startOrStopGame() {
    if (isRun) {
        console.log("点击停止");
        ui.startGame.setText("开始运行");;
        rb.setIcon('@drawable/ic_play_arrow_black_48dp');
        rb.setTint('#FFFFFF');
        rb.setColor('#41A4F5');
        suspend = false;
        isRun = false;
        wait = true;
        closeCurrentPackage();
    } else {
        console.log("点击运行");
        if (runGameList.length != 0) {
            isRun = true;
            wait = false;
            suspend = true;
            ui.startGame.setText("停止运行");;
            gameThread();
        } else {
            toast("没有选择执行的脚本")
        }
    }
}

/*
运行时间
timeout 分钟
*/
function runTime(timeout) {
    var i = 0;
    var id = setInterval(function () {
        i++;
        console.log("运行了" + i + "s");
        if (i >= timeout * 60) {
            if (pattern == 0) {
                suspend = true;;
            } else {
                suspend = false;
            }
        }
        i = 0;
    }, 1000);
}
//初始化无障碍弹窗
function initAutoDialog() {
    autoDialog = dialogs.build({
        title: "需要启动无障碍权限服务",
        content: "软件需要打开无障碍服务才能运行,请在随后的设置中选择Auto.js并开启服务。你也可以稍后在侧拉菜单设置",
        checkBoxPrompt: "不再提示",
        negative: "取消",
        positive: "去设置"
    }).on("positive", () => {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }).on("check", (checked) => {
        if (checked) {
            game.put("isShow", false);
        } else {
            game.put("isShow", true);
        }
    });
    if (auto.service != null) {
        autoDialog.hide();
    } else {
        autoDialog.show();
    }
}
//强制关闭应用
function closeCurrentPackage() {
    threads.start(function () {
        app.openAppSetting(packageName2);
        text(app.getAppName(packageName2)).waitFor();
        pressRect(findTextButton("强行停止"));
        sleep(1000);
        pressRect(findTextButton("强行停止"));
        sleep(1000);
    })
}
//清除数据
function closeData() {
    app.openAppSetting(packageName2);
    text(app.getAppName(packageName2)).waitFor();
    sleep(2000);
    pressRect(findTextButton("存储"));
    sleep(2000);
    pressRect(findTextButton("删除数据"));
    sleep(2000);
    pressRect(findTextButton("确定"));
    sleep("5000");
    back();
}
//初始化脚本列表数据
function initData() {
    var bmob = new Bmob("https://api2.bmob.cn/1", "a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");
    var thread = threads.start(function () {
        ui.run(function () {
            ui.refresh.setVisibility(0);
        })
        var result = bmob.findAll("Game").results;
        for (var index = 0; index < result.length; index++) {
            var element = result[index];
            game.put(element.appName, "30");
            if (getAppName(element.packageName) == null) {
                color = "#C0C0C0";
                isClickable = false;
                noDownGameList.push(new Game(element.appName, element.packageName, color, false, game.get(element.appName, "30")));
            } else {
                color = "#FFFFFF";
                isClickable = true;
                downGameList.push(new Game(element.appName, element.packageName, color, true, game.get(element.appName, "30")));
            }
        }
        for (var i = 0; i < downGameList.length; i++) {
            gameList.push(downGameList[i]);
        }
        for (var j = 0; j < noDownGameList.length; j++) {
            gameList.push(noDownGameList[j]);
        }
        sleep(1000);
        ui.run(function () {
            ui.gameList.setDataSource(gameList);
            ui.refresh.setVisibility(8);
        })
    })
}
//初始化本地存储
function initStorages() {
    game = storages.create("game");
    game.put("dialog_isShow", true);
    game.put("down_isShow", false);
    game.put("reception_isShow", false);
    game.put("console_isShow", false);
    game.put("isShow", true);
    game.put("model", 0);
}
//按音量键下停止脚本运行
function initKeyDown() {
    events.observeKey();
    events.onKeyDown("volume_down", function (event) {
        if (game.get("down_isShow")) {
            toast("脚本停止运行");
            exit();
        }
    })
}
//是否等待
function isWait() {
    while (wait) {
        sleep(1000);
        console.log("等待中。。。");
        index = 0;
    }
}
/**
 * 屏幕滑动
 */
function slideScreenDown(startX, startY, endX, endY, pressTime, second) {
    for (let index = 0; index < second; index++) {
        console.log("滑动屏幕")
        swipe(startX, startY, endX, endY, pressTime);
        var delayTime = random(7000, 10000);
        sleep(delayTime);
    }
}
