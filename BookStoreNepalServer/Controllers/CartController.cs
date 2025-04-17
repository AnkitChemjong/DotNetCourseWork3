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
    var carts = await _db.Carts.ToListAsync();

    if (carts == null || carts.Count == 0)
    {
        return NoContent(); 
    }

    return Ok(carts); 
}
    }
}
