declare -A APIS

APIS["0.3"]=(1 2 3)

echo ${APIS["0.3"][*]}
