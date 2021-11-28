#ifndef DATABASE_DATABASE_H_
#define DATABASE_DATABASE_H_
#include <map>
#include <string>
#include <vector>

enum UserType { ADMIN, NORMAL };

struct Comment {
    std::string user;
    std::string data;
};

struct CFile {
    std::string filename;
    std::string path;
    std::vector<Comment> comments;
};

struct User {
    std::string userid;
    std::string username;
    std::string password_hash;
    std::string email;
    UserType access_level;
    std::map<std::string, CFile> files;
};

class Database {
   public:
    Database();
    ~Database();
    void add_user(User& user);
    void delete_user(std::string userid);
    User* get_user(std::string userid);

    void add_file(std::string userid, CFile& file, std::string data);
    void delete_file(std::string userid, std::string filename);
    CFile* get_file(std::string userid, std::string filename);

    void add_comment(std::string userid, std::string filename,
                     Comment& comment);
    void delete_comment(std::string userid, std::string filename, int id);

   private:
    std::map<std::string, User> users;
    std::string path;
    void read_users();
    void read_files(User& user);
    void read_comments(CFile& file, std::string userid);
    void write_users();
    void write_files(User& user);
    void write_comments(CFile& file, std::string userid);
    void create_filesystem();
    void create_folder(std::string foldername);
    void delete_file(std::string filename);
    void delete_folder(std::string foldername);
    std::string create_path(std::string filename);
    std::string create_path(std::vector<std::string> filenames);
    std::string add_to_path(std::string path, std::string filename);
};

#endif  // DATABASE_DATABASE_H_
