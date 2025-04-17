using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly DB _db;
        public StaffController(DB db)
        {
            _db = db;
        }

        [HttpPost("fulfil-order")]
        public async Task<IActionResult> FulfillOrder([FromQuery] string claimCode)
        {
           
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.ClaimCode == claimCode && o.Status == "Placed");
            if (order == null)
            {
                return NotFound("No order found with that claim code or order already processed.");
            }

      
            order.Status = "Claimed";
            await _db.SaveChangesAsync();

            return Ok("Order has been processed successfully.");
        }
    }
}
