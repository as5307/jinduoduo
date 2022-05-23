"ui";
importClass(android.graphics.drawable.GradientDrawable.Orientation);
importClass(android.graphics.drawable.GradientDrawable);
importClass(java.net.URL);
importClass(java.io.FileOutputStream);

var game;
var fb;
var autoDialog;
var rb;

var packageName;
var appName;
var color

var runThread;
var inputTime;
var index;
var suspend;
wait = false;
isRun = 0;


d_width = device.width;
d_height = device.height;

var point;
var rect;
bigImgPath = "/sdcard/jinduoduo-main/res/截屏/jieping.jpg";
listView = [];

serverItemView = [];
initStorages();

serverList = [
    {
        title: "无障碍服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: auto.service != null
    },
    {
        title: "保持前台服务",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("reception_isShow", false)
    },
    {
        title: "显示控制台",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("console_isShow", false)
    }
];

recordList = [
    {
        title: "悬浮窗",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("dialog_isShow", true)
    },
    {
        title: "音量下键关闭",
        icon: "@drawable/ic_android_black_48dp",
        isShow: game.get("down_isShow", false)
    }
];

otherList = [
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

downGameList = [];
noDownGameList = [];
gameList = [];
checkGameList = [];

var img;
var pattern;

//初始化下载参数
running = false
byteSum = 0; //总共读取的文件大小
byteRead = 0; //每次读取的byte数
buffer = util.java.array('byte', 1024); //byte[]

var filePath;
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
                            <card w="*" h="55" margin="10 5" cardCornerRadius="2dp" layout_gravity="center" id="gameCard"  >
                                <horizontal h="*" >
                                    <View bg="#4caf50" h="*" w="10" />
                                    {/* <radio textSize="15" id="game1" text="{{this.appName}}" layout_gravity="center" layout_weight="1"/> */}
                                    <checkbox id="game1" textSize="15" text="{{this.appName}}" layout_gravity="center" layout_weight="1" />
                                    <text text="运行" />
                                    <input inputType="number" id="inputTime" text="30" />
                                    <text text="分钟" />
                                    <button id="longBottom" text="安装" h="40" w="70" layout_gravity="center" />
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

initRequire();
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

//服务选择
ui.server_menu.on("item_bind", function (itemView, itemHolder) {
    serverItemView.push(itemView);
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
                        console.setPosition(d_width * 0.2, 0);

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
    if (serverItemView.length > 0) {
        serverItemView[0].isShow.checked = auto.service != null;
    }
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
//     checkGameList = [];
//     initData();
// })

// ui.save.click(function () {
//     for (var index = 0; index < listView.length; index++) {
//         var element = listView[index];
//         var runTime = element.inputTime.text();
//         var appName = gameList[index].appName;
//         game.put(gameList[index].appName, runTime)
//     }
//     toast("保存成功")
// })

//检测是否在游戏界面
function isBackGame() {
    var packname = getPackageName(appName);
    rect = packageName(packname).findOnce();
    if (rect == null) {
        console.log("返回到本游戏界面");
        app.launchPackage(packname);
        frequency = 0;
        sleep(3000)
    }
}

//运行游戏的线程
function gameThread() {
    runThread = threads.start(function () {
        var element;
        auto.waitFor();
        if (!requestScreenCapture()) {
            console.log("请求截图失败");
            exit();
        };
        for (index = 0; index < checkGameList.length;) {
            console.log("index" + index)
            element = checkGameList[index];
            appName = element.appName;
            packagenName = getPackageName(appName);
            console.log("开始运行：" + appName);
            ui.run(function () {
                runTime(parseInt(game.get(appName)));
            })
            switch (appName) {
                case "快手极速版":
                    快手极速版();
                    break;
                case "薅到你破产":
                    启点通用();
                    break;
                case "消除高手":
                    启点通用();
                    break;
                case "拜托别消我":
                    启点通用();
                    break;
                case "逆袭之王":
                    启点通用();
                    break;
                case "开心消消消":
                    开心消消消();
                    break;

            }
            isWait();
        }
    })
}

//快手极速版
function 快手极速版() {
    while (suspend) {
        isBackGame();
        if (findTextButton("福利") != null) {
            pressRect(findTextButton("福利"));
            sleep(40000);
            pressRect(findIdButton("video_close_icon"));
            pressRect(findTextButton("已成功领取奖励"));
            pressRect(findTextButton("放弃奖励"));
        } else if (findTextButton("再看一个") != null) {
            pressRect(findTextButton("再看一个"));
            sleep(40000);
        } else if (findTextButton("领福利") != null && isSee) {
            pressRect(findTextButton("领福利"));
            sleep(65000);
            click(d_width / 2, d_height / 2);
            sleep(1000)
            pressRect(findIdButton("live_close_place_holder"));
            sleep(1000);
            pressRect(findTextButton("退出"));
            sleep(1000);
            pressRect(findTextButton("退出直播间"));
            sleep(1000);
        } else {
            slideScreenDown(d_width / 2, d_height * 0.6, d_width / 2, 0, 100, 1);
        }
    }
}
// //长沙嘟游
// function 长沙嘟游() {
//     while (suspend) {
//         isBackGame();
//         img = captureScreen();
//         pressRect(findIdButton("btn"));
//         pressRect(findTextContains("允许", 1));
//         pressRect(findCustomizButton("红包群", 10, 1));
//         pressRect(findCustomizButton("世界群", 12, 3));

//         pressRect(findIdButton("text_switcher"));

//         point = findImage("长沙嘟游", "redenvelope", 0.6, 0, 0, d_width, d_height);
//         pressPoint(point, 0, 0);

//         if (findIdButton("getRedBagRl") != null) {
//             sleep(5000);
//             pressRect(findIdButton("getRedBagRl"));
//         }

//         point = findImage("关闭广告", "read", 0.6, 0, 0, d_width, d_height);

//         if (point != null) {
//             click(d_width / 4, d_height * 0.1);
//         }
//         point = findImage("关闭广告", "close", 0.6, d_width * 0.85, 0, d_width * 0.15, d_height * 0.09);
//         pressPoint(point, 0, 0);


//         if (findIdButton("sure") != null || findTextButton("坚持退出") != null) {
//             pressRect(findIdButton("sure"));
//             closeData();
//         }
//     }
// }


//启点通用
function 启点通用() {
    while (suspend) {
        isBackGame();
        img = captureScreen();
        images.saveImage(img, bigImgPath);
        if (frequency > 10) {
            back();
            back();
        }
        point = findImage("启点通用", "start", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            pressPoint(point, 100, 100);
            frequency++;
        }
        point = findImage("启点通用", "withdrawal", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            pressPoint(point, 50, 50);
            frequency++;
        }

        point = findImage("启点通用", "withdrawal2", 0.7, 0, 0, d_width, d_height / 2);
        if (point != null) {
            pressPoint(point, 0, 0);
            frequency++;
        }

        point = findImage("启点通用", "ok", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 100, 100);


        point = findImage("启点通用", "watch", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            pressPoint(point, 0, 0);
            frequency++;
        }

        point = findImage("关闭广告", "read", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            click(d_width / 4, d_height * 0.1);

        }
        point = findImage("关闭广告", "close", 0.6, d_width * 0.7, 0, d_width * 0.3, d_height);
        if (point != null) {
            pressPoint(point, 0, 0);
            frequency = 0;
        }
        point = findImage("启点通用", "withdrawal3", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            pressPoint(point, 100, 100);
            frequency++;
        }

        if (findTextButton("应用详情") != null || findTextButton("点击查看详情") != null) {
            back();
        }

        pressRect(findIdButton("ksad_kwad_web_navi_close"));
        pressRect(findTextButton("残忍离开"));
        pressRect(findTextButton("坚持退出"));
        pressRect(findTextContains("跳过", 0));

    }
}

//开心消消乐
function 开心消消消() {
    while (suspend) {
        isBackGame();
        img = captureScreen();
        images.saveImage(img, bigImgPath);
        point = findImage("开心消消消", "redenvelope", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 0, 0);

        point = findImage("开心消消消", "receive", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 100, 100);

        point = findImage("关闭广告", "read", 0.6, 0, 0, d_width, d_height);
        if (point != null) {
            click(d_width / 4, d_height * 0.1);
        }
        point = findImage("关闭广告", "close", 0.6, d_width * 0.7, 0, d_width * 0.3, d_height);
        pressPoint(point, 0, 0);
        
        point = findImage("关闭广告", "close2", 0.8, d_width * 0.7, 0, d_width * 0.3, d_height);
        pressPoint(point, 50, 50);    
        
        point = findImage("开心消消消", "accept", 0.6, 0, 0, d_width, d_height);
        pressPoint(point, 100, 100);  

        if (findTextButton("应用详情") != null || findTextButton("点击查看详情") != null) {
            back();
        }
        pressRect(findIdButton("ksad_kwad_web_navi_close"));
        pressRect(findIdButton("tt_bu_close"));
        pressRect(findTextButton("残忍离开"));
        pressRect(findTextButton("坚持退出"));
        pressRect(findTextContains("跳过", 0));

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

//勾选的游戏的监听
ui.gameList.on("item_bind", function (itemView, itemHolder) {
    itemView.game1.on("check", (checked) => {
        var position = itemHolder.position;
        if (checked) {
            pattern = ui.spl.getSelectedItemPosition();
            checkGameList.splice(position, 0, gameList[position]);
            //对象数组进行排序
            checkGameList = checkGameList.sort(compare("serial"));
            console.log(checkGameList);
        } else {
            if (checkGameList.length >= 1) {
                for (let index = 0; index < checkGameList.length; index++) {
                    if (checkGameList[index].appName == gameList[position].appName) {
                        checkGameList.splice(index, 1);
                    }
                }
            }
            console.log(checkGameList);

        }
    })

    // itemView.longBottom.on("click", () => {
    //     var position = itemHolder.position;
    //     if (gameList[position].isClickable) {
    //         toast("已经安装")
    //     } else {
    //         if (running) {
    //             toast("已经在安装中")
    //             return
    //         }
    //         // if (files.exists(filePath)) {
    //         //     ui.longBottom.text("下载完成")
    //         //     gradientDrawable.setColors(colorArr, [1, 0]);
    //         //     ui.longBottom.setBackground(gradientDrawable);
    //         //     app.viewFile(filePath)
    //         //     return
    //         // }
    //         // toast("注意你的流量哦")
    //         progress = 0
    //         running = true
    //         //开始下载
    //         let setProgress = setInterval(() => {
    //             itemView.longBottom.text((progress * 100).toFixed(1) + "%")
    //             if (progress >= 1) {
    //                 running = false
    //                 clearInterval(setProgress)
    //                 toast("下载完成");

    //                 //读入文件
    //                 var newApkFile = new File(filePath);
    //                 var intent = new Intent(Intent.ACTION_VIEW);
    //                 intent.addCategory(Intent.CATEGORY_DEFAULT);
    //                 intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    //                 var type = "application/vnd.android.package-archive";
    //                 var uri;
    //                 if (device.sdkInt > 23) {
    //                     //创建url
    //                     uri = Packages["androidx"].core.content.FileProvider.getUriForFile(context, app.fileProviderAuthority, newApkFile);
    //                     intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    //                 } else {
    //                     uri = Uri.fromFile(newApkFile);
    //                 }
    //                 intent.setDataAndType(uri, type);
    //                 app.startActivity(intent);
    //             }
    //         }, 20)

    //         threads.start(function () {
    //             filePath = files.path("./" + gameList[position].appName + ".apk");
    //             var myUrl = new URL(gameList[position].url);
    //             var conn = myUrl.openConnection(); //URLConnection
    //             inStream = conn.getInputStream(); //InputStream
    //             fs = new FileOutputStream(filePath); //FileOutputStream
    //             connLength = conn.getContentLength(); //int
    //             while ((byteRead = inStream.read(buffer)) != -1) {
    //                 byteSum += byteRead;
    //                 fs.write(buffer, 0, byteRead); //读取
    //                 progress = byteSum / connLength;
    //             }
    //         })
    //     }
    // })
})

function compare(key) {
    return function (a, b) {
        var c = a[key];
        var d = b[key];
        if (c < d) {
            return 1
        } else {
            return -1
        }
    }
}

//根据id找控件点击
function findIdButton(b_id) {
    rect = id(b_id).findOnce();
    if (rect != null) {
        console.log("找到id控件：" + "坐标" + "：" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect
    }
    return null;
}

//根据text找控件点击
function findTextButton(b_text) {
    rect = text(b_text).findOnce();
    if (rect != null) {
        console.log("找到“+b_text+”控件：" + "坐标" + "：" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect;
    }
    return null
}

function findTextContains(b_text, i) {
    rect = textContains(b_text).findOnce(i);
    if (rect != null) {
        console.log("找到“+b_text+”匹配控件：" + "坐标" + "：" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
        return rect;
    }
    return null;
}

// //根据属性className、classNane、drawOrder找控件点击
// function findCustomizButton(b_className, b_depth, b_drawingOrder) {
//     rect = className(b_className).depth(b_depth).drawingOrder(b_drawingOrder).findOnce();
//     if (rect != null) {
//         console.log("找到控件坐标" + "(" + rect.bounds().centerX() + "," + rect.bounds().centerY() + ")");
//         return rect;
//     }
//     return null;
// }

//找图方法
function findImage(gameName, imgName, rate, s_width, s_height, r_width, r_height) {
    var imgPath = "/sdcard/jinduoduo-main/res/" + gameName + "/" + imgName + ".jpg";
    var templ = images.read(imgPath);
    var bigImg = images.read(bigImgPath)
    point = images.findImage(bigImg, templ, {
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
    // fb.setIcon('http://www.autojs.org/assets/uploads/profile/3-profileavatar.png');
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
    if (isRun == 0) {
        // console.log("开始运行");
        if (checkGameList.length != 0) {
            ui.startGame.setText("停止运行");
            rb.setIcon('@drawable/ic_stop_black_48dp');
            rb.setTint('#FFFFFF');
            rb.setColor('#ED524E');
            isRun = 1;
            wait = false;
            suspend = true;
            gameThread();
        } else {
            toast("没有选择执行的脚本")
        }
    } else if (isRun == 1) {
        // console.log("停止运行");
        ui.startGame.setText("继续运行");;
        rb.setIcon('@drawable/ic_play_arrow_black_48dp');
        rb.setTint('#FFFFFF');
        rb.setColor('#41A4F5');
        suspend = false;
        isRun = 2;
        wait = true;
        closeCurrentPackage();
    } else {
        // console.log("继续运行");
        if (checkGameList.length != 0) {
            ui.startGame.setText("停止运行");
            rb.setIcon('@drawable/ic_stop_black_48dp');
            rb.setTint('#FFFFFF');
            rb.setColor('#ED524E');
            isRun = 1;
            wait = false;
            suspend = true;
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
        // console.log("运行了" + i + "s");
        if (i >= timeout * 60) {
            if (pattern == 0) {
                suspend = true;
                i = 0;
            } else {
                suspend = false;
            }
        }
    }, 1000);
}
//初始化无障碍弹窗
function initAutoDialog() {
    autoDialog = dialogs.build({
        title: "需要启动无障碍权限服务",
        content: "软件需要打开\"无障碍服务\"才能运行,请在随后的设置中选择Auto.js并开启服务。你也可以稍后在侧拉菜单设置",
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
        var packname = getPackageName(appName);
        app.openAppSetting(packname);
        pressRect(findTextButton("强行停止"));
        pressRect(findTextButton("结束运行"));
        sleep(1000);
        pressRect(findTextButton("强行停止"));
        pressRect(findTextButton("确定"));
        sleep(1000);
        app.launchPackage("com.jinduoduo.guaji");
    })
}

//清除数据
function closeData() {
    var packname = getPackageName(appName);
    app.openAppSetting(packname);
    sleep(5000);
    pressRect(findTextButton("存储"));
    sleep(2000);
    pressRect(findTextButton("删除数据"));
    sleep(2000);
    pressRect(findTextButton("确定"));
    sleep("5000")
}

//初始化脚本列表数据
function initData() {
    var bmob = new Bmob("https://api2.bmob.cn/1", "a4a599f95c785c5dcc649a6973bfbc78", "90827b1b837cc3d1b02fde1b2d7b81da");
    threads.start(function () {
        ui.run(function () {
            ui.refresh.setVisibility(0);
        })
        var result = bmob.findAll("Game").results;
        for (var index = 0; index < result.length; index++) {
            var element = result[index];
            game.put(element.appName, "30");
            if (getPackageName(element.appName) == null) {
                noDownGameList.push(new Game(element.appName, element.url, element.serial));
            } else {
                downGameList.push(new Game(element.appName, element.url, element.serial));
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
    game.put("isShow", true);
}


//引用资源
function initRequire() {
    require("/sdcard/jinduoduo-main/FloatButton/FloatButton.js");
    Bmob = require("/sdcard/jinduoduo-main/bmob.js");
    Game = require("/sdcard/jinduoduo-main/game.js");
}

//
function setDrawable(view) {
    let gradientDrawable = new GradientDrawable()
    let colorArr = [colors.GREEN, colors.TRANSPARENT]
    gradientDrawable.setCornerRadius(50);
    gradientDrawable.setStroke(3, colors.parseColor("#000000"));
    gradientDrawable.setOrientation(GradientDrawable$Orientation.LEFT_RIGHT);
    view.setBackground(gradientDrawable);
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
        index = 0;
        // console.log("等待中。。")
    }
    // console.log("退出");
}
/**
 * 屏幕滑动
 */
function slideScreenDown(startX, startY, endX, endY, pressTime, second) {
    for (let index = 0; index < second; index++) {
        console.log("滑动屏幕")
        swipe(startX, startY, endX, endY, pressTime);
        var delayTime = random(4000, 8000);
        sleep(delayTime);
    }
}
