using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/whitelist")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
         private readonly DB _db;

        public BookmarkController(DB db)
        {
            _db = db;
        }

        [HttpPost("addBookMark")]
public async Task<IActionResult> AddToCart([FromBody] Whitelist whitelist)
{
    await _db.Whitelists.AddAsync(whitelist);
    await _db.SaveChangesAsync();
    return Ok(new { message = "Books bookmarked successfully." });
}
    }
}
