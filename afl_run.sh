#!/bin/sh

# compile the example code -> result will be a.out
~/Desktop/AFL/afl-g++ -lm main.cpp src/caff.cpp src/ciff.cpp -o main

# configure core dump notifications
echo core | sudo tee -a /proc/sys/kernel/core_pattern

# fuzz it with afl
~/Desktop/AFL/afl-fuzz -i testcases/ -o output -t 5000 -f fuzzed_input.caff ./main @@
