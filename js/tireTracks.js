// an overlay canvas that can be drawn onto
// for infinite scorchmarks, skidmarks, dents, mud, etc

var decalManager = function() {

	this.tireTrackCanvas = document.createElement("canvas");
	this.tireTrackCanvas.width = gameCanvas.width;
	this.tireTrackCanvas.height = gameCanvas.height;
	this.tireTrackCTX = this.tireTrackCanvas.getContext('2d'); 
	this.decalCount = 0;
	
	this.add = function(x,y,rot,alpha,color) {
		this.decalCount++;
		if (alpha === undefined) alpha = 0.1;
		if (alpha > 1) alpha = 1;
		if (alpha < 0) alpha = 0;
		if (color==undefined) color = 'black';
		//console.log('addTireTracks:'+x+','+y+','+rot+' alpha:'+alpha);
		//this.tireTrackCTX.save();
		//this.tireTrackCTX.translate(x,y);
		//this.tireTrackCTX.rotate(rot);
		//this.tireTrackCTX.globalAlpha = alpha;
		//this.tireTrackCTX.drawImage(Images.tire_tracks, -9, -9);
		drawImageTinted(this.tireTrackCTX,Images.tire_tracks, x, y, rot, color, alpha);
		//this.tireTrackCTX.restore()
		if (this.decalCount % 200 == 0) // every 200th skidmark
		{
			this.fadeOut();
		}
	};

	this.fadeOut = function() {
		var myImageData = this.tireTrackCTX.getImageData(0,0,this.tireTrackCanvas.width,this.tireTrackCanvas.height);
		var data = myImageData.data;
		for (var i = 0; i < data.length; i += 4) {
		  //data[i] = data[i];     // red
		  //data[i + 1] = data[i + 1]; // green
		  //data[i + 2] = data[i + 2]; // blue
		  if (data[i + 3]>1) data[i + 3]--; // alpha gets fainter
		}
		this.tireTrackCTX.putImageData(myImageData, 0, 0);
	}

	this.draw = function() {
		gameContext.drawImage(this.tireTrackCanvas, 0, 0);
	};

	this.resize = function() {
		this.tireTrackCanvas.width = gameCanvas.width;
		this.tireTrackCanvas.height = gameCanvas.height;
	};

	this.reset = function() {
    this.tireTrackCTX.clearRect(0, 0, this.tireTrackCanvas.width, this.tireTrackCanvas.height);
	};
  
};

var tireTracks = new decalManager(); // so we can call tireTracks.add(x,y,r);
