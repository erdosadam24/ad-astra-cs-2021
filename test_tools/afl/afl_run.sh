#!/bin/sh

# compile the code -> result will be main
~/Desktop/AFL/afl-g++ -lm main.cpp src/caff.cpp src/ciff.cpp -o main

# configure core dump notifications
echo core | sudo tee -a /proc/sys/kernel/core_pattern

# fuzz it with afl
~/Desktop/AFL/afl-fuzz -i testcases/ -o output -t 5000 -f fuzzed_input.caff ./main @@
