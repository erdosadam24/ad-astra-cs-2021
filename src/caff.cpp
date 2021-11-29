// Copyright 2021 <Ad Astra>

#include "headers/caff.h"
#include <stdio.h>
#include <string.h>
#include <iostream>
#include <stdexcept>

Caff::Caff(std::string caff_path) {
    const char* file_end = ".caff";
    const char * path = caff_path.c_str();
    size_t path_len = strlen(path);
    size_t file_end_len = strlen(file_end);
    if (file_end_len > path_len) {
        throw std::invalid_argument("CAFF path too short.");
    }
    int caff = strncmp(path + path_len - file_end_len, file_end, file_end_len);
    if (caff != 0) {
        throw std::invalid_argument("Caff path must end with .caff.");
    }
    is.exceptions(std::ifstream::failbit | std::ifstream::badbit);
    try {
        is.open(caff_path, std::ios::binary);
    }
    catch (std::ifstream::failure e) {
        std::cerr << "Exception during opening the file.\n";
    }
}

uint64_t Caff::convert8Byte(const char* arr) {
    uint64_t number =
        (((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[0]) << 0) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[1]) << 8) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[2]) << 16) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[3]) << 24) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[4]) << 32) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[5]) << 40) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[6]) << 48) + \
            ((uint64_t)((reinterpret_cast<const uint8_t*>(arr))[7]) << 56));
    return number;
}

uint16_t Caff::convert2Byte(const char* arr) {
    uint16_t number = (arr[1] << 8) | (arr[0] & 0);
    return number;
}

void Caff::parseCaff() {
    if (is.is_open()) {
        is.seekg(0, is.end);
        std::streamoff length = is.tellg();
        is.seekg(0, is.beg);
        while (is.tellg() != static_cast<int>(length)) {
            CaffBlock caff_block;
            char block_id;
            is.read(&block_id, 1);
            caff_block.id = static_cast<int>(block_id);
            if (!(caff_block.id == 1 || caff_block.id == 2
                || caff_block.id == 3)) {
                throw std::invalid_argument("Invalid CAFF block id.");
            }
            std::cout << "ID: " << caff_block.id << "\n";
            char* block_length = new char[8];
            is.read(block_length, 8);
            caff_block.length = convert8Byte(block_length);
            std::cout << "Block length: " << caff_block.length << "\n";
            caff_block.data = new char[static_cast<int>(caff_block.length)];
            is.read(caff_block.data, caff_block.length);
            std::cout << "Data has been read\n";
            caff_blocks.push_back(caff_block);
            int block_number = caff_blocks.size() - 1;
            if (caff_block.id == 1) {
                std::cout << "CAFF HEADER:\n";
                parseHeader(block_number);
            } else if (caff_block.id == 2) {
                std::cout << "CAFF CREDITS:\n";
                parseCredits(block_number);
            } else if (caff_block.id == 3) {
                std::cout << "CAFF ANIMATION:\n";
                parseAnimation(block_number);
            }
        }
        std::cout << "File parsed successfully.\n";
    } else {
        throw std::runtime_error("Cannot parse file because it is not open.");
    }
}

void Caff::parseHeader(int block_number) {
    if (block_number != 0) {
        throw std::invalid_argument(
            "Invalid CAFF file. Header file must be the first block.");
    }
    caff_header.magic = new char[5];
    for (int i = 0; i < 4; ++i) {
        caff_header.magic[i] = caff_blocks[0].data[i];
    }
    caff_header.magic[4] = '\0';
    if (strcmp(caff_header.magic, "CAFF") != 0) {
        throw std::invalid_argument(
            "Invalid CAFF file. Header magic does not spell CAFF.");
    }
    std::cout << "magic: " << caff_header.magic << '\n';
    char* header_header_size = new char[8];
    for (int i = 0; i < 8; ++i) {
        header_header_size[i] = caff_blocks[0].data[i + 4];
    }
    caff_header.header_size = convert8Byte(header_header_size);
    if (caff_header.header_size != caff_blocks[0].length) {
        throw std::invalid_argument(
            "Invalid CAFF file. Header size is not equal to block size.");
    }
    std::cout << "header size: " << caff_header.header_size << '\n';
    char* header_num_anim = new char[8];
    for (int i = 0; i < 8; ++i) {
        header_num_anim[i] = caff_blocks[0].data[i + 4 + 8];
    }
    caff_header.num_anim = convert8Byte(header_num_anim);
    std::cout << "num anim: " << caff_header.num_anim << '\n';
}

void Caff::parseCredits(int block_number) {
    char* credit_year = new char[2];
    for (int i = 0; i < 2; ++i) {
        credit_year[i] = caff_blocks[block_number].data[i];
    }
    caff_credit.year = convert2Byte(credit_year);
    if (!(1000 <= caff_credit.year <= 2021)) {
        throw std::invalid_argument(
            "Invalid CAFF file. Created year is invalid.");
    }
    caff_credit.month = caff_blocks[block_number].data[2];
    if (!(caff_credit.month >= 1 && caff_credit.month  <= 12)) {
        throw std::invalid_argument(
            "Invalid CAFF file. Created month is invalid.");
    }
    char credit_day = caff_blocks[block_number].data[3];
    caff_credit.day = static_cast<unsigned int>(credit_day);
    if (caff_credit.month == 1 || caff_credit.month == 3 ||
        caff_credit.month == 5 || caff_credit.month == 7 ||
        caff_credit.month == 8 || caff_credit.month == 10 ||
        caff_credit.month == 12) {
        if (!(caff_credit.day > 0 && caff_credit.day <= 31)) {
            throw std::invalid_argument(
                "Invalid CAFF file. Created day is invalid.");
        }
    } else if (caff_credit.month == 4 || caff_credit.month == 6 ||
        caff_credit.month == 9 || caff_credit.month == 11) {
        if (!(caff_credit.day > 0 && caff_credit.day <= 30)) {
            throw std::invalid_argument(
                "Invalid CAFF file. Created day is invalid.");
        }
    } else {
        if (caff_credit.year % 400 == 0 ||
            (caff_credit.year % 100 != 0 && caff_credit.year % 4 == 0)) {
            if (!(caff_credit.day > 0 && caff_credit.day <= 29)) {
                throw std::invalid_argument(
                    "Invalid CAFF file. Created day is invalid.");
            }
        } else if (!(caff_credit.day > 0 && caff_credit.day <= 28)) {
            throw std::invalid_argument(
                "Invalid CAFF file. Created day is invalid.");
        } else {
            throw std::invalid_argument(
                "Invalid CAFF file. Created day is invalid.");
        }
    }
    char credit_hour = caff_blocks[block_number].data[4];
    caff_credit.hour = static_cast<unsigned int>(credit_hour);
    if (!(0 <= caff_credit.hour <= 23)) {
        throw std::invalid_argument(
            "Invalid CAFF file. Created hour is invalid.");
    }
    char credit_minute = caff_blocks[block_number].data[5];
    caff_credit.minute = static_cast<unsigned int>(credit_minute);
    if (!(0 <= caff_credit.minute < 60)) {
        throw std::invalid_argument(
            "Invalid CAFF file. Created minute is invalid.");
    }
    std::cout << "Date: " << std::to_string(caff_credit.year) << '/'
        << std::to_string(caff_credit.month)
        << '/' << std::to_string(caff_credit.day) << "  "
        << std::to_string(caff_credit.hour)
        << ':' << std::to_string(caff_credit.minute) << '\n';
    char* credit_creator_len = new char[8];
    for (int i = 0; i < 8; ++i) {
        credit_creator_len[i] = caff_blocks[block_number].data[i + 6];
    }
    caff_credit.creator_len = convert8Byte(credit_creator_len);
    std::cout << "Creator_len: " << caff_credit.creator_len << '\n';
    for (int i = 0; i < caff_credit.creator_len; ++i) {
        caff_credit.creator.push_back(caff_blocks[block_number].data[i + 14]);
    }
    caff_credit.creator[caff_credit.creator_len] = '\0';
    std::cout << "Creator: " << caff_credit.creator << '\n';
}

void Caff::parseCiffHeader(int block_number) {
    std::cout << "CIFF HEADER:\n";
    caff_animation.ciff_data.ciff_header.magic = new char[5];
    for (int i = 0; i < 4; ++i) {
        caff_animation.ciff_data.ciff_header.magic[i] =
            caff_blocks[block_number].data[i + 8];
    }
    caff_animation.ciff_data.ciff_header.magic[4] = '\0';
    std::cout << "magic: " << caff_animation.ciff_data.ciff_header.magic
        << "\n";
    if (strcmp(caff_animation.ciff_data.ciff_header.magic, "CIFF") != 0) {
        throw std::invalid_argument(
            "Invalid CIFF file. Header magic does not spell CIFF.");
    }
    char* ciff_header_size = new char[8];
    for (int i = 0; i < 8; ++i) {
        ciff_header_size[i] = caff_blocks[block_number].data[i + 8 + 4];
    }
    caff_animation.ciff_data.ciff_header.header_size =
        convert8Byte(ciff_header_size);
    std::cout << "header size: "
        << caff_animation.ciff_data.ciff_header.header_size << "\n";
    char* ciff_content_size = new char[8];
    for (int i = 0; i < 8; ++i) {
        ciff_content_size[i] = caff_blocks[block_number].data[i + 8 + 4 + 8];
    }
    caff_animation.ciff_data.ciff_header.content_size =
        convert8Byte(ciff_content_size);
    std::cout << "content size: "
        << caff_animation.ciff_data.ciff_header.content_size << "\n";
    char* ciff_width = new char[8];
    for (int i = 0; i < 8; ++i) {
        ciff_width[i] = caff_blocks[block_number].data[i + 8 + 4 + 8 + 8];
    }
    caff_animation.ciff_data.ciff_header.width = convert8Byte(ciff_width);
    std::cout << "width: " << caff_animation.ciff_data.ciff_header.width
        << "\n";
    char* ciff_height = new char[8];
    for (int i = 0; i < 8; ++i) {
        ciff_height[i] = caff_blocks[block_number].data[i + 8 + 4 + 8 + 8 + 8];
    }
    caff_animation.ciff_data.ciff_header.height = convert8Byte(ciff_height);
    std::cout << "height: " << caff_animation.ciff_data.ciff_header.height
        << "\n";
    if ((caff_animation.ciff_data.ciff_header.height *
        caff_animation.ciff_data.ciff_header.width * 3)
        != caff_animation.ciff_data.ciff_header.content_size) {
        throw std::invalid_argument(
            "Invalid CIFF file. Content_size must be w*h*3.");
    }
    uint64_t i = 8 + 4 + 8 + 8 + 8 + 8;
    caff_animation.ciff_data.ciff_header.caption.clear();
    // i is smaller than header_size + 8 because we start the j counter
    // before the header so we have to add the 8 long animation duration to it
    while (i < caff_animation.ciff_data.ciff_header.header_size + 8) {
        caff_animation.ciff_data.ciff_header.caption.push_back(
            caff_blocks[block_number].data[i]);
        if (caff_blocks[block_number].data[i] == '\n') {
            i++;
            break;
        }
        i++;
    }
    std::cout << "caption: " << caff_animation.ciff_data.ciff_header.caption;
    caff_animation.ciff_data.ciff_header.tags.clear();
    while (i < caff_animation.ciff_data.ciff_header.header_size + 8) {
        if (caff_blocks[block_number].data[i] == '\0') {
            caff_animation.ciff_data.ciff_header.tags.push_back('#');
        } else {
            caff_animation.ciff_data.ciff_header.tags.push_back(
                caff_blocks[block_number].data[i]);
        }
        i++;
    }
    std::cout << "tags: " << caff_animation.ciff_data.ciff_header.tags << "\n";
}

void Caff::parseCiffContent(int block_number) {
    caff_animation.ciff_data.ciff_content.pixels.clear();
    uint64_t i = caff_animation.ciff_data.ciff_header.header_size + 8;
    while (i < caff_animation.ciff_data.ciff_header.content_size +
        caff_animation.ciff_data.ciff_header.header_size + 8) {
        caff_animation.ciff_data.ciff_content.pixels.push_back(
            caff_blocks[block_number].data[i]);
        i++;
    }
    if (caff_animation.ciff_data.ciff_content.pixels.size() !=
        caff_animation.ciff_data.ciff_header.content_size) {
        throw std::invalid_argument(
            "Invalid CIFF file. Content_size must be w*h*3.");
    }
    if (((caff_animation.ciff_data.ciff_header.width == 0) ||
        (caff_animation.ciff_data.ciff_header.height == 0)) &&
        !caff_animation.ciff_data.ciff_content.pixels.empty()) {
        throw std::invalid_argument(
            "Invalid CIFF file. Incalid pixel number.");
    }
    std::cout << "Pixels have been read.\n";
}

void Caff::saveAsImage(const char* path, int ciff_number) {
    if (ciffs.empty()) {
        throw std::invalid_argument(
            "There are no CIFF files so cannot create image.");
    }
    if (!ciffs[ciff_number].ciff_header.content_size == 0) {
        ciffs[ciff_number].saveAsImage(path);
    } else {
        throw std::invalid_argument(
            "Cannot create image from CIFF file. It has 0 pixels.");
    }
}

void Caff::getAsImage(const char* path, int ciff_number) {
    if (ciffs.empty()) {
        throw std::invalid_argument(
            "There are no CIFF files so cannot create image.");
    }
    if (!ciffs[ciff_number].ciff_header.content_size == 0) {
        ciffs[ciff_number].getAsImage(path);
    }
    else {
        throw std::invalid_argument(
            "Cannot create image from CIFF file. It has 0 pixels.");
    }
}

void Caff::parseAnimation(int block_number) {
    char* animation_duration = new char[8];
    for (int i = 0; i < 8; ++i) {
        animation_duration[i] = caff_blocks[block_number].data[i];
    }
    caff_animation.duration = convert8Byte(animation_duration);
    std::cout << "duration: " << caff_animation.duration << "\n";;
    parseCiffHeader(block_number);
    parseCiffContent(block_number);
    ciffs.push_back(caff_animation.ciff_data);
}
