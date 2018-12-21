cc.Class({
    extends: cc.Component,

    properties: {
        target:{
            default:null,
            type:cc.PageView,
        }
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.target.__proto__._onTouchBegan , this.target.__proto__ , true);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.target.__proto__._onTouchMoved , this.target.__proto__ , true);

        this.node.on(cc.Node.EventType.TOUCH_END, this.target.__proto__._onTouchEnded , this.target.__proto__ , true);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.target.__proto__._onTouchCancelled , this.target.__proto__ , true);
    },
});
