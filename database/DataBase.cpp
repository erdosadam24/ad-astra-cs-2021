// Copyright 2021 <Ad Astra>
#include "database.h"

#include <fstream>
#include <iostream>
#include <string>

#if defined(_WIN32) || defined(_WIN64) || \
    defined(__CYGWIN__) && !defined(_WIN32)
#define PLATFORM_NAME "windows"
#define USERDATA_PATH ".\\data\\users"
#define FILESYSTEM_PATH ".\\filesystem"
#elif defined(__linux__)
#define PLATFORM_NAME "linux"
#define USERDATA_PATH "./data/users.txt"
#define FILESYSTEM_PATH "./filesystem"
#endif

std::string Database::create_path(std::string filename) {
    std::string ret = FILESYSTEM_PATH;
    if (PLATFORM_NAME == "linux") {
        ret += "/" + filename;
    } else {
        ret += "\\" + filename;
    }
    return ret;
}

std::string Database::create_path(std::vector<std::string> filenames) {
    std::string ret = FILESYSTEM_PATH;
    for (std::string filename : filenames) {
        if (PLATFORM_NAME == "linux") {
            ret += "/" + filename;
        } else {
            ret += "\\" + filename;
        }
    }
    std::cout << "I create this path:" << ret << std::endl;
    return ret;
}

std::string Database::add_to_path(std::string path, std::string filename) {
    if (PLATFORM_NAME == "linux") {
        path += "/" + filename;
    } else {
        path += "\\" + filename;
    }
    return path;
}

void Database::create_folder(std::string foldername) {
    std::string path = "mkdir " + foldername;
    const char* str = path.c_str();
    system(str);
}

void Database::create_filesystem() {
    std::string filename;
    create_folder(FILESYSTEM_PATH);
    read_users();
    for (auto user : users) {
        filename = create_path(user.second.userid);
        create_folder(filename);
    }
}

void Database::read_comments(CFile& file, std::string userid) {
    std::string junk;
    std::ifstream db;
    std::string filename =
        file.filename.substr(0, file.filename.size() - 4) + "_file_data";
    std::vector<std::string> filenames = {userid, filename};
    std::string user_path = create_path(filenames);
    db.open(user_path);
    int comment_count;
    db >> comment_count;
    std::getline(db, junk);
    for (int k = 0; k < comment_count; k++) {
        Comment comment;
        std::getline(db, comment.user);
        std::getline(db, comment.data);
        file.comments.push_back(comment);
    }
}

void Database::read_files(User& user) {
    std::string junk;
    std::ifstream db;
    std::vector<std::string> filenames = {user.userid, "user_data"};
    std::string user_path = create_path(filenames);
    db.open(user_path);
    int file_count;
    db >> file_count;
    std::getline(db, junk);
    for (int j = 0; j < file_count; j++) {
        CFile file;
        std::getline(db, file.filename);
        std::getline(db, file.path);
        read_comments(file, user.userid);
        user.files[file.filename] = file;
    }
    db.close();
}

void Database::read_users() {
    std::string junk;
    std::ifstream db;
    db.open(path);
    int user_count;
    db >> user_count;
    std::getline(db, junk);
    for (int i = 0; i < user_count; i++) {
        User user;
        std::getline(db, user.userid);
        std::getline(db, user.username);
        std::getline(db, user.password_hash);
        std::getline(db, user.email);
        int access_level;
        db >> access_level;
        std::getline(db, junk);
        user.access_level = (UserType)access_level;
        read_files(user);
        users[user.userid] = user;
    }
    db.close();
}

Database::Database() {
    this->path = USERDATA_PATH;
    create_filesystem();
    for (auto user : users) {
        std::cout << user.second.userid << std::endl;
        std::cout << user.second.password_hash << std::endl;
        std::cout << (int)user.second.access_level << std::endl;
        std::cout << user.second.files.size() << std::endl;
        for (auto file : user.second.files) {
            std::cout << file.second.filename << std::endl;
            std::cout << file.second.path << std::endl;
            std::cout << file.second.comments.size() << std::endl;
            for (auto comment : file.second.comments) {
                std::cout << comment.user << std::endl;
                std::cout << comment.data << std::endl;
            }
        }
    }
}

void Database::write_comments(CFile& file, std::string userid) {
    std::ofstream db;
    std::string filename =
        file.filename.substr(0, file.filename.size() - 4) + "_file_data";
    std::vector<std::string> filenames = {userid, filename};
    std::string file_path = create_path(filenames);
    db.open(file_path);
    db << file.comments.size() << std::endl;
    for (auto comment : file.comments) {
        db << comment.user << std::endl;
        db << comment.data << std::endl;
    }
    db.close();
}

void Database::write_files(User& user) {
    std::ofstream db;
    std::vector<std::string> filenames = {user.userid, "user_data"};
    std::string user_path = create_path(filenames);
    db.open(user_path);
    db << user.files.size() << std::endl;
    for (auto file : user.files) {
        db << file.second.filename << std::endl;
        db << file.second.path << std::endl;
        write_comments(file.second, user.userid);
    }
    db.close();
}

void Database::write_users() {
    std::ofstream db;
    db.open(path);
    db << users.size() << std::endl;
    for (auto user : users) {
        db << user.second.userid << std::endl;
        db << user.second.username << std::endl;
        db << user.second.password_hash << std::endl;
        db << user.second.email << std::endl;
        db << (int)user.second.access_level << std::endl;
        write_files(user.second);
    }
    db.close();
}

void Database::delete_file(std::string filename) {
    std::string path;
    if (PLATFORM_NAME == "linux") {
        path = "rm  " + filename;
    } else {
        path = "del " + filename;
    }
    const char* str = path.c_str();
    system(str);
    std::cout << "I'm delete this file " << filename << std::endl;
}

void Database::delete_folder(std::string foldername) {
    std::string path;
    if (PLATFORM_NAME == "linux") {
        path = "rm -rf " + foldername;
    } else {
        path = "rmdir " + foldername;
    }
    const char* str = path.c_str();
    system(str);
    std::cout << "I'm delete this folder " << foldername << std::endl;
}

Database::~Database() { write_users(); }

void Database::add_user(User& user) { users[user.userid] = user; }

void Database::delete_user(std::string userid) {
    users.erase(userid);

    std::string path = create_path(userid);
    delete_folder(path);
}

User* Database::get_user(std::string userid) {
    if (users.find(userid) != users.end()) {
        return &users[userid];
    }
    return nullptr;
}

void Database::add_file(std::string userid, CFile& file, std::string data) {
    users[userid].files[file.filename] = file;
   
    std::ofstream db;
    std::string filename = file.filename.substr(0, file.filename.size() - 4) + "_file_data";
    std::vector<std::string> filenames = {userid, filename};
    std::string file_path = create_path(filenames);
    db.open(file_path);
    db << data;
    db.close();
}

void Database::delete_file(std::string userid, std::string filename) {
    users[userid].files.erase(filename);

    std::vector<std::string> filenames = {userid, filename};
    std::string path = create_path(filenames);
    delete_folder(path);

    filename = filename.substr(0, filename.size() - 4) + "_file_data";
    filenames = {userid, filename};
    std::string path = create_path(filenames);
    delete_folder(path);
}

CFile* Database::get_file(std::string userid, std::string filename) {
    if (users[userid].files.find(filename) != users[userid].files.end()) {
        return &users[userid].files[filename];
    }
    return nullptr;
}

void Database::add_comment(std::string userid, std::string filename,
                           Comment& comment) {
    users[userid].files[filename].comments.push_back(comment);
}

void Database::delete_comment(std::string userid, std::string filename,
                              int id) {
    users[userid].files[filename].comments.erase(
        users[userid].files[filename].comments.begin() + id);
}