using Microsoft.EntityFrameworkCore.Migrations;

namespace CAFF_Store.Data.Migrations
{
    public partial class baseAdminSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "b8774540-eec6-46b3-803a-413a38b9c386", 0, "0e0a85bd-82cb-4d75-853e-42bb308c4d9b", "string", false, false, null, "STRING", "STRING", "AQAAAAEAACcQAAAAEO0w0uCrnzqnHAow/7wEpXbjFse51LaYsKSXyuH1N3A4waCxLpSSpnxTfK2OAJkGig==", null, false, "EO2N5S75T7KKJP4BQJ2FR3MDMCNLUJRZ", false, "string" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b8774540-eec6-46b3-803a-413a38b9c386");
        }
    }
}
