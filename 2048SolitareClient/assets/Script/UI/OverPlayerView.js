cc.Class({
    extends: cc.Component,

    properties: {
        //当前等级ui
        myHead: {
            default: null,
            visible: false,
        },
        overHead: {
            default: null,
            visible: false,
        },
        //关闭按钮
        okayBtn: {
            default: null,
            visible: false,
        },

    },

    onLoad() {
        this.myHead = cc.find("Bg/MyHead/Sprite", this.node).getComponent(cc.Sprite);
        this.overHead = cc.find("Bg/OverHead/Sprite", this.node).getComponent(cc.Sprite);
        this.okayBtn = cc.find("Bg/Continue", this.node);
        this.myHead.spriteFrame = SDK().MyPlayer.head;
    },

    onEnable() {
        //升级礼花卡片
        var pos = {};
        pos.parent = gameViewScript.levelPro.node.parent;
        pos.position = gameViewScript.levelPro.node.position;
        effectManager.particleShow(pos, 2);
    },

    onDisable(){
        this.okayBtn.off("click");
    },

    overPlayer(overID){
        cc.loader.load(gameViewScript.friends[overID].headUrl, function (err, texture) {
            this.overHead.spriteFrame = new cc.SpriteFrame(texture);
            this.okayBtn.on("click",function(){
                soundManager.playSound("btnClick");
                SDK().playWith(gameViewScript.friends[overID].id, null, function (isCompleted) {
                    gameApplication.onGiftBtnClick(null, 0);
                }.bind(this));
                viewManager.popView("OverPlayerView", false);
            }.bind(this));
        }.bind(this));
    },


    update(dt) { },
});
