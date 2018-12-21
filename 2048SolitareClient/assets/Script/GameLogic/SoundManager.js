var musicList = [
"Boom",
"Discard",
"Fail",
"GetScore",
"Over",
"PutCard",
"ScoreCard",
"btnClick",
"closePop",
"pop",
];

cc.Class({
    extends: cc.Component,

    properties: {
        //音效开关
        isOpen: {
            default: true,
            visible: false,
        },
        //背景音效开关
        isBgOpen: {
            default: true,
            visible: false,
        },
        //语音开关
        isVoiceOpen: {
            default: true,
            visible: false,
        },
        audio: {
            default: null,
            tpye: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS: 

    onLoad() {
        window.soundManager = this;
    },

    start() {
        this.preLoad();
    },

    //预加载音效
    preLoad() {
        for (var i = 0; i < musicList.length; i = i + 1) {
            resManager.loadSoundAsync(musicList[i],null);
        }
    },

    //加载背景音乐
    loadBg() {
        resManager.loadClip("Bg", function (clip) {
            if (clip != null) {
                this.audio = clip;
                this.bg = cc.audioEngine.play(this.audio, true, 0.2);
            } else {
                console.log(soundtype + " soundClip not exist!");
            }
        }.bind(this));
    },

    //播放音效
    playSound: function (soundtype) {
        if (this.isOpen) {
            if (resManager != null) {
                resManager.loadSoundAsync(soundtype, function (clip) {
                    if (clip != null) {
                        cc.audioEngine.play(clip, false, 1);
                    } else {
                        console.log(soundtype + " soundClip not exist!");
                    }
                }.bind(this));
            } else {
                console.log("resManeger not exist!(资源管理器不存在！)");
            }
        }
    },

    //播放背景音效
    playBg: function () {
        if (this.isBgOpen) {
            this.bg = cc.audioEngine.play(this.audio, false, 1);
        } else {
            cc.audioEngine.stop(this.bg);
        }
    },
    //设置背景音效开关
    setBgOpen: function (isOpen) {
        this.isBgOpen = isOpen;
        if (this.isBgOpen) {
            try {
                if (str != null) {
                    HiboGameJs.mute(0)
                }
            } catch (e) {

            }

        } else {
            try {
                if (str != null) {
                    HiboGameJs.mute(1)
                }
            } catch (e) {

            }
        }
        this.playBg();
    },
    //设置音效开关
    setIsOpen: function (isOpen) {
        this.isOpen = isOpen;
        if (this.isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.mute(0)
                }
            } catch (e) {

            }

        } else {
            try {
                if (str != null) {
                    HiboGameJs.mute(1)
                }
            } catch (e) {
            }
        }
    },
    //设置语音开关
    setVoiceIsOpen: function (isOpen) {
        this.isVoiceOpen = isOpen;
        if (isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(0)
                }
            } catch (e) {

            }
        } else {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(1)
                }
            } catch (e) {

            }
        }

    },
});
