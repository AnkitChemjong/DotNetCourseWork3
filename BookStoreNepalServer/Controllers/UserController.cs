using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using BookStoreNepalServer.DTO;
using BCrypt.Net;

namespace BookStoreNepalServer.Controllers
{
    // Route for the User API (e.g., /api/user)
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DB _db;
        private readonly IConfiguration _config;

        
// Constructor to initialize the controller with DB context and configuration
        public UserController(DB db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }
// Register user endpoint (POST request to /api/user/register)
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] Users user)
        {
            Console.WriteLine(user);
            // Check if the incoming model is valid
            if (!ModelState.IsValid)
            {
                // Return 400 if model validation fails
                return BadRequest(ModelState);
            }
           // Check if the user with the same email already exists in the database
            if (await _db.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict(new { message = "User with this email already exists" });
            }
// Hash the user's password before storing it in the database
             user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
         
        // Add the new user to the database and save changes
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();

// Check if the UserId was generated successfully, return 500 if it fails
            if (user.UserId == 0) 
            {
                return StatusCode(500, "Failed to retrieve generated UserId");
            }
// Prepare response object with success message and user data
             var response = new
    {
        message = "User registered successfully",
        user = user 
    };

      

        
   // Return a Created response with the user data and location URL
    return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, response);
        }
        
 // Login user endpoint (POST request to /api/user/login)
    [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
        // Check if the incoming model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);// Return 400 if model validation fails
            }
       // Find the user by email
                    var user = await _db.Users
                    .SingleOrDefaultAsync(u => u.Email == loginDto.Email);
// If the user is not found, return Unauthorized response
                if (user == null)
                    return Unauthorized("Invalid email or password");

 // Verify the provided password against the hashed password stored in the database
           bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
    if (!isPasswordValid)
        return Unauthorized("Invalid email or password");

                    // Generate a JWT token for the authenticated user
            var tokenString = GenerateJwtToken(user);

 // Set the JWT token as a cookie in the response for session management
    Response.Cookies.Append("token", tokenString, new CookieOptions
    {
        HttpOnly = false,
        Secure = false, 
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(1)
    });
// Return the token, user data, and success message
            return Ok(new { 
                Token = tokenString, 
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role ,
                message="Login Successfully."
            });
        }

// Method to generate a JWT token for the authenticated user
        private string GenerateJwtToken(Users user)
        {
            // Create claims (user-related information) for the token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
// Retrieve JWT settings from the app configuration
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

// Create the JWT token with issuer, audience, claims, expiration, and signing credentials
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );
            // Return the serialized JWT token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        // Get user by Id endpoint (GET request to /api/user/{id})
                [HttpGet("{id}")]
                public async Task<ActionResult<Users>> GetUser(int id)
                {
                    var user = await _db.Users.FindAsync(id);
                    if (user == null)
                    {
                        return NotFound();  // Return 404 if user is not found 
                    }
                    return user; // Return the user object if found
                }


// Get logged-in user (GET request to /api/user/loginUser)
[HttpGet("loginUser")]
public async Task<ActionResult<object>> GetLoginUser()
{
    var token = Request.Cookies["token"]; // Retrieve the JWT token from the cookies

// If the token is not found, return a message indicating the absence of the token
    if (string.IsNullOrEmpty(token))
    {
        return Ok(new { user = (Users)null,message="No token" });
    }

    try
    {
        // Validate the JWT token and extract claims
        var jwtSettings = _config.GetSection("JwtSettings");
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

        var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero  // No clock skew for token expiration
        }, out SecurityToken validatedToken);

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
     // If the userId claim is not found, return null
        if (userIdClaim == null)
        {
            return Ok(new { user = (Users)null });
        }

        var userId = int.Parse(userIdClaim.Value); // Extract the user ID from the claim
        var user = await _db.Users.FindAsync(userId);


// If the user is not found, return null
        if (user == null)
        {
            return Ok(new { user = (Users)null });
        }

        return Ok(new { user, token, message = "User retrieved successfully" });
    }
    catch (Exception)
    {
        return Ok(new { user = (Users)null });
    }
}


// Logout endpoint (GET request to /api/user/logout)
[HttpGet("logout")]
public IActionResult LogOut()
{
    // Delete the JWT token cookie to log the user out
    Response.Cookies.Delete("token");
    // Return a success message
    return Ok(new
    {
        message = "Logout successfully."
    });
}

            }
        }
