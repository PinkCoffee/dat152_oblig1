"use strict";

/*
 * En klasse for manipulering av tabellen
 */
class TableActions {
	constructor(uihandler) {
		this.uihandler = uihandler
		this.tElm = document.getElementById('tElm')
	}
	
	addRow() {
		let pos = tElm.rows.length
		let rowElement = this.tElm.insertRow(pos)
		for (let i = 0; i < 7; ++i) {
			rowElement.insertCell(i)
		}
		
		// Ønsker å skjule medlems-id samtidig som det fins på siden
		rowElement.cells[0].style.display = "none"
		
		let deleteButton = document.createElement("button")
		let deleteText = document.createTextNode("Delete")
		deleteButton.appendChild(deleteText)
		deleteButton.addEventListener("click", this.uihandler.deleteByButton.bind(this.uihandler))
		rowElement.cells[5].appendChild(deleteButton)
		
		let editButton = document.createElement("button")
		let editText = document.createTextNode("Edit")
		editButton.appendChild(editText)
		editButton.addEventListener("click", this.uihandler.editByButton.bind(this.uihandler))
		rowElement.cells[6].appendChild(editButton)
		
		return pos
	}
	
	deleteRow(row) {
		this.tElm.deleteRow(row)
	}
	
	toggleEditable(row) {
		let rowElement = tElm.rows[row]
		let buttonText = rowElement.cells[5].textContent
		console.log("buttonText: " + buttonText)
		console.log("this: " + this)
		if (buttonText == "Delete") {
			// Lås opp cellene (til input-elementer)
			for (let i = 1; i < 5; ++i) {
				this.textToInput(row, i)
			}
			
			let button = rowElement.cells[5].firstElementChild
			button.textContent = "Discard"
			button.removeEventListener("click", this.uihandler.deleteByButton.bind(this.uihandler))
			button.addEventListener("click", this.uihandler.discardChanges.bind(this.uihandler))
			
			button = rowElement.cells[6].firstElementChild
			button.textContent = "Submit"
			button.removeEventListener("click", this.uihandler.editByButton.bind(this.uihandler))
			button.addEventListener("click", this.uihandler.submitChanges.bind(this.uihandler))
		} else {
			// Lås cellene (til tekstnoder)
			for (let i = 1; i < 5; ++i) {
				this.inputToText(row, i)
			}
			
			let button = rowElement.cells[5].firstElementChild
			button.textContent = "Delete"
			button.removeEventListener("click", this.uihandler.discardChanges.bind(this.uihandler))
			button.addEventListener("click", this.uihandler.deleteByButton.bind(this.uihandler))
			
			button = rowElement.cells[6].firstElementChild
			button.textContent = "Edit"
			button.removeEventListener("click", this.uihandler.submitChanges.bind(this.uihandler))
			button.addEventListener("click", this.uihandler.editByButton.bind(this.uihandler))
		}
	}
	
	// Row og cell-parametre er heltall
	textToInput(row, cell) {
		let cellElement = this.tElm.rows[row].cells[cell]
		let input = document.createElement("input")
		input.setAttribute("type", "text")
		
		// Nye rader har ingen tekstnoder i cellene
		if (cellElement.firstChild) {
			input.value = cellElement.textContent
			cellElement.replaceChild(input, cellElement.childNodes[0])
		} else {
			cellElement.appendChild(input)
		}
	}
	
	inputToText(row, cell) {
		let cellElement = this.tElm.rows[row].cells[cell]
		let input = cellElement.firstElementChild
		let textNode = document.createTextNode(input.value)
		cellElement.replaceChild(textNode, input)
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
}