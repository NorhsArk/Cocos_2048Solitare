cc.Class({
    extends: cc.Component,

    properties: {
        //皮肤组的内容UI
        SkinsContent: {
            default: null,
            visible: false,
        },
        //皮肤的预制件
        SkinItem: {
            default: null,
            visible: false,
        },
        //解锁数量UI
        unlockNum: {
            default: null,
            visible: false,
        },
        curSkinIdx: {
            default: 0,
            visible: false,
        },
        skinCount: {
            default: 0,
            visible: false,
        },
        skinsData: {
            default: [],
            visible: false,
        },
        skinsList: {
            default: [],
            visible: false,
        },
        select:{
            default: null,
            visible: false,
        },
        skinsNew: {
            default: [],
            visible: false,
        },
    },

    onLoad() {
        window.skinView = this;
        this.SkinsContent = cc.find("Bg/Main/Skins/view/content", this.node).getComponent(cc.Layout);
        this.SkinItem = cc.find("Bg/Main/Skins/view/content/SkinItem", this.node);
        this.SkinsContent.spacingX = (this.SkinsContent.node.width - (130 * 3)) * 0.5;
        this.unlockNum = cc.find("Bg/Main/Unlock/Num", this.node).getComponent(cc.Label);
        this.skinsData = gameViewScript.skinsData;
        this.skinsNew = gameViewScript.skinsNew;
    },

    start() {
        var titel = cc.find("Bg/Main/Titel", this.node);
        titel.active = true;
    },

    onEnable() {
        this.skinCount = 0;
        this.unlockNum.string = this.skinCount + "/" + this.skinsData.length;
        this.scheduleOnce(function(){
            if (this.skinsData != null && this.skinsData != undefined) {
                this.showSkins();
            }
        }.bind(this),0.5);
    },

    onDisable() {
    },


    showSkins() {
        for (var i = 0; i < this.skinsData.length; i = i + 1) {
            this.loadSkinItem(i);
        }
    },

    loadSkinItem(idx) {
        var item = this.skinsList[idx];
        if (item == null) {
            item = {};
            item.main = cc.instantiate(this.SkinItem);
            item.pros = cc.find("Pros", item.main).getComponent("LocalizedLabel");
            item.pros.dataID = "lang.skin" + idx;
            item.skinImage = cc.find("SkinImage", item.main).getComponent(cc.Sprite);
            item.select = cc.find("Select", item.main);
            item.lockSprite = cc.find("LockSprite", item.main);
            item.newSprite = cc.find("NewSprite", item.main);
            resManager.loadSprite("GameSp." + idx + "-card16", function (sf) {
                item.skinImage.spriteFrame = sf;
            }.bind(this))
            item.main.parent = this.SkinsContent.node;
            this.skinsList[idx] = item;
            item.main.on("click", function (event) {
                soundManager.playSound("btnClick");
                //满足条件
                if (gameViewScript.levelNum[0] >= this.skinsData[idx].need) {
                    if(gameViewScript.curSkinIdx != "N"){
                        this.skinsList[gameViewScript.curSkinIdx].select.active = false;
                    }
                    this.curSkinIdx = idx;
                    item.select.active = true;

                    gameViewScript.loadSkin(idx);
                    this.skinsNew[idx]  = 1;
                    item.newSprite.active = false;
                    dataManager.setStore("SkinNew",this.skinsNew);
                }
            }.bind(this));
        }
        if(gameViewScript.curSkinIdx == idx){
            item.select.active = true;
        }else{
            item.select.active = false;
        }
        var pros = gameViewScript.levelNum[0] / this.skinsData[idx].need;
        if (pros >= 1) {
            item.lockSprite.active = false;
            item.skinImage.node.active = true;
            this.skinCount = 1 + this.skinCount;
            this.unlockNum.string = this.skinCount + "/" + this.skinsData.length;
            item.pros.node.active = false;
            if(this.skinsNew[idx] == 0){
                item.newSprite.active = true;
            }else{
                item.newSprite.active = false;
            }
        } else {
            item.lockSprite.active = true;
            item.skinImage.node.active = false;
            item.pros.node.active = true;
            item.newSprite.active = false;
        }
        item.main.active = true;
    },


    update(dt) { 
    },
});
