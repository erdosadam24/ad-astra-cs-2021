// Copyright 2021 <Ad Astra>

#include <iostream>
#include "src/headers/caff.h"
#include <string.h>

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Not enough arguments. Add the path of the CAFF "
            << "you want to parse.";
        return 1;
    }

    try {
        Caff CaffObj(argv[1]);
        CaffObj.parseCaff();

        const char* path = argv[1];
        std::string one = path;
        one.erase(one.size() - 5);
        one.append(".bmp");

        CaffObj.saveAsImage(one.c_str(), 1);

        return 0;
    }
    catch (...) {
        return -1;
    }
}
