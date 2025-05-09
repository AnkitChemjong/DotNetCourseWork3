using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStoreNepalServer.Migrations
{
    /// <inheritdoc />
    public partial class removedratingfrombook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Books");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Books",
                type: "double precision",
                nullable: true);
        }
    }
}
