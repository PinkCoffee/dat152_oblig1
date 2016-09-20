"use strict";

/*
 * En klasse for samling og distribuering av brukerdata fra tabellen
 * Foreløpig inneholder den også metoder som manipulerer tabellen direkte, men
 * det beste hadde vært å ha den funksjonaliteten i en egen klasse
 */
class TableUI {
	constructor() {
		this.comm = new AjaxComm()
		document.getElementById("add").addEventListener("click", addByButton, false)
	  	this.tElm = document.forms[0].getElementsByTagName('table')[0]
		this.state = new Object() // fungerer som HashMap
	}
	
	// Medlemsfunksjoner som kjøres av events
	
	addByButton() {
		let row = tElm.rows.length
		addRow()
		toggleEditable(row)
	}
	
	editByButton(rowElement) {
		let row = findPosition(rowElement)
		let member = getData(row)
		saveState(row, member)
		toggleEditable(row)
	}
	
	deleteByButton(rowElement) {
		let row = findPosition(row)
		comm.deleteMember(row)
	}
	
	submitChange(rowElement) {
		let row = findPosition(rowElement)
		let member = getData(row)
		if (member.validate()) {
			if (!hasState(row)) {
				// Nye medlemmer har ikke tidligere lagret informasjon
				comm.insertMember(member)
				deleteRow(row)
			} else {
				// Eksisterende medlemmer har allerede definert kolonne og tilstand
				toggleEditable(row)
				AjaxComm.updateMember(member)
				restoreState(row)
			}
		}
	}
	
	discardChange(rowElement) {
		let row = findPosition(rowElement)
		if (!hasState(row)) {
			deleteRow(row)
		} else {
			toggleEditable(row)
			restoreState(row)
		}
	}
	
	// Medlemsfunksjoner som manipulerer tabellen
	
	addRow() {
		let pos = tElm.rows.length
		this.tElm.insertRow(pos)
		let rowElement = tElm.rows[pos]
		for (let i = 0; i < 7; ++i) {
			rowElement.insertCell(i)
		}
		
		// Ønsker å skjule medlems-id samtidig som det fins på siden
		rowElement.cells[0].style.display = "none"
		
		let deleteButton = document.createElement("button")
		deleteButton.value = "Delete"
		deleteButton.addEventListener("click", deleteByButton, true)
		rowElement.cells[5].appendChild(deleteButton)
		
		let editButton = document.createElement("button")
		editButton.value = "Edit"
		editButton.addEventListener("click", editByButton, true)
		rowElement.cells[6].appendChild(editButton)
	}
	
	deleteRow(row) {
		this.tElm.deleteRow(row)
	}
	
	toggleEditable(row) {
		let rowElement = tElm.rows[row]
		if (rowElement.cells[3].textContent == "Delete") {
			// Lås opp cellene (til input-elementer)
			for (let i = 1; i < 5; ++i) {
				inputToText(row, i)
			}
			
			let button = rowElement.cells[5].firstElementChild
			button.value = "Discard"
			button.removeEventListener("click", deleteByButton)
			button.addEventListener("click", discardChanges, true)
			
			button = rowElement.cells[6].firstElementChild
			button.value = "Submit"
			editButton.removeEventListener("click", editByButton)
			submitButton.addEventListener("click", submitChanges, true)
		} else {
			// Lås cellene (til tekstnoder)
			for (let i = 1; i < 5; ++i) {
				textToInput(row, i)
			}
			
			let button = rowElement.cells[5].firstElementChild
			button.value = "Delete"
			button.removeEventListener("click", discardChanges)
			button.addEventListener("click", deleteByButton, true)
			
			button = rowElement.cells[6].firstElementChild
			button.value = "Edit"
			button.removeEventListener("click", submitChanges)
			button.addEventListener("click", editByButton, true)
		}
	}
	
	// Row og cell-parametre er heltall
	textToInput(row, cell) {
		let cellElement = tElm.rows[row].cell[cell]
		let input = document.createElement("input")
		input.setAttribute("type", "text")
		input.value = cellElement.textContent
		cellElement.replaceChild(cellElement.firstChild, input)
	}
	
	inputToText(row, cell) {
		let cellElement = tElm.rows[row].cell[cell]
		let input = cellElement.firstElementChild
		let textNode = document.createTextNode(input.value)
		cellElement.replaceChild(input, textNode)
	}
	
	// Forventer at raden er skrivebeskyttet
	getData(row) {
		return {
	    		'memberId': tElm.rows[row].cells[0].value,
				'firstname': tElm.rows[row].cells[1].value,
	    		'lastname': tElm.rows[row].cells[2].value,
	    		'address': tElm.rows[row].cells[3].value,
	    		'phone': tElm.rows[row].cells[4].value
	    }
	}
	
	setData(row, member) {
		tElm.rows[row].cells[0].value = member.memberId
		tElm.rows[row].cells[1].value = member.firstname
		tElm.rows[row].cells[2].value = member.lastname
		tElm.rows[row].cells[3].value = member.address
		tElm.rows[row].cells[4].value = member.phone
	}
	
	// Hjelpefunksjoner
	
	/*
	 * TODO bruk row.addEventListener("onclick", xByButton(this), true) 
	 * Alternativt: ha egne instanser for hvert medlem 
	 */
	findPosition(memberId) {
		for (let row in tElm.rows) {
			if (row.cells[0].textContent == memberId) {
				return row.rowIndex
			}
		}
		return undefined
	}
	
	/*
	 * Lagrer medlemsdata for senere bruk
	 */
	saveState(row, member) {
		state[row] = member
	}
	
	/*
	 * Overskriver medlemsdata med den lagrede tilstanden som fjernes etterpå
	 */
	restoreState(row) {
		member = state[row]
		state[row] = undefined
		// editRow(row, member)
	}
	
	hasState(row) {
		return !!state[row] // Omformer sannlige verdier (som objekter) til true
	}
}

// Vent til dokumentet er ferdig lastet (trenger tilgang til DOM-elementer)
window.addEventListener("load", constructor, true)