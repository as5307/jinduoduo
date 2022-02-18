"ui";

var game = storages.create("game");

var fb;

var autoDialog;
var setDialog;

var color

game.put("isShow", true);
game.put("model", 0);
var packageName;
var appName;
var runThread;
var startTime;
var endTime;
var runTime;


var suspend = false;

var index;

var isRun = false;

var rb;

var isSingle = true;

var serverList = [
    {
        title: "无障碍服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: auto.service != null
    },
    {
        title: "保持前台服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: true
    },
    {
        title: "显示控制台",
        icon: "@drawable/ic_android_black_48dp",
        isShow: false
    }
];

var recordList = [
    {
        title: "悬浮窗",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "音量下键关闭",
        icon: "@drawable/ic_android_black_48dp"
    }
];

var otherList = [
    {
        title: "主题色",
        icon: "@drawable/ic_android_black_48dp",
    },
    {
        title: "挂机秘籍",
        icon: "@drawable/ic_android_black_48dp"
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
var gameList = [];
var runGameList = [];

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="金多多挂机" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <vertical >
                    <list id="gameList" layout_weight="1" bg="#FAF0E6" >
                        <card w="*" h="55" margin="10 5" cardCornerRadius="2dp" layout_gravity="center" id="gameCard" bg="{{this.color}}" >

                            <horizontal h="*" >
                                <View bg="#4caf50" h="*" w="10" />
                                <checkbox id="game1" clickable="{{this.isClickable}}" textSize="20" text="{{this.appName}}" layout_gravity="center" layout_weight="1" />
                                <input id="runTime" type="number" w="auto" text="30" layout_gravity="center" />
                                <text text="分钟" layout_gravity="center" />
                                <button text="脚本配置" id="btn_set" layout_gravity="center" margin="5" w="50" textSize="10" />

                                <button text="清除数据" layout_gravity="center" margin="5" w="50" textSize="10" />
                            </horizontal>


                        </card>

                    </list>
                    <horizontal padding="5">
                        <img src="@drawable/ic_autorenew_black_48dp" margin="5" />
                        <spinner id="sp1" entries="单个循环|顺序循环" />
                        <button id="startGame" text="开始运行" layout_gravity="bottom" style="Widget.AppCompat.Button.Colored" />
                    </horizontal>
                </vertical>
                <frame>
                    <text text="项目配置" />
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="150" scavarype="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />

            <text text="服务" margin="10" />
            <list id="server_menu">
                <horizontal w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" />
                    <Switch id="autoService" checked="{{this.isShow}}" text="{{this.title}}" layout_gravity="center" w="*" />
                </horizontal>
            </list>

            <View bg="#FFF5EE" h="10" />

            <text text="录制脚本" margin="10" />
            <list id="record_menu">
                <horizontal w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" />
                    <Switch id="isShow" layout_gravity="center" text="{{this.title}}" layout_gravity="center" w="*" />
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
    </drawer>
);

initUI();

isShow();

activity.setSupportActionBar(ui.toolbar);

ui.viewpager.setTitles(["脚本列表", "录制脚本"]);

ui.tabs.setupWithViewPager(ui.viewpager);

ui.toolbar.setupWithDrawer(ui.drawer);

ui.server_menu.setDataSource(serverList);

ui.gameList.setDataSource(gameList);

ui.record_menu.setDataSource(recordList);

ui.other_menu.setDataSource(otherList);

//服务选择
ui.server_menu.on("item_bind", function (itemView, itemHolder) {
    itemView.autoService.on("check", function (checked) {
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
                } else {
                    fb.hide();
                }
                break;
            case "音量下键关闭":

                break;
        }
    })
})

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});

//点击开始按钮 
ui.startGame.on("click", () => {
    // let viewUtil = fb.getViewUtil('run');
    // viewUtil.setChecked(true);
})

//检测是否在游戏界面
function isGame(packageName) {
    if (currentPackage() != getAppName(packageName)) {
        console.log("返回到本游戏界面");
        app.launchPackage(packageName);
    }
}

//运行游戏的线程
function gameThread(inputTime) {
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
            startTime = new Date().getTime();
            endTime = new Date().getTime();
            runTime = 0;
            while (runTime < inputTime * 60) {
                element = runGameList[index];
                packageName = element.packageName;
                appName = element.appName;
                console.log(appName);
                isGame(packageName);
                endTime = new Date().getTime();
                runTime = Math.floor((endTime - startTime) / 1000);
                console.log("运行时间" + runTime + "s");
                switch (appName) {
                    case "富豪连连看":
                        closeAdvertis1();
                        findImage(appName, "宝箱", 0.6, 100, 200);
                        findImage(appName, "多倍领取", 0.6, 100, 100);
                        findImage(appName, "开心收下", 0.6, 100, 100);
                        findImage(appName, "关闭", 0.6, 0, 0);
                        break;
                    case "红包连连翻":
                        closeAdvertis2();
                        findImage(appName, "宝箱", 0.6, 150, 150);
                        findImage(appName, "关闭", 0.6, 0, 0);
                        break;
                }
                isWait();
            }
        }
        console.log("已完成运行");
    })
}

//勾选的游戏的监听
ui.gameList.on("item_bind", function (itemView, itemHolder) {

    itemView.game1.on("check", (checked) => {
        var position = itemHolder.position;

        if (checked) {
            runGameList.splice(position, 0, gameList[position]);
            console.log("选中添加")

        } else {
            remove(gameList[position].appName)
            console.log("选中删除")
        }

        console.log(runGameList.length);
    })

    itemView.btn_set.on("click", () => {
        var position = itemHolder.position;

        var appName = gameList[position].appName;

        switch (appName) {
            case "富豪连连看":
              
                break;

            case "红包连连翻":
                var items = ["直接领取(关闭弹窗)", "多倍领取(点击广告)", "转盘"];
                initSetDialog(items, 0);
                break;
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
        runGameList.splice(0, 0, data)
    }
}

function isShow() {
    if (auto.service != null) {
        autoDialog.hide();
    } else {
        autoDialog.show();
        toast("已开启无障碍服务");
    }
}

//关闭富豪连连看广告弹窗
function closeAdvertis1() {

    var main_gameView1 = id("tt_insert_dislike_icon_img").findOnce();

    if (main_gameView1) {
        press(main_gameView1.bounds().centerX(), main_gameView1.bounds().centerY(), 1);
        console.log("关闭主界面弹窗1");
        sleep(2000);
    }

    var main_gameView2 = className("android.widget.Image").text("lkYrmqKHmnb8yLjAt5ruh6Laz5bel5L+h6YOo5pyA5Lil6KaB5rGCIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5o+S5bGPL+erluWbvi3mlofmoYgxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTk0LjAwMDAwMCwgLTE3Ny4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IjQwL+WFs+mXrSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTk0LjAwMDAwMCwgMTc3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjMiIGN4PSIyOCIgY3k9IjI4IiByPSIyMCI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5Y+JL+aegeWwjyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkuMDAwMDAwLCAxOS4wMDAwMDApIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMTcuNSIgeTE9IjAuNSIgeDI9IjAuNSIgeTI9IjE3LjUiIGlkPSJMaW5lIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjE3LjUiIHkxPSIxNy41IiB4Mj0iMC41IiB5Mj0iMC41IiBpZD0iTGluZS1Db3B5LTI0Ij48L2xpbmU+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==").findOnce();

    if (main_gameView2) {
        var parent = main_gameView2.parent();
        press(parent.bounds().centerX(), parent.bounds().centerY(), 1)
        console.log("关闭主界面弹窗2");
        sleep(2000);
    }

    var advertis1 = className("android.widget.ImageView").depth("5").drawingOrder("2").selected(false).findOnce();
    if (advertis1) {
        press(advertis1.bounds().centerX(), advertis1.bounds().centerY(), 1)
        console.log("关闭点击按钮弹窗2");
        sleep(2000);
    }

    var advertis2 = id("ksad_end_close_btn").findOnce();
    if (advertis2) {
        press(advertis2.bounds().centerX(), advertis2.bounds().centerY(), 1)
        console.log("关闭点击按钮弹1");
        sleep(2000);
    }

    var advertis3 = className("android.widget.ImageView").depth("5").drawingOrder("5").selected(false).findOnce();

    if (advertis3) {
        press(advertis3.bounds().centerX(), advertis3.bounds().centerY(), 1)
        console.log("关闭点击按钮弹窗3");
        sleep(2000);
    }

    var advertis4 = className("android.widget.ImageView").depth("6").drawingOrder("5").selected(false).findOnce();

    if (advertis4) {
        press(advertis4.bounds().centerX(), advertis4.bounds().centerY(), 1)
        console.log("关闭点击按钮弹窗4");
        sleep(2000);
    }

    var advertis5 = className("android.widget.ImageView").depth("8").drawingOrder("1").selected(false).clickable(true).findOnce();

    if (advertis5) {
        press(advertis5.bounds().centerX(), advertis5.bounds().centerY(), 1)
        console.log("关闭点击按钮弹窗5");
        sleep(2000);
    }
}

//关闭红包连连看广告弹窗
function closeAdvertis2() {

    
}

//找图
function findImage(gameName, imgName, rate, a, b) {
    var img = captureScreen();

    var imgPath = "/sdcard/脚本/金多多挂机/res/" + gameName + "/" + imgName + ".jpg";

    console.log(imgPath);

    var templ = images.read(imgPath);

    var x = device.width / 1080;
    var y = device.height / 2400;
    var temp2 = images.scale(templ, x, y);

    var result = images.matchTemplate(img, temp2, {
        threshold: rate,
        region: [0, 0, device.width, device.height],
        max: 5
    });

    if (result) {
        for (var index = 0; index < result.matches.length; index++) {
            var pp = result.matches[index].point;
            click(pp.x + a, pp.y + b);
            console.log("找到点击" + imgName + pp);
            sleep(2000)
        }
    } else {
        console.log("未找到" + imgName);
    }
}

//初始化ui界面
function initUI() {
    //悬浮框
    require("sdcard/脚本/金多多挂机/FloatButton/FloatButton.js");

    fb = new FloatButton();
    fb.setIcon('http://www.autojs.org/assets/uploads/profile/3-profileavatar.png');
    fb.setAllButtonSize(50)
    rb = fb.addItem('run');
    rb.setIcon('@drawable/ic_play_arrow_black_48dp');
    rb.setTint('#FFFFFF');
    rb.setColor('#41A4F5');
    rb.onClick((view, name, state) => { 
        if (isRun) {
            rb.setIcon('@drawable/ic_play_arrow_black_48dp');
            rb.setTint('#FFFFFF');
            rb.setColor('#41A4F5');
            console.log("点击停止");
            suspend = true;
            isRun = false;
            closeCurrentPackage();
        } else {
            if (runGameList.length != 0) {
                isRun = true;
                suspend = false;

                var pattern = ui.sp1.getSelectedItemPosition();

                console.log("选中" + pattern);

                switch (pattern) {
                    case 0:
                        var inputTime = Math.pow(2, 100);
                        console.log(inputTime)
                        gameThread(inputTime);
                        break;
                    case 1:
                        var text = ui.runTime.text();
                        var inputTime = parseInt(text);
                        gameThread(inputTime);
                        break;
                }
                console.log("点击运行");
            } else {
                toast("没有选择执行的脚本")
            }
        }

        return true;
    })
    fb.show();
    initAutoDialog();
    addGameList();
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
}

//初始化配置弹窗
function initSetDialog(items, index) {
    setDialog = dialogs.build({
        title: "挂机配置",
        positive:"确定",
        negative:"取消",
        items: items,
        itemsSelectMode: "single",
        itemsSelectedIndex:game.get("model")

    }).on("single_choice", (index, item) => {

        console.log("你选择的是" + item);

        game.put("model",index);

    }).show();
}

//强制关闭应用
function closeCurrentPackage() {
    threads.start(function () {
        console.log("应用包名" + packageName);
        app.openAppSetting(packageName);
        text(app.getAppName(packageName)).waitFor();

        var is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).clickable(true).findOnce();

        if (is_sure) {
            click(is_sure.bounds().centerX(), is_sure.bounds().centerY());
            log("找到了1" + is_sure);
            sleep(2000);
        }
        var is_sure2 = textMatches(/(.*确.*|.*定.*|.*止.*|)/).clickable(true).findOnce();

        if (is_sure2) {
            click(is_sure2.bounds().centerX(), is_sure2.bounds().centerY());
            log("找到了确定点击");
            sleep(2000);
        }

    })
}

//添加脚本列表数据
function addGameList() {

    var bmob = new Bmob("https://api2.bmob.cn/1", "a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");

    var thread = threads.start(function () {
        var allGame = bmob.getObjects("GameApp");

        var result = allGame.results;

        for (var index = 0; index < result.length; index++) {
            var element = result[index];

            if (getAppName(element.packageName) == null) {
                color = "#C0C0C0";
                isClickable = false;
            } else {
                color = "#FFFFFF";
                isClickable = true;
            }

            gameList.push(new Game(element.appname, element.packageName, color, isClickable));
        }
    })
}
function Game(appName, packageName, color, isClickable) {
    this.appName = appName;
    this.packageName = packageName;
    this.color = color;
    this.isClickable = isClickable;
}

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
    Bmob.prototype.getObjects = function (className) {
        return this.makeRequest("GET", "/classes/" + className).body.json();
    }
    Bmob.prototype.getObject = function (className, id) {
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

//是否等待
function isWait() {
    while (suspend) {
        console.log("暂停中。。。");
        index = 0;
        sleep(10000);
    }
}



















