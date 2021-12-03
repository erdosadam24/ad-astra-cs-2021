// Copyright 2021 <Ad Astra>

#ifndef SRC_HEADERS_CAFF_H_
#define SRC_HEADERS_CAFF_H_

#include <stdint.h>
#include <fstream>
#include <string>
#include <vector>
#include "ciff.h"

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
    uint64_t year;
    unsigned int month;
    unsigned int day;
    unsigned int hour;
    unsigned int minute;
    unsigned int creator_len;
    std::string creator;
};

struct CaffAnimation {
    uint64_t duration;
    Ciff ciff_data;
};

class Caff {
 public:
     explicit Caff(std::string caff_path);
     ~Caff() = default;
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
     void parseHeader(int block_number);
     void parseCredits(int block_number);
     void parseAnimation(int block_number);
     void parseCiffHeader(int block_number);
     void parseCiffContent(int block_number);
     uint64_t convert8Byte(const char* arr);
     uint16_t convert2Byte(const char* arr);
};


#endif  // SRC_HEADERS_CAFF_H_
