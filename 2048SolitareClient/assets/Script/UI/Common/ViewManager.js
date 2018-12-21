cc.Class({
    extends: cc.Component,

    properties: {
        //对应的key储存对应界面的idx
        idxList: {
            default: {},
            visible: false,
        },
        //储存界面
        viewList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //弹窗储存
        popSaver: {
            default: {},
            visible: false,
        },
        //弹窗队列
        curPopList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        //当前的界面切换方向
        curDir: {
            default: 0,
            visible: false,
        },
    },

    //判断是前进还是后退，前进为12，后退为34
    judgeDir(isFOrB) {
        var ram = Math.random() * 2;
        if (isFOrB == null) {
            this.curDir = 1;
            return;
        }
        ram = 2;
        if (isFOrB) {
            if (ram <= 1) {
                this.curDir = 1;
            } else if (ram <= 2) {
                this.curDir = 2;
            }
        } else {
            if (ram <= 1) {
                this.curDir = 3;
            } else if (ram <= 2) {
                this.curDir = 4;
            }
        }
    },

    /**
     * 本函数：界面的切换
     * name:node相对于Canvas的路径
     * inOut:显示还是隐藏
     * isFOrB:是前进的界面还是后退的界面
     * dir:指定切换方式
     * cb:延时需要做的操作
     * delayTrue：是否需要延时进行别的操作
     */
    showView(name, inOut, isFOrB, dir = null, cb = null, delayTrue = 0) {
        if (dir == null) {
            this.judgeDir(isFOrB);
        } else {
            this.curDir = dir;
        }
        let idx = this.idxList[name];
        if (idx == null) {
            var Canvas = cc.find("Canvas");
            view = cc.find(name, Canvas);
            if (view == null) {
                resManager.loadPrefab(name, function (prefab) {
                    view = cc.instantiate(prefab);
                    if (view != null) {
                        view.parent = Canvas;
                        this.showView(name, inOut, isFOrB, dir, cb, delayTrue);
                    }
                }.bind(this));
                return;
            }
            //控制大小
            view.width = cc.winSize.width;
            view.height = cc.winSize.height;
            if (view != null) {
                //添加索引并放置队尾
                var temp = this.viewList.length;
                idx = temp;
                this.idxList[name] = idx;
                this.viewList[idx] = view;
                //设置大小
                view.width = cc.winSize.width;
                view.height = cc.winSize.height;
            } else {
                console.log(name + " is not found");
                return;
            }
        }
        let view = this.viewList[idx];
        for (var i = 0; i < this.viewList.length; i = i + 1) {
            if (view != this.viewList[i]) {
                if (this.viewList[i].active && inOut) {
                    this.viewList[i].stopAllActions();
                    this.showAnim(this.viewList[i], false, 0, null);
                }
            }
        }
        this.showAnim(view, inOut, delayTrue, cb);
        return view;
    },

    //选择显示方式
    showAnim(view, inOut, delayTrue, cb) {
        //选择显示方式
        if ((inOut && view.active == false) || (!inOut && view.active == true)) {
            view.stopAllActions();
            if (inOut) {
                view.setSiblingIndex(view.parent.childrenCount);
            }
            this.showType(2, view, inOut, delayTrue, cb);
        }
    },

    //界面切换方式
    showType(type, view, isOpen, delayTrue, cb) {
        let during = 0.5;
        let seq = null;
        switch (type) {
            //渐隐渐现
            case 0: {
                if (isOpen) {
                    view.opacity = 0;
                    view.active = true;
                    seq =
                        cc.sequence(
                            cc.fadeIn(during).easing(cc.easeSineIn(2)),
                            cc.delayTime(delayTrue),
                            cc.callFunc(function () {
                                if (null != cb) {
                                    cb(view);
                                }
                                this.noBtnMask(false, view);
                            }.bind(this), this)
                        )

                } else {
                    this.noBtnMask(true, view);
                    seq =
                        cc.sequence(
                            cc.fadeOut(during).easing(cc.easeSineIn(2)),
                            cc.callFunc(function () {
                                view.active = false;
                                if (null != cb) {
                                    cb(view);
                                }
                            }.bind(this))
                        );
                }
            } break;
            //放大缩小
            case 1: {
                if (isOpen) {
                    view.scale = 0;
                    view.active = true;
                    seq =
                        cc.sequence(
                            cc.scaleTo(during, 1).easing(cc.easeBounceOut(2)),
                            cc.delayTime(delayTrue),
                            cc.callFunc(function () {
                                if (null != cb) {
                                    cb();
                                }
                                this.noBtnMask(false, view);
                            }.bind(this), this)
                        )

                } else {
                    this.noBtnMask(true, view);
                    seq =
                        cc.sequence(
                            cc.scaleTo(during, 0).easing(cc.easeSineIn(2)),
                            cc.callFunc(function () {
                                view.active = false;
                                if (null != cb) {
                                    cb();
                                }
                            }.bind(this))
                        );
                }
            } break;
            //移动1右切左,2上切下为前进，3左切右,4下切上为后退
            case 2: {
                var targetPos;
                if (this.curDir == 1) {
                    targetPos = cc.v2(cc.winSize.width, 0);
                } else if (this.curDir == 2) {
                    targetPos = cc.v2(0, cc.winSize.height);
                } else if (this.curDir == 3) {
                    targetPos = cc.v2(-cc.winSize.width, 0);
                } else if (this.curDir == 4) {
                    targetPos = cc.v2(0, -cc.winSize.height);
                }
                if (isOpen) {
                    view.active = true;
                    view.setPosition(targetPos.x, targetPos.y);
                    seq =
                        cc.sequence(
                            cc.moveTo(during, cc.v2(0, 0)).easing(cc.easeSineIn(2)),
                            cc.delayTime(delayTrue),
                            cc.callFunc(function () {
                                if (null != cb) {
                                    cb();
                                }
                                this.noBtnMask(false, view);
                            }.bind(this), this)
                        )
                } else {
                    this.noBtnMask(true, view);
                    seq =
                        cc.sequence(
                            cc.moveTo(during, cc.v2(-targetPos.x, -targetPos.y)).easing(cc.easeSineIn(2)),
                            cc.callFunc(function () {
                                view.active = false;
                                if (null != cb) {
                                    cb();
                                }
                            }.bind(this))
                        );
                }
            } break;
        };
        if (seq != null) {
            view.stopAllActions();
            this.scheduleOnce(function () {
                view.runAction(seq);
            }.bind(this), 0.1);
        }
    },

    //初始化弹窗
    initPopView() {
        //读取弹窗信息
        resManager.loadConfig("ResourceList", function (results) {
            var cof = results.popViewList;
            this.closeCount = 0;
            this.loadAction(cof, cof.length, 0);
        }.bind(this))
    },

    //生成并显示然后隐藏
    loadAction(viewList, length, i) {
        this.popView(
            viewList[i],//界面名
            true,//是否显示
            //回调函数
            function () {
                var closeIdx = i;
                i = i + 1;
                if (i < length) {
                    this.loadAction(viewList, length, i);
                }
                this.popAnim(this.popSaver[viewList[closeIdx]], false, function () {
                    this.closeCount = this.closeCount + 1;
                    //发出通知
                    this.node.emit("loadPop", { pro: ((this.closeCount) / length) });
                }.bind(this), true);
            }.bind(this)
        );
    },

    //关闭弹窗
    closePop(name) {
        this.popView(name, false, null);
    },

    //弹出弹窗
    popView(name, isOpen, cb) {
        //尝试从储存中获取
        let view = this.popSaver[name];
        if (view == 1) {
            return;
        }
        //需要创建
        if (view == null) {
            //尝试场景中获取
            var Canvas = cc.find("Canvas");
            var cView = cc.find(name, Canvas);
            if (cView == null) {
                this.popSaver[name] = 1;
                resManager.loadPrefab(name, function (prefab) {
                    view = cc.instantiate(prefab);
                    //控制大小
                    view.width = cc.winSize.width;
                    view.height = cc.winSize.height;
                    this.savePop(view, isOpen, cb);
                }.bind(this))
            } else {
                this.savePop(cView, isOpen, cb);
            }
        } else {
            this.popAnim(view, isOpen, cb);
        }
    },

    savePop(view, isOpen, cb) {
        if (view != null) {
            //初始化关闭按钮
            let close = cc.find("Bg/Close", view);
            close.off("click");
            close.on("click", function (event) {
                this.closePop(view.name);
                soundManager.playSound("btnClick");
            }, this);
            //设置父级和层级
            var canvas = cc.find("Canvas");
            view.parent = canvas;
            //储存界面
            this.popSaver[view.name] = view;
            this.popAnim(view, isOpen, cb, true);
        }
    },

    //弹窗动画
    popAnim(view, isOpen, cb) {
        //整体结构对齐
        var Bg = cc.find("Bg", view);
        var widget = Bg.getComponent(cc.Widget);
        if (widget != null) {
            widget.updateAlignment();
        }
        var time = 0.5;
        //弹出
        if (isOpen) {
            Bg.scale = 0;
            view.x = 0;
            view.active = true;
            soundManager.playSound("pop");
            view.setSiblingIndex(view.parent.childrenCount);
            Bg.runAction(
                cc.sequence(
                    cc.scaleTo(time, 1).easing(cc.easeElasticOut(3)),
                    cc.callFunc(function () {
                        if (cb != null) {
                            cb(view);
                        }
                    }.bind(this), this)
                )
            );
            //隐藏之前的弹窗
            var old = this.curPopList.pop();
            if (old != null && old != undefined) {
                let oldView = this.popSaver[old];
                if (old != view.name) {
                    oldView.active = false;
                    this.curPopList.push(old);
                }
            }
            //将自己加入Pop列表
            this.curPopList.push(view.name);
        }
        //缩回 
        else {
            soundManager.playSound("closePop");
            Bg.runAction(
                cc.sequence(
                    cc.scaleTo(time - 0.2, 0).easing(cc.easeBackIn(3)),
                    cc.callFunc(function () {
                        view.active = false;
                        if (cb != null) {
                            cb(view);
                        }
                    }.bind(this), this)
                )
            )
            //将自己移除pop列表
            var idx = this.curPopList.findIndex((value, index, arr) => {
                return value == view.name
            });
            if (idx >= 0) {
                this.curPopList.splice(idx, 1);
            }
            //将上一个弹窗显示
            var pre = this.curPopList.pop();
            if (pre != null && pre != undefined) {
                let preView = this.popSaver[pre];
                if(pre!=view.name){
                    preView.active = true;
                    this.curPopList.push(pre);
                }
            }
        }
    },


    //按钮屏蔽器
    noBtnMask(isOpen, view) {
        var mask = cc.find("noBtn", view);
        if (mask == null) {
            mask = new cc.Node("noBtn");
            mask.addComponent(cc.BlockInputEvents);
            mask.width = cc.winSize.width;
            mask.height = cc.winSize.height;
        }
        mask.active = isOpen;
    },

    //关闭弹窗
    closePopView(name, cb) {
        this.popView(name, false, cb);
    },


    //移除界面
    removeView(name) {
        var view = this.viewList[this.idxList[name]];
        this.idxList[name] = null;
        for (var i = 0; i < this.viewList.length; i = i + 1) {
            if (view == this.viewList[i]) {
                this.viewList[i] = null;
                //this.viewList.splice(i, 1);
            }
        }
    },

    //获取目标在target的坐标
    getUIPosition(myNode, targetNode) {
        var naturePos = myNode.parent.convertToWorldSpaceAR(myNode.position);
        var targetPos = targetNode.convertToNodeSpaceAR(naturePos);
        return targetPos;
    },


    /**
     * 本函数：对一个数值进行平滑的变化
     * start:起始值
     * disVal:位移量
     * time:时间
     * callback:回调传回一个代理，代理的X参数即为我们需要的渐变值
     * id:每个独立的操作都拥有一个Id来标识
     */
    lerpAction(start, disVal, time, callback, id) {
        if (this.agent == null) {
            this.agent = {};
        }
        if (this.agent[id] == null) {
            this.agent[id] = new cc.Node("agent");
            this.agent[id].x = 0;
        }
        this.agent[id].stopAllActions();
        let ob = this.agent[id];
        if (start != null) {
            ob.x = start;
        }
        let repeatTime = time / 0.02;
        let repeatVal = disVal / repeatTime;
        ob.runAction(cc.repeat(
            cc.sequence(
                cc.callFunc(function () {
                    callback(ob);
                }.bind(this), this),
                cc.moveBy(0.02, cc.v2(repeatVal, 0)),
            )
            , repeatTime + 1));
    },

    //停止一个渐变函数
    stopLerpAction(id) {
        if (this.agent[id] != null) {
            this.agent[id].stopAllActions();
        }
    },

    //停止所有渐变函数
    stopAllLerpActions() {
        for (var index in this.agent) {
            if (this.agent[index] != null) {
                this.agent[index].stopAllActions();
            }
        }
    },

    onLoad() {
        window.viewManager = this;
    },

    //start() {},

    // update (dt) {},
});
