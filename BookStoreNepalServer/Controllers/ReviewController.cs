using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    // Define the route for the Review API (e.g., /api/review)
    [Route("api/review")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
         private readonly DB _db;
// Constructor to initialize the ReviewController with the database context
            public ReviewController(DB db)
            {
                _db = db;
            }
            // Endpoint to add a review to the system (POST request)
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
                // Add the review to the Reviews table
                _db.Reviews.Add(review);
                // Save the changes to the database
                await _db.SaveChangesAsync();
                // Return a success message indicating the review was added successfully
                return Ok("Thankyou for the review.");
            }
            catch (Exception ex)
            {
                // If an error occurs while saving the review, return a 500 error with the exception message
                return StatusCode(500, $"Something went wrong: {ex.Message}");
            }
        }
        // Endpoint to get all reviews from the system (GET request)
        [HttpGet("getallreview")]
        public async Task<ActionResult<IEnumerable<Review>>> GetAllReviews()
        {
            // Retrieve all reviews from the database, including related User and Book data
            var reviews = await _db.Reviews
                .Include(r => r.User) // Include user data related to the review
                .Include(r => r.Book) // Include book data related to the review
                .ToListAsync(); // Convert the results to a list asynchronously

            // Return the list of reviews as a successful response
            return Ok(reviews);
        }
     
    }
}
