using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using BookStoreNepalServer.Services.Notification;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {

        private readonly DB _db;
         private readonly NotificationService _notificationService;
        public OrderController(DB db, NotificationService notificationService)
        {
            _db = db;
              _notificationService = notificationService;
            // _notificationService = notificationService;
        }




   [HttpPost("place-from-cart/{userId}")]
    public async Task<IActionResult> PlaceOrderFromCart(int userId)
    {
        
        var cartItems = await _db.Carts
            .Include(c => c.Book)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (cartItems == null || !cartItems.Any())
            return BadRequest("No items in cart.");

    
        var orderItems = cartItems.Select(ci => new OrderItem {
            BookId    = ci.BookId,
            Quantity  = ci.TotalItems,
            UnitPrice = ci.Book.Price
        }).ToList();

    
        decimal totalPrice = orderItems.Sum(oi => oi.UnitPrice * oi.Quantity);
        int totalBooks     = orderItems.Sum(oi => oi.Quantity);

        decimal discountPct = 0m;
        if (totalBooks >= 5) discountPct += 5m;
        

        int claimedCount = await _db.Orders
            .CountAsync(o => o.UserId == userId && o.Status == "Claimed");
        if (claimedCount > 0 && claimedCount % 10 == 0)
            discountPct += 10m;

        decimal discountAmt = totalPrice * discountPct / 100m;
        decimal finalPrice  = totalPrice - discountAmt;

        
        var order = new Orders {
            UserId          = userId,
            TotalPrice      = finalPrice,
            DiscountPercent = discountPct,
            Status          = "Placed",
            OrderDate       = DateTime.UtcNow
  
        };

                       
        using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
         
            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            


         
            foreach (var oi in orderItems)
            {
                oi.OrderId = order.OrderId;
                await _db.OrderItems.AddAsync(oi);
            }

         
            foreach (var ci in cartItems)
            {
                ci.Book.Stock -= ci.TotalItems;
                if (ci.Book.Stock < 0)
                    return BadRequest($"Not enough stock for book {ci.Book.Title}");
            }

            // d) Remove all cart items
            _db.Carts.RemoveRange(cartItems);

              await _notificationService.SendOrderPlacedNotificationAsync(
                userId: order.UserId,
                orderId: order.OrderId
            );


          
            await _db.SaveChangesAsync();
            await tx.CommitAsync();


            //   await _notificationService.SendOrderPlacedNotificationAsync(
            //     userId: order.UserId,
            //     orderId: order.OrderId
            // );
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            return StatusCode(500, new { message = "Failed to place order", error = ex.Message });
        }

        // 6️ Return
        return Ok(new {
            message    = "Order placed successfully",
            claimCode  = order.ClaimCode,
            orderId    = order.OrderId,
            totalPrice = finalPrice
        });
    }

    
        // [HttpPost("place")]
        // public async Task<IActionResult> PlaceOrder([FromQuery] int userId, [FromBody] OrderItem[] orderItems)
        // {
 
        //     decimal totalPrice = orderItems.Sum(item => item.UnitPrice * item.Quantity);

          
        //     int totalBooks = orderItems.Sum(item => item.Quantity);
        //     decimal discountPercent = 0;

        //     if (totalBooks >= 5)
        //         discountPercent += 5;
                
        //     int successfulOrders = await _db.Orders.CountAsync(o => o.UserId == userId && o.Status == "Claimed");
        //     if (successfulOrders > 0 && successfulOrders % 10 == 0)
        //         discountPercent += 10;

        //     decimal discountAmount = totalPrice * discountPercent / 100;
        //     decimal finalPrice = totalPrice - discountAmount;

        //     Orders order = new Orders
        //     {
        //         UserId = userId,
        //         TotalPrice = finalPrice,
        //         DiscountPercent = discountPercent,
  
        //         Status = "Placed",
        //         OrderDate = DateTime.UtcNow
        //     };

        //     await _db.Orders.AddAsync(order);
        //     await _db.SaveChangesAsync();

      
        //     foreach(var item in orderItems)
        //     {
        //         item.OrderId = order.OrderId;
        //         await _db.OrderItems.AddAsync(item);
        //     }
        //     await _db.SaveChangesAsync();

        //     return Ok(new { message = "Order placed successfully", claimCode = order.ClaimCode, order });
        // }

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
