var cardYSpace = 50;
var levelStage = [3000, 4000, 5000,6000,7000];
var colors = [
    new cc.Color(0, 160, 233, 255),
    new cc.Color(234, 104, 162, 255),
    new cc.Color(255, 99, 51, 255),
    new cc.Color(255, 71, 71, 255),
    new cc.Color(126, 107, 90, 255),
    new cc.Color(246, 179, 127, 255),
    new cc.Color(0, 153, 68, 255),
];
var curColor;
cc.Class({
    extends: cc.Component,

    properties: {
        //卡槽UI列表
        cardSlotList: {
            default: [],
            visible: false,
        },
        //卡片的数据列表（对应每个卡槽）
        cardDataList: {
            default: [],
            visible: false,
        },
        //卡片的UI列表（对应每个卡槽）
        cardUIList: {
            default: [],
            visible: false,
        },
        //卡牌池的UI列表
        cardPoolList: {
            default: [],
            visible: false,
        },
        //卡牌池的卡牌
        cardPoolCards: {
            default: [],
            visible: false,
        },
        //卡牌预制件
        cardPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //当前分数UI
        curScore: {
            default: 0,
            visible: false,
        },
        //最佳分数
        bestScore: {
            default: 0,
            visible: false,
        },
        //最佳分数UI
        bestScoreText: {
            default: null,
            visible: false,
        },
        //当前分数UI
        curScoreText: {
            default: null,
            visible: false,
        },
        //预示线
        proline: {
            default: null,
            visible: false,
        },
        //碰撞中的物体
        collisioning: {
            default: null,
            visible: false,
        },
        //是否放置在垃圾桶上
        onDisCard: {
            default: false,
            visible: false,
        },
        //垃圾桶按钮
        discardBtn: {
            default: null,
            visible: false,
        },
        //垃圾桶数量
        discardCount: {
            default: 0,
            visible: false,
        },
        //垃圾桶数量UI
        discardCountText: {
            default: null,
            visible: false,
        },
        //是否正在剪切
        onCuting: {
            default: false,
            visible: false,
        },
        //剪刀数量
        cutCount: {
            default: 0,
            visible: false,
        },
        //剪刀数量UI
        cutCountText: {
            default: null,
            visible: false,
        },
        //剪切提示
        cutTip: {
            default: null,
            visible: false,
        },
        //万能牌数量
        changeCount: {
            default: 0,
            visible: false,
        },
        //万能牌数量UI
        changeCountText: {
            default: null,
            visible: false,
        },
        //超越好友UI
        overUI: {
            default: {},
            visible: false,
        },
        //三倍分数的UI显示
        score3: {
            default: null,
            visible: false,
        },
        //分数加倍道具的时间
        scoreTime: {
            default: 0,
            visible: false,
        },
        //是否可以获取道具的时间
        isGetTime: {
            default: 0,
            visible: false,
        },
        //是否进行引导
        isGuide: {
            default: false,
            visible: false,
        },
        //好友
        friends: {
            default: [],
            visible: false,
        },
        //正在超越中的对手idx
        overIdx: {
            default: -1,
            visible: false,
        },
        //是否第一次进行激励
        isFirstShare: {
            default: false,
            visible: false,
        },
        //AD
        adSpriteList: {
            default: [],
            type: [cc.Node],
        },
        //道具特效
        lightList: {
            default: [],
            type: [cc.Node],
        },
        //等级进度条
        levelPro: {
            default: null,
            visible: false,
        },
        //左右两边的字
        levelTextList: {
            default: [],
            visible: false,
        },
        //等级一级分数
        levelNum: {
            default: [],
            visible: false,
        },
        //有颜色的三个节点
        levelColorNode: {
            default: [],
            visible: false,
        },
        //游戏是否结束
        isOver: {
            default: false,
            visible: false,
        },
        //清除游戏数据
        clearIdx: {
            default: 0,
            visible: false,
        },
        curSkinIdx: {
            default: 0,
            visible: false,
        },
        skinsSprite: {
            default: null,
            visible: false,
        },
        skinsNew: {
            default: [],
            visible: false,
        },
        skinsData: {
            default: [],
            visible: false,
        },
        overPlayer: {
            default: 0,
            visible: false,
        },
    },

    //预加载卡牌
    proLoadSprite() {
        var num = 2;
        for (var i = 0; i < 11; i = i + 1) {
            //读取图片
            resManager.loadSpriteAsync("GameSp.card" + num, null);
            num = num * 2;
        }
    },

    //加载卡牌的图片
    loadCardSprite(num, sprite) {
        var idx = this.curSkinIdx;
        if (num == "X" || num == 0) {
            idx = "N";
        }
        resManager.loadSprite("GameSp." + idx + "-card" + num, function (spFrame) {
            sprite.spriteFrame = spFrame;
        }.bind(this))
    },

    destroyCard(card, j) {
        this.scheduleOnce(function () {
            var pos = {};
            pos.parent = card.parent;
            pos.position = card.position;
            effectManager.particleShow(pos, 1);
            card.destroy();
        }.bind(this), 0.15 * (7 - j));
    },

    //清除数据
    clearData() {
        for (var i = 0; i < 4; i = i + 1) {
            this.cardSlotList[i].getComponent(cc.BoxCollider).tag = 2;
            //清除卡牌的UI
            this.cardDataList[i] = [];
            if (this.cardUIList[i] != undefined && this.cardUIList[i] != null) {
                if (this.cardUIList[i].length > 0) {
                    for (var j = 0; j < this.cardUIList[i].length; j = j + 1) {
                        this.destroyCard(this.cardUIList[i][j], j);
                    }
                }
                this.cardUIList[i] = [];
            }
            //清除卡牌池的UI
            if (i < 2) {
                if (this.cardPoolCards[i] != null) {
                    this.cardPoolCards[i].destroy();
                    this.cardPoolCards[i] = null;
                }
            }
        }
    },

    //加载皮肤
    loadSkin(idx) {
        cc.sys.localStorage.setItem("skinidx", idx);
        this.curSkinIdx = idx;
        for (var i = 0; i < 4; i = i + 1) {
            if (this.cardUIList[i] != undefined && this.cardUIList[i] != null) {
                if (this.cardUIList[i].length > 0) {
                    for (var j = 0; j < this.cardUIList[i].length; j = j + 1) {
                        this.loadCardSprite(this.cardDataList[i][j], this.cardUIList[i][j].sprite);
                    }
                }
            }
            if (i < 2) {
                if (this.cardPoolCards[i] != null) {
                    this.loadCardSprite(this.cardPoolCards[i].num, this.cardPoolCards[i].sprite);
                }
            }
        }
    },

    //初始化ui
    initUI() {
        this.proLoadSprite();
        //卡槽和卡池UI
        for (var i = 0; i < 4; i = i + 1) {
            this.cardSlotList[i] = cc.find("Gaming/CardSlot/Slot" + i, this.node);
            if (i < 2) {
                this.cardPoolList[i] = cc.find("Gaming/CardPool/Pool" + i, this.node);
            }
        }

        //道具数量UI
        this.discardBtn = cc.find("UIView/Bottom/Discard", this.node);
        this.discardCountText = cc.find("UIView/Bottom/Discard/Num", this.node).getComponent(cc.Label);
        this.cutCountText = cc.find("UIView/Bottom/Cut/Num", this.node).getComponent(cc.Label);
        this.changeCountText = cc.find("UIView/Bottom/ChangeCard/Num", this.node).getComponent(cc.Label);
        this.cutTip = cc.find("Gaming/Middle/CutTip", this.node);
        this.score3 = cc.find("UIView/Top/X3Show", this.node).getComponent(cc.Sprite);

        //分数UI初始化
        this.bestScoreText = cc.find("UIView/Top/BestScore/Num", this.node).getComponent(cc.Label);
        this.curScoreText = cc.find("UIView/Top/CurScore", this.node).getComponent(cc.Label);

        //超越好友UI
        this.overUI.main = cc.find("UIView/Top/OverPlayer", this.node);
        this.overUI.head = cc.find("UIView/Top/OverPlayer/Border/Head", this.node).getComponent(cc.Sprite);
        this.overUI.score = cc.find("UIView/Top/OverPlayer/Score", this.node).getComponent(cc.Label);

        //预示线
        this.proline = cc.find("Gaming/CardPool/Proline", this.node);

        //等级
        this.levelPro = cc.find("UIView/Top/Level/LevelPro", this.node).getComponent(cc.ProgressBar);
        this.levelPro.totalLength = this.levelPro.node.width;
        this.levelPro.progress = 0;
        //等级的字
        this.levelTextList[0] = cc.find("UIView/Top/Level/CurLevel/Num", this.node).getComponent(cc.Label);
        this.levelTextList[1] = cc.find("UIView/Top/Level/NextLevel/Num", this.node).getComponent(cc.Label);
        //有颜色的节点
        this.levelColorNode[0] = cc.find("UIView/Top/Level/CurLevel", this.node);
        this.levelColorNode[1] = cc.find("UIView/Top/Level/NextLevel", this.node);
        this.levelColorNode[2] = cc.find("UIView/Top/Level/LevelPro/bar", this.node);

        //卡槽排列设置
        var layout = this.cardSlotList[0].parent.getComponent(cc.Layout);
        var spacing = (layout.node.width - (this.cardSlotList[0].width * 4)) / 5;
        layout.paddingLeft = spacing;
        layout.paddingRight = spacing;
        layout.spacingX = spacing;


        this.skinsSprite = cc.find("UIView/Top/Skins/NewSprite", this.node);

        this.curSkinIdx = cc.sys.localStorage.getItem("skinidx");
        if (this.curSkinIdx == undefined || this.curSkinIdx == null) {
            this.curSkinIdx = "N";
        } else {
            this.curSkinIdx = Number.parseInt(this.curSkinIdx);
        }

        cardYSpace = (cc.winSize.height - 690) / 7;
        SDK().getFriendRank(2, function (list) {
            this.friends = list;
            this.checkOverPlayer();
        }.bind(this));
    },

    //初始化数据
    initData() {
        var gameData = cc.sys.localStorage.getItem("gameData");
        gameData = JSON.parse(gameData);
        if (gameData != null && gameData != "0") {
            this.cardDataList = gameData.cardData;
            //卡牌列表复原
            for (var i = 0; i < 4; i = i + 1) {
                this.cardUIList[i] = [];
                //其中单个列表的复原
                for (var j = 0; j < this.cardDataList[i].length; j = j + 1) {
                    if (this.cardDataList[i][j] == "X") {
                        this.cardDataList[i][j] = 64;
                    }
                    var card = this.produceCard(this.cardDataList[i][j]);
                    //遮罩去掉
                    card.mask.active = false;

                    card.parent = this.cardSlotList[i];
                    card.position = cc.v2(0, 0 - (j * cardYSpace) - 10);
                    this.cardUIList[i][j] = card;
                    //碰撞体的tag设置
                    if (j == this.cardDataList[i].length - 1) {
                        card.getComponent(cc.BoxCollider).tag = 2;
                    } else {
                        card.getComponent(cc.BoxCollider).tag = 1;
                    }
                    //将上级赋值
                    if (j == 0) {
                        this.cardSlotList[i].getComponent(cc.BoxCollider).tag = 1;
                        card.pro = this.cardSlotList[i];
                    } else {
                        card.pro = this.cardUIList[i][j - 1];
                    }
                    card.active = true;
                    //绑定可剪切的功能
                    this.ridContorlAction(card);
                }
            }
            //卡排池的卡牌复原
            var poolCard = gameData.pool;
            for (var i = 0; i < poolCard.length; i = i + 1) {
                var card = this.produceCard(poolCard[i]);
                //遮罩去掉
                card.mask.active = false;
                this.cardPoolCards[i] = card;
                card.parent = this.cardPoolList[i];
                //区分大小
                if (i == 0) {
                    card.scale = 0.8;
                } else {
                    card.scale = 1;
                    card.isReady = true;
                }
                //绑定移动函数
                this.bindContorlAction(card);
                card.position = cc.v2(0, 0);
                card.active = true;
            }
            //垃圾桶数量以及分数
            this.discardCount = gameData.discard;
            this.discardCountText.string = this.discardCount;
            this.curScore = gameData.curScore;
            this.curScoreText.string = gameApplication.countUnit(this.curScore)[3];
        } else {
            //初始化各类储存
            for (var i = 0; i < 4; i = i + 1) {
                this.cardDataList[i] = [];
                this.cardUIList[i] = [];
            }
            //生成卡片
            this.poolCard(function () {
                this.poolCard();
            }.bind(this));
            //垃圾桶重置
            this.discardCount = 2;
            this.discardCountText.string = this.discardCount;
            //分数重置
            this.curScore = 0;
            this.curScoreText.string = gameApplication.countUnit(this.curScore)[3];
            this.scoreTime = 0;
            this.setItem("LevelScore", 0);
        }
        this.getItem("Level", function (val1) {
            if (val1.Level != undefined) {
                this.levelNum[0] = val1.Level;
            } else {
                if (val1 == 0) {
                    this.levelNum[0] = 1;
                } else {
                    this.levelNum[0] = val1;
                }
            }
            this.getItem("LevelScore", function (val) {
                if (val.LevelScore != undefined) {
                    this.levelNum[1] = val.LevelScore;
                } else {
                    this.levelNum[1] = val;
                }
                this.levelTextList[0].string = this.levelNum[0];
                this.levelTextList[1].string = this.levelNum[0] + 1;
                var needScore = 0;
                if (this.levelNum[0] < 25) {
                    needScore = this.levelNum[0] * levelStage[Number.parseInt(this.levelNum[0] / 5)];
                } else {
                    needScore = 25 * 7000;
                }
                var pros = this.levelNum[1] / needScore;
                this.levelPro.progress = pros;
                var ran = Math.floor(Math.random() * colors.length);
                var color = this.getRandom(ran, 1, 7);
                curColor = color[0];
                this.levelColorNode[0].color = colors[ran];
                this.levelColorNode[2].color = colors[ran];
                this.levelColorNode[1].color = colors[color[0]];

                this.setPros(this.levelNum[0]);

            }.bind(this));
        }.bind(this));

        //榜单处理
        var ext = {};
        ext.lv = this.levelNum[0];
        SDK().setRankScore(2, this.curScore, JSON.stringify(ext));
    },


    //设置进度
    setPros(val) {
        //处理皮肤事件
        for (var idx = 0; idx < 13; idx = idx + 1) {
            if (this.skinsData[idx] != undefined) {
                //是否是新的
                var isNew = false;
                if (this.skinsData[idx].pros < this.skinsData[idx].need) {
                    isNew = true;
                }
                this.skinsData[idx].pros = Number.parseInt(val);
                //判断有没有获得
                if (isNew && this.skinsData[idx].pros >= this.skinsData[idx].need) {
                    this.skinsSprite.active = true;
                    this.lightList[2].active = true;
                }
            }
        }
        dataManager.setStore("Skins", this.skinsData);
    },

    //初始化皮肤
    dealSkins() {
        dataManager.getStore("SkinsFirst", function (data) {
            if (data != 3) {
                dataManager.setStore("SkinsFirst", 3);
                dataManager.setStore("SkinNew", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                var skins = [
                    { need: 5, pros: 0 },
                    { need: 10, pros: 0 },
                    { need: 15, pros: 0 },
                    { need: 20, pros: 0 },
                    { need: 25, pros: 0 },
                    { need: 30, pros: 0 },
                    { need: 35, pros: 0 },
                    { need: 40, pros: 0 },
                    { need: 45, pros: 0 },
                    { need: 50, pros: 0 },
                    { need: 55, pros: 0 },
                    { need: 60, pros: 0 },
                    { need: 65, pros: 0 }
                ];
                this.skinsData = skins;
                dataManager.setStore("Skins", skins);
            } else {
                dataManager.getStore("Skins", function (data) {
                    this.skinsData = data;
                }.bind(this));
                dataManager.getStore("SkinNew", function (skinNew) {
                    if (skinNew == 0) {
                        skinNew = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        dataManager.setStore("SkinNew", skinNew);
                    }
                    this.skinsNew = skinNew;
                }.bind(this));
            }
        }.bind(this));
    },

    //新手引导
    initGuide() {
        this.isGuide = true;
        var gameData = {};
        gameData.cardData = [[2], [4, 2], [16, 8, 4, 2], [8, 4, 2]];
        gameData.pool = [
            2,
            2
        ];
        gameData.discard = 2;
        gameData.curScore = 0;
        var dataString = JSON.stringify(gameData);
        cc.sys.localStorage.setItem("gameData", dataString);
    },

    onLoad: function () {
        window.gameViewScript = this;
        this.cardDataList = [];
        this.dealSkins();
        this.initUI();
        SDK().getItem("isFirst", function (val) {
            //是否第一次进入游戏
            if (val != 3 || val != "3") {
                //设置新手引导
                this.initGuide();
                //第一次的剪刀数量
                this.setProp(1, 1);
                //第一次的万能牌数量
                this.setProp(1, 0);
                SDK().setItem({ isFirst: 3 });
            } else {
                //获取剪刀数量
                SDK().getItem("cut", function (val) {
                    if (val == undefined || val == null) {
                        val = 0;
                    }
                    this.setProp(val, 1);
                }.bind(this));
                //获取万能卡数量
                SDK().getItem("change", function (val) {
                    if (val == undefined || val == null) {
                        val = 0;
                    }
                    this.setProp(val, 0);
                }.bind(this));
                SDK().getItem("bestScore", function (val) {
                    if (val == null || val == undefined) {
                        val = 0;
                    }
                    this.bestScore = val;
                    this.bestScoreText.string = gameApplication.countUnit(this.bestScore)[3];
                }.bind(this))
            }
            soundManager.loadBg();
            this.gameStart();
        }.bind(this));
    },

    onEnable() {
        this.schedule(this.updataVal, 1);
    },
    onDisable() {
        this.unschedule(this.updataVal);
    },

    updataVal() {
        if (this.changeCount > 0) {
            this.changeCountText.node.active = true;
            this.adSpriteList[0].active = false;
        } else {
            this.changeCountText.node.active = false;
            this.adSpriteList[0].active = true;
        }
        if (this.cutCount > 0) {
            this.cutCountText.node.active = true;
            this.adSpriteList[1].active = false;
        } else {
            this.cutCountText.node.active = false;
            this.adSpriteList[1].active = true;
        }
        if (this.discardCount > 0) {
            this.discardCountText.node.active = true;
            this.adSpriteList[2].active = false;
        } else {
            this.discardCountText.node.active = false;
            this.adSpriteList[2].active = true;
        }
    },

    start() {
        SDK().getItem("Short", function (val) {
            if (val != 100) {
                SDK().canCreateShortcutAsync(function (isOK) {
                    if (isOK) {
                        SDK().setItem({ Short: 100 });
                    }
                }.bind(this));
            }
        }.bind(this))
    },

    //游戏开始
    gameStart() {
        this.clearData();
        this.initData();
        this.checkOver();
        if (this.isGuide) {
            this.isGuide = false;
            var guide = cc.find("Guide", this.node);
            var hand = cc.find("Guide/Hand", this.node);
            guide.active = true;
            var poolPos = viewManager.getUIPosition(this.cardPoolList[1], hand.parent);
            var cardSlotPos = viewManager.getUIPosition(this.cardSlotList[2], hand.parent);
            cardSlotPos.y = cardSlotPos.y - cardYSpace * 4;
            hand.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.callFunc(function () {
                            hand.position = poolPos;
                        }.bind(this), this),
                        cc.moveTo(2, cardSlotPos).easing(cc.easeIn(1))
                    )
                )
            )
        }
        this.isOver = false;
    },

    //绑定触摸函数
    bindContorlAction(card) {
        card.on('touchstart', function (event) {
            if (card.isReady) {
                card.isMoving = true;
            }
        }.bind(this), this)

        card.on('touchmove', function (event) {
            if (card.isMoving) {
                this.cardMoving(card, event);
            }
        }.bind(this), this)

        card.on('touchend', function (event) {
            if (card.isMoving) {
                this.moveOver(card, event);
                card.isMoving = false;
            }
        }.bind(this), this)
        card.on('touchcancel', function (event) {
            if (card.isMoving) {
                this.moveOver(card, event);
                card.isMoving = false;
            }
        }.bind(this), this)
    },

    //解绑触摸函数
    ridContorlAction(card) {
        card.off('touchstart');
        card.off('touchmove');
        card.off('touchend');
        card.off('touchcancel');
        card.on('touchstart', function () {
            this.cutOff(card);
        }.bind(this), this)
    },

    //生成卡片
    produceCard(num) {
        var card = cc.instantiate(this.cardPrefab);
        card.mask = cc.find("Mask", card);
        var sprite = card.getComponent(cc.Sprite);
        card.sprite = sprite;
        card.num = num;
        var cutButton = cc.find("Cut", card);
        cutButton.on('touchstart', function () {
            this.cutOff(card);
        }.bind(this), this);
        card.cutButton = cutButton;
        this.loadCardSprite(num, sprite);
        /* var idx = this.curSkinIdx;
        if(num == "X" || num == 0){
            idx = "N";
        }
        resManager.loadSprite("GameSp."+idx+"-card" + num, function (spFrame) {
            sprite.spriteFrame = spFrame;
        }.bind(this)) */
        return card;
    },

    //卡牌池生成卡牌
    poolCard(cb) {
        var ramdon = Math.random();
        var num = 0;
        if (ramdon <= 0.09) {
            num = 2;
        } else if (ramdon <= 0.27) {
            num = 4;
        } else if (ramdon <= 0.45) {
            num = 8;
        } else if (ramdon <= 0.63) {
            num = 16;
        } else if (ramdon <= 0.81) {
            num = 32;
        } else if (ramdon <= 0.99) {
            num = 64;
        } else if (ramdon <= 1) {
            num = "X";
        }
        if (num != 0) {
            //新牌的位置信息默认为第一张
            var targetIdx = 0;
            //第一张牌推前为第二张
            if (this.cardPoolCards[0] != null && this.cardPoolCards[0] != undefined) {
                var card0 = this.cardPoolCards[0];
                card0.isReady = false;
                var pos = viewManager.getUIPosition(card0, this.cardPoolList[1]);
                card0.parent = this.cardPoolList[1];
                card0.position = pos;
                card0.runAction(
                    cc.sequence(
                        cc.spawn(
                            cc.moveTo(0.3, cc.v2(0, 0)),
                            cc.scaleTo(0.3, 1)
                        ),
                        cc.callFunc(function () {
                            //成为第二个卡牌池
                            this.cardPoolCards[1] = card0;
                            card0.isReady = true;
                        }.bind(this), this)
                    )
                )
            } else {
                if (this.cardPoolCards[1] == null || this.cardPoolCards[0] != undefined) {
                    //如果第一张没有牌则默认为第二张
                    targetIdx = 1;
                }
            }

            //新牌推入第一张待命
            var card = this.produceCard(num);
            card.parent = this.cardPoolList[targetIdx];
            card.scale = 0.8;
            if (targetIdx == 1) {
                card.scale = 1;
            }
            card.x = -140;
            card.y = 0;
            card.active = true;
            //转向
            card.runAction(cc.sequence(
                cc.scaleTo(0.3, 0, 1),
                cc.callFunc(function () {
                    card.mask.active = false;
                }.bind(this), this),
                cc.scaleTo(0.3, card.scale),
            ));
            //移动
            card.runAction(
                cc.sequence(
                    cc.moveTo(0.3, cc.v2(0, 0)),
                    cc.callFunc(function () {
                        this.cardPoolCards[targetIdx] = card;
                        this.bindContorlAction(card);
                        if (targetIdx == 1) {
                            card.isReady = true;
                        } else {
                            var gameData = {};
                            gameData.cardData = this.cardDataList;
                            gameData.pool = [
                                this.cardPoolCards[0].num,
                                this.cardPoolCards[1].num
                            ];
                            gameData.discard = this.discardCount;
                            gameData.curScore = this.curScore;
                            gameData.scoreTime = this.scoreTime;
                            var dataString = JSON.stringify(gameData);
                            cc.sys.localStorage.setItem("gameData", dataString);
                        }
                        if (cb != null) {
                            cb(card);
                        }
                    }.bind(this), this)
                )
            )
        }
    },

    //移动处理
    cardMoving(card, event) {
        //清除剪切状态
        this.onCuting = false;
        this.cutTip.active = false;
        this.cutShow(false);

        var touchPos = event.touch._point;
        var realPos = card.parent.convertToNodeSpaceAR(touchPos);
        if (realPos.y > 0) {
            realPos.y = realPos.y + realPos.y * 0.5;
        }
        card.position = realPos;
    },

    //移动结束处理
    moveOver(card, event) {
        if (card.isMoving) {
            //是否可以放置
            if (this.collisioning != null && !this.collisioning.merging) {
                var guide = cc.find("Guide", this.node);
                guide.active = false;
                soundManager.playSound("PutCard");
                var idx = this.cardSlotList.indexOf(this.collisioning);
                if (idx >= 0) {
                    //父级变动
                    card.parent = this.collisioning;
                    card.position = cc.v2(0, -10);
                    card.pro = this.collisioning;
                    this.collisioning.getComponent(cc.BoxCollider).tag = 1;
                    card.getComponent(cc.BoxCollider).tag = 2;
                    //牌放上去要动画
                    card.runAction(cc.sequence(
                        cc.scaleTo(0.1, card.scale - 0.1),
                        cc.scaleTo(0.1, 1)
                    ));
                    //UI存储
                    this.cardUIList[idx].push(card);
                    //数据压入
                    this.cardDataList[idx].push(card.num);
                } else {
                    idx = this.cardSlotList.indexOf(this.collisioning.parent);
                    //如果已经满了而且无法合并则返回原位
                    if (this.cardUIList[idx].length == 8 && this.collisioning.num != card.num && card.num != "X") {
                        //提示框提示满队列了
                        /* viewManager.popView("TipsView", true, function (view) {
                            var tipText = cc.find("Bg/Text", view).getComponent("LocalizedLabel");
                            tipText.dataID = "lang.overLenth";
                            this.scheduleOnce(function () {
                                viewManager.popView("TipsView", false);
                            }.bind(this), 1);
                        }.bind(this)) */
                        card.position = cc.v2(0, 0);
                        return;
                    }
                    //父级变动
                    card.parent = this.collisioning.parent;
                    card.position = cc.v2(this.collisioning.x, this.collisioning.y - cardYSpace);
                    card.pro = this.collisioning;
                    //碰撞中物体可碰撞状态消失
                    this.collisioning.getComponent(cc.BoxCollider).tag = 1;
                    //放上去的牌状态为可碰撞
                    card.getComponent(cc.BoxCollider).tag = 2;
                    //牌放上去要动画
                    card.runAction(cc.sequence(
                        cc.scaleTo(0.1, card.scale - 0.1),
                        cc.scaleTo(0.1, 1)
                    ));
                    //UI存储
                    this.cardUIList[idx].push(card);
                    //数据压入
                    this.cardDataList[idx].push(card.num);
                    if (card.pro.num == undefined) {
                        if (card.num == "X") {
                            this.cardDataList[idx][this.cardDataList.length - 1] = 64;
                        }
                    }
                }
                this.ridContorlAction(card);
                //清除当前选择体
                this.collisioning = null;
                this.proline.active = false;
                //判断合并
                this.mergeCard(card, 0);
                //生成卡片
                this.poolCard();
            } else if (this.onDisCard && this.discardCount > 0) {
                this.discardCard(card);
            } else {
                card.position = cc.v2(0, 0);
            }
        }
        this.scheduleOnce(function () {
            this.checkOver();
        }.bind(this), 1)
    },

    //合并纸牌
    mergeCard(card, times) {
        if (card.pro.num == undefined) {
            //第一张是万能牌则变成64
            if (card.num == "X") {
                card.num = 64;
                //读取图片
                this.loadCardSprite(card.num, card.getComponent(cc.Sprite));
                /* resManager.loadSprite("GameSp.card" + card.num, function (spFrame) {
                    card.getComponent(cc.Sprite).spriteFrame = spFrame;
                }.bind(this)) */
            }
            return;
        }

        if (card.num == card.pro.num || card.num == "X") {
            card.merging = true;
            this.scheduleOnce(function () {
                var idx = this.cardSlotList.indexOf(card.parent);
                var cIdx = this.cardUIList[idx].indexOf(card);
                //UI弹出
                this.cardUIList[idx].splice(cIdx - 1, 2);
                //数据弹出
                this.cardDataList[idx].splice(cIdx - 1, 2);
                card.runAction(
                    cc.sequence(
                        cc.moveTo(0.2, card.pro.position),
                        cc.scaleTo(0.1, 0.8),
                        cc.callFunc(function () {
                            soundManager.playSound("merge" + times);
                            //卡片面值翻倍
                            if (card.num == "X") {
                                card.num = card.pro.num * 2;
                            } else {
                                card.num = card.num * 2;
                            }
                            //读取图片
                            this.loadCardSprite(card.num, card.getComponent(cc.Sprite));
                            /* resManager.loadSprite("GameSp.card" + card.num, function (spFrame) {
                                card.getComponent(cc.Sprite).spriteFrame = spFrame;
                            }.bind(this)) */
                            //旧卡上级储存
                            var oldPro = card.pro.pro;
                            if (this.cardSlotList.indexOf(card.pro) < 0) {
                                //旧卡销毁
                                card.pro.destroy();
                            }
                            //上级转变
                            card.pro = oldPro;
                            //2048爆炸
                            if (card.num == 2048) {
                                var pos = {};
                                pos.parent = this.cardSlotList[idx];
                                pos.position = card.position;
                                effectManager.particleShow(pos, 0);
                                soundManager.playSound("2048Sound");
                            }
                        }.bind(this), this),
                        cc.scaleTo(0.1, 1),
                        cc.callFunc(function () {
                            //特效
                            if (times > 0) {
                                this.flyCombo(card, times);
                            }
                            times = times + 1;
                            //如果合并后不是2048
                            if (card.num != 2048) {
                                //UI储存
                                this.cardUIList[idx].splice(cIdx - 1, 0, card);

                                //数据储存
                                this.cardDataList[idx].splice(cIdx - 1, 0, card.num);

                                //如果不是最后一个就不能进行碰撞
                                if (this.cardUIList[idx].indexOf(card) != this.cardDataList[idx].length - 1) {
                                    card.getComponent(cc.BoxCollider).tag = 1;
                                } else {
                                    card.getComponent(cc.BoxCollider).tag = 2;
                                }

                                card.merging = false;
                                this.mergeCard(card, times);
                            } else {
                                this.discardCount = this.discardCount + 2;
                                this.discardCountText.string = this.discardCount;
                                card.pro.getComponent(cc.BoxCollider).tag = 2;
                                card.destroy();
                            }
                            var addScore = card.num * times;

                            this.setScore(addScore);
                        }.bind(this), this),
                    )
                );
            }.bind(this), 0.2);
        } else {
            var idx = this.cardSlotList.indexOf(card.parent);
            //尝试下面的牌
            var cIdx = this.cardUIList[idx].indexOf(card);
            if (cIdx < this.cardUIList[idx].length - 1) {
                this.mergeCard(this.cardUIList[idx][cIdx + 1], times);
            }
            //this.checkRewardCard(idx);
            SDK().getItem("Short", function (val) {
                if (val != 100) {
                    SDK().canCreateShortcutAsync(function (isOK) {
                        if (isOK) {
                            SDK().setItem({ Short: 100 });
                        }
                    }.bind(this));
                }
            }.bind(this))
        }
    },

    //丢弃一张牌
    discardCard(card) {
        //卡牌移动时不能被丢掉
        if (!this.onDisCard && card.isMoving) {
            return;
        }
        this.discardCount = this.discardCount - 1;
        this.discardCountText.string = this.discardCount;
        var pos = viewManager.getUIPosition(this.discardBtn, card.parent);
        soundManager.playSound("Discard");
        card.runAction(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.4, 0),
                    cc.callFunc(function () {
                        //放入垃圾桶
                        card.destroy();
                        //生成卡片
                        this.poolCard();
                        //垃圾桶状态重置
                        this.onDisCard = false;

                        //记录使用垃圾桶
                        //gameApplication.DataAnalytics.doEvent("discard");
                    }.bind(this), this)
                ),
                cc.moveTo(0.3, pos)
            )
        )
    },

    //剪切函数
    cutOff(card) {
        if (this.onCuting) {
            this.cutShow(false);
            this.lightList[1].active = false;
            this.cutTip.active = false;
            //状态重置，并且剪刀数量减一
            this.onCuting = false;
            this.setProp(-1, 1);
            soundManager.playSound("Discard");
            card.runAction(cc.sequence(
                cc.scaleTo(0.15, 0.6, 1.5),
                cc.scaleTo(0.15, 1.2, 0.8),
                cc.scaleTo(0.1, 0),
                cc.callFunc(function () {
                    //剪切卡片
                    var pos = {};
                    pos.parent = card.parent;
                    pos.position = card.position;
                    effectManager.particleShow(pos, 1);
                }.bind(this), this)
            ));
            this.scheduleOnce(function () {
                //获取所在列并
                var idx = this.cardSlotList.indexOf(card.parent);
                var goOverWrite = false;
                var nextOneIdx = -1;
                for (var i = 0; i < this.cardDataList[idx].length; i = i + 1) {
                    if (goOverWrite) {
                        //UI前移
                        this.cardUIList[idx][i - 1] = this.cardUIList[idx][i];
                        //数据前移
                        this.cardDataList[idx][i - 1] = this.cardDataList[idx][i];
                        //下面的卡往上移动
                        this.cardUIList[idx][i - 1].runAction(cc.moveBy(0.2, cc.p(0, cardYSpace)))
                    }
                    //检索到对应剪切卡片
                    if (card == this.cardUIList[idx][i]) {
                        goOverWrite = true;
                        //把父级移交给被切得下一个
                        if (i + 1 < this.cardDataList[idx].length) {
                            nextOneIdx = i;
                            this.cardUIList[idx][i + 1].pro = card.pro;
                        }
                    }
                }
                //移除最后一张牌
                var last = this.cardUIList[idx].pop();
                this.cardDataList[idx].pop();
                if (last == card) {
                    card.pro.getComponent(cc.BoxCollider).tag = 2;
                }

                //销毁被剪切的卡片
                card.destroy();
                //判断能否合并
                if (nextOneIdx != -1) {
                    this.mergeCard(this.cardUIList[idx][nextOneIdx], 0);
                }
            }.bind(this), 0.7);

            //记录剪刀
            //gameApplication.DataAnalytics.doEvent("cutCard");
        }
    },

    //炸弹卡
    boomCard() {
        soundManager.playSound("Boom");
        this.isOver = false;
        //记录炸弹
        //gameApplication.DataAnalytics.doEvent("boomCard");

        for (var i = 0; i < 4; i = i + 1) {
            //最后可以被碰撞的牌
            var lastCard = null;
            var beginIdx = 0;
            if (this.cardUIList[i].length > 3) {
                lastCard = this.cardUIList[i][this.cardUIList[i].length - 4];
                beginIdx = this.cardUIList[i].length - 3;
            } else {
                lastCard = this.cardSlotList[i];
            }
            lastCard.getComponent(cc.BoxCollider).tag = 2;
            for (var j = this.cardUIList[i].length - 1; j >= beginIdx; j = j - 1) {
                var popCard = this.cardUIList[i].pop();
                var pos = {};
                pos.parent = this.cardSlotList[i];
                pos.position = popCard.position;
                effectManager.particleShow(pos, 0);
                popCard.destroy();
                this.cardDataList[i].pop();
            }
        }
    },

    //分数卡
    scoreCard() {
        soundManager.playSound("ScoreCard");
        //记录分数卡
        //gameApplication.DataAnalytics.doEvent("scoreCard");

        if (this.scoreTime < 0) {
            this.scoreTime = 0;
        }
        this.scoreTime = this.scoreTime + 20;
        //飞动
        effectManager.flyReward(1, 0, this.score3.node, null, function () {
            this.score3.node.active = true;
        }.bind(this))
    },

    //显示结束界面
    showOver() {
        this.scheduleOnce(function () {
            viewManager.popView("GameOver", true);
        }.bind(this), 1.2);
    },

    //检测游戏结束
    checkOver() {
        if (this.isOver) {
            return;
        }
        var isOver = 0;
        for (var i = 0; i < 4; i = i + 1) {
            if (this.cardDataList[i].length >= 8) {
                isOver = isOver + 1;
            }
            if (this.cardPoolCards[1] != null) {
                //还能放置
                if (this.cardPoolCards[1].num == "X" || this.cardPoolCards[1].num == this.cardDataList[i][7]) {
                    isOver = isOver - 1;
                }
            }
        }
        if (isOver >= 4) {
            this.isOver = true;
            soundManager.playSound("Fail");
            viewManager.popView("ReviveView", true, function () { }.bind(this));
        }
    },

    //检查奖励卡
    checkRewardCard(idx) {
        if (this.isGetTime > 0) {
            return;
        }
        if (this.cardDataList[idx].length >= 8) {
            var random = Math.random();
            viewManager.popView("UseCardView", true, function (view) {
                this.isGetTime = 120;
                var sprite = cc.find("Bg/Card", view).getComponent(cc.Sprite);
                var useBtn = cc.find("Bg/Use", view);
                var desc = cc.find("Bg/Desc", view).getComponent("LocalizedLabel");
                var closeBtn = cc.find("Bg/Close", view);
                closeBtn.off("click");
                closeBtn.on("click", function () {
                    sprite.node.active = false;
                    desc.node.active = true;
                    useBtn.off("click");
                    viewManager.popView("UseCardView", false);
                }.bind(this), this);
                //判断奖励
                var cb = null;
                if (random >= 0.5) {
                    cb = function () {
                        this.isFirstShare = false;
                        viewManager.popView("UseCardView", false, function () {
                            this.scheduleOnce(function () {
                                gameViewScript.boomCard();
                            }.bind(this), 0.5)
                        }.bind(this));
                    }.bind(this)
                    desc.dataID = "lang.boomCardDesc";
                    resManager.loadSprite("UIView.boomCard", function (spFrame) {
                        sprite.spriteFrame = spFrame;
                        sprite.node.active = true;
                    }.bind(this))
                } else {
                    cb = function () {
                        this.isFirstShare = false;
                        gameViewScript.scoreCard();
                        viewManager.popView("UseCardView", false);
                    }.bind(this)
                    desc.dataID = "lang.X3CardDesc";
                    resManager.loadSprite("UIView.x3Card", function (spFrame) {
                        sprite.spriteFrame = spFrame;
                        sprite.node.active = true;
                    }.bind(this))
                }
                desc.node.active = true;
                useBtn.off("click");
                if (this.isFirstShare) {
                    useBtn.on("click", function () {
                        cb();
                        gameApplication.onShareBtnClick(function (isOK) {
                            if (isOK) {
                            }
                        }.bind(this))
                    }.bind(this), this)
                } else {
                    useBtn.on("click", function () {
                        gameApplication.onVideoBtnClick(function (isOk) {
                            if (isOk) {
                                cb();
                            }
                        }.bind(this), 0);
                    }.bind(this), this)
                }
            }.bind(this));
        }
    },

    //显示隐藏卡牌的剪刀
    cutShow(isShow) {
        for (var i = 0; i < 4; i = i + 1) {
            if (this.cardUIList[i] != undefined && this.cardUIList[i] != null) {
                if (this.cardUIList[i].length > 0) {
                    for (var j = 0; j < this.cardUIList[i].length; j = j + 1) {
                        this.cardUIList[i][j].cutButton.active = isShow;
                    }
                }
            }
        }
    },

    CollisionEnter: function (other, self) {
        //检测是否有可以放置的位置
        if (other.tag == 2 && self.tag == 0 && self.node.isMoving && !other.node.merging) {
            this.collisioning = other.node;
            this.proline.active = true;
            this.proline.position = viewManager.getUIPosition(this.collisioning, this.proline.parent);
        }

        //是否离开触及垃圾桶
        if (other.tag == 3) {
            this.onDisCard = true;
        }
    },

    CollisionStay: function (other, self) {
        if (other.node == this.collisioning) {

        }
    },

    CollisionExit: function (other, self) {
        //解除可防止的位置
        if (other.node == this.collisioning) {
            this.collisioning = null;
            this.proline.active = false;
        }

        //是否离开垃圾桶
        if (other.tag == 3) {
            this.onDisCard = false;
        }
    },

    //点击事件处理
    menuClick(event, type) {
        this.isFirstShare = false;
        soundManager.playSound("btnClick")
        if (type == "change") {

            SDK().fbEvent('clickwannengpaiBtn', 1);
            if (this.changeCount > 0) {
                //道具数量减少一个
                this.setProp(-1, 0);
                this.lightList[0].active = false;

                this.cardPoolCards[1].num = "X";
                this.cardPoolCards[1].runAction(
                    cc.sequence(
                        cc.scaleTo(0.1, 0, 1),
                        cc.callFunc(function () {
                            //读取图片
                            this.loadCardSprite("X", this.cardPoolCards[1].getComponent(cc.Sprite));
                            /* resManager.loadSprite("GameSp.cardX", function (spFrame) {
                                this.cardPoolCards[1].getComponent(cc.Sprite).spriteFrame = spFrame;
                            }.bind(this)) */
                        }.bind(this), this),
                        cc.scaleTo(0.1, 1),
                    )
                )
            } else {
                if (this.isFirstShare) {
                    this.isFirstShare = false;
                    this.setProp(1, 0);
                    gameApplication.onShareBtnClick(function (isOk) {
                        if (isOk) {
                        }
                    }.bind(this));
                } else {
                    gameApplication.onVideoBtnClick(function (isOk) {
                        if (isOk) {
                            this.setProp(1, 0);
                            this.lightList[0].active = true;
                        }
                    }.bind(this), 0)
                }
            }
        }
        else if (type == "cut") {
            if (this.onCuting) {
                return;
            }
            SDK().fbEvent('clickjiandaoBtn', 1);
            if (this.cutCount > 0 && !this.onCuting) {
                this.onCuting = true;
                this.cutTip.active = true;
                this.cutShow(true);
            } else {
                if (this.isFirstShare) {
                    this.isFirstShare = false;
                    this.setProp(1, 1);
                    gameApplication.onShareBtnClick(function (isOk) {
                        if (isOk) {
                        }
                    }.bind(this));
                } else {
                    gameApplication.onVideoBtnClick(function (isOk) {
                        if (isOk) {
                            this.setProp(1, 1);
                            this.lightList[1].active = true;
                        }
                    }.bind(this), 1)
                }
            }
        }
        else if (type == "discard") {

            SDK().fbEvent('clickdeleteBtn', 1);
            if (this.discardCount > 0) {
                this.discardCard(this.cardPoolCards[1]);
                return;
            }
            if (this.isFirstShare) {
                this.isFirstShare = false;
                this.discardCount = this.discardCount + 1;
                this.discardCountText.string = this.discardCount;
                gameApplication.onShareBtnClick(function (isOk) {
                    if (isOk) {
                    }
                }.bind(this));
            } else {
                gameApplication.onVideoBtnClick(function (isOk) {
                    if (isOk) {
                        this.discardCount = this.discardCount + 1;
                        this.discardCountText.string = this.discardCount;
                    }
                }.bind(this), 2)
            }
        }
        else if (type == "pause") {
            viewManager.popView("PauseView", true);
        }
        else if (type == "closeGuide") {
            var guideView = cc.find("Guide", this.node);
            guideView.active = false;
        }
        else if (type == "clear") {
            this.clearIdx = this.clearIdx + 1;
            if (this.clearIdx % 5 == 0) {
                SDK().setItem({ isFirst: 100 });
                cc.sys.localStorage.setItem("gameData", "0");
            }
        } else if (type == "Skins") {
            viewManager.popView("SkinView", true);
            this.skinsSprite.active = false;
            this.lightList[2].active = false;
        }
    },

    //设置道具数量
    setProp(val, type) {
        if (type == 0) {
            this.changeCount = this.changeCount + val;
            this.changeCountText.string = this.changeCount;
            SDK().setItem({ change: this.changeCount });
        } else if (type == 1) {
            this.cutCount = this.cutCount + val;
            this.cutCountText.string = this.cutCount;
            SDK().setItem({ cut: this.cutCount });
        }
        if (this.isFirstShare) {
            return;
        }
        /* if (val > 0) {
            //获取道具的提示
            viewManager.popView("TipsView", true, function (view) {
                var tipText = cc.find("Bg/Text", view).getComponent("LocalizedLabel");
                if (type == 0) {
                    tipText.dataID = "lang.getChange";
                } else {
                    tipText.dataID = "lang.getCut";
                }
                this.scheduleOnce(function () {
                    viewManager.popView("TipsView", false);
                }.bind(this), 1);
            }.bind(this))
        } */
    },

    //设置分数
    setScore(val) {
        if (this.scoreTime > 0) {
            val = val * 3;
        }
        if (this.levelNum.length > 0) {
            this.levelNum[1] = this.levelNum[1] + val;
            var need = 0;
            if (this.levelNum[0] < 25) {
                need = (this.levelNum[0] * levelStage[Number.parseInt(this.levelNum[0] / 5)])
            } else {
                need = 25 * 7000;
            }
            //等级处理
            if (this.levelNum[1] > need) {
                //升级并处理等级显示的颜色
                this.levelNum[1] = this.levelNum[1] - need;
                this.levelNum[0] = this.levelNum[0] + 1;
                this.setItem("Level", this.levelNum[0]);
                this.levelColorNode[0].color = this.levelColorNode[1].color;
                this.levelColorNode[2].color = this.levelColorNode[1].color;
                var color = this.getRandom(curColor, 2, 7);
                this.levelColorNode[1].color = colors[color[1]];
                curColor = color[1];

                //处理皮肤事件
                this.setPros(this.levelNum[0]);

                //处理超越好友事件
                this.checkOverPlayer();
                if (this.overPlayer > -1) {
                    viewManager.popView("OverPlayerView", true, function (view) {
                        var script = view.getComponent("OverPlayerView");
                        script.overPlayer(this.overPlayer);
                    }.bind(this));
                } else {
                    viewManager.popView("PassView", true);
                }

                SDK().fbEvent('Level' + this.levelNum[0], 1);
            }
            this.levelTextList[0].string = this.levelNum[0];
            this.levelTextList[1].string = this.levelNum[0] + 1;
            this.setItem("LevelScore", this.levelNum[1]);
            var needScore = 0;
            if (this.levelNum[0] < 25) {
                needScore = this.levelNum[0] * levelStage[Number.parseInt(this.levelNum[0] / 5)];
            } else {
                needScore = 25 * 7000;
            }
            var pros = this.levelNum[1] / needScore;
            this.levelPro.progress = pros;
        }

        this.curScore = this.curScore + val;
        this.curScoreText.string = gameApplication.countUnit(this.curScore)[3];
        //超越历史记录处理
        if (this.curScore > this.bestScore) {
            //最高分处理
            this.bestScore = this.curScore;
            this.bestScoreText.string = gameApplication.countUnit(this.bestScore)[3];
            SDK().setItem({ bestScore: this.curScore });
            var ext = {};
            ext.lv = this.levelNum[0];
            //榜单处理
            SDK().setRankScore(2, this.curScore, JSON.stringify(ext));
        }
    },

    checkOverPlayer() {
        if (this.overPlayer != this.overIdx) {
            this.overPlayer = -1;
            if (this.overIdx != -1) {
                var lv = JSON.parse(this.friends[this.overIdx].ext).lv;
                if (this.levelNum[0] > lv) {
                    this.overPlayer = this.overIdx;
                }
            }
        } else {
            this.overPlayer = -1;
        }
        //处理超越好友
        for (var i = this.friends.length - 1; i >= 0; i = i - 1) {
            var lv = JSON.parse(this.friends[i].ext).lv;
            if (lv >= this.levelNum[0]) {
                if (this.overIdx != i && this.friends[i].id != SDK().MyPlayer.id) {
                    this.overIdx = i;
                    this.overUI.main.active = true;
                    this.overUI.score.node.active = false;
                    cc.loader.load(this.friends[i].headUrl, function (err, texture) {
                        this.overUI.head.node.runAction(
                            cc.sequence(
                                cc.fadeOut(0.5),
                                cc.callFunc(function () {
                                    this.overUI.head.spriteFrame = new cc.SpriteFrame(texture);
                                    this.overUI.score.string = "Lv " + lv;
                                    this.overUI.score.node.active = true;
                                }.bind(this), this),
                                cc.fadeIn(0.5)
                            )
                        );
                    }.bind(this));
                }
                if (this.friends[i].id != SDK().MyPlayer.id) {
                    break;
                }
            }
            if (i == -1) {
                this.overUI.main.active = false;
            }
        }
    },

    getItem(type, cb) {
        dataManager.getStore(type, function (data) {
            if (data == null || data == undefined) {
                dataManager.setStore(type, 1);
                data = 1;
            }
            if (cb != null) {
                cb(data);
            }
        }.bind(this))
    },

    setItem(type, score) {
        dataManager.setStore(type, score);
    },

    //连击特效
    flyCombo(card, num) {
        num = num + 1;
        if (this.scoreTime > 0) {
            num = num * 3;
        }
        effectManager.flyText("X " + num, card);
    },

    //获取不相同的随机数
    getRandom(have, count, length) {
        var arr = [];
        for (var i = 0; i < length; i = i + 1) {
            arr[i] = i;
        }
        if (have < length) {
            //去掉已存在的那个
            var center = arr[have];
            arr[have] = arr[arr.length - 1];
            arr[arr.length - 1] = center;
            arr = arr.slice(0, arr.length - 1);
        }
        //抽取所需要的数量
        var need = [];
        var needIdx = 0;
        for (var i = 0; i < count; i = i + 1) {
            //随机抽取一个
            var ran = Math.floor(Math.random() * arr.length);
            var center = arr[ran];
            arr[ran] = arr[arr.length - 1];
            arr[arr.length - 1] = center;
            arr = arr.slice(0, arr.length - 1);
            need[needIdx] = center;
            needIdx = needIdx + 1;
        }
        return need;
    },

    update(dt) {
        if (this.scoreTime > 0) {
            this.scoreTime = this.scoreTime - dt;
            this.score3.fillRange = this.scoreTime / 20;
        } else {
            this.score3.node.active = false;
        }
        if (this.isGetTime > 0) {
            this.isGetTime = this.isGetTime - dt;
        }
    },
});
