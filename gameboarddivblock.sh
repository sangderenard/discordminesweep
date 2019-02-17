#!/bin/bash

function roundfloatbc {
	local power=$2
	local ceiling
	local result
	local rounddeterminer
	local float

	if [ "$power" == "-1" ]; then
		echo $( echo "$1/1" | bc )
		return
	elif [ "$power" == "-2" ]; then
		power=2
		ceiling=1
	fi


	float=$(echo "($1)*(10^($power+1))" | bc -l )

	if [ "$ceiling" == "1" ]; then
		rounddeterminer=$(echo "($float / 10)" | bc)
		rounddeterminer=$(echo "scale=7; ($float - ($rounddeterminer * 10))/1" | bc -l)

		if (( $(echo "$rounddeterminer >= 0.0000001" | bc -l) )); then
			result=$(echo "1+($float/1000)" | bc)
		else
			result=$(echo "$float/1000)" | bc)
		fi
		
		echo $result
		return
	fi

	rounddeterminer=$(echo "($float / 10)/1" | bc )
	rounddeterminer=$(echo "($float - ($rounddeterminer * 10))/1" | bc )
	result=0

	result=$(echo "$float/10" | bc)

	if [ "$rounddeterminer" -gt "4"  ]; then
		let result=$result+1
	fi

	if [ "$2" == "0" ]; then
		echo $result
	else
		echo $(echo "scale=$2; $result/(10^$power)" | bc -l)
	fi
	return
}


function writegameboard {
	local boardwidthintiles=$1
	local boardheightintiles=$2
	local boardwidthinpixels=$3

	local gamecellstyle=( "$4" )


	local margins=2

	local i=0
	local j=0
	local k=0


	local gameboard=""


	local celldim
	local rowdim

	local celldimplus


	local gamecellpadding
	local gamecellinnersize


	gameboardstylesheet=''    #build a style sheet and post it to header instead of each element
	

	celldim=$(roundfloatbc "($boardwidthinpixels - ($boardwidthintiles*$margins) ) / ($boardwidthintiles)" "-1")

	let celldimplus=$celldim+$margins
	let rowdim=celldimplus*$boardwidthintiles
	let fontdim=$( echo "scale=0; ($celldim*.7)/1" | bc -l )
	let gamecellpadding=($celldim-$fontdim)/2
	let gamecellinnersize=2*$gamecellpadding
	let gamecellinnersize=$celldim-$gamecellinnersize

	
	gameboard=$gameboard'

<div id="gamepanel">
	<div id="gameboard" class="gameboard">
		<div class="table" 
			onmousedown="killevent(event, this)" 
			style="
				border-radius: 20px; 
				margin: 0px; 
				padding: 0px; 
				background-color: chocolate; 
				overflow: auto; 
				width: '"$boardwidthinpixels"'px; 
				border-width: 0px">

			<div class="row" style="
				font-size: xx-large; 
				box-shadow: 0px 0px; 
				width: 100%;">
				
				<div id="gametitle" class="cell" style="
					padding: 10px;">

					'"$boardwidthintiles"'x'"$boardheightintiles"' Game<br></div>

			</div><br>'
	while [ "$i" -lt "$boardheightintiles" ]
	do
		gameboard=$gameboard'

			<div class="row" style="
				text-align: left;
				height: '"$celldimplus"'px; 
				margin: 0px; 
				padding: 0px; 
				box-shadow: 0px 0px; 
				width: 100%;">'
		
		j=0

		while [ "$j" -lt "$boardwidthintiles" ]
		do
			local idtag='_'"$i"'_'"$j"

			gameboard=$gameboard'

				<div id="gamecellcontainer'"$idtag"'" class="cell gamecellcontainer" style="
					margin: 0px; 
					width: '"$celldimplus"px'; 
					height: '"$celldimplus"px';
					padding: 0px; 
					box-shadow: 0px 0px">'

			let k=$boardwidthintiles+1
			let k=$k*$i
			let k=$k+$j

			gameboard=$gameboard'
			
					<div 
						id="gamecell'"$idtag"'" 
						class="gamecell" 
						style="

						padding: '"$gamecellpadding"'px; 
						font-size: '"$fontdim"'px; 
						box-shadow: 0px 0px; 
						margin: 0px; 
						width: '"$gamecellinnersize"'px; 
						height: '"$gamecellinnersize"'px; 
						display: none" 

						oncontextmenu="return false;">'

			gameboard=$gameboard"	${minesweepbuffer[$k]}"'</div>


					<div 
						id="gamecell'"$idtag"'_veil" 
						class="gamecell" 
						style="

						background-color: SaddleBrown; 
						box-shadow: 0px 0px; 
						margin: 0px; 
						padding: 0px; 
						width: '"$celldim"'px; 
						height: '"$celldim"'px; 
						display: inline-block" 

						onclick="gameclick('"'$i'"', '"'$j'"')" 
						oncontextmenu="flag('"$i"','"$j"');return false;"></div>
				</div>'

			let j=$j+1

		done
		
		gameboard=$gameboard'
			
			</div>'

		let i=$i+1
	done

	gameboard=$gameboard'
			<div class="row">
				<div class="cell" style="width: 100%">
					<div 
						id="resetbutton" 
						style="

						width: 100%; 
						font-size: xx-large; 
						padding: 10px;" 

						onclick="resetgameboard()">RESET</div>
				</div>
			</div>
		</div>
	</div>
</div>'

	sanitizedivblock "$gameboard"
}
