using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
public async Task<IActionResult> AddBookMark([FromBody] Whitelist whitelist)
{
    await _db.Whitelists.AddAsync(whitelist);
    await _db.SaveChangesAsync();
    return Ok(new { message = "Books bookmarked successfully." });
}
[HttpGet("getAllBookMark")]
public async Task<ActionResult<IEnumerable<Whitelist>>> GetAllMark()
{
   var marks = await _db.Whitelists.Include(w => w.Book).ToListAsync();

    if (marks == null || marks.Count == 0)
    {
        return NoContent(); 
    }

    return Ok(marks); 
}
[HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMark(int id)
        {
            var mark = await _db.Whitelists.FindAsync(id);
            if (mark == null)
            {
                return NotFound($"List not found {id}");
            }
            _db.Whitelists.Remove(mark);
            await _db.SaveChangesAsync();
            return Ok("Deleted Successfully.");
        }
        
    }
}
