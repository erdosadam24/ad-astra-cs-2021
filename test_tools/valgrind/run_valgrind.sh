#!/bin/sh

# compile the code -> result will be main
g++ main.cpp src/caff.cpp src/ciff.cpp -o main

# inspect with valgrind
testfile=1.caff
logname=$(echo $testfile | tr . _)
logpath=test_tools/valgrind/log/log_${logname}_$(date "+%Y%m%d_%H%M%S").log
valgrind -v --stats=yes --leak-check=yes --time-stamp=yes --log-file=${logpath} ./main caff_files/${testfile} 