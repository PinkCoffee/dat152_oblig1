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
		let jsonObject = JSON.parse(responseText).updates
		
		// Proceed if request was understood and processed
		if (jsonObject.status) {
			this.logId = jsonObject.logId
			
			// Check if there are new members since last update
			if (jsonObject.hasOwnProperty('newMembers')) {
				// Check if there are multiple new members
				if (jsonObject.newMembers instanceof Array) {
					// Multiple new entries; iterate
					for (let i of jsonObject.newMembers) {
						member = parseMember(i)
						// UIHandler.addRow(member)
					}
				} else {
					// Single new entry
					member = parseMember(jsonObject.newMembers)
					// UIHandler.addRow(member)
				}
			}
			
			if (jsonObject.hasOwnProperty('updatedMembers')) {
				if (jsonObject.updatedMembers instanceof Array) {
					for (let i of jsonObject.updatedMembers) {
						member = parseMember(i)
						// UIHandler.editRow(member.memberId, member)
					}
				} else {
					member = parseMember(jsonObject.updatedMembers)
					// UIHandler.editRow(member.memberId, member)
				}
			}
			
			if (jsonObject.hasOwnProperty('deletedMembers')) {
				if (jsonObject.deletedMembers instanceof Array) {
					for (let i of jsonObject.deletedMembers) {
						// UIHandler.removeRow(i)
					}
				} else {
					// UIHandler.removeRow(jsonObject.deletedMembers)
				}
			}
		}
	}
	
	// Hvis vi skal omforme json-objekt til en Member-klasse
	parseMember(member) {
		// TODO selve omformingen
		return member
	}
	
	gotMember(responseText) {
		console.log("AjaxComm: Recieved data \"" + responseText + "\".")
		let jsonObject = JSON.parse(responseText).updatedMember
		
		// Send update request if member has been added/updated/deleted
		if (jsonObject.status) {
			getUpdate(logId);
		}
	}
}
