echo "#hat" > ./development/index_htm_hat
echo "#hair" > ./development/index_htm_hair
echo "#head" > ./development/index_htm_head
echo "#neck" > ./development/index_htm_neck
echo "#body" > ./development/index_htm_body
echo "#leg" > ./development/index_htm_leg
echo "#foot" > ./development/index_htm_foot
#echo "#script" > ./development/?
#echo "#css" > ./development/index_custom_id###


function opentemplate {
	HATOUTPUT=""
	HAIROUTPUT=""
	HEADOUTPUT=""
	NECKOUTPUT=""
	BODYOUTPUT=""
	LEGOUTPUT=""
	FOOTOUPUT=""

	HAT_ID=0
	HAIR_ID=1
	HEAD_ID=2
	NECK_ID=3
	BODY_ID=4
	LEG_ID=5
	FOOT_ID=6
	CUSTOM_IDS=()

}

function posttotemplate {
	case $1 in
		$HAT_ID)
		HATOUTPUT=$HATOUTPUT$2
		;;
		$HAIR_ID)
		HAIROUTPUT=$HAIROUTPUT$2
		;;
		$HEAD_ID)
		HEADOUTPUT=$HEADOUTPUT$2
		;;
		$NECK_ID)
		NECKOUTPUT=$NECKOUTPUT$2
		;;
		$BODY_ID)
		BODYOUTPUT=$BODYOUTPUT$2
		;;
		$LEG_ID)
		LEGOUTPUT=$LEGOUTPUT$2
		;;
		$FOOT_ID)
		FOOTOUTPUT=$FOOTOUTPUT$2
		;;
		$CUSTOM_IDS)

		;;
	esac
}

function publishtemplate {

	echo -e $HATOUTPUT >> ./development/index_htm_hat
	echo -e $HAIROUTPUT >> ./development/index_htm_hair
	echo -e $HEADOUTPUT >> ./development/index_htm_head
	echo -e $NECKOUTPUT >> ./development/index_htm_neck
	echo -e $BODYOUTPUT >> ./development/index_htm_body
	echo -e $LEGOUTPUT >> ./development/index_htm_leg
	echo -e $FOOTOUPUT >> ./development/index_htm_foot
}
