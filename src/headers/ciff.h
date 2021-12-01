// Copyright 2021 <Ad Astra>

#ifndef SRC_HEADERS_CIFF_H_
#define SRC_HEADERS_CIFF_H_

#include <vector>
#include <string>

struct CiffHeader {
    char* magic;
    uint64_t header_size;
    uint64_t content_size;
    uint64_t width;
    uint64_t height;
    std::string caption;
    std::string tags;
};

struct CiffContent {
    std::vector<char> pixels;
};

class Ciff {
 public:
     Ciff() = default;
     ~Ciff() = default;
     void saveAsImage(const char* path);
 private:
     friend class Caff;
     CiffHeader ciff_header;
     CiffContent ciff_content;
};

#endif  // SRC_HEADERS_CIFF_H_
