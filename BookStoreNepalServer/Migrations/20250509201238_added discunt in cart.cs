using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStoreNepalServer.Migrations
{
    /// <inheritdoc />
    public partial class addeddiscuntincart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Discount",
                table: "Carts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiscountedPrice",
                table: "Carts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OriginalPrice",
                table: "Carts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "DiscountedPrice",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "OriginalPrice",
                table: "Carts");
        }
    }
}
