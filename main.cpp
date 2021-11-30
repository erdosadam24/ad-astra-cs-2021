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
    Caff CaffObj(argv[1]);
    CaffObj.parseCaff();

    const char* path = argv[1];
    size_t path_len = strlen(path);
    char one[path_len];
    strcpy(one, path);
    one[path_len - 5] = '\0';

    char buf[path_len];
    strcpy(buf, one);
    strcat(buf, ".bmp");


    CaffObj.saveAsImage(buf, 1);
    return 0;
}
