using Microsoft.EntityFrameworkCore.Migrations;

namespace CAFF_Store.Data.Migrations
{
    public partial class BigUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b8774540-eec6-46b3-803a-413a38b9c386",
                columns: new[] { "Email", "NormalizedEmail", "NormalizedUserName", "UserName" },
                values: new object[] { "admin@email.com", "ADMIN@EMAIL.COM", "ADMIN@EMAIL.COM", "admin@email.com" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b8774540-eec6-46b3-803a-413a38b9c386",
                columns: new[] { "Email", "NormalizedEmail", "NormalizedUserName", "UserName" },
                values: new object[] { "string", "STRING", "STRING", "string" });
        }
    }
}
