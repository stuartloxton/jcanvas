(function($) {
	
	$.fn.getContext = function() {
		if(this.data('2dContext')) return;
		else {
			this.data('2dContext', this[0].getContext('2d'));
		}
		return this.data('2dContext');
	}
	
	
	$.fn.drawShape = function() {
		ctx = this.getContext();
		var args = arguments;
		ctx.beginPath();
		
		ctx.moveTo(args[0][0],args[0][1]);
		Array.shift(args);
		
		$.each(args, function() {
			ctx.lineTo(this[0], this[1]);
		})
		
		ctx.fill();
	}
	
	
	
	
})(jQuery);