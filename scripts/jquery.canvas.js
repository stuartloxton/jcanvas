(function($) {
	
	var exCanvas = $('<canvas>')[0]; // Create a blank empty canvas not on the page to test features with.
	$.support.fillText = $.isFunction(exCanvas.getContext('2d').fillText);
	$.support.CanvasText = $.browser.mozilla;
	
	$.fn.initAsCanvas = function(options) {
		settings = jQuery.extend({
			height: '100%',
			width:  '100%'
		}, options);
		
		this.find('*').remove();
		
		if(/\%/.test(settings.height)) settings.height = this.height() * (parseInt(settings.height.replace('%', '')) / 100);
		if(/\%/.test(settings.width)) settings.width = this.width() * (parseInt(settings.width.replace('%', '')) / 100);
		
		this.append('<canvas height="' + settings.height + '" width="' + settings.width + '"></canvas>');
		this.data('isCanvas', true);
		return this.find('canvas');
	}
	
	$.fn.getContext = function() {
		if(this.data('isCanvas')) return this.find('canvas')[0].getContext('2d');
		else return this[0].getContext('2d');
	}
	
	
	$.fn.drawShape = function() {
		var ctx = this.getContext();
		var args = arguments;
		ctx.beginPath();
		
		ctx.moveTo(args[0][0],args[0][1]);
		
		$.each(args, function() {
			ctx.lineTo(this[0], this[1]);
		})
		
		ctx.fill();
		return this;
	}
	
	$.fn.fillText = function(text, x, y) {
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
		this.getContext().rotate(r);
		return this;
	}
	
	$.fn.translate = function(x, y) {
		this.getContext().translate(x, y);
		return this;
	}
	
	$.fn.fillRect = function(x, y, w, h) {
		this.getContext().fillRect(x, y, w, h);
		return this;
	}
	
	$.fn.strokeRect = function(x, y, width, height) {
		this.getContext().strokeRect(x, y, width, height);
		return this;
	}
	
	$.fn.clearRect = function(x, y, width, height) {
		this.getContext().clearRect(x, y, width, height);
		return this;
	}
	
	
})(jQuery);