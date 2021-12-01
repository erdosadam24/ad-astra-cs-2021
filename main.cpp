// Copyright 2021 <Ad Astra>

#include <iostream>
#include "src/headers/caff.h"
#include <string.h>

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Not enough arguments. Add the path of the CAFF "
            << "you want to parse and then add the path where "
            << "you want to save an image from it.";
        return 1;
    }
    Caff CaffObj ;
    CaffObj.parseCaff(argv[1]);

    const char* path = argv[1];
    std::string one = path;
    one.erase(one.size() - 5);
    one.append(".bmp");

    CaffObj.saveAsImage(one.c_str(), 1);
    return 0;
}
