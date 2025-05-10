using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStoreNepalServer.Migrations
{
    /// <inheritdoc />
    public partial class updatedordertable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "InitialPrice",
                table: "Orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialPrice",
                table: "Orders");
        }
    }
}
