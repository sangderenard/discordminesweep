function sanitizedivblock {
	echo "$1" | tr $'\n\t' ' ' | sed -e "s/[\ ]\+/ /g" | sed -e "s/>\ </></g"
}
