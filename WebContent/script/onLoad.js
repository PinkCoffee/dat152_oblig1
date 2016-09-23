"use strict";
/**
 * Kjører videre når DOM-strukturen er lastet ned
 */
(function() {
	function onLoad() {
		let tableControl = new Controller(window);
		tableControl.begin();
	}
	
	window.addEventListener("DOMContentLoaded", onLoad);
})();
