using System;
using System.ComponentModel.DataAnnotations;
// Data Transfer Object (DTO) used for user login requests.
// Contains required fields for email and password, with validation attributes to ensure correct input.


namespace BookStoreNepalServer.DTO;

public class LoginDTO
{
// The user's email address.
    // This field is required and must follow a valid email format.
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }
     // The user's password.
    // This field is required and must not be empty.
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; }

}
