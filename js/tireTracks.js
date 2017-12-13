// an overlay canvas that can be drawn onto
// for infinite scorchmarks, skidmarks, dents, mud, etc

var decalManager = function() {

	this.tireTrackCanvas = document.createElement("canvas");
	this.tireTrackCanvas.width = gameCanvas.width;
	this.tireTrackCanvas.height = gameCanvas.height;
	this.tireTrackCTX = this.tireTrackCanvas.getContext('2d'); 
	
	this.add = function(x,y,rot,alpha) {
		if (alpha==undefined) alpha = 0.1;
		if (alpha>1) alpha=1;
		if (alpha<0) alpha=0;
		//console.log('addTireTracks:'+x+','+y+','+rot+' alpha:'+alpha);
		this.tireTrackCTX.save();
		this.tireTrackCTX.translate(x,y);
		this.tireTrackCTX.rotate(rot);
		this.tireTrackCTX.globalAlpha=alpha;
		this.tireTrackCTX.drawImage(Images.tire_tracks,-9,-9);
		this.tireTrackCTX.restore()
	}

	this.draw = function() {
		gameContext.drawImage(this.tireTrackCanvas, 0, 0);
	}

	this.resize = function() {
		this.tireTrackCanvas.width = gameCanvas.width;
		this.tireTrackCanvas.height = gameCanvas.height;
	}
  
}

var tireTracks = new decalManager(); // so we can call tireTracks.add(x,y,r);