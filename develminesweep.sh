#!/bin/bash

function quickdump {
echo -e "$REQUEST_URI";
exit;
}
unreasonablelength=20000
requiredarguments=5
formattinglist=( "plaintext" "richtext" "html" )
fromcgi=1
opentag="||"
closetag="||"
maxmessagelength=2000
headerstring="swep d mines pls"
adjustedtotallength=0
unformattedgriddata=()

source ./htmltemplateposter.sh
opentemplate

source ./gameboarddivblock.sh


function writejavascript {
	javascript='<script defer src="http://thisisafakeemail.org:8080/develminesweepjeepcreep.js">'
	javascript=$javascript'







	</script>'
	posttotemplate $BODY_ID "$javascript"
#	echo -e "$javascript"
}

function writebodyheader {
	bodyheader='

<div id="maincontainer" onmouseup=
				"stopdrag(event, this)" 
			onmousedown=
				"startdrag(event, this)"
			style="	top: 0px;
				left: 0px;
				border-top-width: 7px;
				border-radius: 15px;
				padding-bottom: 15px;">

	<div onmousedown="killevent(event, this)" class="table" style="
			border-style: none;
			background-color: PaleGoldenrod;
			padding: 0px; 
			padding-top: 1px; 
			padding-bottom: 1px;
			border-radius: 5px;
			margin: 0px; 
			width: 98%;
			max-height: 98%;">
		
		<div class="row" style="
			background-color: Khaki;">

			<div class="cell" style="
				background-color: transparent;
				width: 50%; 
				text-align: left;">
			
				<div class="menubar" style="
					text-align: left; 
					width: 100%;
					left: -5px;">
					
					<div class="menubutton" 
						onclick="menuclick('"'verbosereadout'"')">
						
						debug info</div>
					
					<div class="menubutton" 
						onclick="menuclick('"'outputpanel'"')">

						output</div>

					<div class="menubutton" 
						onclick="menuclick('"'gamepanel'"')">
							
						play</div>

				</div>
			</div>

			<div class="cell" style="
				background-color: transparent;
				width: 50%; 
				text-align: right;">

				<div class="menubar" style="
					text-align: right; 
					width: 100%;
					left:-5px">

					<div class="menubutton" 
						onclick="menuclick('"'settingspanel'"')"
						style="
							position: relative;
							left: -3px;">

					new...</div>
				</div>
			</div>
		</div>
		
		<div class="row" style="
			background-color: MidnightBlue;
			width: 100%; 
			padding-top: 2px;">

			<div class="cell" style="
				background-color: MistyRose; 
				width: 100%;">
	
	'

	local sanitizedoutput=$(sanitizedivblock "$bodyheader") 
	posttotemplate $BODY_ID "$sanitizedoutput"

#	echo -e "$sanitizedoutput"

}

function writebodyfooter {
	local tempgameboard=$(writegameboard $width $height 532 "")
#	echo -e "$tempgameboard"
	posttotemplate $BODY_ID "$tempgameboard"
	bodyfooter='

	

	</div></div>

	</div>

	</div>
	<div id="gameboarddata" style="display: none;">'"$first $width $height"'</div>
	'

	posttotemplate $BODY_ID "$bodyfooter"
#	echo -e "$bodyfooter"

}

function writeheader {
	head='<head><meta charset="UTF-8"><title>'"$(date +%Y-%m-%d-%H-%M-%S)"'</title>'
	echo -e '<meta http-equiv="refresh" content="4;URL='"'"'http://thisisafakeemail.org:8080/development/'"'"'" />'
	head=$head'<link href="http://thisisafakeemail.org:8080/develstyle.css" rel="stylesheet" type="text/css">'
	head=$head'</head>'


	posttotemplate $HEAD_ID "$head"

#	echo -e "$head"
}

function writeform {
	formatselect='<select class="input disabled" name="formatting">'
	for i in ${!formattinglist[*]}
	do
		local isselected=" "
		if [ "$formatting" == "${formattinglist[$i]}" ]; then
			isselected=" selected"
		fi
		formatselect=$formatselect$'\n''<option value="'$i'"'" $isselected"'>'"${formattinglist[$i]}"'</option>'
	done
	formatselect=$formatselect'</select>'
	
	difficultyselect='<select name="difficulty">'
	difficulties=$(seq 1 1 10 | tr -s '\n' ' ')
	for i in ${difficulties[@]}
	do
		local isselected=" "
		if [ "$first" == "$i" ]; then
			isselected=" selected"
		fi
		difficultyselect=$difficultyselect$'\n''<option value="'$i'"'" $isselected"'>'$i'</option>'
	done
	difficultyselect=$difficultyselect'</select>'
	
	local iseasyreveal=" "
	if [ "$easyreveal" == "1" ]; then
		iseasyreveal=" checked"
	fi


	form='<div id="settingspanel" style="left: 400px; top:100px; border-top-width: 80px;" onmouseup="stopdrag(event, this)" onmousedown="startdrag(event, this)">
		<div class="form" onmousedown="killevent(event, this)"><form><div class="table" style="
						box-shadow: none; 
						text-align: left; 
						padding: 0px; 
						margin: 0px;
					">
			<div class="row">
				<div class="cell" style="text-align: left; width: 50%;">Difficulty:</div>
				<div class="cell" style="text-align: right; width: 50%;">'$difficultyselect'</div></div>
			<div class="row">
				<div class="cell" style="width: 40%;">Width:</div>
				<div class="cell" style="text-align: right; width: 60%;"><input type="text" name="width" value="'"$second"'"></div></div>
			<div class="row">
				<div class="cell" style="width: 40%;"> Height: </div>
				<div class="cell" style="text-align: right; width: 60%;"><input type="text" name="height" value="'"$third"'"></div></div>
			<div class="row disabled">
				<div class="cell" style="width: 50%;"> Output format:</div>
				<div class="cell" style="text-align: right; width: 50%;">'$formatselect'</div></div>
			<div class="row disabled">
				<div class="cell" style="text-align: left; width: 50%;">Maximum output length</div>
				<div class="cell" style="text-align: right; width: 50%;"><input class="input disabled" type="text" style="text-align: right; width: 50px;" name="maxsize" value="'"$maxmessagelength"'"></div></div>
			<div class="row disabled">
				<div class="cell" style="width: 50%;">Opening character:</div>
				<div class="cell" style="width: 50%;text-align: right; "><input class="input disabled" type="text" name="opentag" value="'$(echo -e "$opentag")'"></div></div>
			<div class="row disabled">
				<div class="cell" style="width: 50%;">Closing character:</div>
				<div class="cell" style="text-align: right; width: 50%;"><input class="input disabled" type="text" name="closetag" value="'$(echo -e "$closetag")'"></div></div>
			<div class="row disabled">
				<div class="cell" style="width: 80%;">Consolodate bookends:</div>
				<div class="cell" style="width: 20%;text-align: right;"><input class="input disabled" style="width: 30px;" type="checkbox" name="easyreveal" value="1"'"$iseasyreveal"'></div></div>
			<div class="row disabled">
				<div class="cell" style="width: 100%; text-align: center; height: 30px;">Character set:</div></div>
			<div class="row disabled">
				<div class="cell" style="width: 100%; text-align: center;"><input class="input disabled" type="text" name="charset" value="'$(echo -e "${emojilist[@]}")'" style="width:100%; height: 40px; font-size: x-large;"></div></div>
			<div class="row">
				<div class="cell" style="width: 100%; text-align: center;"><input type="submit" style="width: 100%;" class="generatebutton" value="Generate..."></div></div>


				</div>
			</form>
		</div>
	</div>'
	local sanitizedoutput=$(sanitizedivblock "$form")
	posttotemplate $BODY_ID "$sanitizedoutput"
#	echo $sanitizedouput
}

source ./cleandivblock.sh
#function sanitizedivblock {
#	echo "$1" | tr $'\n\t' ' ' | sed -e "s/\(>[\ ]\+\)</></g"
#}


if [ "$REQUEST_URI" == "" ]; then
	fromcgi=0
	if [ "$#" -lt "$requiredarguments" ]; then
		posttotemplate $BODY_ID "only recieved $# arguments, need $requiredarguments"
		posttotemplate $BODY_ID "command recieved: where are $@"
		posttotemplate $BODY_ID "proper arguments: ## ## ## # # [#] [string] [string]"
		posttotemplate $BODY_ID "difficulty, width, height, formatting, verbose, [force cgi output], [opentag], [closetag], [maxmessagelength]"
		exit
	else
		if [ "$1" -gt "0" ] && [ "$1" -lt "11" ]; then
			first=$1
		else
			posttotemplate $BODY_ID "error difficulty setting"
			exit
		fi

		if [ "$2" -gt "0" ] && [ "$3" -gt "0" ]; then

			second=$2
			third=$3
		else
			posttotemplate $BODY_ID "error size setting"
			exit
		fi
	
		if [ "$4" == "0" ] || [ "$4" == "1" ] || [ "$4" == "2" ]; then
			formatting=${formattinglist[$4]}
		elif [ "$4" == "${formattinglist[0]}" ] || [ "$4" == "${formattinglist[1]}" ] || [ "$4" == "${formattinglist[2]}" ]; then
			formatting=$4
		else
			posttotemplate $BODY_ID "error formatting setting"
			exit
		fi

		if [ "$5" == "0" ] || [ "$5" == "1" ]; then
			verbose=$5
		else
			posttotemplate $BODY_ID "error verbosity setting"
			exit
		fi

		if [ "$6" == "1" ]; then
			fromcgi=1
		fi

		if [ "$7" != "" ]; then
			opentag=$7
		fi
		
		if [ "$8" != "" ]; then
			closetag=$8
		fi

		if [ "$9" != "" ]; then
			maxmessagelength=$9
		fi
	fi

else
	REQUEST_URI=$(echo "$REQUEST_URI" | sed -e "s/\(.*?\)\(.*\)difficulty=\([0-9]\+\)\(.*\)/\1\3\2\4/" )
	REQUEST_URI=$(echo "$REQUEST_URI" | sed -e "s/\(.*?[0-9]\+&\)\(.*\)width=\([0-9]\+\)\(.*\)/\1\3\2\4/" )
	REQUEST_URI=$(echo "$REQUEST_URI" | sed -e "s/\(.*?[0-9]\+&[0-9]\+&\)\(.*\)height=\([0-9]\+\)\(.*\)/\1\3\2\4/" )
	first=$(echo "$REQUEST_URI" | sed -e "s/.*?\([0-9]\+\)&\([0-9]\+\)&\([0-9]\+\).*/\1/")
	second=$(echo "$REQUEST_URI" | sed -e "s/.*?\([0-9]\+\)&\([0-9]\+\)&\([0-9]\+\).*/\2/")
	third=$(echo "$REQUEST_URI" | sed -e "s/.*?\([0-9]\+\)&\([0-9]\+\)&\([0-9]\+\).*/\3/")
	formatting=$(echo "$REQUEST_URI" | sed -e "s/.*?.*formatting=\([012]\)*\([a-z]\+\)*.*/\1\2/")
	urimaxmessagelength=$(echo "$REQUEST_URI" | sed -e "s/.*?.*maxsize=\([0-9]\+\).*/\1/")
	uriopentag=$(echo -e "$REQUEST_URI" | sed -e "s/.*?.*opentag=\([0-9a-zA-Z%+]\+\).*/\1/")
	uriclosetag=$(echo -e "$REQUEST_URI" | sed -e "s/.*?.*closetag=\([0-9a-zA-Z%+]\+\).*/\1/")
	uriopentag=$(echo "$uriopentag" | sed 's/+/ /g')
	uriclosetag=$(echo "$uriclosetag" | sed 's/+/ /g')
	easyreveal=$(echo "$REQUEST_URI" | sed "s/.*?.*easyreveal=\([01]\).*/\1/")
	uricharset=()
	uricharset=$(echo -e "$REQUEST_URI" | sed -e "s/.*?.*charset=\([0-9a-zA-Z%+]\+\).*/\1/" | sed 's/+/ /g' | sed 's/%/\\U000000/g')
	uricharset=( $(echo -e "$uricharset") )

	if [ "${#uricharset[*]}" -lt "10" ]; then
		uricharset=()
	fi

#	echo "Content-type: text/plain"
#	echo ""
#	echo "${uricharset[@]}"
#	echo "${#uricharset[*]}"
	

	if [ "$uriopentag" != "$REQUEST_URI" ] && [ "$uriopentag" != "" ]; then
		opentag=$(echo "$uriopentag" | sed 's/%/\\U000000/g')
		opentag=$(echo -e "$opentag")
	fi
	if [ "$uriclosetag" != "$REQUEST_URI" ] && [ "$uriclosetag" != "" ]; then
		closetag=$(echo "$uriclosetag" | sed 's/%/\\U000000/g')
		closetag=$(echo -e "$closetag")
	fi

	if [ "$formatting" == "$REQUEST_URI" ]; then
		formatting=0
	elif [ "$formatting" == "html" ]; then	
		formatting=2
	elif [ "$formatting" == "richtext" ]; then	
		formatting=1
	elif [ "$formatting" == "plaintext" ]; then	
		formatting=0
	elif [ "$formatting" == "" ]; then
		formatting=0
	fi
	formatting=${formattinglist[$formatting]}
	
	if [ "$urimaxmessagelength" -gt "0" ] && [ "$urimaxmessagelength" -lt "$unreasonablelength" ]; then
		maxmessagelength=$urimaxmessagelength
	elif [ "$urimaxmessagelength" -gt "$unreasonablelength" ] || [ "$urimaxmessagelength" == "$unreasonablelength" ] ; then
		maxmessagelength=$unreasonablelength
	fi
	
	botornot=$(echo "$REQUEST_URI" | grep "/minesweepbot.pl")
	if [ "${#botornot}" -lt "13" ]; then
        	verbose=1
	fi

fi

if [ "$formatting" == "${formattinglist[2]}" ]; then
#	posttotemplate $HAT_ID "<Content-type: text/html; charset=utf=8>"
#	posttotemplate $HAT_ID ""
	posttotemplate $HAIR_ID "<!DOCTYPE html>\n<html lang='en'>\n"
	writeheader
	posttotemplate $BODY_ID '<body onmousemove="reportmousemove(event, this)">'
	writebodyheader
	posttotemplate $BODY_ID '<div id="verbosereadout" style="padding-top: 20px;"><div id="plaintext" style="overflow: auto; width: 500px; height: 80%;">'
	datalinedivider='<br>'$'\n'
	linedivider=$datalinedivider
elif [ "$formatting" == "${formattinglist[0]}" ]; then
	posttotemplate $HAT_ID "Content-type: text/plain; charset=utf=8"
	posttotemplate $HAT_ID ""
	datalinedivider=$'\n'
	linedivider=""
else
	if [ "$fromcgi" == "1" ]; then
#		posttotemplate $HAT_ID "<Content-type: text/html; charset=utf=8>"
#		posttotemplate $HAT_ID ""
		posttotemplate $HAIR_ID "<html>"
		writeheader
		posttotemplate $BODY_ID "<body>"
		writebodyheader
		posttotemplate $BODY_ID '<div id="verbosereadout"><div class="plaintext" style="overflow: auto; width: 500px; height: 80%;">'
		datalinedivider='<br>'$'\n'
		if [ "$formatting" == "${formattinglist[0]}" ]; then
			linedivider=""
		else
			linedivider=$datalinedivider
		fi
	else
		datalinedivider=$'\n'
	fi
fi


if [ "$first" -lt "1" ]; then
	first=1
elif [ "$first" -gt "10" ]; then
	first=10
elif [ "$first" -lt "11" ] && [ "$first" -gt "0" ]; then
	first=$first
else
	first=5
fi

if [ "${#uricharset[*]}" == "10" ]; then
	emojilist=("${uricharset[@]}")
else
	if [ "$formatting" == "${formattinglist[2]}" ]; then
		emojilist=( '&#x30;&#x20E3;' '&#x31;&#x20E3;' '&#x32;&#x20E3;' '&#x33;&#x20E3;' '&#x34;&#x20E3;' '&#x35;&#x20E3;' '&#x36;&#x20E3;' '&#x37;&#x20E3;' '&#x38;&#x20E3;' '&#x1F4A3;' )
	elif [ "$formatting" == "${formattinglist[1]}" ]; then
		emojilist=( '\U00000030\U000020E3' '\U00000031\U000020E3' '\U00000032\U000020E3' '\U00000033\U000020E3' '\U00000034\U000020E3' '\U00000035\U000020E3' '\U00000036\U000020E3' '\U000037\U000020E3' '\U000038\U000020E3' '\U0001F4A3' )
	else
		emojilist=( ":zero:" ":one:" ":two:" ":three:" ":four:" ":five:" ":six:" ":seven:" ":eight:" ":bomb:" )
	fi
fi

maxemojiwidth=1

for emoji in ${emojilist[@]}
do
	if [ "${#emoji}" -gt "$maxemojiwidth" ]; then
		maxemojiwidth=${#emoji}
	fi
done

if ( [ "$formatting" == "${formattinglist[1]}" ] && [ "$fromcgi" == "0" ] ) || ( [ "$formatting" == "${formattinglist[2]}" ] && [ "$fromcgi" == "1" ] ); then
#	maxemojiwidth=2
	maxemojiwidth=10
fi

maxtilesize=$(echo "scale=0; ${#opentag}+$maxemojiwidth+${#closetag}" | bc -l)

if [ "$opentag" == " " ] && [ "$closetag" == " " ]; then
	let maxtilesize=$maxtilesize-2
fi

aspectratio=$(echo "scale=8; $second/$third"| bc -l)

if [ "$verbose" == "1" ]; then
	if [ "${#uricharset[*]}" == "10" ]; then
		tempcharsetoutput=$(echo -e "the requested charset is: ${uricharset[@]} $linedivider")
		posttotemplate $BODY_ID "$tempcharsetoutput"
	fi

	posttotemplate $BODY_ID "the aspect ratio is $aspectratio $linedivider"
#	echo "the maximum tile character size is $maxtilesize"
fi


#width / height
#area = width * height
#x/y = aspect ratio
#x*y = area
#y = area/x
#x^2/area = aspect ratio
#aspect ratio * area = x squared
#x=sqrt (ratio * area)
#y=area/sqrt (ratio*area)

maxtotallength=$(echo "scale=0; ($maxmessagelength - $third - ${#headerstring} -1)/$maxtilesize" | bc -l)

if (( $(echo "$maxtotallength > ($second*$third)" | bc) )); then
#	echo "here"
	if [ "$second" -gt "$third" ]; then
		maxwidth=$second
		maxheight=$(echo "scale=0; ($maxmessagelength/$maxtilesize)/$maxwidth" | bc -l)
	else
		maxheight=$third
		maxwidth=$(echo "scale=0; ($maxmessagelength/$maxtilesize)/$maxheight" | bc -l)
	fi		
	noresize=1
else
#	maxheight=$(echo "scale=8; sqrt ( $maxmessagelength/$maxtilesize )" | bc -l)
#	maxwidth=$(echo "scale=8; ($maxheight*$aspectratio)" | bc -l)
#	maxheight=$(echo "scale=8; ($maxheight/$aspectratio)" | bc -l)

	maxwidth=$(echo "scale=8; sqrt ( ( $maxtotallength * 1.2 ) * $aspectratio )" | bc -l)
	maxheight=$(echo "scale=8; ($maxtotallength * 1.2 ) / $maxwidth" | bc -l)
	maxwidth=$(echo "scale=0; $maxwidth/1" | bc -l)
	maxheight=$(echo "scale=0; $maxheight/1" | bc -l)

	maxtotallength=$(echo "scale=0; ($maxmessagelength - $maxheight - ${#headerstring} -1)/$maxtilesize" | bc -l)
	adjustedtotallength=$(echo "$maxwidth*$maxheight*$maxtilesize+$maxheight+${#headerstring}+1" | bc -l)

	timesreduced=0
	while (( $(echo "$adjustedtotallength > $maxmessagelength" |  bc -l) ))
	do
		if [ "$maxheight" -gt "$maxwidth" ]; then
			let maxheight=$maxheight-1
		else
			let maxwidth=$maxwidth-1
		fi
		let timesreduced=$timesreduced+1
		maxtotallength=$(echo "scale=0; ($maxmessagelength - $maxheight - ${#headerstring} -1)/$maxtilesize" | bc -l)
		adjustedtotallength=$(echo "$maxwidth*$maxheight*$maxtilesize+$maxheight+${#headerstring}+1" | bc -l)
	done

	if [ "$verbose" == "1" ]; then	
		posttotemplate $BODY_ID "had to resize (1+$timesreduced) times $linedivider"
		posttotemplate $BODY_ID "estimated total resized length: $maxtotallength tiles $adjustedtotallength characters $linedivider"
		posttotemplate $BODY_ID " $linedivider"
	fi
fi

maxheightplus=$maxheight
maxwidthplus=$maxwidth
let maxheightplus=$maxheightplus+1
let maxwidthplus=$maxwidthplus+1

if [ "$second" -lt "1" ]; then
	second=1
elif [ "$second" -gt "$maxwidth" ];then
	second=$maxwidth
elif [ "$second" -lt "$maxwidthplus" ] && [ "$second" -gt "0" ]; then
	second=$second
else
	second=$maxwidth
fi

if [ "$third" -lt "1" ]; then
	third=1
elif [ "$third" -gt "$maxheight" ]; then
	third=$maxheight
elif [ "$third" -lt "$maxheightplus" ] && [ "$third" -gt "0" ]; then
	third=$third
else
	third=$maxheight
fi

if [ "$verbose" == "1" ]; then
	if [ "$REQUEST_URI" == "" ]; then
		REQUEST_URI="/cgi-bin/[devel]minesweep[bot].pl?$first&$second&$third&formatting=$4"
	fi
	posttotemplate $BODY_ID "url: thisisafakeemail.org$REQUEST_URI $linedivider"
	posttotemplate $BODY_ID " $linedivider"
	posttotemplate $BODY_ID "difficulty: $first $linedivider"
fi

bombfrequency=$(echo "scale=0; (20-(($first-1)*2))/1.5"|bc -l)
let bombfrequency=$bombfrequency+1
width=$second
height=$third

minimumbomb=0

minimumbomb=$(echo "scale=0; (($width*$height)/$bombfrequency)/1"|bc -l)

if [ "$verbose" == "1" ]; then
	posttotemplate $BODY_ID "(\$RANDOM % $bombfrequency) $linedivider"
	if [ "$noresize" != "1" ]; then
		posttotemplate $BODY_ID "maximum allowed width: $maxwidth $linedivider"
		posttotemplate $BODY_ID "maximum allowed height: $maxheight $linedivider"
		posttotemplate $BODY_ID "expected size: "$(echo "$maxwidth*$maxheight*$maxtilesize" | bc )" $linedivider"
	fi
	posttotemplate $BODY_ID "maximum tile size: $maxtilesize $linedivider"
	posttotemplate $BODY_ID "maximum message length: $maxmessagelength $linedivider"
	posttotemplate $BODY_ID "minimum bomb threshold: $minimumbomb $linedivider"
	posttotemplate $BODY_ID "columns: $width $linedivider"
	posttotemplate $BODY_ID "rows: $third $linedivider"
fi



if [ "$verbose" == "1" ]; then
	posttotemplate $BODY_ID  "the list of tiles is: $linedivider"
	if [ "$fromcgi" == "1" ] && [ "$formatting" == "${formattinglist[2]}" ]; then
		posttotemplate $BODY_ID '<div id="charset" class="plaintext" style="color: Black;background-color: Snow;margin-bottom: 20px; margin-top: 5px; font-size: large;  padding: 6px; padding-left: 20px; padding-right: 20px; border-width: thin;">'
		tempemojilist=$(echo -e "${emojilist[@]}" | sed -e "s/\([0-9a-zA-Z&#;]\+\)/$opentag\1$closetag/g" | sed -e "s/\([\ \n\r]\)\1\+/\ /g")
		posttotemplate $BODY_ID "$tempemojilist"
		posttotemplate $BODY_ID "</div>$linedivider"
	else
		posttotemplate $BODY_ID "${emojilist[@]} $linedivider"
	fi
	posttotemplate $BODY_ID  "the opening tag is $opentag $linedivider"
	posttotemplate $BODY_ID  "the closing tag is $closetag $linedivider"
fi

i=0
j=0
k=0
pass=0
# smaller number higher difficulty
# pass zero for bombs pass 1 for numbers
minesweepbuffer=()
while [ "$pass" -lt "2" ]
do
	bombcount=0
	i=0
	while [ "$i" -lt "$height" ]
	do
		j=0
		while [ "$j" -lt "$width" ]
		do
	#		echo "$pass"
			let k=$width+1
			let k=$k*i+$j
			thischar="$opentag${emojilist[0]}$closetag"
			if [ "$pass" == "0" ]; then
				if [ "$(echo $(($RANDOM % $bombfrequency)))" == "0" ]; then
					thischar="$opentag${emojilist[9]}$closetag"
					let bombcount=bombcount+1
				fi
			elif [ "$pass" == "1" ]; then
				if [ "${minesweepbuffer[$k]}" == "$opentag${emojilist[0]}$closetag" ]; then
					number=0
					y=-1
					while [ "$y" -lt "2" ]
					do
						x=-1
						while [ "$x" -lt "2" ]
						do
							index=0
							columnindex=0
							rowindex=0
							let columnindex=$j+$x
							let rowindex=$y+$i
							let index=($width+1)*$y+$k+$x

							if [ "$columnindex" -gt "-1" ] &&\
		 [ "$rowindex" -gt "-1" ] && [ "$columnindex" -lt "$width" ] && \
			[ "$rowindex" -lt "$height" ] && [ "${minesweepbuffer[$index]}" == "$opentag${emojilist[9]}$closetag" ]; then
								let number=$number+1
							fi
#							echo "$x $y $number ${minesweepbuffer[$index]}"
							let x=x+1
						done
						let y=$y+1
					done
					thischar="$opentag${emojilist[$number]}$closetag"
					#echo "$thischar"
				else
					thischar="$opentag${emojilist[9]}$closetag"
				fi
			fi

			minesweepbuffer[$k]=$thischar
			let j=$j+1
		done
		let k=$k+1
		minesweepbuffer[$k]=$datalinedivider
		let i=$i+1
	done
	if [ "$pass" == "0" ] && ( [ "$bombcount" -gt "$minimumbomb" ] || [ "$bombcount" == "$minimumbomb" ] ); then
		let pass=$pass+1
if [ "$verbose" == "1" ]; then
	posttotemplate $BODY_ID " $linedivider"
	posttotemplate $BODY_ID " $linedivider"
	posttotemplate $BODY_ID "needed $minimumbomb bombs $linedivider"
	posttotemplate $BODY_ID "generated $bombcount bombs $linedivider"
	posttotemplate $BODY_ID "took $pass tries $linedivider"
	posttotemplate $BODY_ID " $linedivider"
	posttotemplate $BODY_ID " $linedivider"
fi

	elif [ "$pass" == "1" ]; then
		let pass=$pass+1
	fi
done

output=$(echo "${minesweepbuffer[@]}" | sed -e "s/\ //g")

if [ "$first" -lt "4" ]; then
	easyreveal=1
fi

if [ "$easyreveal" == "1" ]; then

for emojione in ${emojilist[@]}
do
for emojitwo in ${emojilist[@]}
do

	if [ "$emojione" != "${emojilist[9]}" ] && [ "$emojitwo" != "${emojilist[9]}"  ]; then
		if [ "$fromcgi" == "0" ]; then
#			emojione=$(echo -e "$emojione")
#			emojitwo=$(echo -e "$emojitwo")
			output=$(echo -e "$output" | sed "s/\($(echo -e $emojione)\)$closetag$opentag\1/\1\1/g")
			output=$(echo -e "$output" | sed "s/\($(echo -e $emojitwo)\)$closetag$opentag\1/\1\1/g")
			output=$(echo -e "$output" | sed "s/\($(echo -e $emojione)\)$closetag$opentag\($(echo -e $emojitwo)\)/\1\2/g")
			output=$(echo -e "$output" | sed "s/\($(echo -e $emojitwo)\)$closetag$opentag\($(echo -e $emojione)\)/\1\2/g")
		else	
			output=$(echo "$output" | sed "s/\($emojione\)$closetag$opentag\1/\1\1/g")
			output=$(echo "$output" | sed "s/\($emojitwo\)$closetag$opentag\1/\1\1/g")
			output=$(echo "$output" | sed "s/\($emojione\)$closetag$opentag\($emojitwo\)/\1\2/g")
			output=$(echo "$output" | sed "s/\($emojitwo\)$closetag$opentag\($emojione\)/\1\2/g")
		fi
	fi

done
done

fi

if [ "$verbose" == "1" ]; then
	formattingdata=$height
	let formattingdata=$formattingdata*${#datalinedivider}

	if [ "$formatting" == "${formattinglist[2]}" ] && [ "$fromcgi" == "1" ]; then
		formattedoutput=$(echo -e "$output" | sed -e "s/\(&#x[0-9A-F]\+\)/00000/g" )
#		echo -e "$formattedoutput"
#		echo "${#datalinedivider}"
#		echo "$height"
#		echo "$formattingdata"
#		exit
	else
		formattedoutput=$(echo -e "$output")
	fi

	formattedoutputlength=${#formattedoutput}
	posttotemplate $BODY_ID "gross data size: $formattedoutputlength from expected "$(echo "$height*$width" | bc)" tiles $linedivider"
	let formattedoutputlength=$formattedoutputlength-$formattingdata+$height
	posttotemplate $BODY_ID "net data size after removing $formattingdata bytes layout data: $formattedoutputlength $linedivider"
	posttotemplate $BODY_ID "expected data size no larger than: "$( echo "$height*$width*$maxtilesize"  | bc )"$linedivider"
	posttotemplate $BODY_ID "$linedivider"
#exit
	if [ "$formatting" == "${formattinglist[1]}" ]; then
		controlcharadjustment=0
##		controlcharadjustment=$(echo "$height*$width" | bc )
#		controlcharadjustment=$(echo "$height*$width-$bombcount")
		let formattedoutputlength=$formattedoutputlength-$controlcharadjustment
	fi


	measuredsize=$(echo "scale=0; $formattedoutputlength+${#headerstring}+1" | bc )
	posttotemplate $BODY_ID "measured size: $measuredsize ($formattedoutputlength data + header:${#headerstring}+1) $linedivider"
	inefficiency=0
	let inefficiency=$maxmessagelength-$measuredsize
	if [ "$adjustedtotallength" -gt "0" ]; then
		inaccuracy=0
		let inaccuracy=$adjustedtotallength-$measuredsize
		tileinaccuracy=$(echo "scale=2; $inaccuracy/$maxtilesize" | bc -l)
		posttotemplate $BODY_ID "error from estimate: $inaccuracy ($adjustedtotallength - $measuredsize) $linedivider"
		posttotemplate $BODY_ID "error from estimate as tiles: $tileinaccuracy $linedivider"
	fi

	inefficiencyperc=$(echo "scale=8; $measuredsize/$maxmessagelength*100" | bc -l)
	posttotemplate $BODY_ID "message buffer utilization: "$(echo "scale=2; $inefficiencyperc/1" | bc -l)"% $linedivider"
	if [ "$formatting" == "${formattinglist[2]}" ] && [ "$fromcgi" == "1" ]; then
		posttotemplate $BODY_ID '</div></div>'
	else
		posttotemplate $BODY_ID "$linedivider"
		posttotemplate $BODY_ID "$linedivider"
	fi

	if ( [ "$formatting" == "${formattinglist[2]}" ] || [ "$formatting" == "${formattinglist[1]}" ] ) && [ "$fromcgi" == "1" ]; then
		writeform
#		posttotemplate $BODY_ID "$linedivider"
#		posttotemplate $BODY_ID "$linedivider"
	fi
	
fi


if ( [ "$fromcgi" == "1" ] && [ "$formatting" != "${formattinglist[0]}" ] ) || [ "$formatting" == "${formattinglist[2]}" ]; then
	posttotemplate $BODY_ID '<div id="outputpanel"><div class="plaintext">'
	posttotemplate $BODY_ID  "$headerstring$linedivider"
else
	posttotemplate $BODY_ID  "$headerstring"
fi

if [ "$fromcgi" == "1" ]; then
	posttotemplate $BODY_ID "$output"
else
	posttotemplate $BODY_ID  "$output"
fi

if [ "$fromcgi" == "1" ] && [ "$formatting" != "${formattinglist[0]}" ]; then
	posttotemplate $BODY_ID '</div></div>'
	writebodyfooter
	writejavascript
	posttotemplate $BODY_ID "</body>"
	posttotemplate $BODY_ID "</html>"
fi


publishtemplate;

