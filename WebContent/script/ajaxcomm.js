"use strict";

function AjaxComm (urlEnding, whenConnected){
		let url = config.servicesPath + urlEnding;
		this._ajax = new AJAXConnection(url);
		this._ajax.onsuccess = whenConnected;
	}
	
	/*
	 * Service syntax: post /member
	 */
	AjaxComm.prototype.insertMember = function(member) {
		this._ajax.post("/member",{'member': member})
	}
	
	/*
	 * Service syntax: put /member/{memberId}
	 */
	AjaxComm.prototype.updateMember = function(memberId, member) {
		this._ajax.put([memberId],{'member': member})
	}
	
	/*
	 * Service syntax: delete /member/{memberId}
	 */
	AjaxComm.prototype.deleteMember = function(memberId) {
		this._ajax.del([memberId])
	}
	
	/*
	 * Service syntax: get /updates/{logId}
	 */
	AjaxComm.prototype.getMembersByLogId = function(logId) {
		this._ajax.get([logId]);
	}