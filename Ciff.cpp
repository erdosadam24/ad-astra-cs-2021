#include "Ciff.h"
#include <fstream>
#include <iostream>

//bmp -> https://web.archive.org/web/20080912171714/http://www.fortunecity.com/skyscraper/windows/364/bmpffrmt.html

void Ciff::saveAsImage(const char* path) {
    std::ofstream ofs;
    try
    {
        ofs.open(path);
    }
    catch (int e) {
        std::cerr << "Exception during saving the image.\n";
    }
    
    

    int filesize = 54 + static_cast<int>(ciff_header.content_size);

    unsigned char bmpfileheader[14] = { 'B','M', 0,0,0,0, 0,0, 0,0, 54,0,0,0 };
    unsigned char bmpinfoheader[40] = { 40,0,0,0, 0,0,0,0, 0,0,0,0, 1,0, 24,0 };

    bmpfileheader[2] = (unsigned char)(filesize);
    bmpfileheader[3] = (unsigned char)(filesize >> 8);
    bmpfileheader[4] = (unsigned char)(filesize >> 16);
    bmpfileheader[5] = (unsigned char)(filesize >> 24);

    bmpinfoheader[4] = (unsigned char)(ciff_header.width);
    bmpinfoheader[5] = (unsigned char)(ciff_header.width >> 8);
    bmpinfoheader[6] = (unsigned char)(ciff_header.width >> 16);
    bmpinfoheader[7] = (unsigned char)(ciff_header.width >> 24);
    bmpinfoheader[8] = (unsigned char)(ciff_header.height * (-1));  //*1 because befault is upside down
    bmpinfoheader[9] = (unsigned char)(ciff_header.height * (-1) >> 8);         
    bmpinfoheader[10] = (unsigned char)(ciff_header.height * (-1) >> 16);
    bmpinfoheader[11] = (unsigned char)(ciff_header.height * (-1) >> 24);


    ofs.write((char*)(&bmpfileheader), sizeof(bmpfileheader));
    ofs.write((char*)(&bmpinfoheader), sizeof(bmpinfoheader));

    //the number of bytes in one row must always be adjusted to fit into the border of a multiple of four
    int pad = (4 - 3 * ciff_header.width % 4) % 4;

    //the specification for a color starts with the blue byte
    std::vector<char> rqbquad;
    for (size_t i = 0; i <= ciff_content.pixels.size() - 3; i += 3)
    {
        rqbquad.push_back(ciff_content.pixels[i + 2]);
        rqbquad.push_back(ciff_content.pixels[i + 1]);
        rqbquad.push_back(ciff_content.pixels[i]);
    }

    for (uint64_t i = 0; i < ciff_header.height; i++) {
        for (uint64_t j = 0; j < ciff_header.width * 3 ; j++) {
            ofs << rqbquad[static_cast<int>(i * (3 * ciff_header.width) + j)];
        }
        for (int padding = 0; padding < pad; padding++) ofs << 0;
    }
    
    ofs.close();

    std::cout << "Image successfully saved\n";
    
}


