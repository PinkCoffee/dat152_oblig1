"use strict";

class AjaxComm {
	constructor () {
		this.logId = -1
	}
	
	/*
	 * Service syntax: get /updates/{logId}
	 */
	getUpdate() {
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
		const ajax = new AJAXConnection(url, config.requestType)
		ajax.onsuccess = gotMember
		ajax.post(null,{'member': member})
	}
	
	/*
	 * Service syntax: put /member/{memberId}
	 */
	updateMember(memberId, member) {
		let url = config.servicesPath + "/member"
		const ajax = new AJAXConnection(url, config.requestType)
		ajax.onsuccess = gotMember
		ajax.put([memberId],{'member': member})
	}
	
	/*
	 * Service syntax: delete /member/{memberId}
	 */
	deleteMember(memberId) {
		let url = config.servicesPath + "/member"
		const ajax = new AJAXConnection(url, config.requestType)
		ajax.onsuccess = gotMember
		ajax.del([memberId])
	}
	
	gotUpdate(responseText) {
		console.log("AjaxComm: Recieved data \"" + receivedData + "\".")
		let jsonObject = JSON.parse(responseText).updates
		
		// Fortsett dersom ajax-forespørsel var forstått
		if (jsonObject.status) {
			this.logId = jsonObject.logId
			
			// Sjekk for nye medlemmer
			if (jsonObject.hasOwnProperty('newMembers')) {
				// Sjekk om det er en eller flere medlemmer det er snakk om
				if (jsonObject.newMembers instanceof Array) {
					// Flere oppføringer; iterer
					for (let i of jsonObject.newMembers) {
						let member = parseMember(i)
						// UIHandler.addRow(member)
					}
				} else {
					// En oppføring
					let member = parseMember(jsonObject.newMembers)
					// UIHandler.addRow(member)
				}
			}
			
			if (jsonObject.hasOwnProperty('updatedMembers')) {
				if (jsonObject.updatedMembers instanceof Array) {
					for (let i of jsonObject.updatedMembers) {
						let member = parseMember(i)
						// UIHandler.editRow(member.memberId, member)
					}
				} else {
					let member = parseMember(jsonObject.updatedMembers)
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
	
	// TODO hvis vi skal omforme json-objekt til en Member-klasse
	parseMember(member) {
		return member
	}
	
	gotMember(responseText) {
		console.log("AjaxComm: Recieved data \"" + responseText + "\".")
		let jsonObject = JSON.parse(responseText).updatedMember
		
		// Send update-forespørsel hvis medlem har blitt lagt til/endret/slettet
		if (jsonObject.status) {
			getUpdate();
		}
	}
}
