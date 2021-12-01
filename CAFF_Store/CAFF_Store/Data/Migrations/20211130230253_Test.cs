using Microsoft.EntityFrameworkCore.Migrations;

namespace CAFF_Store.Data.Migrations
{
    public partial class Test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Comments",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Comments",
                newName: "Created");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Comments",
                newName: "CommentId");

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Body",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "Body",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "Updated",
                table: "Comments",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Created",
                table: "Comments",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "CommentId",
                table: "Comments",
                newName: "Id");
        }
    }
}
