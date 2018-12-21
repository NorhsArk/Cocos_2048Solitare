

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
        cofDataMap: {
            default: {},
            visible: false,
        },
        //每个储存的状态 true-繁忙  false-空闲
        statusList: {
            default: {},
            visible: false,
        },
        //每个储存事件的缓存数据
        bufList: {
            default: {},
            visible: false,
        },
        //是否还存在事件
        actionList: {
            default: {},
            visible: false,
        },
        //回调函数列表
        actionCbList: {
            default: {},
            visible: false,
        },
        firstRemote:{
            default: {},
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.dataManager = this;
    },

    start() { },

    //设置某个数据
    setStore(name, val, cb) {
        var saver = JSON.stringify(val);
        //储存并回调并储存到服务器
        cc.sys.localStorage.setItem(name, saver);
        if (cb != null) {
            cb();
        }
        var param = {};
        param[name] = saver;
        SDK().setItem(param);
    },

    //获取整个数据
    getStore(name, cb, isRemote) {
        if(this.firstRemote[name] == undefined || this.firstRemote[name] == null){
            isRemote = true;
            this.firstRemote[name] = true;
        }
        if (isRemote) {
            SDK().getItem(name, function (dataString) {
                if (dataString == "null" && dataString == null) {
                    dataString = 0;
                }
                var data = JSON.parse(dataString);
                if (cb != null) {
                    cb(data);
                }
            }.bind(this), 1)
        } else {
            var data = cc.sys.localStorage.getItem(name);
            data = JSON.parse(data);
            if (cb != null) {
                cb(data);
            }
        }
    },
    // update (dt) {},
});
