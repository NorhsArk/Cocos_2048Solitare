// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.pauseViewScript = this;
        this.musicSprite = cc.find("Bg/Btns/Music/Sprite", this.node).getComponent(cc.Sprite);
    },

    start() {

    },

    onEnable() {
        //this.selectView.node.height = 0;
        //声音按钮初始化
        if (soundManager.isOpen) {
            resManager.loadSprite("UIView.musicOnSprite", function (sp) {
                this.musicSprite.spriteFrame = sp;
            }.bind(this));
        } else {
            resManager.loadSprite("UIView.musicOffSprite", function (sp) {
                this.musicSprite.spriteFrame = sp;
            }.bind(this));
        }
    },


    //点击事件处理
    menuClick(event, type) {
        soundManager.playSound("btnClick")
        if (type == "description") {
            viewManager.popView("DescriptionView", true);
        }
        else if (type == "restart") {
            cc.sys.localStorage.setItem("gameData", "0");
            gameViewScript.isGuide = true;
            gameViewScript.gameStart();
            viewManager.popView("PauseView", false);
        }
        else if (type == "music") {
            if (!soundManager.isOpen) {
                soundManager.setIsOpen(true);
                soundManager.setBgOpen(true);
                resManager.loadSprite("UIView.musicOnSprite", function (sp) {
                    this.musicSprite.spriteFrame = sp;
                }.bind(this));
            } else {
                soundManager.setIsOpen(false);
                soundManager.setBgOpen(false);
                resManager.loadSprite("UIView.musicOffSprite", function (sp) {
                    this.musicSprite.spriteFrame = sp;
                }.bind(this));
            }
        }
        else if (type == "back") {
            viewManager.popView("PauseView", false);
            viewManager.showView("GameView", false, true);
            viewManager.showView("MainView", true, false);
        }
    }

    // update (dt) {},
});
