using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BookStoreNepalServer.DTO;

namespace BookStoreNepalServer.Controllers
{
    // Define route for book-related API actions
    [Route("api/book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly DB _db;
         // Constructor to inject the DB context for accessing database

        public BookController(DB db)
        {
            _db = db;
        }


         // Endpoint to create a new book
        [HttpPost("create")]
        public async Task<IActionResult> CreateBook([FromBody] Books book)
        {
              // Ensure that the model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Check if a book with the same ISBN already exists
   
            if (await _db.Books.AnyAsync(b => b.ISBN == book.ISBN))
            {
                return Conflict("A book with this ISBN already exists.");
            }

           // Add the new book to the database
            await _db.Books.AddAsync(book);
            await _db.SaveChangesAsync();

           // If the BookId is still 0, there was an issue during book creation
            if (book.BookId == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to retrieve generated BookId");
            }
            // Return a successful creation response
         var response=new {
            message="Book Created Successfully.",
            book=book
         };
    
            return CreatedAtAction(nameof(GetBook), new { id = book.BookId}, response);
        }

      // Endpoint to get a book by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Books>> GetBook(int id)
        {
            // Fetch the book from the database
            var book = await _db.Books.FindAsync(id);
            // If the book is not found, return NotFound status
            if (book == null)
            {
                return NotFound();
            }
            // Return the book details if found
            return book;
        }
        // Endpoint to get all books

        [HttpGet("getAllBooks")]
public async Task<ActionResult<IEnumerable<Books>>> GetAllBooks()
{
    // Fetch all books with related reviews included
    var books = await _db.Books
    .Include(b => b.Reviews)
    .ToListAsync();
    // If no books found, return NoContent
    if (books == null || books.Count == 0)
    {
        return NoContent(); 
    }
// Return the list of books
    return Ok(books); 
}



// Endpoint to get books by category
         [HttpGet("categories/{category}")]
        public async Task<ActionResult> GetBooksByCategory(string category)
        {
            IQueryable<Books> query = _db.Books;

            switch (category.ToLower())
            {
                case "bestsellers":
            
                    query = query.OrderByDescending(b => b.Stock);
                    break;
                case "awardwinners":
         
                    query = query.Where(b => b.Description.Contains("award"));
                    break;
                case "newreleases":
                    query = query.Where(b => b.PublishedDate >= DateTime.UtcNow.AddMonths(-3));
                    break;
                case "newarrivals":
             
                    query = query.OrderByDescending(b => b.PublishedDate); 
                    break;
                case "comingsoon":
                
                    query = query.Where(b => b.PublishedDate > DateTime.UtcNow);
                    break;
                case "deals":
                    query = query.Where(b => b.IsOnSale);
                    break;
                default:
                    return BadRequest("Invalid category.");
            }

            var books = await query.ToListAsync();
            return Ok(books);
        }




        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Books updatedBook)
        {
            if (id != updatedBook.BookId)
            {
                return BadRequest("Book ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Entry(updatedBook).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Books.AnyAsync(b => b.BookId == id))
                {
                    return NotFound();
                }
                throw;
            }
            return NoContent();
        }



        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            _db.Books.Remove(book);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("update-discount")]
public async Task<IActionResult> UpdateDiscount([FromBody] UpdateDiscountRequest request)
{
    if (request.DiscountStartDate >= request.DiscountEndDate)
    {
        return BadRequest("Discount end date must be after the start date.");
    }

    var book = await _db.Books.FindAsync(request.BookId);
    if (book == null)
    {
        return NotFound("Book not found.");
    }

    // Check if book is out of stock
    if (book.Stock <= 0)
    {
        return BadRequest("Cannot apply discount - book is out of stock.");
    }

    // Check if book is marked as on sale
    if (!book.IsOnSale)
    {
        return BadRequest("Cannot apply discount - book is not marked for sale.");
    }

    // Update the book's discount information
    book.Discount = request.Discount;
    book.DiscountStartDate = request.DiscountStartDate;
    book.DiscountEndDate = request.DiscountEndDate;
    
    try
    {
        _db.Books.Update(book);
        await _db.SaveChangesAsync();

        return Ok(new { 
            message = "Discount updated successfully.", 
            book = new {
                book.BookId,
                book.Title,
                book.Discount,
                DiscountStartDate = book.DiscountStartDate.ToString("yyyy-MM-dd"),
                DiscountEndDate = book.DiscountEndDate.ToString("yyyy-MM-dd"),
                book.IsOnSale,
                book.Stock
            }
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"An error occurred while updating discount: {ex.Message}");
    }
}
       

       [HttpPatch("end-discount")]
        public async Task<IActionResult> EndDiscount([FromBody] EndDiscountRequest request)
        {
            var book = await _db.Books.FindAsync(request.BookId);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            // End the discount by setting Discount to 0 and setting the DiscountEndDate to the current date
            book.Discount = 0;
            book.DiscountEndDate = DateTime.UtcNow;

            _db.Books.Update(book);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Discount ended successfully.", book });
        }


    }
}
