// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using BookStoreNepalServer.Models;
// using BookStoreNepalServer.Database;
// using Microsoft.EntityFrameworkCore;

// namespace BookStoreNepalServer.Controllers
// {
//     [Route("api/cart")]
//     [ApiController]
//     public class OrderItemController : ControllerBase
//     {

//           private readonly DB _db;
//         public OrderItemController(DB db)
//         {
//             _db = db;
//         }


//          [HttpPost("add")]
//         public async Task<IActionResult> AddToCart([FromQuery] int userId, [FromQuery] int bookId, [FromQuery] int quantity)
//         {
            
     
//             if (quantity <= 0)
//             {
//                 return BadRequest("Quantity must be greater than zero.");
//             }

//               var user = await _db.Users.FindAsync(userId);
//             if (user == null)
//             {
//                 return NotFound($"User with ID {userId} not found");
//             }

            
//             // 3. Verify the book exists
//             var book = await _db.Books.FindAsync(bookId);
//             if (book == null)
//             {
//                 return NotFound($"Book with ID {bookId} not found");
//             }

//             // 4. Check the available stock of the book
//             if (book.Stock < quantity)
//             {
//                 return BadRequest("Not enough stock available");
//             }

//             // 5. Check if this book is already in the user's cart
//             var existingCartItem = await _db.OrderItems.SingleOrDefaultAsync(c => c.UserId == userId && c.BookId == bookId);
//             if (existingCartItem != null)
//             {
//                 // Update the quantity by adding the new requested quantity
//                 existingCartItem.Quantity += quantity;
//             }
//             else
//             {
//                 // Create a new cart item entry
//                 var newCartItem = new OrderItem
//                 {
//                     UserId = userId,
//                     BookId = bookId,
//                     Quantity = quantity
//                 };

//                 await _db.CartItems.AddAsync(newCartItem);
//             }

//             // 6. Save changes to the database
//             await _db.SaveChangesAsync()

            

//             return Ok("Book added to cart");
//         }

//         // GET: api/cart?userId=1
//         [HttpGet]
//         public async Task<IActionResult> GetCart([FromQuery] int userId)
//         {
  
//             return Ok(); 
//         }

//         [HttpDelete("remove")]
//         public async Task<IActionResult> RemoveFromCart([FromQuery] int userId, [FromQuery] int bookId)
//         {
    
//             return Ok("Book removed from cart");
//         }
//     }
// }
