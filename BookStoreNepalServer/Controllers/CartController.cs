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
    await _db.Carts.AddAsync(cart);
    await _db.SaveChangesAsync();
    return Ok(new { message = "Item added to cart successfully." });
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
