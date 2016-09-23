"use strict";

/** INITIERING
 */
function Controller(parent) {
	this._parent = parent;
	this._gui = new TableUI(this, -1);
	this._http = new AjaxComm("/updates", this._gui.show.bind(this._gui));
	this._gui._editing = this.put.bind(this);
	this._gui._deleting = this.del.bind(this);
	this._gui._creating = this.post.bind(this);
}

/** LYTT ETTER å ha LAGT TIL
 */
Controller.prototype.begin = function() {
	document.getElementById("memberAdd").onclick = (function() {
		this.showMemberInput(null);
	}).bind(this._gui);
	this._http.getMembersByLogId(this._gui.getLogId());

	this.refresh();
}

/** OPPDATER LISTEN JEVNLIG
 */
Controller.prototype.refresh = function() {
	this._parent.setTimeout((function() {
		this._http.getMembersByLogId(this._gui.getLogId());
		this.refresh();
	}).bind(this), 3000);
}

/** LEGG TIL MEDLEM
 */
Controller.prototype.post = function() {
	let member = this.inputs();
	member = this.arrayToJSON(member);
	let http = new AjaxComm("/member", this._gui.hideMemberInput);
	http.insertMember(member);
}

/** OPPDATER MEDLEM i database (person)
 */
Controller.prototype.put = function(id) {
	let http = new AjaxComm("/member", this._gui.hideMemberInput);
	let fields = this.inputs();
	let member = this.arrayToJSON(fields); //JSON OBJECT

	http.updateMember(id, member);
	member.memberId = id;
	this._gui.updateMembers([member]);
}

/** SLETT MEDLEM (person)
 */
Controller.prototype.del = function(id) {
	let http = new AjaxComm("/member", this._gui.removed.bind(this._gui));
	http.deleteMember(id);
}

/** SKAFFER EDIT-INFO
 */
Controller.prototype.inputs = function() {
	function el(val) { return document.getElementById(val); };
	return [el("fName"), el("lName"), el("address"), el("phone")];
}

/** DATA til JSON-fil
 */
Controller.prototype.arrayToJSON = function(member) {
	return {
		"firstname": member[0].value,
		"lastname": member[1].value,
		"address": member[2].value,
		"phone": member[3].value
	}
}