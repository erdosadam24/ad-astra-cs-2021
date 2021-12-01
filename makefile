
start:
	~/Desktop/AFL/afl-g++ -g -std=c++11 -lm fuzz_main.cpp -o main # -lstdc++
	echo core | sudo tee -a /proc/sys/kernel/core_pattern
	~/Desktop/AFL/afl-fuzz -i caff_files -o out ./main -m 50 @@

