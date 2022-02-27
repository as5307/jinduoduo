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

var packageName2;
var appName;

var runThread;
var runTime;
var inputTime;

var index;
var suspend;

var wait = false;

var isRun = false;
var isSingle = true;

var rb;

var isshow = false;


var isOpen = false;

var width = device.width;
var height = device.height;

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

var img;
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

                                    <button text="清除数据" id="btm_clean" layout_gravity="center" margin="5" w="50" textSize="10" />
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
    startOrStopGame();
})

ui.dialogs.click(function () {
    if (!isshow) {
        ui.dialogs.setVisibility(0);
        isshow = false;
    } else {
        ui.dialogs.setVisibility(8);
        isshow = true;
    }
})

//检测是否在游戏界面
function isGame(b_packageName) {
    console.log(b_packageName);
    var main_gameView = packageName(b_packageName).findOnce();

    if (!main_gameView) {
        console.log("返回到本游戏界面");
        app.launchPackage(packageName2);
        sleep(5000)
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

        for (index = 0; index < runGameList.length;) {
            console.log("执行第" + index + "个");

            element = runGameList[index];
            packageName2 = element.packageName;
            appName = element.appName;
            console.log(appName + "开始运行");

            switch (appName) {
                case "阿强消消消":
                    阿强消消消();
                    break;
                case "土豪秒升级":
                    土豪游戏();
                    break;
                case "我就是神豪":
                    土豪游戏();
                    break;
                case "神豪人生":
                    土豪游戏();
                    break;
                case "牛人大作战":
                    土豪游戏();
                    break;
                case "我是学霸":
                    土豪游戏();
                    break;
                case "休闲大师":
                    土豪游戏();
                    break;
                case "一起来冲关":
                    土豪游戏();
                    break;
                case "叫我升级王":
                    土豪游戏();
                    break;
            }
            isWait();
        }

    })
}

//阿强消消消
function 阿强消消消() {
    while (suspend) {
        isGame(packageName2);
        runTime = runTime + 1;
        img = captureScreen();
        suspend = runTime < inputTime * 60;
        findImage("阿强消消消", "blue", 0.8, 10, 10);
        findImage("阿强消消消", "blue2", 0.8, 10, 10);
        findImage("阿强消消消", "green", 0.8, 10, 10);
        findImage("阿强消消消", "green2", 0.8, 10, 10);
        findImage("阿强消消消", "red", 0.8, 10, 10);
        findImage("阿强消消消", "red2", 0.8, 10, 10);
        findImage("阿强消消消", "purple", 0.8, 10, 10);
        findImage("阿强消消消", "purple2", 0.8, 10, 10);
        findImage("阿强消消消", "yellow", 0.8, 10, 10);
        findImage("阿强消消消", "yellow2", 0.8, 10, 10);
        findImage("阿强消消消", "windmill", 0.8, 10, 10);
        findImage("阿强消消消", "hatchet", 0.8, 10, 10);
        findImage("阿强消消消", "redenvelope", 0.8, 10, 10);
        findImage("阿强消消消", "redenvelope2", 0.8, 30, 50);
        findImage("阿强消消消", "chest", 0.8, 10, 10);
        findImage("阿强消消消", "open", 0.8, 100, 100);
        findImage("阿强消消消", "receive", 0.8, 100, 100);
        findImage("阿强消消消", "receive2", 0.8, 0, 0);
        findImage("阿强消消消", "rewards", 0.8, 10, 10);
        findImage("阿强消消消", "close", 0.8, 0, 0);
        findImage("阿强消消消", "takeit", 0.8, 100, 100);
        findImage("阿强消消消", "takeit2", 0.8, 100, 100);

        findCustomizClick("android.widget.ImageView", 6, 5);
        findTextButton("android.view.View", "| 跳过");
        findCustomizClick("android.widget.ImageView", 4, 3);
        findTextButton("android.widget.Button", "坚持退出");
        findTextButton("android.widget.TextView", "放弃奖励离开");
    }
}
//土豪游戏
function 土豪游戏() {
    while (suspend) {
        isGame(packageName2);
        runTime = runTime + 1;
        img = captureScreen();
        suspend = runTime < inputTime * 60;
        findImage("土豪游戏", "redenvelope", 0.6, 100, 100, width, height);
        findImage("土豪游戏", "redenvelope3", 0.6, 100, 100, width, height);
        findImage("土豪游戏", "redenvelope4", 0.6, 100, 100, width, height);
        findImage("土豪游戏", "redenvelope5", 0.6, 100, 100, width, height);
        findImage("土豪游戏", "receive", 0.6, 0, 0, width, height);
        findImage("土豪游戏", "receive3", 0.6, 100, 100, width, height);
        if (findImage("土豪游戏", "redenvelope2", 0.6, 0, 0, width, height) != null) {
            sleep(10000);
            if(app.launchApp("应用商店")){
                sleep(5000);
                click(860, 1129);
               
            };
            if (app.launchApp("应用市场")) {
                sleep(5000);
                click(72, 1536);
            };
            sleep(15000);
        }

        if (findImage("土豪游戏", "receive4", 0.6, 100, 100) != null || findImage("土豪游戏", "receive6", 0.6, 100, 100) != null) {
            sleep(10000);
            click(806, 2224);
            sleep(10000);
            click(80, 2180);
            sleep(5000);
            click(206, 2252);
            sleep(5000);
            click(60, 2220);
        }

        if (findImage("土豪游戏", "open", 0.6, 50, 50, width, height) != null || findImage("土豪游戏", "open2", 0.6, 50, 50, width, height) != null) {
            click(device.width / 2, device.height / 2);
        }

        findImage("土豪游戏", "read", 0.6, 50, 50, width, height);

        findTextButton("android.view.View", "| 跳过");
        findImage("土豪游戏", "close", 0.6, 0, 0, width, height / 2);
        findCustomizClick("android.widget.ImageView", 8, 5);
        findTextButton("android.widget.Button", "继续观看");
        findImage("土豪游戏", "know", 0.6, 50, 50, width, height);
        findImage("土豪游戏", "receive2", 0.6, 50, 50, width, height);
        findImage("土豪游戏", "receive5", 0.6, 50, 50, width, height);
        findImage("土豪游戏", "receive7", 0.6, 50, 50, width, height);
    }
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
function findIdButton(b_id) {
    var main_gameView = id(b_id).findOnce();

    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1);
        console.log("找到id");
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//根据类名找控件点击
function findClassNameButton(b_view) {
    var main_gameView = className(b_view).findOnce();

    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件" + main_gameView);
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//根据text找控件点击
function findTextButton(b_view, b_text) {
    var main_gameView = className(b_view).text(b_text).findOnce();

    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件" + main_gameView);
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//根据子控件找父控件点击
function findFatherButton(b_view, b_text) {

    var main_gameView = className(b_view).text(b_text).findOnce();

    if (main_gameView) {
        var parent = main_gameView.parent();
        press(parent.bounds().centerX(), parent.bounds().centerY(), 1)
        console.log("找到控件" + main_gameView);
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//根据属性className、classNane、drawOrder找控件点击
function findCustomizClick(b_className, b_depth, b_drawingOrder) {
    var main_gameView = className(b_className).depth(b_depth).drawingOrder(b_drawingOrder).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件" + main_gameView);
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//根据属性className、classNane、drawOrder、desc找控件点击
function findCustomiz2Click(b_className, b_depth, b_drawingOrder, b_desc) {
    var main_gameView = className(b_className).depth(b_depth).drawingOrder(b_drawingOrder).desc(b_desc).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件" + main_gameView);
        sleep(1000);
        runTime = runTime + 1;
        console.log("运行了" + runTime + "s");
    }
}

//找图方法
function findImage(gameName, imgName, rate, a, b, r_width, r_height) {
    console.log("找图：" + imgName);
    var imgPath = "/sdcard/脚本/金多多挂机/jinduoduo-main/res/" + gameName + "/" + imgName + ".jpg";
    var templ = images.read(imgPath);

    var result = images.matchTemplate(img, templ, {
        threshold: rate,
        region: [0, 0, r_width, r_height]
    });

    if (result.matches.length != 0) {
        for (var index = 0; index < result.matches.length; index++) {
            var pp = result.matches[index].point;
            console.log("找到图片坐标" + imgName + pp.x + "," + pp.y);
            click(pp.x + a, pp.y + b);
            return pp;
        }
    }
    sleep(100);
    runTime = runTime + 1;
    console.log("运行了" + runTime + "s");

    return null;
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
        startOrStopGame();
        return true;
    })
    fb.show();
    initAutoDialog();
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

            var pattern = ui.sp1.getSelectedItemPosition();

            console.log("选中" + pattern);
            var text = ui.runTime.text();
            inputTime = parseInt(text);
            runTime = 0;


            switch (pattern) {
                case 0:
                    index = 0;
                    gameThread(inputTime);
                    break;
                case 1:
                    gameThread(inputTime);
                    break;
            }

        } else {
            toast("没有选择执行的脚本")
        }
    }
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
        console.log("应用包名" + 2);
        app.openAppSetting(packageName2);
        text(app.getAppName(packageName2)).waitFor();

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

    var bmob = new Bmob("https://api2.bmob.cn/1", "a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");

    var thread = threads.start(function () {

        var result = bmob.findAll("GameApp").results;

        console.log("返回数据" + result);

        for (var index = 0; index < result.length; index++) {
            var element = result[index];

            if (getAppName(element.packageName) == null) {
                color = "#C0C0C0";
                isClickable = false;

                noDownGameList.push(new Game(element.appname, element.packageName, color, isClickable));
            } else {
                color = "#FFFFFF";
                isClickable = true;
                downGameList.push(new Game(element.appname, element.packageName, color, isClickable));
            }

        }
        for (var i = 0; i < downGameList.length; i++) {
            gameList.push(downGameList[i]);
        }
        for (var j = 0; j < noDownGameList.length; j++) {
            gameList.push(noDownGameList[j]);
        }

    })
}

//是否等待
function isWait() {
    index++;
    suspend = true;
    while (wait) {
        sleep(1000);
        console.log("等待中。。。");
        index = 0;
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
        sleep(100);
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






















