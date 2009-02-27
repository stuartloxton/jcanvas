(function($) {
	
	var exCanvas = $('<canvas>')[0]; // Create a blank empty canvas not on the page to test features with.
	$.support.fillText = $.isFunction(exCanvas.getContext('2d').fillText);
	$.support.CanvasText = $.browser.mozilla;
	
	$.canvas = {};
	
	$.fn.initAsCanvas = function(options) {
		settings = jQuery.extend({
			height: '100%',
			width:  '100%'
		}, options);
		
		this.find('*').remove();
		
		if(/\%/.test(settings.height)) settings.height = this.height() * (parseInt(settings.height.replace('%', '')) / 100);
		if(/\%/.test(settings.width)) settings.width = this.width() * (parseInt(settings.width.replace('%', '')) / 100);
		
		this.append('<canvas id="' + new Date().getTime() + '" height="' + settings.height + '" width="' + settings.width + '"></canvas>');
		this.data('isCanvas', true);
		return this.find('canvas');
	}
	
	$.fn.getContext = function() {
		if(this.data('isCanvas')) return this.find('canvas')[0].getContext('2d');
		else return this[0].getContext('2d');
	}
	
	
	$.fn.drawShape = function() {
		this.trigger('beforeDraw');
		var ctx = this.getContext();
		var args = arguments;
		ctx.beginPath();
		
		ctx.moveTo(args[0][0],args[0][1]);
		
		$.each(args, function() {
			ctx.lineTo(this[0], this[1]);
		})
		
		ctx.fill();
		this.trigger('afterDraw');
		return this;
	}
	
	$.fn.fillText = function(text, x, y) {
		this.trigger('beforeDraw');
		var ctx = this.getContext();
		if($.support.fillText) {
			ctx.fillText(text, x, y);
		} else {
			if($.support.CanvasText) {
				ctx.translate(x, y);
				ctx.mozDrawText(text)
				ctx.translate(-x, -y);
			} else {
				var canvasOffset = this.offset();
				var div = $('<div>'+text+'</div>').insertAfter(this);
				this.next().css({
						position: 'absolute',
						left: canvasOffset.left + x,
						top: canvasOffset.top + y,
						color: this.fillStyle()
					});
			}
		}
		this.trigger('afterDraw');
		return this;
	}

	$.fn.fillStyle = function(val) {
		var ctx = this.getContext();
		if(val) {
			ctx.fillStyle = val;
			return this;
		} else {
			return ctx.fillStyle;
		}
	}
	
	$.fn.rotate = function(r) {
		if($.canvas[this.getContext().canvas.id] === undefined) $.canvas[this.getContext().canvas.id] = {
			rotation: 0
		};
		this.trigger('beforeDraw');
		this.getContext().rotate(r);
		$.canvas[this.getContext().canvas.id].rotation = val;
		this.trigger('afterDraw');
		return this;
	}
	
	$.fn.rotation = function(val) {
		if($.canvas[this.getContext().canvas.id] === undefined) $.canvas[this.getContext().canvas.id] = {
			rotation: 0
		};
		if(val === undefined) return $.canvas[this.getContext().canvas.id].rotation;
		else {
			if(/^(\-|\+)=/.test(val)) {
				val = parseFloat(val.replace('=', ''));
				$.canvas[this.getContext().canvas.id].rotation += val;
				this.getContext().rotate(val);
			} else {
				this.getContext().rotate(val - $.canvas[this.getContext().canvas.id].rotation);
				$.canvas[this.getContext().canvas.id].rotation = val;
			}
			return this;
		}
	}
	
	var proxiedFuncs = ['translate', 'fillRect', 'strokeRect', 'clearRect', 'moveTo', 'lineTo', 'fill', 'stroke'];
	
	$.each(proxiedFuncs, function(k, i) {
		$.fn[i] = function(a, b, c, d) {
			this.trigger('beforeDraw');
			this.getContext()[i](a, b, c, d);
			this.trigger('afterDraw');
			return this;
		};
	});
	
	
})(jQuery);