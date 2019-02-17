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
var gameover=0;
var resetbackgroundcolor;
var resettextcolor;
var titlecolor;
var titletextcolor;
var gamepieces = new Array();
var gameboard;
var gameboarddatabox;
var tempgameboarddata;
var gameboarddata = new Array();
var charsetbox;
var tempcharset;
var charset = new Array();
var gametilebackgroundcolor =  'Peru';
var verbosereadout;
var outputpanel;
var settingspanel;
var gamepanel;
var resetbutton;
var gametitle;
var unflagcolor;
var flagcolor = "RosyBrown";
var texturecount=10;
var texturetargetsize;
var textures = new Array();
var texturedgamepieces = new Array();
var imagedir = "http://thisisafakeemail.org:8080/";
var lockedelements;
var currentcoords = new Array();
var drag = 0;
var dragprocess = 0;
var dragoffset = [ 0, 0 ];
var experimentalcorrectionx = 0;
var experimentalcorrectiony = 0;

function onpageload(){

	gameboard = document.getElementById('gameboard');
	gameboardbackground=gameboard.style.backgroundColor;

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
		charset[i]=tempcharset[i];
	}

	verbosereadout = document.getElementById('verbosereadout');
	outputpanel = document.getElementById('outputpanel');
	settingspanel = document.getElementById('settingspanel');
	gamepanel = document.getElementById('gamepanel');

	blankpanels();

	gamepanel.style.display = 'inline-block';


	resetbutton = document.getElementById('resetbutton');
	resetbackgroundcolor = resetbutton.style.backgroundColor;
	resettextcolor = resetbutton.style.color;
	gametitle = document.getElementById('gametitle');
	titlecolor = gametitle.style.backgroundColor;
	titletextcolor = gametitle.style.color;

	setgamepieces();

	lockdown=0
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

	preparetextures();
	deploytextures();

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
	currentcoords=[ i.clientX, i.clientY ];
}

/*
function movewindow(i){
	var window = document.getElementById(i);
	while (!stopmove) {
		var previousleft = 

	}

}*/
function deploytextures(){;
	for (var i=0; i<gamepieces.length; i++) {
		var value=gamepieces[i].textContent.trim();
		texturedgamepieces[i] = document.createElement("div");
		texturedgamepieces[i].className = 'texturedgamecell';
		gamepieces[i].parentElement.appendChild(texturedgamepieces[i]);
		texturedgamepieces[i].style.backgroundColor = "OldLace";

		possiblemargin=window.getComputedStyle(texturedgamepieces[i]).getPropertyValue('margin');
		possiblepadding=window.getComputedStyle(gamepieces[i].parentElement).getPropertyValue('padding');
		possibleborder=window.getComputedStyle(texturedgamepieces[i]).getPropertyValue('border-width');

		possiblemargin=parseInt(possiblemargin.substring(0,possiblemargin.length-2));
		possiblepadding=parseInt(possiblepadding.substring(0,possiblepadding.length-2));
		possibleborder=parseInt(possibleborder.substring(0,possibleborder.length-2));

		if(!(possiblemargin>0)){possiblemargin=0;}
		if(!(possiblepadding>0)){possiblepadding=0;}
		if(!(possibleborder>0)){possibleborder=0;}

		containersize=parseInt(gamepieces[i].parentElement.style.height.substring(0,gamepieces[i].parentElement.style.height.length-2));

		textureoffset=parseInt(possiblemargin)+parseInt(possiblepadding)+parseInt(possibleborder);
		sizecorrection=2*(parseInt(possiblemargin)+parseInt(possibleborder));
		texturesize=containersize-sizecorrection;
	
		texturedgamepieces[i].style.width = texturesize+'px';
		texturedgamepieces[i].style.height = texturesize+'px';
/*		texturedgamepieces[i].style.top = '-'+parseInt(parseInt(containersize)+parseInt(sizecorrection)+parseInt(textureoffset)*2)+'px';
*/

		texturedgamepieces[i].style.top = '-'+containersize+'px';
		texturedgamepieces[i].style.left = '0px';/*"-"+gamepieces[i].style.padding;*/

		texturedgamepieces[i].style.display = 'none';
		texturedgamepieces[i].textContent = gamepieces[i].textContent.trim();
		texturedgamepieces[i].style.color = 'transparent';
		texturedgamepieces[i].id = 'textured'+gamepieces[i].id;

		switch (value){
			case charset[0]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"00.png')";
				break;
			case charset[1]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"01.png')";
				break;
			case charset[2]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"02.png')";
				break;
			case charset[3]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"03.png')";
				break;
			case charset[4]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"04.png')";
				break;
			case charset[5]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"05.png')";
				break;
			case charset[6]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"06.png')";
				break;
			case charset[7]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"07.png')";
				break;
			case charset[8]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"08.png')";
				break;
			case charset[9]:
				texturedgamepieces[i].style.backgroundImage = "url('"+imagedir+"09.png')";
				break;
		}
	}
}

function preparetextures(){
	texturetargetsize=gamepieces[0].style.width;
	for( var i=0; i<texturecount; i++){
		textures[i] = new Image(texturetargetsize, texturetargetsize);
		textures[i].src = 'http://thisisafakeemail.org:8080/'+'0'+i+'.png'

	}
}
function gameclick(i,j){
	if(gameover){return; }

	gameelementid = "gamecell_"+i+"_"+j;
	gameveilelementid = gameelementid+"_veil";
	texturedgameelement = "textured"+gameelementid;

	var texturedgameelement = document.getElementById(texturedgameelement);
	var gameelement = document.getElementById(gameelementid);
	var gameveilelement = document.getElementById(gameveilelementid);

	if (gameveilelement.style.backgroundColor.toLowerCase() == flagcolor.toLowerCase()){ return; }

	var gamepiece = gameelement.textContent.trim();

	if ( gamepiece == charset[9] ) {
		setgameover(1);

		gameelement.style.display = 'inline-block';
		texturedgameelement.style.display = 'inline-block';
		gameveilelement.style.display = 'none';

		gameelement.style.backgroundColor = 'DarkRed';
		texturedgameelement.style.backgroundColor = 'DarkRed';
		gameelement.style.color = 'Tomato';

		var y;
		var x;
		var z;
		for ( z=0; z<2; z++ ){
			for ( y=0; y<gameboarddata[2]; y++ ){
				for ( x=0; x<gameboarddata[1]; x++ ){
					var currenttexturedgametile = document.getElementById("texturedgamecell_"+y+"_"+x);
					var currentgametile = document.getElementById("gamecell_"+y+"_"+x);
					var currentveiltile = document.getElementById("gamecell_"+y+"_"+x+"_veil");
/*
					if ( currentgametile.textContent.trim() == charset[9] && ( x != j && y != i ) ){

					} else {
						clearpath(y,x);
					}
*/
					currenttexturedgametile.style.display = 'inline-block';
					currentgametile.style.display = 'inline-block';
					currentveiltile.style.display = 'none';
				}
			}
		}
	} else if ( gamepiece != charset[9] ){
		/*gameelement.style.display = 'inline-block';*/
		gameveilelement.style.display = 'none';
		clearpath(i, j);
		checkwin();
	}
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
function setgamepieces(){
	setgameover(0);

	var k=0;
	for (var i=0; i<gameboarddata[2]; i++){
		for (var j=0; j<gameboarddata[1]; j++){
			gamepieces[k] = document.getElementById("gamecell_"+i+"_"+j);
			document.getElementById("gamecell_"+i+"_"+j+"_veil").style.display = 'inline-block';
			document.getElementById("gamecell_"+i+"_"+j+"_veil").style.backgroundColor = unflagcolor;
			cleanpiece(gamepieces[k]);
			cleanpiece(document.getElementById("texturedgamecell_"+i+"_"+j));
			k++;
		}
	}
}



function clearpath(i, j){
	var gameboardindex=parseInt(i)*parseInt(gameboarddata[1])+parseInt(j);
	var currentpiece=gamepieces[gameboardindex];
	var currentveil=document.getElementById("gamecell_"+i+"_"+j+"_veil");
	var currenttexture=document.getElementById("texturedgamecell_"+i+"_"+j);
	if(!currentpiece || !currentveil){
		alert("currently narrowing down a bug at "+i+" "+j);

	}
	var currentpiecevalue=currentpiece.textContent.trim();
	if ( currentpiece.style.display == 'inline-block' || currentveil.style.backgroundColor.toLowerCase() == flagcolor.toLowerCase()) {
		return;
	}

	if (currentpiecevalue != charset[9]){
		currenttexture.style.display = 'inline-block';
		currentpiece.style.display = 'inline-block';
		document.getElementById("gamecell_"+i+"_"+j+"_veil").style.display = 'none';

		for( var x=0; x<3; x++ ){
			for ( var y=0; y<3; y++ ){
				var a = parseInt(i)+parseInt(x)-1
				var b = parseInt(j)+parseInt(y)-1
				if ( a < gameboarddata[2] && b < gameboarddata[1] && a >= 0 && b >= 0 && !( x == y && x == 1 ) ) {
					if (currentpiecevalue == charset[0]) {
						clearpath(a,b);
					}
				}
			}
		}
	}

}

function setwin(){
	setgameover(1);
}

function checkwin(){
	for( var i=0; i<gamepieces.length; i++ ){
		if ( gamepieces[i].style.display == 'none' && gamepieces[i].textContent.trim() != charset[9] ){
			return;
		}
	}

	setwin();
}

function cleanpiece(i){
	if(!i){return;}
	var piecevalue = i.textContent.trim();

	i.style.display='none';
	/*i.style.color = 'Azure';*/


	switch (piecevalue) {
		case charset[0]:
			i.style.backgroundColor=gametilebackgroundcolor;
/* fis this later if you care			i.style.color=gametilebackgroundcolor; */
			i.style.textShadow="none";
			break;
		case charset[9]:
			i.style.backgroundColor = "Tomato";
			break;
	}
}
function flag(i,j){
	if(gameover){return;}

	var gameveilelement = document.getElementById("gamecell_"+i+"_"+j+"_veil");

	if (!unflagcolor) {
		unflagcolor=gameveilelement.style.backgroundColor;
	}

	if ( gameveilelement.style.backgroundColor == unflagcolor ) {
		gameveilelement.style.backgroundColor = flagcolor;
	} else {
		gameveilelement.style.backgroundColor = unflagcolor;
	}

	return false;
}

function setgameover(isgameover){
	if(isgameover){
		gameover=1;
		resetbutton.style.backgroundColor = 'DarkRed';
		resetbutton.style.color = 'Tomato';
		gametitle.style.backgroundColor = 'DarkRed';
		gametitle.style.color = 'Tomato';
		gameboard.style.backgroundColor = 'LightCyan';
	}else{
		gameover=0;
		resetbutton.style.backgroundColor = resetbackgroundcolor;
		resetbutton.style.color = resettextcolor;
		gametitle.style.backgroundColor = titlecolor;
		gametitle.style.color = titletextcolor;
		gameboard.style.backgroundColor = gameboardbackground;
	}
}
function resetgameboard(){
	setgamepieces();
}
function explodeatile(i, j) {
	
}
