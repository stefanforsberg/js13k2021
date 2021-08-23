import Game from "./game"


window.onload = function()
{
	Array.prototype.revFor = function(cb) {
		for (let i = this.length - 1; i >= 0; i--) {
			cb(this[i]);
		}
	}

	new Game();

};



