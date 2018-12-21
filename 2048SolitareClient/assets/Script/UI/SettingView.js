
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
        selectView: {
            default: null,
            type: cc.ScrollView,
        },
        curLang: {
            default: null,
            type: cc.Label,
        },
        curSprite: {
            default: null,
            type: cc.Sprite,
        },
        selectContent: {
            default: null,
            type: cc.Node,
        },
        selectItem: {
            default: null,
            type: cc.Node,
        },
        musicToggle: {
            default: [],
            type: [cc.Toggle],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initToggle();
    },

    onEnable() {
        //this.selectView.node.height = 0;
        //声音按钮初始化
        if (soundManager.isBgOpen) {
            this.musicToggle[0].isChecked = true;
        } else {
            this.musicToggle[0].isChecked = false;
        }
        if (soundManager.isOpen) {
            this.musicToggle[1].isChecked = true;
        } else {
            this.musicToggle[1].isChecked = false;
        }
    },

    //初始化语言的选项
    initToggle() {
        SDK().getItem("curLang", function (idx) {
            if (idx == null) {
                idx = 0;
            }
            for (var i = 0; i < window.langArr.length; i = i + 1) {
                var newItem = cc.instantiate(this.selectItem);
                newItem.idx = i;
                newItem.parent = this.selectContent;
                //初始化状态
                newItem.toggle = newItem.getComponent(cc.Toggle);
                if (i != idx) {
                    newItem.toggle.isChecked = false;
                } else {
                    newItem.toggle.isChecked = true;
                    this.curLang.string = window.langArr[i];
                    resManager.loadSprite("UISetting.lang" + i, function (spriteFrame) {
                        this.curSprite.spriteFrame = spriteFrame;
                    }.bind(this));
                }

                //初始化名字
                var name = cc.find("Name", newItem).getComponent(cc.Label);
                name.string = window.langArr[i];

                //设置国家图片
                this.setSprite(newItem, i);

                //初始化处理事件
                newItem.on('toggle', this.languageSelect, this);

                newItem.active = true;
                console.log()
            }
        }.bind(this))
    },

    //设置图片
    setSprite(newItem, i) {
        var sprite = cc.find("Sprite", newItem).getComponent(cc.Sprite);
        //设置国家图片
        resManager.loadSprite("UISetting.lang" + i, function (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }.bind(this));
    },

    languageSelect(event) {
        var item = event.target;
        if (item.toggle.isChecked) {
            this.curLang.string = window.langArr[item.idx];
            //设置国家图片
            resManager.loadSprite("UISetting.lang" + item.idx, function (spriteFrame) {
                this.curSprite.spriteFrame = spriteFrame;
            }.bind(this));
            SDK().setItem({ curLang: item.idx }, function () {
                cc.director.loadScene("loadLanguage");
            }.bind(this));
        }
    },

    menuClick(event, type) {
        gameApplication.soundManager.playSound("btnClick");
        if (type == "music") {
            if (this.musicToggle[0].isChecked) {
                soundManager.setBgOpen(true);
            } else {
                soundManager.setBgOpen(false);
            }
        }
        else if (type == "sound") {
            if (this.musicToggle[1].isChecked) {
                soundManager.setIsOpen(true);
            } else {
                soundManager.setIsOpen(false);
            }
        }
        else if (type == "select") {
            var length = 400;
            if (Math.abs(this.selectView.node.height - length) < 0.01) {
                viewManager.lerpAction(length, -length, 0.3, function (ob) {
                    this.selectView.node.height = ob.x;
                    if (Math.abs(this.selectView.node.height - 0) < 1) {
                        this.selectView.node.height = 0;
                    }
                }.bind(this))
            } else if (Math.abs(this.selectView.node.height - 0) < 0.01) {
                viewManager.lerpAction(0, length, 0.3, function (ob) {
                    this.selectView.node.height = ob.x;
                    if (Math.abs(this.selectView.node.height - length) < 1) {
                        this.selectView.node.height = length;
                    }
                }.bind(this))
            }
        }
    },

    start() {

    },

    // update (dt) {},
});
