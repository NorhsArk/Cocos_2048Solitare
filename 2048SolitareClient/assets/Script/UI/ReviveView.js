cc.Class({
    extends: cc.Component,

    properties: {
        //倒计时ui
        timeText: {
            default: null,
            visible: false,
        },
        //倒计时
        timeVal: {
            default: 0,
            visible: false,
        },
        //重玩一局按钮
        shareBtn: {
            default: null,
            visible: false,
        },
        //分享按钮
        videoBtn: {
            default: null,
            visible: false,
        },
        //返回主界面
        jumpBtn: {
            default: null,
            visible: false,
        },
    },

    onLoad() {
        this.timeText = cc.find("Bg/Time/Num", this.node).getComponent(cc.Label);
        this.shareBtn = cc.find("Bg/Share", this.node);
        this.videoBtn = cc.find("Bg/Video", this.node);
        this.jumpBtn = cc.find("Bg/Jump", this.node);
        this.shareBtn.on("click", function (event) {
            this.menuClick(null, "share");
        }.bind(this), this)
        this.videoBtn.on("click", function (event) {
            this.menuClick(null, "video");
        }.bind(this), this)
        this.jumpBtn.on("click", function (event) {
            this.menuClick(null, "jump");
        }.bind(this), this)
    },

    onEnable() {
        this.timeVal = 10;
        this.timeText.string = " " + this.timeVal;
        this.schedule(this.countGameTime, 1, 10);
        this.jumpBtn.active = false;
    },

    onDisable() {
        this.unschedule(this.countGameTime);
    },

    //计算倒计时
    countGameTime() {
        this.timeVal = this.timeVal - 1;
        this.timeText.string = " " + this.timeVal;
        if (this.timeVal == 7) {
            this.jumpBtn.active = true;
        }
        if (this.timeVal == 0) {
            this.menuClick(null, "jump");
        }
    },

    //点击事件处理
    menuClick(event, type) {
        soundManager.playSound("btnClick")
        if (type == "share") {
            SDK().fbEvent('clickshareBtn',1);
            gameApplication.onShareBtnClick(function (isOk) {
                if (isOk) {
                    gameViewScript.boomCard();
                    viewManager.popView("ReviveView", false);
                }
            }.bind(this));
        }
        else if (type == "video") {
            SDK().fbEvent('clickreliveBtn',1);
            gameApplication.onVideoBtnClick(function (isOk) {
                if (isOk) {
                    gameViewScript.boomCard();
                    viewManager.popView("ReviveView", false);
                }
            }.bind(this),3)
        }
        else if (type == "jump") {
            SDK().fbEvent('clickskipBtn',1);
            viewManager.popView("ReviveView", false);
            gameViewScript.clearData();
            gameViewScript.showOver();
        }
    },


    update(dt) { },
});
