cc.Class({
    extends: cc.Component,

    properties: {
        //当前等级ui
        curLvText: {
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
        this.curLvText = cc.find("Bg/Star/Sprite/Level", this.node).getComponent(cc.Label);
        this.okayBtn = cc.find("Bg/Okay", this.node);
        this.okayBtn.on("click", function (event) {
            this.menuClick(null, "Okay");
        }.bind(this), this);
    },

    onEnable() {
        //升级礼花卡片
        var pos = {};
        pos.parent = gameViewScript.levelPro.node.parent;
        pos.position = gameViewScript.levelPro.node.position;
        effectManager.particleShow(pos, 2);
        this.curLvText.string = "LV "+(gameViewScript.levelNum[0]);
    },

    //点击事件处理
    menuClick(event, type) {
        soundManager.playSound("btnClick")
        if (type == "Okay") {
            viewManager.popView("PassView", false);
            gameApplication.onGiftBtnClick(null, 0);
            if(gameViewScript.levelNum[0] % 5 == 0){
                viewManager.popView("SkinView", true);
            }
        }
    },

    update(dt) { },
});
