cc.Class({
    extends: cc.Component,

    properties: {
        //皮肤图片
        skinImage:{
            default: null,
            visible: false,
        },
        //解锁条件描述
        desc: {
            default: null,
            visible: false,
        },
        //进度
        prosLabel: {
            default: null,
            visible: false,
        },
        //进度条
        prosBar:{
            default: null,
            visible: false,
        },
    },

    onLoad() {
        this.skinImage = cc.find("Bg/Main/Skin/SkinImage", this.node).getComponent(cc.Sprite);
        this.desc = cc.find("Bg/Main/Desc", this.node).getComponent("LocalizedLabel");
        this.prosLabel = cc.find("Bg/Main/Num", this.node).getComponent(cc.Label);
        this.prosBar = cc.find("Bg/Main/Pros", this.node).getComponent(cc.ProgressBar);
    },

    start() {},

    onEnable() {
        this.skinImage.node.active = false;
        this.desc.node.active = false;
        this.prosLabel.node.active = false;
        this.prosBar.node.active =false;
        this.showSkins(skinView.curSkinIdx);
    },

    //加载皮肤
    showSkins(idx) {
        var data = skinView.skinsData[idx];
        resManager.loadSprite("GameSp." + idx + "-card16",function(sf){
            this.skinImage.spriteFrame = sf;
            this.skinImage.node.active = true;
        }.bind(this))
        //描述
        this.desc.dataID = "lang.skin"+idx;
        //进度
        this.prosLabel.string = data.pros+"/"+data.need;
        var pros = data.pros/data.need;
        this.prosBar.progress = pros;
        //显示
        this.desc.node.active = true;
        this.prosLabel.node.active = true;
        this.prosBar.node.active =true;
    },

    update(dt) { },
});
