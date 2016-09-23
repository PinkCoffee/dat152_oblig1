"use strict";


/** DEBUG MSG
 */
function TableUI(parent, logId) {
	this._parent = parent;
	this._logId = logId;
	this._list = document.getElementById("memberList");
	
	this._creating = function() { console.log("creating a new member-entry... "); };
	this._editing = function(id) { console.log("update-button was pushed: ID_" + id); };
	this._deleting = function(id) { console.log("delete-button was pushed: ID_" + id); };
}

/** RETURN LOGID
 */
TableUI.prototype.getLogId = function() {
	return this._logId;
}

/** OPPDATERE nettleser FRA JSON-database
 */
TableUI.prototype.show = function(dataResponse) {
	let data = JSON.parse(dataResponse);
	data = data.updates;
	
	if (data.status) 
		this._logId = data.logId;
	
	if (data.newMembers)
		this.addMembers(this.createArray(data.newMembers));
	
	if (data.deletedMembers)
		this.deleteMembers(this.createArray(data.deletedMembers));
	
	if (data.updatedMembers)
		this.updateMembers(this.createArray(data.updatedMembers));
}

/** GJØR OM TIL ARRAY
 */
TableUI.prototype.createArray = function(arg) {
	if (arg instanceof Array) return arg;
	else return [arg];
}

/** LAG NYE MEDLEMMER
 */
TableUI.prototype.addMembers = function(newMembers) {
	for (let i = 0; i < newMembers.length; i++) {
		let row = this._list.insertRow(-1);
		row.id = "m" + newMembers[i].memberId;
		this.addCells(row, newMembers[i]);
	}
}

/** SLETT MEDLEM
 */
TableUI.prototype.deleteMembers = function(deletedMembers) {
	for (let i = 0; i < deletedMembers.length; i++) {
		this.deleteMemberById(deletedMembers[i]);
	}
}

/** OPPDATER MEDLEMER
 */
TableUI.prototype.updateMembers = function(updatedMembers) {
	for (let i = 0; i < updatedMembers.length; i++) {
		let row = document.getElementById("m" + updatedMembers[i].memberId);
		row.cells[0].innerHTML = updatedMembers[i].firstname;
		row.cells[1].innerHTML = updatedMembers[i].lastname;
		row.cells[2].innerHTML = updatedMembers[i].address;
		row.cells[3].innerHTML = updatedMembers[i].phone;
	}
}

/** SHOW EDIT-PERSON-DIV-elem 
 */
TableUI.prototype.showMemberInput = function(id) {
	document.getElementById("memberEdit").style.display = "inline";
	let fields = this._parent.inputs();
	
	if (id) {
		let row = document.getElementById("m" + id);

		for (let i = 0; i < fields.length; i++) {
			fields[i].value = row.cells[i].innerHTML;
		}

		document.getElementById("sendMember").onclick = (function() {
			this._editing(id);
		}).bind(this);
	} else {
		for (let i = 0; i < fields.length; i++) {
			fields[i].value = "";
		}
		
		document.getElementById("sendMember").onclick = (function() {
			this._creating();
		}).bind(this);
	}
	
	document.getElementById("cancel").onclick = (function() {
		for (let i = 0; i < fields.length; i++) {
			fields[i].value = "";
		}
		document.getElementById("memberEdit").style.display = "none";
	})
}

/** HIDE EDIT-PERSON-DIV-element
 */
TableUI.prototype.hideMemberInput = function(dataResponse) {
	let data = JSON.parse(dataResponse);
	data = data.updatedMember;
	let messageP = document.getElementById("errorMsg");
	if (data.status) {
		document.getElementById("memberEdit").style.display = "none";
		messageP.innerHTML = "";
	} else {
		messageP.innerHTML = "Oisann, her gikk det noe galt!";
	}
}

/** SLETT MEDLEM
 */
TableUI.prototype.deleteMemberById = function(id) {
	let memberList = this._list.rows;
	for (let i = 1; i < memberList.length; i++) {
		if (memberList[i].id == "m" + id) {
			this._list.deleteRow(i); 
			break;
		}
	}
}

/** SLETTE MEDLEM når RESPONS kommer
 */
TableUI.prototype.removed = function(dataResponse) {
	let data = JSON.parse(dataResponse);
	data = data.updatedMember;
	if (data.status) {
		let listOfMembers = this._list.rows;
		for (let i = 1; i < listOfMembers.length; i++) {
			if (listOfMembers[i].id == "m" + data.memberId) {
				this._list.deleteRow(i);
				break;
			}
		}
	}
}

/** OPPRETT CELLER for MEDLEM (data og knapper)
 */
TableUI.prototype.addCells = function(row, member) {
	let cellArray = new Array(6);
	for (let i = 0; i < 6; i++) {
		cellArray[i] = row.insertCell(i);
	}

	cellArray[0].innerHTML = member.firstname;
	cellArray[1].innerHTML = member.lastname;
	cellArray[2].innerHTML = member.address;
	cellArray[3].innerHTML = member.phone;
	
	let editBtn = document.createElement("input");
	editBtn.value = "Endre";
	editBtn.type = "button";
	editBtn.onclick = (function() {
		this.showMemberInput(member.memberId);
	}).bind(this);
	cellArray[4].appendChild(editBtn);

	let delBtn = document.createElement("input");
	delBtn.value = "Fjern";
	delBtn.type = "button";
	delBtn.onclick = (function() {
		this._deleting(member.memberId);
	}).bind(this);
	cellArray[5].appendChild(delBtn);
}
