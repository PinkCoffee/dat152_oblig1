"use strict";

/*
 * En klasse for samling og distribuering av brukerdata fra tabellen
 * Foreløpig inneholder den også metoder som manipulerer tabellen direkte, men
 * det beste hadde vært å ha den funksjonaliteten i en egen klasse
 */
class TableUI {
	constructor() {
		this.table = new TableActions(this)
		this.comm = new AjaxComm()
		this.state = [] // fungerer som HashMap
	}
	
	// Medlemsfunksjoner som kjøres av events
	
	addByButton() {
		// Må bruke bind på eventlisteners som kaller denne metoden, ellers 
		// vil this referere til HTMLButtonElement
		console.log("this: " + this)
		let row = this.table.addRow();
		this.table.toggleEditable(row);
	}
	
	editByButton(rowElement) {
		let row = this.table.findPosition(rowElement)
		let member = this.table.getData(row)
		saveState(row, member)
		this.table.toggleEditable(row)
	}
	
	deleteByButton(rowElement) {
		let row = this.table.findPosition(row)
		comm.deleteMember(row)
	}
	
	submitChanges(rowElement) {
		let row = this.table.findPosition(rowElement)
		let member = this.table.getData(row)
		if (member.validate()) {
			if (!hasState(row)) {
				// Nye medlemmer har ikke tidligere lagret informasjon
				this.comm.insertMember(member)
				this.table.deleteRow(row)
			} else {
				// Eksisterende medlemmer har allerede definert kolonne og tilstand
				this.table.toggleEditable(row)
				this.comm.updateMember(member)
				this.table.restoreState(row)
			}
		}
	}
	
	discardChanges(rowElement) {
		let row = this.table.findPosition(rowElement)
		if (!hasState(row)) {
			this.table.deleteRow(row)
		} else {
			this.table.toggleEditable(row)
			this.table.restoreState(row)
		}
	}
	
	newMembers(members) {
		for (member in members) {
			let row = this.table.addRow()
			this.table.setData(row, member)
		}
	}
	
	updatedMembers(members) {
		for (member in members) {
			let row = this.table.findPosition(member.memberId)
			this.table.setData(row, member)
		}
	}
	
	deletedMembers(members) {
		for (member in members) {
			let row = this.table.findPosition(member.memberId)
			this.table.deleteRow(row)
		}
	}
	
	// Hjelpefunksjoner
	
	/*
	 * Lagrer medlemsdata for senere bruk
	 */
	saveState(row, member) {
		this.state[row] = member
	}
	
	/*
	 * Overskriver medlemsdata med den lagrede tilstanden som fjernes etterpå
	 */
	restoreState(row) {
		member = this.state[row]
		this.state[row] = undefined
		this.table.setData(row, member)
	}
	
	hasState(row) {
		return !!this.state[row] // Omformer sannlige verdier (som objekter) til true
	}
}

function init() {
	window.removeEventListener("load", init)
	let uihandler = new TableUI()
	document.getElementById("add").addEventListener("click", uihandler.addByButton.bind(uihandler))
}

// Vent til dokumentet er ferdig lastet (trenger tilgang til DOM-elementer)
window.addEventListener("load", init)