#ifndef CAFF_H
#define CAFF_H

#include <fstream>
#include <vector>
#include <stdint.h>
#include "Ciff.h"

struct CaffBlock {
    int id;
    uint64_t length;
    char* data;
};

struct CaffHeader {
    char* magic;
    uint64_t header_size;
    uint64_t num_anim;
};

struct CaffCredit {
    unsigned short year;
    unsigned short month;
    unsigned short day;
    unsigned short hour;
    unsigned short minute;
    uint64_t creator_len;
    char* creator;
};

struct CaffAnimation {
    uint64_t duration;
    Ciff ciff_data;
};

class Caff
{
public:
    Caff(std::string caff_path);
    void parseCaff();
    void saveAsImage(const char* path, int ciff_number = 0);
private:    
    std::ifstream is;
    std::string caff_path;
    std::vector<CaffBlock> caff_blocks;
    std::vector<Ciff> ciffs;
    CaffHeader caff_header;
    CaffCredit caff_credit;
    CaffAnimation caff_animation;
    void parseHeader();
    void parseCredits(int block_number);
    void parseAnimation(int block_number);
    void parseCiffHeader(int block_number);
    void parseCiffContent(int block_number);
    uint64_t convert8Byte(const char* arr);
    unsigned short convert2Byte(const char* arr);
};


#endif