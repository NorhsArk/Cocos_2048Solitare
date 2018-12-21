cc.Class({
    extends: cc.Component,

    properties: {
        isPlay: false,
        loop: true,
        sprite: {
            default: null,
            type: cc.Sprite,
        },
        shadow: {
            default: null,
            type: cc.Sprite,
        },
        itemId: {    //缓存目标的id，如果发生变化，重新init
            default: null,
            visible: false,
        },
        animCount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        sprites: {
            default: [],
            type: [cc.SpriteFrame],
            visible: false,
        },
        spritesArray: {
            default: [],
            visible: false,
        },
        fps: {
            default: 5,
            type: cc.Integer,
            visible: false,
        },
        delta: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        index: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        wait: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        waitDelta: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        gameAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        isInited: {
            default: false,
            visible: false,
        },
        isRotat: {
            default: true,
            visible: false,
        },
        oPoint: {
            default: cc.v2(0, 0),
            visible: false,
        },
        callback: {
            default: null,
            visible: false,
        },
    },

    /**
     * 播放动画
     * id:boom_1 则boom_为id
     * num：帧动画的数量
     * offset：从几开始读图 例如为3，则从boom_3开始读图
     * stage：表示一个阶段，一个id可以有几个阶段，一个阶段是offset 到 offset + num的帧动画
     * fps：每秒的帧速度
     * isReset:是否重置
     * isLoop：是否循环播放
     * scale：是否定义大小
     * cb：回调函数
    */
    playSprites(id, num, offset, stage, fps, isReset, isLoop, scale, cb) {
        var self = this;
        this.animCount = 8;//帧动画数量
        this.fps = fps;
        this.wait = 0;
        this.waitDelta = 0;
        if (scale == null) {
            this.scale = 1;
        } else {
            this.scale = scale;
        }
        if (offset == null) {
            offset = 0;
        }
        this.isReset = isReset;
        if (isLoop == null) {
            this.loop = true;
        } else {
            this.loop = isLoop;
        }
        this.isRotat = false;

        if (this.isInited && this.itemId == id && self.spritesArray[id][stage] != null) {
            self.sprites = self.spritesArray[id][stage];
            this.play(cb);
        } else {
            this.itemId = id;
            self.spritesArray[id] = [];
            self.spritesArray[id][stage] = []
            self.sprites = self.spritesArray[id][stage];
            for (var i = offset; i < offset + num; i = i + 1) {
                var frame = this.gameAtlas.getSpriteFrame(this.itemId + i);
                self.spritesArray[id][stage].push(frame);
            }
            self.isInited = true;
            if (self.sprites.length != null && self.sprites.length > 0) {
                self.play(cb);
            }
        }
    },

    /**
    * 根据idx播放单张图
    */
    playSpriteByIdx(id, num, cb) {
        this.sprite.spriteFrame = this.gameAtlas.getSpriteFrame(id + num);
        this.isPlay = false;
    },

    /**
    * 根据名字播放单张图
    */
    playSpriteByName(id, name, cb) {
        this.sprite.spriteFrame = this.gameAtlas.getSpriteFrame(id + name);
        this.isPlay = false;
    },

    play(cb) {
        this.index = 0;
        this.isPlay = true;
        this.node.scale = this.scale;
        this.node.opacity = 255;

        if (this.shadow != null) {
            this.shadow.node.active = true;
        }

        if (cb != null) {
            this.callback = cb;
        }
    },

    reSet() {

        this.index = 0;
        if (this.sprite != null) {
            this.sprite.spriteFrame = this.sprites[this.index];
        }
        this.isPlay = false;
        //this.node.active = false;
        this.node.opacity = 255;
        this.node.setRotation(0);

        if (this.shadow != null) {
            this.shadow.node.active = false;
            this.shadow.node.setRotation(0);
        }

        if (this.callback != null) {
            this.callback();
        }
    },

    update(dt) {
        //更新shadow位置
        if (this.shadow != null) {
            var shadow_v2 = this.shadow.node.position;
            var node_v2 = cc.v2(this.node.position.x + 10, this.node.position.y - 10)
            if (shadow_v2 != node_v2) {
                // cc.log("node_v2:",node_v2);
                this.shadow.node.position = node_v2;
            }
        }

        if (this.wait > 0 && this.waitDelta < this.wait) {
            this.waitDelta += dt;
            return;
        }

        if (this.isPlay && this.fps > 0 && this.sprites.length > 0) {

            this.delta += dt;

            var rate = 1 / this.fps;
            if (rate < this.delta) {
                this.delta = rate > 0 ? this.delta - rate : 0;

                this.sprite.spriteFrame = this.sprites[this.index];
                if (this.shadow != null) {
                    this.shadow.spriteFrame = this.sprites[this.index];
                }

                if (this.index + 1 == this.sprites.length) {
                    this.waitDelta = 0;

                    //isLoop
                    if (!this.loop) {
                        this.isPlay = false;
                    }

                    if (this.isReset) {
                        this.reSet();
                    }
                }

                this.index = this.index + 1 >= this.sprites.length ? 0 : this.index + 1;
            }
        }
    },
});
