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
var timeInterval;
var inputTime;
var startTime;

var endTime;

var index;
var suspend;

var wait = false;

var isRun = false;
var isSingle = true;

var rb;

// var isshow = false;


var isOpen = false;

var thread;

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
                <vertical>
                    <frame layout_weight="1" bg="#FAF0E6" >
                        <list id="gameList" >
                            <card w="*" h="55" margin="10 5" cardCornerRadius="2dp" layout_gravity="center" id="gameCard" bg="{{this.color}}" >
                                <horizontal h="*" >
                                    <View bg="#4caf50" h="*" w="10" />
                                    <checkbox id="game1" clickable="{{this.isClickable}}" textSize="20" text="{{this.appName}}" layout_gravity="center" layout_weight="2" />
                                    <horizontal id="control" visibility="{{this.isControl}}">
                                        <button text="脚本配置" id="btn_set" layout_gravity="center" margin="5" />
                                        <button text="清除数据" id="btm_clean" layout_gravity="center" margin="5" />
                                    </horizontal>
                                    <button text="下载游戏" id="btn_down" visibility="{{this.isDown}}" />
                                </horizontal>
                            </card>
                        </list>

                        <linear w="*" h="*" bg="#FAF0E6" id="dialogs" visibility="gone">
                            <vertical w="*">
                                <text text="运行时间(分钟)" />
                                <input w="*" inputType="number" id="inputTime" />
                               
                                <horizontal layout_gravity="bottom">
                                <button id="back" text="返回列表" layout_weight="1"  />
                                <button id="save" text="保存配置" layout_weight="1"  />
                                </horizontal>
                            </vertical>

                        </linear>

                        <linear w="*" h="*" bg="#FAF0E6" id="refresh" gravity="center" visibility="gone">
                            <vertical w="100" h="100" padding="10" >
                                <progressbar />
                            </vertical>
                        </linear>
                    </frame>

                    <horizontal>
                        <horizontal id="control2">
                            <spinner id="sp1" entries="单个循环|顺序循环" layout_weight="1" />
                            <button id="startGame" text="开始运行" layout_weight="1" />
                            <button id="refresh" text="刷新列表" layout_weight="1" />
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
    </drawer >
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

ui.refresh.click(function () {
    gameList = [];
    initData();
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
function gameThread(model) {

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
            inputTime=game.get(appName);
            console.log("开始运行"+appName +inputTime+"分钟");

            switch (appName) {
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
                case "一字之差":
                    土豪游戏();
                    break;
            }
            isWait(model);
        }

    })
}

//土豪游戏
function 土豪游戏() {
    while (suspend) {
        isGame(packageName2);
        img = captureScreen();
        endTime = new Date().getTime();
        timeInterval = Math.floor((endTime - startTime) / 1000);
        if (timeInterval > inputTime * 60) {
            suspend = false;
        };
        console.log("运行时间" + timeInterval + "inputTime" + inputTime * 60);
        findImage("土豪游戏", "redenvelope", 0.6, 100, 100, width, height / 2, true);
        findImage("土豪游戏", "receive", 0.6, 0, 0, width, height, true);

        if (findImage("土豪游戏", "redenvelope2", 0.6, 0, 0, width, height, false) != null) {
            sleep(10000);
            app.launchApp("应用商店");
            app.launchApp("华为应用市场");
            sleep(8000);
            findIdButton("search_bar");
            findIdButton("input_icon");
            sleep(5000);
            var et = id("search_src_text").findOnce();
            if (et != null) {
                et.setText("垃圾分类指南");
            }
            sleep(2000);
            findIdButton("hwsearchview_search_text_button");
            findClassNameButton("adnroid.widget.TextView", "垃圾分类指南");
            sleep(2000);
            findClassNameButton("adnroid.widget.TextView", "快速查询垃圾分类");
            sleep(2000)
            findIdButton("detail_download_button");
            findIdButton("detail_download_layout");
            sleep(5000)
        }

        if (findImage("土豪游戏", "open", 0.6, 50, 50, width, height, true) != null) {
            click(device.width / 2, device.height / 2);
        }

        findImage("土豪游戏", "read", 0.6, 0, 0, width / 4, height / 4, true);
        findTextAndClassButton("android.view.View", "| 跳过");
        findImage("土豪游戏", "close", 0.8, 0, 0, width, height / 4, true);
        findCustomizClick("android.widget.ImageView", 8, 5);
        findTextAndClassButton("android.widget.Button", "继续观看");
        findTextAndClassButton("android.widget.TextView", "抓住奖励机会");
        findImage("土豪游戏", "know", 0.6, 50, 50, width, height, true);
        if (findImage("土豪游戏", "receive2", 0.6, 0, 0, width, height, false) != null) {
            findImage("土豪游戏", "receive2", 0.6, 50, 50, width, height, true);
            var packname = getPackageName("垃圾分类指南");
            console.log("应用包名" + packname);
            if (packname != null) {
                sleep(5000);
                app.openAppSetting(packname);
                sleep(5000);
                findIdButton("action_menu_item_child_icon");
                findIdButton("left_button");
                sleep(5000);
                findIdButton("button1");
                sleep(5000);
            }
        };
    }
}

//勾选的游戏的监听
ui.gameList.on("item_bind", function (itemView, itemHolder) {

    itemView.game1.on("check", (checked) => {
        var position = itemHolder.position;

        if (checked) {
            add(gameList[position].appName, gameList[position]);
        } else {
            remove(gameList[position].appName)
        }
    })

    itemView.btn_set.on("click", () => {
        var position = itemHolder.position;
        appName = gameList[position].appName;
        ui.dialogs.setVisibility(0);
        ui.control2.setVisibility(8);
        ui.inputTime.setText(game.get(appName));
        

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
        console.log("找到控件点击" + "x：" + main_gameView.bounds().centerX() + "y：" + main_gameView.bounds().centerY());
        sleep(1000);
    }
}

//根据类名找控件点击
function findClassNameButton(b_view) {
    var main_gameView = className(b_view).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件点击" + "x：" + main_gameView.bounds().centerX() + "y：" + main_gameView.bounds().centerY());
        sleep(1000);
    }
}

//根据text找控件点击
function findTextAndClassButton(b_view, b_text) {
    var main_gameView = className(b_view).text(b_text).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件点击" + "x：" + main_gameView.bounds().centerX() + "y：" + main_gameView.bounds().centerY());
        sleep(1000);
    }
}

//根据子控件找父控件点击
function findFatherButton(b_view, b_text) {

    var main_gameView = className(b_view).text(b_text).findOnce();

    if (main_gameView) {
        var parent = main_gameView.parent();
        press(parent.bounds().centerX(), parent.bounds().centerY(), 1)
        console.log("找到控件点击" + "x：" + main_gameView.bounds().centerX() + "y：" + main_gameView.bounds().centerY());

        sleep(1000);
    }
}

//根据属性className、classNane、drawOrder找控件点击
function findCustomizClick(b_className, b_depth, b_drawingOrder) {
    var main_gameView = className(b_className).depth(b_depth).drawingOrder(b_drawingOrder).findOnce();
    if (main_gameView) {
        press(main_gameView.bounds().centerX(), main_gameView.bounds().centerY(), 1)
        console.log("找到控件点击" + "x：" + main_gameView.bounds().centerX() + "y：" + main_gameView.bounds().centerY());
        sleep(1000);
    }
}

//找图方法
function findImage(gameName, imgName, rate, a, b, r_width, r_height, isClick) {
    var imgPath = "/sdcard/脚本/金多多挂机/jinduoduo-main/res/" + gameName + "/" + imgName + ".jpg";
    var templ = images.read(imgPath);

    var result = images.matchTemplate(img, templ, {
        threshold: rate,
        region: [0, 0, r_width, r_height]
    });

    if (result.matches.length != 0) {
        for (var index = 0; index < result.matches.length; index++) {
            var pp = result.matches[index].point;
            console.log("找到图片" + imgName + pp.x + "," + pp.y);
            if (isClick) {
                click(pp.x + a, pp.y + b);
            } else {
                return pp;
            }
        }
    }
    sleep(500);

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


ui.back.on("click", function () {
    ui.control2.setVisibility(0);
    ui.dialogs.setVisibility(8);
    console.log("返回列表");
})

ui.save.on("click", function () {
    var inputTime = ui.inputTime.text();
    console.log(inputTime)
    game.put(appName, inputTime);
    toast("保存成功");
})

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
        
            startTime = new Date().getTime();

            switch (pattern) {
                case 0:
                    gameThread(0);
                    break;
                case 1:
                    gameThread(1);
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
        ui.run(function () {
            ui.refresh.setVisibility(0);
        })

        var result = bmob.findAll("Game").results;

        console.log("返回数据" + result);

        for (var index = 0; index < result.length; index++) {
            var element = result[index];

            game.put(element.appName, "30");

            if (getAppName(element.packageName) == null) {
                color = "#C0C0C0";
                isClickable = false;
                noDownGameList.push(new Game(element.appName, element.packageName, color, false, "gone", "visible"));
            } else {
                color = "#FFFFFF";
                isClickable = true;
                downGameList.push(new Game(element.appName, element.packageName, color, true, "visible", "gone"));
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
            ui.refresh.setVisibility(8);
        })


    })
}

//是否等待
function isWait(model) {
    if (model == 0) {
        index = 0;
    } else {
        index++;
    }
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






















