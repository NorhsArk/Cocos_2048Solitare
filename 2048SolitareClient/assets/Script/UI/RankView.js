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
        content: {
            default: null,
            type: cc.Node,
        },
        //头像储存
        headSpriteList: {
            default: {},
            visible: false,
        },
        btns:{
            default: [],
            type: [cc.Toggle],
        },
        //储存用户信息列表
        worldPlayer: {
            default: [],
            visible: false,
        },
        friendPlayer: {
            default: [],
            visible: false,
        },
        //储存用户UI列表
        uiPlayer: {
            default: [],
            visible: false,
        },
        player: {
            default: null,
            type: cc.Node,
        },
        selfHead:{
            default: null,
            type: cc.Sprite,
        },
        selfLevel:{
            default: null,
            type: cc.Label,
        },
        selfNo:{
            default: null,
            type: cc.Label,
        },
        selfName:{
            default: null,
            type: cc.Label,
        },
        selfScore:{
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    onEnable() {
        this.LoadRank();
    },

    //按钮点击事件
    menuClick(event, type) {
        soundManager.playSound("btnClick");
        if (type == "friend") {
            if(this.btns[0] != undefined){
                this.btns[0].isChecked = false;
            }
            if (this.friendPlayer != null && this.friendPlayer.length > 0) {
                this.getRank(this.friendPlayer, 2);
            } else {
                SDK().getFriendRank(2, function (list) {
                    this.friendPlayer = list;
                    this.getRank(list, 2);
                }.bind(this));
            }
        } else if (type == "world") {
            if(this.btns[1] != undefined){
                this.btns[1].isChecked = false;
            }
            if (this.worldPlayer != null && this.worldPlayer.length > 0) {
                this.getRank(this.worldPlayer, 1);
            } else {
                SDK().getWorldRank(2, 50, 0, function (list) {
                    this.getRank(list, 1);
                    this.worldPlayer = list;
                }.bind(this));
            }
        } else if (type == "share") {
            gameApplication.onShareBtnClick(null,4);
        }
    },

    //加载榜单
    LoadRank() {
        SDK().getWorldRank(2, 50, 0, function (list) {
            this.worldPlayer = list;
            if(this.btns[0] != undefined){
                if(this.btns[0].isChecked){
                    this.menuClick(null, "world");
                }
            }
        }.bind(this)); 
        SDK().getFriendRank(2, function (list) {
            this.friendPlayer = list;
            if(this.btns[1] == undefined){
                this.menuClick(null, "friend");
            }else if(this.btns[1].isChecked){
                this.menuClick(null, "friend");
            }
        }.bind(this));
    },

    //排行榜
    getRank(list, type) {
        var isOnRank = false;
        var curList = list;
        for (var i = 0; i < curList.length; i = i + 1) {
            if (this.LoadRankData(i, curList[i], type)) {
                isOnRank = true;
            }
        }
        //如果自己不在榜单上就将自己加载最后
        var listLength = curList.length;
        if (!isOnRank && type == 1) {
            SDK().getRankScore(2, function (info) {
                if (info != undefined || info != null) {
                    this.LoadRankData(listLength - 1, info);
                    listLength = listLength + 1;
                }
                if (listLength < this.uiPlayer.length) {
                    for (var i = curList.length; i < this.uiPlayer.length; i = i + 1) {
                        this.uiPlayer[i].playerBar.active = false;
                    }
                }
            }.bind(this))
        } else {
            //隐藏多余的榜单
            if (listLength < this.uiPlayer.length) {
                for (var i = curList.length; i < this.uiPlayer.length; i = i + 1) {
                    this.uiPlayer[i].playerBar.active = false;
                }
            }
        }
    },

    //将玩家信息加载到第I排
    LoadRankData(i, playerData, type) {
        var isOnRank = false;
        var playerBar;
        var mainBg;
        var No;
        var Score;
        var Mask;
        var Level;
        var Head;
        var Name;
        var Play;
        if (i >= this.uiPlayer.length) {
            playerBar = cc.instantiate(this.player);
            mainBg = playerBar.getChildByName("Bg").getComponent(cc.Sprite);
            No = playerBar.getChildByName("No").getComponent(cc.Label);
            Score = playerBar.getChildByName("Money").getChildByName("Val").getComponent(cc.Label);
            Mask = playerBar.getChildByName("Head").getComponent(cc.Sprite);
            Level = playerBar.getChildByName("Head").getChildByName("Level").getComponent(cc.Label);
            Head = playerBar.getChildByName("Sprite").getComponent(cc.Sprite);
            Name = playerBar.getChildByName("Name").getComponent(cc.Label);
            Play = playerBar.getChildByName("Play");
            this.uiPlayer[i] = {};
            this.uiPlayer[i].playerBar = playerBar;
            this.uiPlayer[i].mainBg = mainBg;
            this.uiPlayer[i].No = No;
            this.uiPlayer[i].Score = Score;
            this.uiPlayer[i].Head = Head;
            this.uiPlayer[i].Level = Level;
            this.uiPlayer[i].Name = Name;
            this.uiPlayer[i].Play = Play;
        } else {
            playerBar = this.uiPlayer[i].playerBar;
            mainBg = this.uiPlayer[i].mainBg;
            No = this.uiPlayer[i].No;
            Score = this.uiPlayer[i].Score;
            Mask = this.uiPlayer[i].Mask;
            Level = this.uiPlayer[i].Level;
            Head = this.uiPlayer[i].Head;
            Name = this.uiPlayer[i].Name;
            Play = this.uiPlayer[i].Play;
        }
        if (type == 1) {
            Play.active = false;
        } else if (type == 2) {
            Play.active = true;
        }
        No.node.active = true;
        Score.node.active = true;
        Head.node.active = true;
        Name.node.active = true;
        var lv = JSON.parse(playerData.ext).lv;
        if(lv == undefined || lv == "undefined"){
            lv = 1;
        }
        Level.string  = "Lv:"+ lv;
        
        //前三名的背景处理
        if (parseInt(playerData.no) <= 3) {

        } else {
        }
        playerBar.parent = this.content;
        //是否为自己
        if (playerData.id == SDK().MyPlayer.id) {
            isOnRank = true;
            Play.active = false;
        }
        //按钮初始化
        Play.tag = playerData.id;
        Play.off("click");
        Play.on("click", function (event) {
            SDK().playWith(event.target.tag, null, function (isCompleted) {
                if (isCompleted) {
                    console.log("Share to " + playerData.id);
                }
            }.bind(this));
        }.bind(this), this);
        //加载名次
        No.string = playerData.no;
        //加载分数
        Score.string = playerData.score;
        Name.string = playerData.name;
        //加载头像
        this.LoadSprite(playerData.headUrl, Head, this.headSpriteList[playerData.id]);
        if (playerData.id == SDK().getSelfInfo().id) {
            if(this.selfNo != null){
                this.LoadSprite(playerData.headUrl, this.selfHead, this.headSpriteList[playerData.id]);
                this.selfNo.string = playerData.no;
                this.selfScore.string = playerData.score;
                this.selfName.string = playerData.name;
                this.selfName.node.parent.active = true;
                var lv = JSON.parse(playerData.ext).lv;
                if(lv == undefined || lv == "undefined"){
                    lv = 1;
                }
                this.selfLevel.string  = "Lv:"+ lv;
            }
        }
        playerBar.active = true;
        return isOnRank;
    },

    //根据URL加载头像并到对应的sprite上
    LoadSprite(url, sprite, saver) {
        if (saver == null) {
            cc.loader.load(url, function (err, texture) {
                saver = new cc.SpriteFrame(texture);
                sprite.spriteFrame = saver;
                sprite.node.parent.active = true;
            });
        } else {
            sprite.spriteFrame = saver;
            sprite.node.parent.active = true;
        }
    },

    // update (dt) {},
});
