/**
 * typewriter
 */

(function($){
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this),
			    str = $ele.html(),
			    progress = 0;
			
			$ele.html('');
			setInterval(function() {
				var current = str.substr(progress, 1);
				if(current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress ++;
				}
				
				$ele.html(str.substring(0, progress) + (progress&1?'_':''));
			}, 100);
		});
		return this;
	};
})(jQuery);