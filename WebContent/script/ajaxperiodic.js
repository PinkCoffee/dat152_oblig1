"use strict";

class AjaxPeriodic {
	constructor() {
		this.communication = new AjaxComm()
		this.interval = config.requestInterval
		this.id = 0 // ID value of timer 
	}
	
	setSuccessHandler(method) {}
	
	setErrorHandler(method) {}
	
	start() {
		id = window.setTimeout(AjaxComm.getUpdate, interval)
	}
	
	stop() {
		window.clearTimeout(id)
	}
}