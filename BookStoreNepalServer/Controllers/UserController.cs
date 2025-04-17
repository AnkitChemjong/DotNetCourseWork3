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

namespace BookStoreNepalServer.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DB _db;
        private readonly IConfiguration _config; 

        public UserController(DB db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] Users user)
        {
            Console.WriteLine(user);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
           
            if (await _db.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict(new { message = "User with this email already exists" });
            }
        
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();

            if (user.UserId == 0) 
            {
                return StatusCode(500, "Failed to retrieve generated UserId");
            }

             var response = new
    {
        message = "User registered successfully",
        user = user 
    };

    return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, response);
        }
        

    [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
        
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

        
            var user = await _db.Users.SingleOrDefaultAsync(u => 
                u.Email == loginDto.Email && 
                u.Password == loginDto.Password
            );

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

        
            var tokenString = GenerateJwtToken(user);
            // Set cookie
    Response.Cookies.Append("token", tokenString, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, 
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(1)
    });

            return Ok(new { 
                Token = tokenString, 
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role ,
                message="Login Successfully."
            });
        }


        private string GenerateJwtToken(Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
                [HttpGet("{id}")]
                public async Task<ActionResult<Users>> GetUser(int id)
                {
                    var user = await _db.Users.FindAsync(id);
                    if (user == null)
                    {
                        return NotFound();  
                    }
                    return user;
                }


[HttpGet("loginUser")]
public async Task<ActionResult<object>> GetLoginUser()
{
    var token = Request.Cookies["token"];

    if (string.IsNullOrEmpty(token))
    {
        return Ok(new { user = (Users)null,message="No token" });
    }

    try
    {
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
            ClockSkew = TimeSpan.Zero 
        }, out SecurityToken validatedToken);

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Ok(new { user = (Users)null });
        }

        var userId = int.Parse(userIdClaim.Value);
        var user = await _db.Users.FindAsync(userId);

        if (user == null)
        {
            return Ok(new { user = (Users)null });
        }

        return Ok(new { user });
    }
    catch (Exception)
    {
        return Ok(new { user = (Users)null });
    }
}

[HttpGet("logout")]
public IActionResult LogOut()
{
    Response.Cookies.Delete("token");
    return Ok(new
    {
        message = "Logout successfully."
    });
}

            }
        }
