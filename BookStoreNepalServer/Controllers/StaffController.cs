using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookStoreNepalServer.Controllers
{
    // Defining the route for the Staff API (e.g., /api/staff)
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly DB _db;
         // Constructor to initialize the StaffController with the database context
        public StaffController(DB db)
        {
            _db = db;
        }
// Endpoint to fulfill an order (POST request)
        [HttpPost("fulfil-order")]
        public async Task<IActionResult> FulfillOrder([FromQuery] string claimCode)
        {
            // Searching for an order in the database based on the claim code and ensuring the order's status is "Placed"
           
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.ClaimCode == claimCode && o.Status == "Placed");
            // If no order is found or if the order is already processed, return a NotFound response
            if (order == null)
            {
                return NotFound("No order found with that claim code or order already processed.");
            }
 // Update the status of the order to "Claimed" to indicate it's being processed
      
            order.Status = "Claimed";
            // Save the changes to the database asynchronously
            await _db.SaveChangesAsync();
// Return a success message indicating that the order has been processed successfully
            return Ok("Order has been processed successfully.");
        }
    }
}
