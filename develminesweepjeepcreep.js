/*
function displayVerboseOutput() {
	var verbosereadout = document.getElementById('verbosereadout');
	if (verbosereadout) {
		var currentsetting = verbosereadout.style.display;
		verbosereadout.style.display = 'inline-block';
	}else{

	}
}
*/

'use strict';

var imagedir = "http://thisisafakeemail.org:8080/";

function arrayShuffle(arraytoshuffle){
	var temporaryarray = new Array();
	while(arraytoshuffle.length > 0){
		var randomindex = Math.floor(Math.random()*(arraytoshuffle.length-.1));
		temporaryarray[temporaryarray.length]=arraytoshuffle[randomindex];
		arraytoshuffle.splice(randomindex, 1);
	}

	for (var i = 0; i < temporaryarray.length; i++){
		arraytoshuffle[i] = temporaryarray[i];
	}
	
	return arraytoshuffle;
}

function removeCSSUnit(string){
	string = string.split("px")[0];
	string = string.split("%")[0];
	if(!string){string=0;}

	return string;

}

function fitAndPositionChild(e){
	var parent = e.parentElement;
	var parentstyle = window.getComputedStyle(parent);
	var style = window.getComputedStyle(e);

	var parentpaddingtop = removeCSSUnit(parentstyle.getPropertyValue('padding-top'));
	var parentpaddingleft = removeCSSUnit(parentstyle.getPropertyValue('padding-left'));
	var parentpaddingright = removeCSSUnit(parentstyle.getPropertyValue('padding-right'));
	var parentpaddingbottom = removeCSSUnit(parentstyle.getPropertyValue('padding-bottom'));

	var parentmargintop = removeCSSUnit(parentstyle.getPropertyValue('margin-top'));
	var parentmarginleft = removeCSSUnit(parentstyle.getPropertyValue('margin-left'));
	var parentmarginright = removeCSSUnit(parentstyle.getPropertyValue('margin-right'));
	var parentmarginbottom = removeCSSUnit(parentstyle.getPropertyValue('margin-bottom'));

	var parentbordertop = removeCSSUnit(parentstyle.getPropertyValue('border-top'));
	var parentborderleft = removeCSSUnit(parentstyle.getPropertyValue('border-left'));
	var parentborderright = removeCSSUnit(parentstyle.getPropertyValue('border-right'));
	var parentborderbottom = removeCSSUnit(parentstyle.getPropertyValue('border-bottom'));

	var parentwidth = removeCSSUnit(parentstyle.getPropertyValue('width'));
	var parentheight = removeCSSUnit(parentstyle.getPropertyValue('height'));

	var margintop = removeCSSUnit(style.getPropertyValue('margin-top'));
	var marginleft = removeCSSUnit(style.getPropertyValue('margin-left'));
	var marginright = removeCSSUnit(style.getPropertyValue('margin-right'));
	var marginbottom = removeCSSUnit(style.getPropertyValue('margin-bottom'));

	var bordertop = removeCSSUnit(style.getPropertyValue('border-top'));
	var borderleft = removeCSSUnit(style.getPropertyValue('border-left'));
	var borderright = removeCSSUnit(style.getPropertyValue('border-right'));
	var borderbottom = removeCSSUnit(style.getPropertyValue('border-bottom'));

/*	alert(borderbottom);*/
	
	e.style.width = (parentwidth - parentpaddingleft - parentpaddingright - borderleft - borderright - marginleft - marginright)+"px";
	e.style.height = (parentheight - parentpaddingtop - parentpaddingbottom - bordertop - borderbottom - margintop - marginbottom)+"px";

	e.style.top = "-"+(parseInt(parentheight)+parseInt(parentmarginbottom)+parseInt(parentmargintop)+parseInt(parentborderbottom)+parseInt(parentbordertop))+"px";
	e.style.left = "-"+(parseInt(parentpaddingleft)+parseInt(marginleft))+"px";
	/*
	alert(e.style.top);
	alert(parseInt(parentheight)+parseInt(parentmarginbottom)+parseInt(parentmargintop)+parseInt(parentborderbottom)+parseInt(parentbordertop))
*/
}

class DivPalette {
	constructor(backgroundcolors, foregroundcolors, bordercolors){
		this.backgroundcolors = backgroundcolors;
		this.foregroundcolors = foregroundcolors;
		this.bordercolors = bordercolors;

		if( !bordercolors || bordercolors.length < foregroundcolors.length ){
			var bordercolorlength = bordercolors.length;
			if(bordercolorlength == 0){
				bordercolors[0] = this.foregroundcolors[0];
				bordercolorlength = 1;
			}
			for(var i = bordercolors.length; i < foregroundcolors.length; i++ ){
				bordercolors[i]=bordercolors[bordercolorlength-1]
			}
		}
	}

	setColors(e, state){
		e.style.backgroundColor = this.backgroundcolors[state];
		e.style.color = this.foregroundcolors[state];
		e.style.borderColor = this.bordercolors[state];
	}

	getState(e){
		for(var i = 0; i < this.backgroundcolors.length; i++){
			if(e.style.backgroundColor.toLowerCase() == this.backgroundcolors[i].toLowerCase()){
				if(e.style.color.toLowerCase() == this.foregroundcolors[i].toLowerCase()){
					if(e.style.borderColor.toLowerCase() == this.bordercolors[i].toLowerCase()){
						return i;
					}
				}
			}
		}
	}


	static toggleVisibility(e){
		if(e.style.display == 'none'){
			e.style.display = 'inline-block';			
		}else if(e.style.display == 'inline-block'){
			e.style.display = 'none';
		}
	}

	static visibilityOn(e){
		e.style.display = 'inline-block';
	}

	static visibilityOff(e){
		e.style.display = 'none';
	}
}

class TiledGameboard {
	constructor(parentElement, id, charset) {		
		this.defaultpalette = new DivPalette( [ 'OldLace', 'Peru', 'DarkRed', 'RosyBrown', 'SaddleBrown', 'FireBrick', 'LightCyan', 'Tomato' ],
						 [ 'Plum', 'Azure', 'Tomato', 'RosyBrown', 'SaddleBrown', 'Black', 'Black', 'DarkRed' ],
						 [ 'NavajoWhite' ]  );

		this.parentElement = parentElement;
		this.id = id;

		this.me;
		this.style;
		this.initialstyle;
		this.parentstyle;

		this.mypalette = this.defaultpalette;

		this.gametitle;		
		this.gametitlestyle;
		this.gametitleinitialstyle;

		this.gametitlepalette = this.defaultpalette;

		this.gamecellrows = new Array();
		this.gamecellrowsstyles = new Array();
		this.gamecellrowsinitialstyles = new Array();

		this.gamecellrowpalette = this.defaultpalette;

		this.gamecellcontainers = new Array();
		this.gamecellcontainersstyles = new Array();
		this.gamecellcontainersinitialstyles = new Array();

		this.gamecellcontainerpalette = this.defaultpalette;

		this.gamecells = new Array();
		this.gamecellsstyles = new Array();
		this.gamecellsinitialstyles = new Array();

		this.gamecellpalette = this.defaultpalette;

		this.gamepieces = new Array();
		this.gamepiecetypes = charset;

		this.gamepiecetextures = new Array();
		this.texturedirectory = "./";

		this.texturedgamecells = new Array();
		this.texturedgamecellsstyles = new Array();
		this.texturedgamecellsinitialstyles = new Array();

		this.texturedgamecellpalette = this.defaultpalette;

		this.gamecellveils = new Array();
		this.gamecellveilsstyles = new Array();
		this.gamecellveilsinitialstyles = new Array();

		this.gamecellveilpalette = this.defaultpalette;

		this.gamebuttons = new Array();
		this.gamebuttonsstyles = new Array();
		this.gamebuttonsinitialstyles = new Array();

		this.gamebuttonpalette = this.defaultpalette;

		this.width;
		this.height;
		this.area;

		if(!this.verifyOrEstablishExistence()){
			
		}

		this.me = document.getElementById(this.id);
		this.initialstyle = window.getComputedStyle(this.me);
		this.parentstyle = window.getComputedStyle(this.me.parentElement);

		if(!this.verifyOrEstablishRelationship()){

		}

		this.updateStyle();

		this.populateDescendents();

		if (this.texturedgamecells.length == 0){
			this.createTextureCells();
		}
	}

	simpleShuffle(){
	var debugcounter=0;
		this.gamecellcontainers = arrayShuffle(this.gamecellcontainers);

		for(var a = 0; a < this.area; a++){
			this.gamecells[a].id = 't'+this.gamecells[a].id;
			this.texturedgamecells[a].id = 't'+this.texturedgamecells[a].id;
			this.gamecellveils[a].id = 't'+this.gamecellveils[a].id;
			this.gamecellcontainers[a].id = 't'+this.gamecellcontainers[a].id;
			this.gamecells[a].parentElement.removeChild(this.gamecells[a]);
			this.texturedgamecells[a].parentElement.removeChild(this.texturedgamecells[a]);
			this.gamecellveils[a].parentElement.removeChild(this.gamecellveils[a]);
			this.gamecellcontainers[a].parentElement.removeChild(this.gamecellcontainers[a]);
		}
		var k = 0;
		for(var i = 0; i < this.height; i++){
			for(var j = 0; j < this.width; j++){
				var originalcoords = this.gamecellcontainers[k].id.substring(19).split("_");

				var originalindex = this.coordToIndex(originalcoords[0], originalcoords[1]);

				this.gamecellcontainers[k].id = "gamecellcontainer_"+i+"_"+j;	

				var tempgamecell = this.gamecells[originalindex];
				this.gamecells[originalindex] = this.gamecells[k];
				this.gamecells[originalindex].id = "gamecell_"+originalcoords[0]+"_"+originalcoords[1]; 
				this.gamecells[k] = tempgamecell;
				this.gamecells[k].id = "gamecell_"+i+"_"+j;
				tempgamecell = 0;

				var temptexturedgamecell = this.texturedgamecells[originalindex];
				this.texturedgamecells[originalindex] = this.texturedgamecells[k];
				this.gamecells[originalindex].id = "texturedgamecell_"+originalcoords[0]+"_"+originalcoords[1]; 
				this.texturedgamecells[k] = temptexturedgamecell;
				this.texturedgamecells[k].id = "texturedgamecell_"+i+"_"+j;
				temptexturedgamecell = 0;

				var tempgamecellveil = this.gamecellveils[originalindex];
				this.gamecellveils[originalindex] = this.gamecellveils[k];
				this.gamecellveils[originalindex].id = "gamecell_"+originalcoords[0]+"_"+originalcoords[1]+"_veil"; 
				this.gamecellveils[k] = tempgamecellveil;
				this.gamecellveils[k].id = "gamecell_"+i+"_"+j+"_veil";
				tempgamecellveil = 0;

				var tempgamepiece = this.gamepieces[originalindex];
				this.gamepieces[originalindex] = this.gamepieces[k];
				this.gamepieces[k] = tempgamepiece;
				tempgamepiece=0;

				this.gamecellrows[i].appendChild(this.gamecellcontainers[k]);
			
				this.gamecellcontainers[k].appendChild(this.gamecellveils[k]);  
				this.gamecellcontainers[k].appendChild(this.gamecells[k]);
				this.gamecellcontainers[k].appendChild(this.texturedgamecells[k]);
				this.gamecellcontainers[originalindex].appendChild(this.gamecellveils[originalindex]);
				this.gamecellcontainers[originalindex].appendChild(this.gamecells[originalindex]);
				this.gamecellcontainers[originalindex].appendChild(this.texturedgamecells[originalindex]);

				k++;
			}
		}
/*
		for(var i=0; i<this.gamecells.length; i++){
			alert('flying on '+this.gamecells[i].id+' in '+this.gamecellcontainers[i].id); 
			if( this.gamecells[i].id.match(/tgamecell/) ){
				alert('landing on '+i);

				this.gamecells[i].parentElement.removeChild(this.gamecells[i]);
			}
		}*/
	}

	setValue(index, value){
		if(!this.texturedgamecells[index]){
			alert("error at index: "+index+" while setting value: "+value);
		}
		this.texturedgamecells[index].textContent = value;
		this.gamecells[index].textContent = value;
		this.gamepieces[index] = value;
		this.refreshTexture(index);
	}

	createTextureCells(){
		for(var i = 0; i < this.gamecells.length; i++){
			var coords = this.indexToCoord(i);
			var x = coords[1];
			var y = coords[0];
			this.texturedgamecells[i] = document.createElement("div");
			this.texturedgamecells[i].className = 'texturedgamecell';
			this.texturedgamecells[i].id = "texturedgamecell_"+y+"_"+x;
			this.texturedgamecellsinitialstyles[i] = window.getComputedStyle(this.texturedgamecells[i]);
			this.texturedgamecells[i].style.display = this.gamecells[i].style.display;
			this.gamecells[i].parentElement.appendChild(this.texturedgamecells[i]);
			this.texturedgamecellsstyles[i] = window.getComputedStyle(this.texturedgamecells[i]);
			fitAndPositionChild(this.texturedgamecells[i]);

			/*not sure I should do this*/
			this.texturedgamecells[i].style.fontSize = "0px";
			this.texturedgamecells[i].textContent = this.gamepieces[i];

			/*move this color elsewhere so it isn't manual*/

			this.defaultpalette.setColors(this.texturedgamecells[i],0)
		}
	}

	setTextureMapping(gamepiecelist, texturenamelist){
		for(var i = 0; i < gamepiecelist.length; i++){
			for(var j = 0; j < this.gamepiecetypes.length; j++){
				if(this.gamepiecetypes[j] == gamepiecelist[i]){
					this.gamepiecetextures[j] = texturenamelist[i];
					j=this.gamepiecetypes.length;
				}
			}
		}

		this.deployTexture();
	}

	whichPieceIsIt(piece){
		for(var i = 0; i < this.gamepiecetypes.length; i++){
			if(this.gamepiecetypes[i] == piece){
				return i;
			}
		}alert("fouling with "+piece);
		return -1;
	}

	deployTexture(){
		for(var i = 0; i < this.texturedgamecells.length; i++){
			this.refreshTexture(i);
		}
	}

	refreshTexture(i){
		this.texturedgamecells[i].style.backgroundImage = "url('"+this.texturedirectory+this.gamepiecetextures[this.whichPieceIsIt(this.gamepieces[i])]+"')";
	}
	
	verifyOrEstablishRelationship(){
		if(!(this.me.parentElement == this.parentElement)){
			this.parentElement.appendChild(this.me);
		}
	}

	verifyOrEstablishExistence(){
		if(document.getElementById('this.id')){
			return true;
		}
		this.generateNewGameboard();
		return false;
	}

	getGameElement(x, y, type){
		var index = ( y * width ) + x;
		if(type == 'gamecellcontainer'){
			return gamecellcontainers[index];
		}else if(type == 'gamecell'){
			return gamecellcontainers[index];
		}else if(type == 'texturedgamecell'){
			return gamecellcontainers[index];
		}else if(type == 'gamecellveil'){
			return gamecellveils[index];
		}
		
	}


	refreshElementStyle(x, y, type){
		
	}

	getCoordinatesFromId(id){
		var coords;
		if( id.match(/gamecellrow/) ){
			coords = id.substring(11);
		}else if ( id.match(/gamecellcontainer/) ){
			coords = id.substring(18).split("_");
		}else if ( id.match(/^gamecell\_[0-9]+\_[0-9]+$/ ) ){
			coords = id.substring(9).split("_");
		}else if ( id.match(/^texturedgamecell\_[0-9]+\_[0-9]+$/) ){
			coords = id.substring(17).split("_");
		}else if ( id.match(/^gamecell\_[0-9]+\_[0-9]+\_veil$/) ){
			var tempcoords = id.substring(9).split("_");
			coords = [ tempcoords[0], tempcoords[1] ];
		}
		return coords;
	}

	populateDescendents(){
		var debugmessagecounter=0;
		var amdone=0;
		var childrenBeingProcessed = this.me.children;
		var whereChildrenCouldBeHiding = new Array();

		while( !amdone ){
			for( var i = 0; i < childrenBeingProcessed.length && debugmessagecounter < 10 ; i++){
				if( !(childrenBeingProcessed[i].id.match(/gamecell[_]/)) && childrenBeingProcessed[i].children.length > 0 ) {
					for( var j = 0; j<childrenBeingProcessed[i].children.length; j++ ){
						whereChildrenCouldBeHiding[whereChildrenCouldBeHiding.length]=childrenBeingProcessed[i].children[j];
					}
				}
				if( childrenBeingProcessed[i].id.match(/gamecellrow/)  ){
					this.gamecellrows[this.gamecellrows.length]=childrenBeingProcessed[i];
					this.gamecellrowsstyles[this.gamecellrowsstyles.length]=window.getComputedStyle(this.gamecellrows[this.gamecellrows.length-1]);
					this.gamecellrowsinitialstyles[this.gamecellrowsinitialstyles.length]=window.getComputedStyle(this.gamecellrows[this.gamecellrows.length-1]);
				}else if( childrenBeingProcessed[i].id.match(/gamecellcontainer/) ){
					this.gamecellcontainers[this.gamecellcontainers.length]=childrenBeingProcessed[i];
					this.gamecellcontainersstyles[this.gamecellcontainersstyles.length]=window.getComputedStyle(this.gamecellcontainers[this.gamecellcontainers.length-1]);
					this.gamecellcontainersinitialstyles[this.gamecellcontainersinitialstyles.length]=window.getComputedStyle(this.gamecellcontainers[this.gamecellcontainers.length-1]);
				}else if( childrenBeingProcessed[i].id.match(/^gamecell\_[0-9]+\_[0-9]+$/) ){
					this.gamecells[this.gamecells.length]=childrenBeingProcessed[i];
					this.gamepieces[this.gamepieces.length]=this.gamecells[this.gamecells.length-1].textContent.trim();
					if(this.gamepiecetypes.length == 0){
						this.gamepiecetypes[0]=this.gamepieces[this.gamepieces.length-1];
					}else{
						for(var j = 0; j < this.gamepiecetypes.length; j++){
							if(this.gamepiecetypes[j] == this.gamepieces[this.gamepieces.length-1]){
								j=this.gamepiecetypes.length
							}else if (j == this.gamepiecetypes.length-1){
								this.gamepiecetypes[this.gamepiecetypes.length]=this.gamepieces[this.gamepieces.length-1];
							}
						}
					}
					this.gamecellsstyles[this.gamecellsstyles.length]=window.getComputedStyle(this.gamecells[this.gamecells.length-1]);
					this.gamecellsinitialstyles[this.gamecellsinitialstyles.length]=window.getComputedStyle(this.gamecells[this.gamecells.length-1]);
				}else if( childrenBeingProcessed[i].id.match(/^texturedgamecell\_[0-9]+\_[0-9]+$/) ){
					this.texturedgamecells[this.texturedgamecells.length]=childrenBeingProcessed[i];
					this.texturedgamecellsstyles[this.texturedgamecellsstyles.length]=window.getComputedStyle(this.texturedgamecells[this.texturedgamecells.length-1]);
					this.texturedgamecellsinitialstyles[this.texturedgamecellsinitialstyles.length]=window.getComputedStyle(this.texturedgamecells[this.texturedgamecells.length-1]);
				}else if( childrenBeingProcessed[i].id.match(/^gamecell\_[0-9]+\_[0-9]+\_veil$/) ){
					this.gamecellveils[this.gamecellveils.length]=childrenBeingProcessed[i];
					this.gamecellveilsstyles[this.gamecellveilsstyles.length]=window.getComputedStyle(this.gamecellveils[this.gamecellveils.length-1]);
					this.gamecellveilsinitialstyles[this.gamecellveilsinitialstyles.length]=window.getComputedStyle(this.gamecellveils[this.gamecellveils.length-1]);
				}else if( childrenBeingProcessed[i].id.match(/^gametitle$/) ){
					this.gametitle=childrenBeingProcessed[i];
					this.gametitlestyle=window.getComputedStyle(this.gametitle);
					this.gametitleinitialstyle=window.getComputedStyle(this.gametitle);
				}else if( childrenBeingProcessed[i].id.match(/.*button.*/) ){
					this.gamebuttons[this.gamebuttons.length]=childrenBeingProcessed[i];
					this.gamebuttonsstyles[this.gamebuttonsstyles.length]=window.getComputedStyle(this.gamebuttons[this.gamebuttons.length-1]);
					this.gamebuttonsinitialstyles[this.gamebuttonsinitialstyles.length]=window.getComputedStyle(this.gamebuttons[this.gamebuttons.length-1]);
				}
			
			}

			if ( whereChildrenCouldBeHiding.length == 0 ){
				amdone=1;
			}else{
				childrenBeingProcessed = new Array();
				for ( var i = 0; i < whereChildrenCouldBeHiding.length; i++ ){
					childrenBeingProcessed[childrenBeingProcessed.length]=whereChildrenCouldBeHiding[i];
				}
				whereChildrenCouldBeHiding = new Array();
			}

		}

		this.area=this.gamecellcontainers.length;
		this.height=this.gamecellrows.length;
		this.width=this.area/this.height;

	}

	generateNewGameboard(){
		
	}
	
	updateStyle(){
		this.style = window.getComputedStyle(this.me);
	}

	getStyle(){
		return this.style;
	}

	coordToIndex(i, j){
		return parseInt(this.width * i)+parseInt(j);
	}

	indexToCoord(k){
		var y = Math.floor(k/this.width);
		var x = k-(y*this.width);
		return [y,x];

	}

	setColors(e, i){
		this.defaultpalette.setColors(e, i);
	}
}

class MineSweeper{
	constructor(gameboardid, reqcharset){
		this.charset = reqcharset;
		this.flagcolor = "RosyBrown";

		this.gameover=0;
		this.firstclick=1;

		this.gameboard = document.getElementById(gameboardid);

		this.minesweepboard = new TiledGameboard(gameboard.parentElement, gameboardid, this.charset);
		this.minesweepboard.texturedirectory = imagedir;

		this.gameboardbackground = this.gameboard.style.backgroundColor;
		this.width = this.minesweepboard.width;
		this.height = this.minesweepboard.height;
		this.area = this.minesweepboard.area;

		this.resetbutton = this.minesweepboard.gamebuttons[0];
		this.gametitle = this.minesweepboard.gametitle;

		this.setgamepieces();
		this.setcharset(this.charset);

	}

	defusefirstbomb(i, j){
		var indextocheck = parseInt(i) * parseInt(this.width)
		indextocheck = parseInt(indextocheck) + parseInt(j);
		if ( this.minesweepboard.gamepieces[indextocheck] == this.charset[9] ){
			for(var y = -1; y < 2; y++){
				for(var x = -1; x < 2; x++){
					if(parseInt(j)+parseInt(x) < this.width && parseInt(i) + parseInt(y) < this.height && parseInt(j)+parseInt(x) >= 0 && parseInt(i) + parseInt(y) >= 0){
						var offsetindex = parseInt(indextocheck)+parseInt(x);
						var offsetindex = parseInt(offsetindex)+parseInt(y*this.width);

						if(x==0 && y==0){
							var nearbybombcount = 0;
							var bomboffset;
							for( var a = -1; a < 2; a++){
								for( var b = -1; b < 2; b++){
								bomboffset = parseInt(indextocheck)+parseInt(a*this.width);
								bomboffset = parseInt(bomboffset)+parseInt(b);
									if(!(b==a && b==0) && parseInt(b)+parseInt(j) >=0 && parseInt(a)+parseInt(i) >= 0 && parseInt(b)+parseInt(j) < this.width && parseInt(a)+parseInt(i) < this.height && this.minesweepboard.gamepieces[bomboffset] == this.charset[9]){
										nearbybombcount++;
/*alert(this.minesweepboard.gamepieces[bomboffset]+' at '+b+' '+a+' '+this.minesweepboard.gamecells[bomboffset].id);*/
									}
								}
							}
							this.minesweepboard.setValue(offsetindex, this.charset[nearbybombcount]);
							alert("wow, looks like that one was a dud");
						}else if( this.minesweepboard.gamepieces[offsetindex] != this.charset[9] ){
							var newvalue = (parseInt(this.minesweepboard.whichPieceIsIt(this.minesweepboard.gamepieces[offsetindex]))-parseInt(1));
							this.minesweepboard.setValue(offsetindex, this.charset[newvalue]);
						}
					}
				}
			}
		}
	}

	recalculatemineproximety(){
		for(var i = 0; i < this.area; i++){
			if(this.minesweepboard.gamepieces[i] != this.charset[9]){
				this.minesweepboard.setValue(i, this.charset[0]);
			}
		}
		for(var i = 0; i < this.height; i++){
			for(var j = 0; j < this.width; j++){
				var currentindex = i * this.width + j;
				if(this.minesweepboard.gamepieces[currentindex] == this.charset[9]){
					for(var y = -1; y < 2; y++){
						for(var x = -1; x < 2; x++){
							if(!(y == x && y== 0)){
								var indexoffsety = y * this.width;
								var indexoffsetx = x;
										
								if(parseInt(j)+parseInt(x) >= 0 && parseInt(j)+parseInt(x) < this.width && parseInt(i)+parseInt(y) >= 0 && parseInt(i)+parseInt(y) < this.height){
									var offset = parseInt(indexoffsety) + parseInt(indexoffsetx);
/* alert(offset); */
									var searchingindex = parseInt(currentindex) + parseInt(offset);

									if(this.minesweepboard.gamepieces[searchingindex] != this.charset[9]){
/*alert("i: "+i+" j: "+j+" x: "+x+" y: "+y+" currentindex: "+currentindex+"/"+this.area+" : "+searchingindex+"/"+this.area);*/
										var newvalue = parseInt(1)+parseInt(this.minesweepboard.whichPieceIsIt(this.minesweepboard.gamepieces[searchingindex]));
							/*			alert(i+":"+j+":"+y+":"+x+":"+indexoffsety+":"+indexoffsetx+":"+currentindex+":"+searchingindex+":"+this.charset[newvalue]);  */
										this.minesweepboard.setValue(searchingindex, this.charset[newvalue]);
/*alert(searchingindex+':'+parseInt(1)+parseInt(this.minesweepboard.whichPieceIsIt(this.minesweepboard.gamepieces[searchingindex]))+':'+this.charset[1+parseInt(this.minesweepboard.whichPieceIsIt(this.minesweepboard.gamepieces[searchingindex]))]);*/
									}
								}
							}
						}
					}
				}
			}
		}
	}

	setcharset(charset){
		this.charset = charset;
		this.minesweepboard.setTextureMapping(this.charset, [ "00.png", "01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png", "09.png" ]);
	}
	setgamepieces(){
		this.setgameover(0);

		var k=0;
		for (var i=0; i<this.height; i++){
			for (var j=0; j<this.width; j++){
				this.minesweepboard.mypalette.setColors(this.minesweepboard.gamecellveils[k], 4);
				this.minesweepboard.gamecellveils[k].style.display = 'inline-block';
				this.cleanpiece(this.minesweepboard.gamecells[k]);
				this.cleanpiece(this.minesweepboard.texturedgamecells[k]);
				k++;
			}
		}
	}

	gameclick(event, element){
		var tempcoords = this.minesweepboard.getCoordinatesFromId(element.id);
		var i = tempcoords[0];
		var j = tempcoords[1];

		if(this.firstclick){
			this.firstclick=0
			this.defusefirstbomb(i, j);
		}

		if(this.gameover){return; }

		var gamecellindex = parseInt(i * this.minesweepboard.width) + parseInt(j);

		var texturedgameelement = this.minesweepboard.texturedgamecells[gamecellindex];
		var gameelement = this.minesweepboard.gamecells[gamecellindex];
		var gameveilelement = this.minesweepboard.gamecellveils[gamecellindex];

		if (gameveilelement.style.backgroundColor.toLowerCase() == this.flagcolor.toLowerCase()){ return; }

		var gamepiece = this.minesweepboard.gamepieces[gamecellindex];

		if ( gamepiece == this.charset[9] ) {
			this.setgameover(1);

			gameelement.style.display = 'inline-block';
			texturedgameelement.style.display = 'inline-block';
			gameveilelement.style.display = 'none';

			this.minesweepboard.setColors(gameelement, 2);
			this.minesweepboard.setColors(texturedgameelement, 2);


			var y;
			var x;
			var z;
			for ( z=0; z<2; z++ ){
				for ( y=0; y<this.height; y++ ){
					for ( x=0; x<this.width; x++ ){
						var currentindex = y*this.width+x;

						var currenttexturedgametile = this.minesweepboard.texturedgamecells[currentindex];
						var currentgametile = this.minesweepboard.gamecells[currentindex];
						var currentveiltile = this.minesweepboard.gamecellveils[currentindex];

						currenttexturedgametile.style.display = 'inline-block';
						currentgametile.style.display = 'inline-block';
						currentveiltile.style.display = 'none';
					}
				}
			}
		} else if ( gamepiece != charset[9] ){
			/*gameelement.style.display = 'inline-block';*/
			gameveilelement.style.display = 'none';
			this.clearpath(i, j);
			this.checkwin();
		}
	}


	clearpath(i, j){
		var gameboardindex = parseInt(i)*parseInt(gameboarddata[1])+parseInt(j);
		var currentpiece = this.minesweepboard.gamecells[gameboardindex];
		var currentveil=this.minesweepboard.gamecellveils[gameboardindex];
		var currenttexture=this.minesweepboard.texturedgamecells[gameboardindex];

		if(!currentpiece || !currentveil){
			alert("currently narrowing down a bug at "+i+" "+j);

		}

		var currentpiecevalue=this.minesweepboard.gamepieces[gameboardindex];

		if ( currentpiece.style.display == 'inline-block' || currentveil.style.backgroundColor.toLowerCase() == this.flagcolor.toLowerCase()) {
			return;
		}

		if (currentpiecevalue != this.charset[9]){
			currenttexture.style.display = 'inline-block';
			currentpiece.style.display = 'inline-block';
			this.minesweepboard.gamecellveils[gameboardindex].style.display = 'none';

			for( var x=0; x<3; x++ ){
				for ( var y=0; y<3; y++ ){
					var a = parseInt(i)+parseInt(x)-1
					var b = parseInt(j)+parseInt(y)-1
					if ( a < this.height && b < this.width && a >= 0 && b >= 0 && !( x == y && x == 1 ) ) {
						if (currentpiecevalue == this.charset[0]) {
							this.clearpath(a,b);
						}
					}
				}
			}
		}

	}

	setwin(){
		this.setgameover(1);
	}

	checkwin(){
		for( var i=0; i<this.minesweepboard.gamecells.length; i++ ){
			if ( this.minesweepboard.gamecells[i].style.display == 'none' && this.minesweepboard.gamepieces[i] != this.charset[9] ){
				return;
			}
		}

		this.setwin();
	}


	cleanpiece(i){
		if(!i){return;}

		var piecevalue = i.textContent.trim();

		i.style.display='none';
		/*i.style.color = 'Azure';*/


		switch (piecevalue) {
			case charset[0]:
				this.minesweepboard.setColors(i, 1);
				i.style.textShadow="none";
				break;
			case charset[9]:
				this.minesweepboard.setColors(i, 7);
				break;
		}
	}
	flag(event, element){
		var tempcoords = this.minesweepboard.getCoordinatesFromId(element.id);
		var i = tempcoords[0];
		var j = tempcoords[1];

		if(this.gameover){return;}

		if ( this.minesweepboard.defaultpalette.getState(element) == 4) {
			this.minesweepboard.setColors(element, 3);
		} else {
			this.minesweepboard.setColors(element, 4);
		}

		return false;
	}

	setgameover(isgameover){
		if(isgameover){
			this.gameover=1;
			this.minesweepboard.setColors(this.resetbutton, 2);
			this.minesweepboard.setColors(this.gametitle, 2);
			this.minesweepboard.setColors(this.gameboard, 6);

		}else{
			this.gameover=0;
			this.firstclick=1;
			this.minesweepboard.setColors(this.resetbutton, 5);
			this.minesweepboard.setColors(this.gametitle, 5);
			this.minesweepboard.setColors(this.gameboard, 7);
		}
	}
	resetgameboard(){
		this.minesweepboard.simpleShuffle();

		this.setgamepieces();

		this.recalculatemineproximety();
	}
	explodeatile(i, j) {
	
	}
}



var lockdown=0;

var gameboarddatabox;
var tempgameboarddata;
var gameboarddata = new Array();
var charsetbox;
var tempcharset;
var loadedcharset = new Array();

var verbosereadout;
var outputpanel;
var settingspanel;
var gamepanel;

var lockedelements;

var currentcoords = new Array();
var previouscoords = new Array();
var currentdrift = new Array();

var drag = 0;
var dragprocess = 0;
var dragoffset = [ 0, 0 ];
var experimentalcorrectionx = 0;
var experimentalcorrectiony = 0;

var thispagegameboard;

function onpageload(){

	verbosereadout = document.getElementById('verbosereadout');
	outputpanel = document.getElementById('outputpanel');
	settingspanel = document.getElementById('settingspanel');
	gamepanel = document.getElementById('gamepanel');

	blankpanels();

	gameboarddatabox = document.getElementById('gameboarddata');
	tempgameboarddata = gameboarddatabox.textContent.trim().split(" ");

	var i;
	for (i = 0; i < 3; i++){
		gameboarddata[i]=tempgameboarddata[i];
	}

	charsetbox = document.getElementById('charset');
	tempcharset = charsetbox.textContent.trim().split(" ");

	var i;
	for (i = 0; i <= 9; i++) {
		loadedcharset[i]=tempcharset[i];
	}

	thispagegameboard = new MineSweeper('gameboard', loadedcharset);

	gamepanel.style.display = 'inline-block';

	thispagegameboard.resetgameboard();

	lockedelements = document.getElementsByClassName('disabled');
	while (lockedelements.length){
		i=0
		var newclass = lockedelements[i].className.replace(/\bdisabled\b/g, "");

		if(!lockdown){
			lockedelements[i].disabled = false;
			lockedelements[i].readOnly = false;
			lockedelements[i].style.pointerEvents = 'auto';

		}else{
			lockedelements[i].style.pointerEvents = 'none';
			lockedelements[i].readOnly = true;
			lockedelements[i].style.backgroundColor = 'DarkGrey';
			lockedelements[i].style.color = 'DarkGrey';
			var censorbar = document.createElement('div');
			censorbar.className = 'censorbar';
			censorbar.appendChild(document.createTextNode('authenticate to edit'));
			lockedelements[i].appendChild(censorbar);
			censorbar.style.zIndex = '9999';
		}

		lockedelements[i].className=newclass;
	}


}

function startdrag(i, j){
	i.stopPropagation();
	drag=1;
	dragoffset[0]=parseInt(currentcoords[0])-parseInt(j.style.left.substring(0,j.style.left.length-2))+parseInt(experimentalcorrectionx);
	dragoffset[1]=parseInt(currentcoords[1])-parseInt(j.style.top.substring(0,j.style.top.length-2))+parseInt(experimentalcorrectiony);
	dragprocess = setInterval(followdrag,1,i,j);
	j.dataset.value = dragprocess;
}

function followdrag(i , j) {
	if(drag){
		j.style.left = (parseInt(currentcoords[0])-parseInt(dragoffset[0]))+'px';
		j.style.top = (parseInt(currentcoords[1])-parseInt(dragoffset[1]))+'px';
	}
}

function stopdrag(i, j) {
	drag=0;
	clearInterval(dragprocess);
}

function killevent(i, j){
	i.stopPropagation();
}

function reportmousemove(i, j) {
	currentdrift=[ (previouscoords[0]-i.clientX), (previouscoords[1]-i.clientY) ]; 
	previouscoords=[ currentcoords[0], currentcoords[1] ];
	currentcoords=[ i.clientX, i.clientY ];
}

function menuclick(i){
	var j;
	if (i == 'outputpanel'){
		j='verbosereadout';
	} else {
		j='outputpanel';
	}

	var element = document.getElementById(i);

	if ( i == 'settingspanel' ){
		if (element.style.display == 'none'){
			element.style.display = 'inline-block';
		}else{
			element.style.display = 'none';
		}
	}
	else{

		if (element) {
			if (element.style.display == 'none'){
				blankpanels();
				element.style.display = 'inline-block';
			}/*else{
			element.style.display = 'none';
			otherelement.style.display = 'inline-block';
		}*/
		}
	}
}

function blankpanels() {
	verbosereadout.style.display = 'none';
	outputpanel.style.display = 'none';
	settingspanel.style.display = 'none';
	gamepanel.style.display = 'none';
}


/*
function movewindow(i){
	var window = document.getElementById(i);
	while (!stopmove) {
		var previousleft = 

	}

}

function preparetextures(){
	texturetargetsize=gamepieces[0].style.width;
	for( var i=0; i<texturecount; i++){
		textures[i] = new Image(texturetargetsize, texturetargetsize);
		textures[i].src = 'http://thisisafakeemail.org:8080/'+'0'+i+'.png'

	}
}
*/


