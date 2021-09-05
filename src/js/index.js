import Game from "./game"


window.onload = function()
{
	Array.prototype.revFor = function(cb) {
		for (let i = this.length - 1; i >= 0; i--) {
			cb(this[i]);
		}
	}

	Array.prototype.random = function(remove) {
		const r = Math.floor(Math.random()*this.length);
		const i = this[r];

		if(remove) {
			this.splice(r, 1)
		}

		return i;
	}

	

	new Game();

};



