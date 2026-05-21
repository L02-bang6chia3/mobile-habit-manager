using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MobileApi.Migrations
{
    /// <inheritdoc />
    public partial class GravityAndAiChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "HabitTemplates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ChatConversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastMessageAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GeneratedHabitId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatConversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkdayStart = table.Column<TimeSpan>(type: "interval", nullable: false),
                    WorkdayEnd = table.Column<TimeSpan>(type: "interval", nullable: false),
                    MinSlotMinutes = table.Column<int>(type: "integer", nullable: false),
                    BufferMinutes = table.Column<int>(type: "integer", nullable: false),
                    Timezone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    RawJson = table.Column<string>(type: "text", nullable: true),
                    TokensIn = table.Column<int>(type: "integer", nullable: true),
                    TokensOut = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatConversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "ChatConversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserIntegrations_UserId",
                table: "UserIntegrations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrbitInstances_HabitId",
                table: "OrbitInstances",
                column: "HabitId");

            migrationBuilder.CreateIndex(
                name: "IX_OrbitInstances_MissionTaskId",
                table: "OrbitInstances",
                column: "MissionTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_OrbitInstances_UserId_TimeStart_TimeEnd",
                table: "OrbitInstances",
                columns: new[] { "UserId", "TimeStart", "TimeEnd" });

            migrationBuilder.CreateIndex(
                name: "IX_MissionTasks_HabitTemplateId",
                table: "MissionTasks",
                column: "HabitTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_HabitTemplates_UserId",
                table: "HabitTemplates",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BusyTimes_UserId_StartTime_EndTime",
                table: "BusyTimes",
                columns: new[] { "UserId", "StartTime", "EndTime" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatConversations_UserId_LastMessageAt",
                table: "ChatConversations",
                columns: new[] { "UserId", "LastMessageAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ConversationId_CreatedAt",
                table: "ChatMessages",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BusyTimes_Users_UserId",
                table: "BusyTimes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HabitTemplates_Users_UserId",
                table: "HabitTemplates",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MissionTasks_HabitTemplates_HabitTemplateId",
                table: "MissionTasks",
                column: "HabitTemplateId",
                principalTable: "HabitTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrbitInstances_HabitTemplates_HabitId",
                table: "OrbitInstances",
                column: "HabitId",
                principalTable: "HabitTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrbitInstances_MissionTasks_MissionTaskId",
                table: "OrbitInstances",
                column: "MissionTaskId",
                principalTable: "MissionTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrbitInstances_Users_UserId",
                table: "OrbitInstances",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserIntegrations_Users_UserId",
                table: "UserIntegrations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusyTimes_Users_UserId",
                table: "BusyTimes");

            migrationBuilder.DropForeignKey(
                name: "FK_HabitTemplates_Users_UserId",
                table: "HabitTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_MissionTasks_HabitTemplates_HabitTemplateId",
                table: "MissionTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_OrbitInstances_HabitTemplates_HabitId",
                table: "OrbitInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_OrbitInstances_MissionTasks_MissionTaskId",
                table: "OrbitInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_OrbitInstances_Users_UserId",
                table: "OrbitInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_UserIntegrations_Users_UserId",
                table: "UserIntegrations");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "UserPreferences");

            migrationBuilder.DropTable(
                name: "ChatConversations");

            migrationBuilder.DropIndex(
                name: "IX_UserIntegrations_UserId",
                table: "UserIntegrations");

            migrationBuilder.DropIndex(
                name: "IX_OrbitInstances_HabitId",
                table: "OrbitInstances");

            migrationBuilder.DropIndex(
                name: "IX_OrbitInstances_MissionTaskId",
                table: "OrbitInstances");

            migrationBuilder.DropIndex(
                name: "IX_OrbitInstances_UserId_TimeStart_TimeEnd",
                table: "OrbitInstances");

            migrationBuilder.DropIndex(
                name: "IX_MissionTasks_HabitTemplateId",
                table: "MissionTasks");

            migrationBuilder.DropIndex(
                name: "IX_HabitTemplates_UserId",
                table: "HabitTemplates");

            migrationBuilder.DropIndex(
                name: "IX_BusyTimes_UserId_StartTime_EndTime",
                table: "BusyTimes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HabitTemplates");
        }
    }
}
