using Microsoft.EntityFrameworkCore.Migrations;

namespace CAFF_Store.Data.Migrations
{
    public partial class CommentChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileID",
                table: "Comments");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Comments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Comments");

            migrationBuilder.AddColumn<int>(
                name: "FileID",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
