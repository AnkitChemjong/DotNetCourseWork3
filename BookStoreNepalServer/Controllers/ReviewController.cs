using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/review")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
         private readonly DB _db;

            public ReviewController(DB db)
            {
                _db = db;
            }
        [HttpPost("addreview")]
        public async Task<IActionResult> AddReview([FromBody] Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Optionally: Check if the referenced User and Book exist
            var userExists = await _db.Users.AnyAsync(u => u.UserId == review.UserId);
            var bookExists = await _db.Books.AnyAsync(b => b.BookId == review.BookId);

            if (!userExists || !bookExists)
            {
                return NotFound("User or Book not found.");
            }

            try
            {
                _db.Reviews.Add(review);
                await _db.SaveChangesAsync();
                return Ok("Thankyou for the review.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Something went wrong: {ex.Message}");
            }
        }
        [HttpGet("getallreview")]
        public async Task<ActionResult<IEnumerable<Review>>> GetAllReviews()
        {
            var reviews = await _db.Reviews
                .Include(r => r.User)
                .Include(r => r.Book)
                .ToListAsync();

            return Ok(reviews);
        }
     
    }
}
