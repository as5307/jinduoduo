function Game(appName, packageName,color,isClickable,isControl,isDown) {
    this.appName = appName;
    this.packageName = packageName;
    this.color = color;
    this.isClickable = isClickable;
    this.isControl=isControl;
    this.isDown=isDown;
}

module.exports=Game;