cc.Class({
    extends: cc.Component,

    properties: {
        //读取资源的队列
        actionList: {
            default: [],
            visible: false,
        },
        //资源储存者
        resSaver: {
            default: {},
            visible: false,
        },
        //资源管理者是否空闲
        isFree: {
            default: [],
            visible: false,
        },
    },

    onLoad() {
        this.isFree = [true,true,true,true,true];
        window.resManager = this;
    },

    //读取图片资源并生成储存
    loadSprite(name, cb) {
        this.pushAction(1, name, cb);
    },

    //读取配置资源并生成储存
    loadConfig(name, cb) {
        this.pushAction(2, name, cb);
    },

    //读取预制件资源并生成储存
    loadPrefab(name, cb) {
        this.pushAction(3, name, cb);
    },

    //读取音频资源并生成储存
    loadClip(name, cb) {
        this.pushAction(4, name, cb);
    },

    //读取龙骨资源并生成储存
    loadBone(name, cb) {
        this.pushAction(5, name, cb);
    },

    //读取事件压入队列
    pushAction(type, name, cb) {
        //读取缓存
        if (this.resSaver[name] != null) {
            if (cb != null) {
                cb(this.resSaver[name]);
            }
            return;
        }
        var action = {};
        action.type = type;
        action.name = name;
        action.cb = cb;
        this.actionList.push(action);
        if (this.isFree[type]) {
            this.dealAction();
        }
    },

    //处理资源
    dealAction() {
        var action = this.actionList.shift();
        if (action != null) {
            //回调自己
            let newCb = action.cb;
            action.cb =
                function (object) {
                    if (newCb != null) {
                        newCb(object);
                    }
                    this.dealAction();
                }.bind(this);
            this.isFree[action.type] = false;
            if (action.name == "" || action.name == null) {
                console.log("action.name is empty");
                this.dealAction();
                return;
            }
            switch (action.type) {
                case 1: {
                    var newName = action.name.split(".");
                    var atlas = newName[0];
                    var spriteName = newName[1];
                    cc.loader.loadRes("texture2d/" + atlas, cc.SpriteAtlas, function (err, spriteAtlas) {
                        if (err == null) {
                            this.resSaver[action.name] = spriteAtlas.getSpriteFrame(spriteName);
                            if (action.cb != null) {
                                action.cb(this.resSaver[action.name])
                            }
                        } else {
                            console.warn(action.name);
                            console.warn(err);
                            if (action.cb != null) {
                                action.cb(null);
                            }
                        }
                        this.isFree[action.type] = true;
                    }.bind(this));
                } break;
                case 2: {
                    cc.loader.loadRes("conf/" + action.name, function (err, cof) {
                        cof = cof;
                        if (err == null) {
                            this.resSaver[action.name] = cof;
                            if (action.cb != null) {
                                action.cb(cof)
                            }
                        } else {
                            console.warn(action.name);
                            console.warn(err);
                            if (action.cb != null) {
                                action.cb(null);
                            }
                        }
                        this.isFree[action.type] = true;
                    }.bind(this));
                } break;
                case 3: {
                    cc.loader.loadRes("prefab/" + action.name, function (err, prefab) {
                        if (err == null) {
                            this.resSaver[action.name] = prefab;
                            if (action.cb != null) {
                                action.cb(prefab)
                            }
                        } else {
                            console.warn(action.name);
                            console.warn(err);
                            if (action.cb != null) {
                                action.cb(null);
                            }
                        }
                        this.isFree[action.type] = true;
                    }.bind(this));
                } break;
                case 4: {
                    cc.loader.loadRes("sound/" + action.name, cc.AudioClip, function (err, clip) {
                        if (err == null) {
                            this.resSaver[action.name] = clip;
                            if (action.cb != null) {
                                action.cb(clip)
                            }
                        } else {
                            console.warn(action.name);
                            console.warn(err);
                            if (action.cb != null) {
                                action.cb(null);
                            }
                        }
                        this.isFree[action.type] = true;
                    }.bind(this));
                } break;
                case 5: {
                    cc.loader.loadResDir("bone/" + action.name, function (err, bone) {
                        if (err == null) {
                            this.resSaver[action.name] = bone;
                            if (action.cb != null) {
                                action.cb(bone)
                            }
                        } else {
                            console.warn(action.name);
                            console.warn(err);
                            if (action.cb != null) {
                                action.cb(null);
                            }
                        }
                        this.isFree[action.type] = true;
                    }.bind(this));
                } break;
            };
        } else {
            this.isFree = [true,true,true,true,true];
        }
    },

    //异步加载
    loadSoundAsync(name,cb){
        cc.loader.loadRes("sound/" + name, cc.AudioClip, function (err, clip) {
            if (err == null) {
                this.resSaver[name] = clip;
                if (cb != null) {
                    cb(clip)
                }
            } else {
                console.warn(name);
                console.warn(err);
                if (cb != null) {
                    cb(null);
                }
            }
        }.bind(this));
    },

    //异步加载
    loadSpriteAsync(name,cb){
        var newName = name.split(".");
        var atlas = newName[0];
        var spriteName = newName[1];
        cc.loader.loadRes("texture2d/" + atlas, cc.SpriteAtlas, function (err, spriteAtlas) {
            if (err == null) {
                this.resSaver[name] = spriteAtlas.getSpriteFrame(spriteName);
                if (cb != null) {
                    cb(this.resSaver[name])
                }
            } else {
                console.warn(name);
                console.warn(err);
                if (cb != null) {
                    cb(null);
                }
            }
        }.bind(this));
    },

})