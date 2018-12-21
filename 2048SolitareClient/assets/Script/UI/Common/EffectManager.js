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
        //对应的key储存对应界面的idx
        idxList: {
            default: {},
            visible: false,
        },
        //特效界面
        effectView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        //特效物体储存
        effectList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //礼包物体储存
        giftList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //粒子物体储存
        particleList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //预制件储存
        prefabList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //图片资源列表
        picList: {
            default: [],
            type: [cc.SpriteFrame],
            visible: false,
        },
        //计时事件
        eventList: {
            default: null,
            visible: false,
        },
        fontType: {
            default: null,
            type: cc.Font,
        },
        //触摸特效粒子
        touchParticle: {
            default: null,
            type: cc.ParticleSystem,
            visible: false,
        },
        isToucing: {
            default: false,
            visible: false,
        },
    },
    onLoad() {
        window.effectManager = this;
        cc.loader.loadRes("fnt/Normal", function (err, font) {
            if (err == null) {
                this.fontType = font;
            } else {
                console.warn(action.name);
                console.warn(err);
            }
        }.bind(this));
    },

    start() {
        //设置特效界面
        if (this.effectView == null) {
            this.effectView = new cc.Node("EffectView");
            this.effectView.width = cc.winSize.width;
            this.effectView.height = cc.winSize.height;
            this.effectView.parent = cc.director.getScene().getChildByName('Canvas');
            this.effectView.setSiblingIndex(this.effectView.parent.childrenCount);
            this.effectView.zIndex = 10001;
            this.effectView.position = cc.v2(0, 0);
        }
        resManager.loadPrefab("Boom",function(prefab){
            this.particleList[0] = prefab;
        }.bind(this));
        resManager.loadPrefab("CutCrash",function(prefab){
            this.particleList[1] = prefab;
        }.bind(this));
        resManager.loadPrefab("LevelUp",function(prefab){
            this.particleList[2] = prefab;
        }.bind(this));
    },

    // update (dt) {},

    //奖励动画效果
    flyReward(num, type, target, start, cb, isBoom = false) {
        if (this.picList[type] == null) {
            if (type == 0) {
                //金币图用于获得金币的特效
                resManager.loadSprite("UIView.X3Show", function (spriteFrame) {
                    this.picList[type] = spriteFrame;
                    this.flyReward(num, type, target, start, cb, isBoom);
                }.bind(this))
            }
        } else {
            //起点
            let begin = cc.v2(0, 0);;
            if (start != null) {
                begin = start.parent.convertToWorldSpaceAR(start.position);
                begin = this.effectView.convertToNodeSpaceAR(begin);
            }

            //终点
            let dis = cc.v2(0, 500);
            if (target != null) {
                dis = target.parent.convertToWorldSpaceAR(target.position);
                dis = this.effectView.convertToNodeSpaceAR(dis);
            }

            for (var i = 0; i < num; i++) {
                var reward = this.effectList.pop();
                if (reward == null) {
                    reward = new cc.Node(i);
                    reward.addComponent(cc.Sprite);
                }
                var sp = reward.getComponent(cc.Sprite);
                sp.spriteFrame = this.picList[type];
                reward.active = false;
                reward.parent = this.effectView;
                reward.position = begin;
                reward.active = true;
                if (isBoom) {
                    reward.x = reward.x + (Math.random() * 50 * (Math.random() < 0.5 ? -1 : 1));
                    reward.y = reward.y + (Math.random() * 50 * (Math.random() < 0.5 ? -1 : 1));
                }
                this.flyAnim(reward, dis, cb, i);
            }
        }
    },

    //飞字
    flyText(string, target) {
        var text = new cc.Node().addComponent(cc.Label);
        text.node.addComponent(cc.LabelOutline).width = 2;
        text.string = string;
        text.node.color = cc.color(255, 210, 35, 255);
        text.fontSize = 30;
        text.lineHeight = 40;
        text.font = this.fontType;
        text.node.parent = this.effectView;
        var begin = target.parent.convertToWorldSpaceAR(target.position);
        begin = this.effectView.convertToNodeSpaceAR(begin);
        text.node.position = begin;
        text.node.runAction(
            cc.spawn(
                cc.fadeOut(0.5, 0).easing(cc.easeIn(2)),
                cc.moveBy(0.5, cc.p(0, 100)),
            )
        );
        this.scheduleOnce(function () {
            if (text.node != null) {
                text.node.destroy();
            }
        }.bind(this), 0.5);
    },

    //飞行移动动作
    flyAnim(reward, dis, cb, i) {
        reward.active = true;
        reward.scale = 0;
        this.scheduleOnce(function () {
            reward.runAction(
                cc.spawn(
                    cc.moveTo(1, cc.v2(dis.x, dis.y)),
                    cc.sequence(
                        cc.scaleTo(0.5, 1.1),
                        cc.scaleTo(0.5, 0),
                        //用于只执行一次的
                        cc.callFunc(function () {
                            if (cb != null) {
                                cb()
                            }
                            this.effectList.push(reward);
                        }.bind(this), this)
                    )
                )
            );
        }.bind(this), i * 0.05);
    },

    //左右摇摆晃动
    shake(node) {
        node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
            cc.delayTime(0.5)
        )));
    },

    //模拟心跳
    scaleUpAndDowm(node) {
        node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 1.1).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
                )
            )
        );
    },

    //显示粒子效果
    particleShow(node, i) {
        if(this.particleList[i] == null ){
            if(i == 0){
                resManager.loadPrefab("Boom",function(prefab){
                    this.particleList[i] = prefab;
                    this.particleShow(node, i);
                }.bind(this));
            }
        }else{
            var effect = cc.instantiate(this.particleList[i]);
            effect.parent = this.effectView;
            var pos = viewManager.getUIPosition(node, this.effectView);
            effect.position = pos;
            effect.active = true;
        }
    },

    //飞行礼包
    flyGift(type, cb) {
        //飞行礼包的预制件
        if (this.giftList[type] == null) {
            resManager.loadPrefab("FlyGift" + type, function (prefab) {
                this.giftList[type] = cc.instantiate(prefab);
                this.giftList[type].parent = this.effectView;
                this.flyGift(type, cb);
            }.bind(this))
        } else {
            var gift = cc.instantiate(this.giftList[type]);
            gift.parent = this.effectView;
            gift.x = cc.winSize.width * -0.8;
            gift.y = Math.random() * cc.winSize.height * 0.35 * (Math.random() < 0.5 ? -1 : 1);
            gift.off("click");
            gift.on("click", function () {
                if (cb != null) {
                    cb({ parent: gift.parent, position: gift.position });
                    gift.stopAllActions();
                    gift.destroy();
                }
            }.bind(this), this);
            gift.active = true;
            gift.runAction(
                cc.sequence(
                    cc.moveTo(10, cc.v2(cc.winSize.width * 0.6, gift.y)),
                    cc.callFunc(function () {
                        gift.destroy();
                    }.bind(this), this)
                )
            )
        }
    },

});
