"use strict";

class AjaxComm {
	constructor () {
		this.logId = -1
		this.receivedDataHandler = new Array()
	}
	
	/*
	 * Service syntax: get /updates/{logId}
	 */
	getUpdate(logId) {
		let url = config.servicesPath + "/updates"
		const ajax = new AJAXConnection(url)
		ajax.onsuccess = gotUpdate
		ajax.get(null,{'logId': logId})
	}
	
	/*
	 * Service syntax: post /member
	 */
	insertMember(member) {
		let url = config.servicesPath + "/member"
		const ajax = new AJAXConnection(url)
		ajax.onsuccess = gotMember
		ajax.post(null,{'member': member})
	}
	
	/*
	 * Service syntax: put /member/{memberId}
	 */
	updateMember(memberId, member) {
		let url = config.servicesPath + "/member"
		const ajax = new AJAXConnection(url)
		ajax.onsuccess = gotMember
		ajax.put([memberId],{'member': member})
	}
	
	/*
	 * Service syntax: delete /member/{memberId}
	 */
	deleteMember(memberId) {
		let url = config.servicesPath + "/member"
		const ajax = new AJAXConnection(url)
		ajax.onsuccess = gotMember
		ajax.del([memberId])
	}
	
	gotResponse(responseText) {
		console.log("AjaxComm: Recieved data \"" + receivedData + "\".")
		let object = JSON.parse(responseText)
		
		// Proceed if request was understood and processed
		if (object.updates.status) {
			this.logId = object.updates.logId
			
			// Iterate through new, updated and deleted members
		}
		
		
		// Code handle the received data
		this.receivedDataHandler.forEach(method => {method(receivedData)})
	}
	
	gotMember(responseText) {
		console.log("AjaxComm: Recieved data \"" + receivedData + "\".")
		let object = JSON.parse(responseText)
		
		// Send update request if member has been added/updated/deleted
		if (object.updatedMember.status == "true") {
			getUpdate(logId);
		}
	}
}
