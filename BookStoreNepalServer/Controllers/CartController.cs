using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DB _db;

        public CartController(DB db)
        {
            _db = db;
        }
       [HttpPost("addToCart")]
public async Task<IActionResult> AddToCart([FromBody] Cart cart)
{
    // Check if this book already exists in user's cart
    var existingCartItem = await _db.Carts
        .FirstOrDefaultAsync(c => c.BookId == cart.BookId && c.UserId == cart.UserId);

    if (existingCartItem != null)
    {
        return Conflict(new { 
            success = false,
            message = "Item already exists in your cart",
            existingItem = new {
                existingCartItem.CartId,
                existingCartItem.BookId,
                existingCartItem.TotalItems
            }
        });
    }

    // Validate book exists
    var book = await _db.Books.FindAsync(cart.BookId);
    if (book == null)
    {
        return NotFound(new { success = false, message = "Book not found" });
    }

    // Validate user exists
    var user = await _db.Users.FindAsync(cart.UserId);
    if (user == null) 
    {
        return NotFound(new { success = false, message = "User not found" });
    }

    // Set created date
    cart.CreatedAt = DateTime.UtcNow;

    await _db.Carts.AddAsync(cart);
    await _db.SaveChangesAsync();

    return Ok(new { 
        success = true,
        message = "Item added to cart successfully.",
        cartId = cart.CartId
    });
}

[HttpGet("getAllCarts")]
public async Task<ActionResult<IEnumerable<Cart>>> GetAllCarts()
{
    var carts = await _db.Carts
        .Include(c => c.Book) 
        .ToListAsync();

    if (carts == null || carts.Count == 0)
    {
        return NoContent(); 
    }

    return Ok(carts); 
}



[HttpDelete("{id}")]
public async Task<IActionResult> RemoveFromCart(int id)
{
  
    var cartItem = await _db.Carts.FindAsync(id);
    if (cartItem == null)
        return NotFound(new { message = $"No cart item found with ID {id}." });

 
    _db.Carts.Remove(cartItem);
    await _db.SaveChangesAsync();


    return Ok(new { message = "Item removed from cart successfully." });
}




[HttpDelete("clear/{userId}")]
public async Task<IActionResult> ClearCart(int userId)
{

    var userCartItems = await _db.Carts
        .Where(c => c.UserId == userId)
        .ToListAsync();

    if (userCartItems == null || userCartItems.Count == 0)
        return NoContent();  


    _db.Carts.RemoveRange(userCartItems);
    await _db.SaveChangesAsync();

    return Ok(new { message = "All cart items cleared for user " + userId });
}

    }
}
