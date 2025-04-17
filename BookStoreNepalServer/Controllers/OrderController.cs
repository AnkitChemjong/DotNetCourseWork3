using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {

        private readonly DB _db;
        public OrderController(DB db)
        {
            _db = db;
        }

    
        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromQuery] int userId, [FromBody] OrderItem[] orderItems)
        {
 
            decimal totalPrice = orderItems.Sum(item => item.UnitPrice * item.Quantity);

          
            int totalBooks = orderItems.Sum(item => item.Quantity);
            decimal discountPercent = 0;

            if (totalBooks >= 5)
                discountPercent += 5;
                
            int successfulOrders = await _db.Orders.CountAsync(o => o.UserId == userId && o.Status == "Claimed");
            if (successfulOrders > 0 && successfulOrders % 10 == 0)
                discountPercent += 10;

            decimal discountAmount = totalPrice * discountPercent / 100;
            decimal finalPrice = totalPrice - discountAmount;

            Orders order = new Orders
            {
                UserId = userId,
                TotalPrice = finalPrice,
                DiscountPercent = discountPercent,
  
                Status = "Placed",
                OrderDate = DateTime.UtcNow
            };

            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();

      
            foreach(var item in orderItems)
            {
                item.OrderId = order.OrderId;
                await _db.OrderItems.AddAsync(item);
            }
            await _db.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully", claimCode = order.ClaimCode, order });
        }

        // // GET: api/order/{orderId}
        // [HttpGet("{orderId}")]
        // public async Task<IActionResult> GetOrder(int orderId)
        // {
        //     var order = await _db.Orders.Include(o => o.User)
        //                                 .Include(o => o.OrderItems)
        //                                     .ThenInclude(oi => oi.Book)
        //                                 .FirstOrDefaultAsync(o => o.OrderId == orderId);
        //     if (order == null)
        //         return NotFound();
        //     return Ok(order);
        // }

        // DELETE: api/order/cancel/{orderId}?userId=1
        [HttpDelete("cancel/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId, [FromQuery] int userId)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);
            if (order == null)
                return NotFound();

            // Only allow cancellation if the order has not been processed (i.e., status "Placed").
            if(order.Status != "Placed")
                return BadRequest("Order cannot be cancelled at this stage.");

            order.Status = "Canceled";
            await _db.SaveChangesAsync();

            return Ok("Order canceled successfully.");
        }
    }
}
