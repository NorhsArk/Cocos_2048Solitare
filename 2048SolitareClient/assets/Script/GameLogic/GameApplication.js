//var DataAnalytics = require("../SDK/DataAnalytics");
cc.Class({
    extends: cc.Component,

    properties: {
        viewManager: {
            default: null,
            visible: false,
        },
        resManager: {
            default: null,
            visible: false,
        },
        soundManager: {
            default: null,
            visible: false,
        },
        effectManager: {
            default: null,
            visible: false,
        },
        dataManager: {
            default: null,
            visible: false,
        },
        player: {
            default: null,
            visible: false,
        },
        _playTimes: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        playTimes: {
            get: function () {
                return this._playTimes;
            },
            set: function (val) {
                this._playTimes = val;
                SDK().plusPlayTimes();
            },
            visible: false,
        },
        unitCof: {
            default: null,
            visible: false,
        },
    },

    onDestroy() {
        //DataAnalytics.levelResult(true, { level: "gameTime" })
        //DataAnalytics.logout(SDK().getSelfInfo().id);
    },

    onLoad() {
        cc.director.setDisplayStats(false);
        this.unitCof = [0, "K", "M", "B", "T"];

        /* this.DataAnalytics = DataAnalytics;
        DataAnalytics.init();*/
        SDK().init(function () {
            //DataAnalytics.login(SDK().getSelfInfo().id);
            //DataAnalytics.levelBegin({ level: "gameTime" })
        });

        //初始化各系统脚本
        window.gameApplication = this;
        this.resManager = this.node.addComponent("ResManager");
        this.soundManager = this.node.addComponent("SoundManager");
        this.viewManager = this.node.addComponent("ViewManager");
        this.effectManager = this.node.addComponent("EffectManager");
        this.dataManager = this.node.addComponent("DataManager");
        //this.player = this.node.addComponent("Player");

        //后台运行处理
        cc.game.on(cc.game.EVENT_HIDE, function () {
            //DataAnalytics.gameHideAndShow(true);
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            //DataAnalytics.gameHideAndShow(false);
            cc.audioEngine.resumeAll();
        });
    },


    start() {
        //初始化语言
        SDK().getItem("curLang", function (idx) {
            if (idx == null) {
                idx = 0;
            }
            this.setLanguage(window.nameArr[idx]);
        }.bind(this))

        //显示游戏界面
        viewManager.showView("GameView", true, true);
        viewManager.showView("MainView", false, false);
    },

    //设置语言
    setLanguage(language) {
        const i18n = require('LanguageData');
        i18n.init(language);
    },

    //插屏广告按钮
    onGiftBtnClick(cb, type) {
        SDK().showInterstitialAd(
            function (isCompleted) {
                if (isCompleted) {
                    cb(true);
                } else {
                    console.log("没有观看成功")
                }
            }.bind(this), type);
    },


    //视频奖励
    onVideoBtnClick(cb, type) {
        SDK().fbEvent('clicwatchBtn', 1);
        SDK().showVideoAd(
            function (isCompleted) {
                if (isCompleted) {
                    //gameApplication.DataAnalytics.doEvent("Video");
                    if (cb != null) {
                        cb(true);
                    }
                } else {
                    console.log("没有观看成功")
                    var shareType = type;
                    if (type <= 3) {
                        this.videoTurnShare(cb, 0);
                    } else {
                        this.fbFail(1)
                    }
                    if (cb != null) {
                        cb(false);
                    }
                }
            }.bind(this)
            , type);
    },

    //检查日常次数限制
    checkDailyCount(key, isAdd, cb) {
        var myDate = new Date();
        let month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        SDK().getItem(month + "_" + day + "_" + key, function (val) {
            if (val == null) {
                val = 0;
            }
            val = parseInt(val);
            if (isAdd) {
                val = val + 1
                var param = {};
                param[month + "_" + day + "_" + key] = val;
                SDK().setItem(param);
            }
            if (cb != null) {
                cb(val);
            }
        })
    },

    //分享按钮
    onShareBtnClick(cb, type) {
        //gameApplication.DataAnalytics.doEvent("ShareBegin");
        SDK().share(0, function (isCompleted) {
            if (isCompleted) {//分享激励
                //console.log("share:" + val);
                //gameApplication.DataAnalytics.doEvent("Share");
                if (cb != null) {
                    cb(true)
                }
            } else {
                this.fbFail(2);
            }
        }.bind(this), type);

        SDK().getItem("bestScore", function (val) {
            if (val == null || val == undefined) {
                val = 0;
            }
        }.bind(this));
    },

    //FB失败界面
    fbFail(type) {
        viewManager.popView("FbFail", true, function (view) {
            if (type == 1) {
                view.getChildByName("Bg").getChildByName("VideoText").active = true;
                view.getChildByName("Bg").getChildByName("ShareText").active = false;
            } else {
                view.getChildByName("Bg").getChildByName("VideoText").active = false;
                view.getChildByName("Bg").getChildByName("ShareText").active = true;
            }
            view.active = true;
        }.bind(this));
    },

    //视频转分享
    videoTurnShare(cb) {
        viewManager.popView("VideoTurnShare", true, function (view) {
            let ok = cc.find("Bg/Ok", view);
            ok.off("click")
            ok.on("click", function (event) {
                this.onShareBtnClick(function (isOk) {
                    if (isOk) {
                        cb(true);
                        viewManager.popView("VideoTurnShare", false);
                    }
                }.bind(this), 1);
            }, this);
        }.bind(this));
    },

    //提示窗
    warnTips(dID, closeCb) {
        viewManager.popView("WarnView", true, function (view) {
            var text = cc.find("Bg/Text", view).getComponent("LocalizedLabel");
            text.dataID = dID;
            let close = cc.find("Bg/Close", view);
            close.on("click", function (event) {
                if (closeCb != null) {
                    closeCb();
                    closeCb = null;
                }
            }, this);
        }.bind(this));
    },


    //互推按钮事件
    popClick(event, type) {
        SDK().switchGameAsync(type);
    },

    //获取当前时间
    getCurTime() {
        var nowTime = new Date().getTime() / 1000;
        return parseFloat(nowTime);
    },

    //计算时间
    countTime(time) {
        var tempMin = time / 60;
        var hor = 0;
        if (tempMin >= 60) {
            var count = Math.floor(tempMin / 60);
            hor = count;
            tempMin = (tempMin % 60);
        }
        var min = tempMin < 10 ? "0" + Math.floor(tempMin) : "" + Math.floor(tempMin);
        var sec = time % 60 < 10 ? "0" + Math.floor(time % 60) : "" + Math.floor(time % 60);
        if (time <= 0) {
            min = "00";
            sec = "00"
        }
        var string;
        if (hor > 0) {
            string = hor + ":" + min + ":" + sec;
        } else {
            string = min + ":" + sec;
        }
        return [string, hor, min, sec];
    },

    //计算单位
    countUnit(num) {
        var old = num;
        var unit = 0;
        while (num >= 10000) {
            num = num * 0.001;
            unit = unit + 1;
        }
        var money = num;
        if (unit > 0) {
            money = money.toFixed(1);
        }
        return [money, unit, ("$" + money + gameApplication.unitCof[unit]), (money + gameApplication.unitCof[unit])];
    },

    update(dt) {
        //监测时间
    },
});
