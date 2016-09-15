"use strict";

class AjaxComm {
	constructor () {
		this.logId = -1
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
	
	gotUpdate(responseText) {
		console.log("AjaxComm: Recieved data \"" + receivedData + "\".")
		let jsonObject = JSON.parse(responseText)
		
		// Proceed if request was understood and processed
		if (jsonObject.updates.status) {
			this.logId = jsonObject.updates.logId
			
			// Check if there are new members since last update
			if (jsonObject.updates.hasOwnProperty('newMembers')) {
				// Check if there are multiple new members
				if (jsonObject.updates.newMembers instanceof Array) {
					// Multiple new entries; iterate
				} else {
					// Single new entry
				}
			}
			
			// TODO iterate through updated and deleted members
		}
	}
	
	gotMember(responseText) {
		console.log("AjaxComm: Recieved data \"" + responseText + "\".")
		let jsonObject = JSON.parse(responseText)
		
		// Send update request if member has been added/updated/deleted
		if (jsonObject.updatedMember.status) {
			getUpdate(logId);
		}
	}
}
