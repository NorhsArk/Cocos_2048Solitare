cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        window.mainScript = this;
    },

    start() {
        //数据清空包
        //cc.sys.localStorage.setItem("gameData", "0");
    },


    //点击事件处理
    menuClick(event, type) {
        soundManager.playSound("btnClick");
        if (type == "rank") {
            SDK().fbEvent('clickpaihangbangBtn',1);
            viewManager.popView("RankView", true, function (view) {
                //初始化
            }.bind(this));
        }
        else if (type == "share") {
            SDK().fbEvent('clickshareBtn',1);
            gameApplication.onShareBtnClick(null,3);
        } 
        else if (type == "begin") {
            SDK().fbEvent('clickplayBtn',1);
            viewManager.showView("GameView", true, true);
            viewManager.showView("MainView", false, false,null,function(){
            gameViewScript.gameStart();
            }.bind(this));
        }
    },


    update(dt) { },
});
