using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MobileApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBusyTimeColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BusyStart",
                table: "BusyTimes",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "BusyEnd",
                table: "BusyTimes",
                newName: "EndTime");

            migrationBuilder.AddColumn<bool>(
                name: "IsImported",
                table: "BusyTimes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsImported",
                table: "BusyTimes");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "BusyTimes",
                newName: "BusyStart");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "BusyTimes",
                newName: "BusyEnd");
        }
    }
}
