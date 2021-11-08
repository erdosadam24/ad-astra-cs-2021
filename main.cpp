
#include <iostream>
#include "Caff.h"

int main(int argc, char* argv[])
{
    if (argc != 3) {
        std::cerr << "Not enough arguments. Add the path of the CAFF you want to parse and then add the path where you want to save an image from it.";
        return 1;
    }
    Caff CaffObj(argv[1]);
    CaffObj.parseCaff();
    CaffObj.saveAsImage(argv[2], 1);
    return 0;
}
