cc.Class({
    extends: cc.Component,

    properties: {
        //当前分数ui
        curScoreText: {
            default: null,
            visible: false,
        },
        //最佳分数ui
        bestScoreText: {
            default: null,
            visible: false,
        },
        //重玩一局按钮
        restartBtn: {
            default: null,
            visible: false,
        },
        //分享按钮
        shareChallengeBtn: {
            default: null,
            visible: false,
        },
        //返回主界面
        backBtn: {
            default: null,
            visible: false,
        },
        
    },

    onLoad() {
        this.curScoreText = cc.find("Bg/CurText", this.node).getComponent(cc.Label);
        this.bestScoreText = cc.find("Bg/BestScore", this.node).getComponent(cc.Label);
        this.restartBtn = cc.find("Bg/Restart", this.node);
        this.shareChallengeBtn = cc.find("Bg/Challenge", this.node);
        this.backBtn = cc.find("Bg/Back", this.node);
        this.restartBtn.on("click", function (event) {
            this.menuClick(null, "restart");
        }.bind(this), this)
        this.shareChallengeBtn.on("click", function (event) {
            this.menuClick(null, "share");
        }.bind(this), this)
        this.backBtn.on("click", function (event) {
            this.menuClick(null, "back");
        }.bind(this), this)
    },

    onEnable(){
        SDK().fbEvent('showjiesuanUISuccess',1);
        this.bestScoreText.string = gameViewScript.bestScore;
        this.curScoreText.string = gameViewScript.curScore;
        this.scheduleOnce(function(){
            gameApplication.onGiftBtnClick(null,1);
        }.bind(this),1);
    },

    //点击事件处理
    menuClick(event, type) {
        soundManager.playSound("btnClick")
        if (type == "restart") {
            viewManager.popView("GameOver", false, function () { }.bind(this));
            cc.sys.localStorage.setItem("gameData", "0");
            gameViewScript.isGuide = true;
            gameViewScript.gameStart();
        }
        else if (type == "share") {
            SDK().fbEvent('clickchallengeBtn',1);
            gameApplication.onShareBtnClick(null,2);
        }
        else if (type == "back") {
            viewManager.showView("MainView", true, false);
            viewManager.showView("GameView", false, true);
            viewManager.popView("GameOver", false);
            cc.sys.localStorage.setItem("gameData", "0");
            gameViewScript.isGuide = true;
        }
    },

    update(dt) { },
});
