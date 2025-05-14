using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    // Define the API route for managing the whitelist (bookmarks)
    [Route("api/whitelist")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
         private readonly DB _db;
          // Constructor to inject the DB context for accessing the database
        public BookmarkController(DB db)
        {
            _db = db;
        }
 // Endpoint to add a new book to the whitelist (bookmark)
        [HttpPost("addBookMark")]
public async Task<IActionResult> AddBookMark([FromBody] Whitelist whitelist)
{
    // Add the new whitelist entry to the database and save changes
    await _db.Whitelists.AddAsync(whitelist);
    await _db.SaveChangesAsync();
    return Ok(new { message = "Books bookmarked successfully." });
}
// Endpoint to get all bookmarks from the whitelist
[HttpGet("getAllBookMark")]
public async Task<ActionResult<IEnumerable<Whitelist>>> GetAllMark()
{
    // Fetch all whitelist entries, including related books
   var marks = await _db.Whitelists.Include(w => w.Book).ToListAsync();
// If no bookmarks are found, return NoContent
    if (marks == null || marks.Count == 0)
    {
        return NoContent(); 
    }
// Return the list of bookmarks
    return Ok(marks); 
}
// Endpoint to delete a bookmark by its ID
[HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMark(int id)
        {
            // Find the bookmark by its ID
            var mark = await _db.Whitelists.FindAsync(id);
            if (mark == null)
            {
                return NotFound($"List not found {id}"); // Return NotFound if the bookmark doesn't exist
            }
            // Remove the bookmark from the database and save changes
            _db.Whitelists.Remove(mark);
            await _db.SaveChangesAsync();
            return Ok("Deleted Successfully."); // Return success message
        }
        
    }
}
