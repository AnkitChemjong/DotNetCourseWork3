using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookStoreNepalServer.Controllers
{
    // Define the API route for managing the shopping cart
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DB _db;
// Constructor to inject the DB context for accessing the database
        public CartController(DB db)
        {
            _db = db;
        }
        // Endpoint to add an item to the user's cart
       [HttpPost("addToCart")]
public async Task<IActionResult> AddToCart([FromBody] Cart cart)
{
    // Check if this book already exists in user's cart
    var existingCartItem = await _db.Carts
        .FirstOrDefaultAsync(c => c.BookId == cart.BookId && c.UserId == cart.UserId);
// If item already exists in the cart, return a conflict response

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
// Add the item to the cart and save changes
    await _db.Carts.AddAsync(cart);
    await _db.SaveChangesAsync();

    return Ok(new { 
        success = true,
        message = "Item added to cart successfully.",
        cartId = cart.CartId
    });
}

// Endpoint to retrieve all cart items
[HttpGet("getAllCarts")]
public async Task<ActionResult<IEnumerable<Cart>>> GetAllCarts()
{
    // Fetch all cart items, including related book details
    var carts = await _db.Carts
        .Include(c => c.Book) 
        .ToListAsync();
// If no items are found, return NoContent
    if (carts == null || carts.Count == 0)
    {
        
        return NoContent(); 
    }
// Return the list of cart items
    return Ok(carts); 
}


// Endpoint to remove a specific item from the cart by its ID
[HttpDelete("{id}")]
public async Task<IActionResult> RemoveFromCart(int id)
{
   // Find the cart item by its ID
    var cartItem = await _db.Carts.FindAsync(id);
    if (cartItem == null)
        return NotFound(new { message = $"No cart item found with ID {id}." });

  // Remove the cart item from the database and save changes
    _db.Carts.Remove(cartItem);
    await _db.SaveChangesAsync();


    return Ok(new { message = "Item removed from cart successfully." });
}



// Endpoint to clear all items in a user's cart
[HttpDelete("clear/{userId}")]
public async Task<IActionResult> ClearCart(int userId)
{
// Fetch all cart items for the given user
    var userCartItems = await _db.Carts
        .Where(c => c.UserId == userId)
        .ToListAsync();
// If no items found, return NoContent
    if (userCartItems == null || userCartItems.Count == 0)
        return NoContent();  

// Remove all items from the user's cart and save changes
    _db.Carts.RemoveRange(userCartItems);
    await _db.SaveChangesAsync();

    return Ok(new { message = "All cart items cleared for user " + userId });
}

    }
}
