// an overlay canvas that can be drawn onto
// for infinite scorchmarks, skidmarks, dents, mud, etc

var decalManager = function() {

	this.tireTrackCanvas = document.createElement("canvas");
	this.tireTrackCanvas.width = gameCanvas.width;
	this.tireTrackCanvas.height = gameCanvas.height;
	this.tireTrackCTX = this.tireTrackCanvas.getContext('2d'); 
	
	this.add = function(x,y,rot) {
		//console.log('addTireTracks:'+x+','+y+','+rot);
		this.tireTrackCTX.save();
		this.tireTrackCTX.translate(x,y);
		this.tireTrackCTX.rotate(rot);
		this.tireTrackCTX.drawImage(Images.tire_tracks,0,0);
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