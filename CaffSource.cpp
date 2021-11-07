#include "Caff.h"
#include <string.h>
#include <iostream>
#include <stdio.h>

Caff::Caff(std::string caff_path) { 
	is.open(caff_path, std::ios::binary);
}

uint64_t Caff::convert8Byte(const char* arr) {
	uint64_t number = (((uint64_t)(((uint8_t*)(arr))[0]) << 0) + \
		((uint64_t)(((uint8_t*)(arr))[1]) << 8) + \
		((uint64_t)(((uint8_t*)(arr))[2]) << 16) + \
		((uint64_t)(((uint8_t*)(arr))[3]) << 24) + \
		((uint64_t)(((uint8_t*)(arr))[4]) << 32) + \
		((uint64_t)(((uint8_t*)(arr))[5]) << 40) + \
		((uint64_t)(((uint8_t*)(arr))[6]) << 48) + \
		((uint64_t)(((uint8_t*)(arr))[7]) << 56));
	return number;
	
}

unsigned short Caff::convert2Byte(const char* arr) {
	unsigned short number = (arr[1] << 8) || arr[2];
	return number;
}


void Caff::parseCaff() {
	is.seekg(0, is.end);
	std::streamoff length = is.tellg();
	is.seekg(0, is.beg);
	while (is.tellg() != static_cast<int>(length)) {
		CaffBlock caff_block;
		char block_id;
		is.read(&block_id, 1);
		caff_block.id = static_cast<int>(block_id);
		char* block_length = new char[8];
		is.read(block_length, 8);
		caff_block.length = convert8Byte(block_length);
		caff_block.data = new char[static_cast<int>(caff_block.length)];
		is.read(caff_block.data, caff_block.length);
		caff_blocks.push_back(caff_block);
		int block_number = caff_blocks.size() - 1;
		if (caff_block.id == 1)
		{
			parseHeader();
		}
		else if (caff_block.id == 2)
		{
			parseCredits(block_number);
		}
		else if (caff_block.id == 3)
		{
			parseAnimation(block_number);
		}
	}
	std::cout << "DONE!!!!";
	
}

void Caff::parseHeader() {
	caff_header.magic = new char[5];
	for (int i = 0; i < 4; ++i)
	{
		caff_header.magic[i] = caff_blocks[0].data[i];
	}
	caff_header.magic[4] = '\0';
	if (strcmp(caff_header.magic, "CAFF") != 0) {
		std::cout << "Rossz CAFF file";
	}
	char* header_header_size = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		header_header_size[i] = caff_blocks[0].data[i + 4];
	}
	caff_header.header_size = convert8Byte(header_header_size);
	char* header_num_anim = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		header_num_anim[i] = caff_blocks[0].data[i + 4 + 8];
	}
	caff_header.num_anim = convert8Byte(header_num_anim);
}

void Caff::parseCredits(int block_number) {
	char* credit_year = new char[2];
	for (int i = 0; i < 2; ++i)
	{
		credit_year[i] = caff_blocks[block_number].data[i];
	}
	caff_credit.year = convert2Byte(credit_year);	
	char credit_month = caff_blocks[block_number].data[2];
	caff_credit.month = static_cast<int>(credit_month);
	char credit_day = caff_blocks[block_number].data[3];
	caff_credit.day = static_cast<int>(credit_day);
	char credit_hour = caff_blocks[block_number].data[4];
	caff_credit.hour = static_cast<int>(credit_hour);
	char credit_minute = caff_blocks[block_number].data[5];
	caff_credit.minute = static_cast<int>(credit_minute);
	char* credit_creator_len = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		credit_creator_len[i] = caff_blocks[block_number].data[i + 6];
	}
	caff_credit.creator_len = convert8Byte(credit_creator_len);
	caff_credit.creator = new char[static_cast<int>(caff_credit.creator_len) + 1];
	for (unsigned long i = 0; i < caff_credit.creator_len; ++i)
	{
		caff_credit.creator[i] = caff_blocks[block_number].data[i + 14];
	}
	caff_credit.creator[caff_credit.creator_len] = '\0';	
}

void Caff::parseCiffHeader(int block_number) {
	caff_animation.ciff_data.ciff_header.magic = new char[5];
	for (int i = 0; i < 4; ++i)
	{
		caff_animation.ciff_data.ciff_header.magic[i] = caff_blocks[block_number].data[i + 8];
	}
	caff_animation.ciff_data.ciff_header.magic[4] = '\0';
	if (strcmp(caff_animation.ciff_data.ciff_header.magic, "CIFF") != 0) {
		std::cout << "Rossz CIFF file";
	}
	char* ciff_header_size = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		ciff_header_size[i] = caff_blocks[block_number].data[i + 8 + 4];
	}
	caff_animation.ciff_data.ciff_header.header_size = convert8Byte(ciff_header_size);
	char* ciff_content_size = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		ciff_content_size[i] = caff_blocks[block_number].data[i + 8 + 4 + 8];
	}
	caff_animation.ciff_data.ciff_header.content_size = convert8Byte(ciff_content_size);
	char* ciff_width = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		ciff_width[i] = caff_blocks[block_number].data[i + 8 + 4 + 8 + 8];
	}
	caff_animation.ciff_data.ciff_header.width = convert8Byte(ciff_width);
	char* ciff_height = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		ciff_height[i] = caff_blocks[block_number].data[i + 8 + 4 + 8 + 8 + 8];
	}
	caff_animation.ciff_data.ciff_header.height = convert8Byte(ciff_height);
	unsigned long i = 8 + 4 + 8 + 8 + 8 + 8;
	//i is smaller than header_size + 8 because we start the j counter before the header so we have to add the 8 long animation duration to it
	while (i < caff_animation.ciff_data.ciff_header.header_size + 8)
	{
		caff_animation.ciff_data.ciff_header.caption.push_back(caff_blocks[block_number].data[i]);		
		if (caff_blocks[block_number].data[i] == '\n') {
			i++;
			break;
		}	
		i++;
	}
	while (i < caff_animation.ciff_data.ciff_header.header_size + 8)
	{
		if (caff_blocks[block_number].data[i] == '\0')
		{
			caff_animation.ciff_data.ciff_header.tags.push_back('#');
		}
		else {
			caff_animation.ciff_data.ciff_header.tags.push_back(caff_blocks[block_number].data[i]);
		}		
		i++;
	}
	std::cout << caff_animation.ciff_data.ciff_header.tags;


}

void Caff::parseCiffContent(int block_number) {
	uint64_t i = caff_animation.ciff_data.ciff_header.header_size + 8;
	while (i < caff_animation.ciff_data.ciff_header.content_size + caff_animation.ciff_data.ciff_header.header_size + 8) {
		caff_animation.ciff_data.ciff_content.pixels.push_back(caff_blocks[block_number].data[i]);
		i++;
	}
	std::cout << caff_animation.ciff_data.ciff_content.pixels.size();

}

void Caff::saveAsImage(const char* path, int ciff_number) {
	ciffs[ciff_number].saveAsImage(path);
}

void Caff::parseAnimation(int block_number) {
	char* animation_duration = new char[8];
	for (int i = 0; i < 8; ++i)
	{
		animation_duration[i] = caff_blocks[block_number].data[i];
	}
	caff_animation.duration = convert8Byte(animation_duration);
	parseCiffHeader(block_number);
	parseCiffContent(block_number);
	ciffs.push_back(caff_animation.ciff_data);
}

