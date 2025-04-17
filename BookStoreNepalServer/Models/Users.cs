using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreNepalServer.Models;

public class Users
{
        public Users()
    {
        Role = "user"; // default value
    }

     [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }

        public string Role { get; set; }

        public ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public ICollection<Whitelist> WhiteLists { get; set; } = new List<Whitelist>();

}
