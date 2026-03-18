using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabManager.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceManualUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ManualFileUrl",
                table: "Devices",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManualFileUrl",
                table: "Devices");
        }
    }
}
