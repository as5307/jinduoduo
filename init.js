"ui";
require("/sdcard/脚本/金多多挂机/jinduoduo-main/FloatButton/FloatButton.js");
var Bmob = require("/sdcard/脚本/金多多挂机/jinduoduo-main/bmob.js");
var Game = require("/sdcard/脚本/金多多挂机/jinduoduo-main/game.js");
var game = storages.create("game");
game.put("isShow", true);
game.put("model", 0);

var fb;

var autoDialog;
var setDialog;

var color

var packageName;
var appName;

var runThread;
var runTime;

var index;
var suspend = false;
var isRun = false;
var isSingle = true;

var rb;

var ifshow = false;

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
var downGameList = [];
var noDownGameList = [];
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
                <frame >
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
                        <horizontal  >
                            <spinner id="sp1" entries="单个循环|顺序循环" layout_weight="1" />
                            <button id="startGame" text="开始运行" layout_weight="1" />
                            <button id="refresh" text="刷新列表" layout_weight="1" />
                        </horizontal>
                    </vertical>

                    <linear w="*" h="*" bg="#a0000000" id="dialogs" gravity="center" visibility="gone">
                        <vertical w="300" h="500" bg="#ffffff" padding="10">

                        </vertical>
                    </linear>

                </frame>
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

initData();

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


ui.dialogs.click(function () {
    if (!ifshow) {
        ui.dialogs.setVisibility(0);
        ifshow = false;
    } else {
        ui.dialogs.setVisibility(8);
        ifshow = true;
    }
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
            runTime = 0;
            while (runTime < inputTime * 60) {
                element = runGameList[index];
                packageName = element.packageName;
                appName = element.appName;
                console.log(appName);
                isGame(packageName);
                runTime = runTime + 1000;
                console.log("运行时间" + runTime / 1000 + "s");
                switch (appName) {
                    case "中青看点":
                        // if (game.get("model") == 0) {
                        //     for (var i = 1; i < 1000; i++) {
                        //         sleep(8000)
                        //         findIdClick("xx");
                        //         findIdClick("arj");
                        //         index = random(1000, 5000);
                        //         slideScreenDown(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.1, index, 1);
                        //         findTextClick("android.view.View", "查看全文，奖励更多");
                        //         slideScreenDown(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.1, index, 2);
                        //         slideScreenDown(device.width / 2, device.height * 0.1, device.width / 2, device.height * 0.8, index, 3);
                        //         back();
                        //         sleep(2000)
                        //         slideScreenDown(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.1, 400.1);
                        //     }
                        // }

                        // if (game.get("model") == 1) {
                        //     for (var i = 1; i < 1000; i++) {
                        //         sleep(8000)
                        //         findIdClick("y0");
                        //         clickScreen(0.5, 0.5);
                        //         index = random(60000, 100000);
                        //         sleep(index);
                        //         back();
                        //         sleep(2000)
                        //         slideScreenDown(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.1, 400, 1);
                        //     }
                        // }
                        break;
                }
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
    })

    itemView.btn_set.on("click", () => {
        var position = itemHolder.position;

        var appName = gameList[position].appName;

        switch (appName) {
            case "中青看点":
                ui.dialogs.setVisibility(0);
                ifshow = true
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

//根据id找控件点击
function findIdClick(b_id) {
    var main_gameView = id(b_id).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1);
        console.log("点击" + main_gameView.text());
        sleep(2000);
    }
}

//根据text找控件点击
function findTextClick(b_view, b_text) {
    var main_gameView = className(b_view).text(b_text).findOnce();

    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("点击文本" + main_gameView);
        sleep(2000);
    }
}

//根据属性className、classNane、drawOrder找控件点击
function findOtherClick(b_className, b_className, b_drawingOrder) {
    var main_gameView = className(b_className).depth(b_className).drawingOrder(b_drawingOrder).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("关闭点击按钮弹窗2");
        sleep(2000);
    }
}

//找图方法
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

//初始化脚本列表数据
function initData() {

    var bmob = new Bmob("https://api2.bmob.cn/1","a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");

    var thread = threads.start(function () {
        var result = bmob.findAll("GameApp").results;

        for (var index = 0; index < result.length; index++) {
            var element = result[index];

            if (getAppName(element.packageName) == null) {
                color = "#C0C0C0";
                isClickable = false;
                downGameList.push(new Game(element.appname, element.packageName, color, isClickable));
            } else {
                color = "#FFFFFF";
                isClickable = true;
                noDownGameList.push(new Game(element.appname, element.packageName, color, isClickable));
            }
        }
        gameList=downGameList.concat(noDownGameList);
        
    })
}

//是否等待
function isWait() {
    while (suspend) {
        console.log("暂停中。。。");
        index = 0;
        sleep(10000);
    }
}

/**
 *点击一下屏幕
 */
function clickScreen(sc_x, sc_y) {
    var x = device.width - device.width * sc_x;
    var y = device.height - device.height * sc_y;
    toastLog("点击屏幕" + x + ":" + y);
    let clickResult = click(x, y);
    sleep(3000)
    toastLog(clickResult);
}

/**
 * 屏幕滑动
 */
function slideScreenDown(startX, startY, endX, endY, pressTime, second) {
    for (let index = 0; index < second; index++) {
        swipe(startX, startY, endX, endY, pressTime);
        sleep(2000);
    }
}

/**随机点赞并休息一秒 */
function randomHeart(b_id) {
    index = random(1, 50);
    if (index == 6) {
        var target = id(b_id).findOnce();
        if (target == null) {
            return;
        } else {
            target.click();
            sleep(1000);
            console.log("随机点赞并休息一秒");
        }
    }
}

/**随机并休息一秒 */
function randomFollow(b_id) {
    index = random(1, 100);
    if (index == 66) {
        var target = id(b_id).findOnce();
        if (target == null) {
            return;
        } else {
            target.click();
            sleep(1000);
        }
    }
}






















