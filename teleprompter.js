
var Teleprompter = function(text){
    this.text = text;
    this.msPerPixel = Infinity;
    this.forward = true;
    this.loopId = null;
    this.queuedSpeedChangeId = null;
    this.topOffset = 0;
    this.mouseY = null;
};

Teleprompter.prototype.start = function(){
    var me = this;
    if(this.msPerPixel !== Infinity){
        this.loopId = window.setInterval(function(){me.nextPixel()},Math.max(5,this.msPerPixel));
    }
    this.prevBodyPadding = document.body.style.padding;
    this.prevBodyMargin = document.body.style.margin;
    this.prevBodyOverflow = document.body.style.oveflow;
    document.body.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.oveflow = 'hidden';
    document.body.appendChild(this.getNodeOverlay());
    this.mouseMoveFn = function(e){me.handleMouseMove(e)};
    $(window).bind('mousemove',this.mouseMoveFn);
    this.keyDownFn = function(e){
        console.log(e.keyCode);
        if(e.keyCode == 27){
            me.stop();
        }
    }
    $(window).bind('keydown',this.keyDownFn);

};

Teleprompter.prototype.stop = function(){
    document.body.style.margin = document.body.style.margin;
    document.body.style.oveflow = this.prevBodyOverflow;
    document.body.removeChild(this.wrapNode);
    this.topOffset = 0;
    this.mouseY = null;
    this.msPerPixel = Infinity;
    window.clearInterval(this.loopId);
    window.clearInterval(this.queuedSpeedChangeId);
    this.loopId = null;
    this.queuedSpeedChangeId = null;
    $(window).unbind('mousemove', this.mouseMoveFn);
    $(window).unbind('keydown',this.keyDownFn);
};

Teleprompter.prototype.nextPixel = function(){
    var me = this;
    if(this.queuedSpeedChangeId){
        window.clearInterval(this.loopId);
        window.clearInterval(this.queuedSpeedChangeId);
        this.loopId = window.setInterval(function(){me.nextPixel()},Math.max(5,this.msPerPixel));
        this.queuedSpeedChangeId = null;
    }
    var pixelAmount = this.forward ? 1 : -1
    if(this.msPerPixel < 5){
        pixelAmount = 5 * (pixelAmount / this.msPerPixel);
    }
    this.topOffset += parseInt(pixelAmount);
    this.textNode.style.marginTop = '' + this.topOffset + 'px';
};

Teleprompter.prototype.handleMouseMove = function(e){
    if (this.mouseY === null){
        this.mouseY = e.pageY;
        this.startMouseY = this.mouseY;
    } else if(e.pageY != this.mouseY){
        this.mouseY = e.pageY;
        if(this.mouseY < this.startMouseY){
            this.forward = false;
        } else{
            this.forward = true;
        }
        this.changeRate(this.getRateByMouseLocation(this.mouseY));
    }
};

Teleprompter.prototype.getRateByMouseLocation = function(mouseY){
    var offset = Math.abs(mouseY - this.startMouseY);
    if (offset == 0){
        return Infinity;
    }
    return Math.max(0.7,5000.0/(offset*offset/5))

};

Teleprompter.prototype.changeRate = function(msPerPixel){
    //positive difference slows it -- more ms per pixel
    window.clearInterval(this.queuedSpeedChangeId);
    if (msPerPixel === Infinity){
        window.clearInterval(this.loopId);
        window.clearInterval(this.queuedSpeedChangeId);
    } else{
        var me = this;
        this.msPerPixel = msPerPixel;
        this.queuedSpeedChangeId = window.setInterval(function(){me.nextPixel()},Math.max(5,this.msPerPixel));
    }
};

Teleprompter.prototype.getNodeOverlay = function(){
    var tpNode = document.createElement('div');
    tpNode.style.overflow = 'hidden';
    tpNode.style.position = 'absolute';
    tpNode.style.width = '100%';
    tpNode.style.top = '0';
    tpNode.style.left = '0';
    tpNode.style.height = '100%';
    tpNode.style.backgroundColor = '#000';
    var tpText = document.createElement('div');
    tpText.style.color = '#DDD';
    tpText.style.fontSize = '50px';
    tpText.appendChild(document.createTextNode(this.text));
    tpNode.appendChild(tpText);
    this.textNode = tpText;
    this.wrapNode = tpNode;
    return tpNode;
};

$(document).ready(function(){
    var tp = new Teleprompter($('#prompter_input').val(), document.body);
    $('#submit').click(function(){
        tp.text = $('#prompter_input').val();
        tp.start();
    })
});
