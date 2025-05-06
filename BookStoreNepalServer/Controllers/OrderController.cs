using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
using Microsoft.EntityFrameworkCore;
using BookStoreNepalServer.Services.Email;
using System.Text;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {

        private readonly DB _db;
        private readonly EmailService _emailService;

public OrderController(DB db, EmailService emailService)
{
    _db = db;
    _emailService = emailService;
}




   [HttpPost("place-from-cart/{userId}")]
    public async Task<IActionResult> PlaceOrderFromCart(int userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
               return NotFound("User not found");
        

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

        // 4️⃣ Create Order
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
            // a) Save order to get OrderId
            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();

            // b) Insert OrderItems
            foreach (var oi in orderItems)
            {
                oi.OrderId = order.OrderId;
                await _db.OrderItems.AddAsync(oi);
            }

            // c) Decrement stock on each Book
            foreach (var ci in cartItems)
            {
                ci.Book.Stock -= ci.TotalItems;
                if (ci.Book.Stock < 0)
                    return BadRequest($"Not enough stock for book {ci.Book.Title}");
            }

            // d) Remove all cart items
            _db.Carts.RemoveRange(cartItems);

            // e) Commit
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
            
            string subject = "Order Confirmation - Book Store Nepal";
           string body = $@"
    <h2>Thank you for your order, {user.Name}!</h2>
    <p>Your claim code is: <strong>{order.ClaimCode}</strong></p>
    <p>Order ID: {order.OrderId}</p>
    <p>Total Price: NPR {finalPrice:F2}</p>
    <p>Date: {order.OrderDate.ToString("yyyy-MM-dd HH:mm:ss")}</p>
    <br/>
    <p>We appreciate your purchase. Happy reading!</p>
";

await _emailService.SendEmailAsync(user.Email, subject, body);
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            return StatusCode(500, new { message = "Failed to place order", error = ex.Message });
        }

        // 6️⃣ Return
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
        [HttpPatch("cancel/{orderId}/{userId}")]
        public async Task<IActionResult> CancelOrder([FromRoute] int orderId, [FromRoute] int userId)
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

      [HttpGet("getAllOrders")]
public async Task<ActionResult<IEnumerable<Orders>>> GetAllOrders()
{
    var orders = await _db.Orders
        .Include(o => o.User)          // Include User details
        .Include(o => o.OrderItems)    // Include OrderItems
            .ThenInclude(oi => oi.Book) // Include Book details for each OrderItem
        .AsNoTracking()                // Recommended for read-only operations
        .ToListAsync();

    if (orders == null || !orders.Any())
    {
        return Ok(new List<Orders>()); // Return empty list instead of null
    }

    return Ok(orders);
}

[HttpPost("verify/{userId}/{orderId}/{code}")]
public async Task<ActionResult> CheckClaimCode(
    [FromRoute] int userId,
    [FromRoute] int orderId,
    [FromRoute] string code)
{
    var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    if (user == null)
        return NotFound(new { 
            Success = false, 
            Message = "User not found." 
        });

    if (string.IsNullOrWhiteSpace(code))
        return BadRequest(new { 
            Success = false, 
            Message = "Claim code is required." 
        });

    var order = await _db.Orders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Book)
        .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

    if (order == null)
        return NotFound(new { 
            Success = false, 
            Message = "Order not found for this user" 
        });

    if (order.ClaimCode != code)
        return BadRequest(new { 
            Success = false, 
            Message = "Claim code does not match" 
        });

    if (order.Status == "Completed")
        return Conflict(new { 
            Success = false, 
            Message = "Order already completed" 
        });
        
    if (order.Status == "Cancelled")
        return Conflict(new { 
            Success = false, 
            Message = "Order already cancelled" 
        });

    order.Status = "Completed";
    order.OrderDate = DateTime.UtcNow;

    try
    {
        await _db.SaveChangesAsync();
        
        string subject = $"Invoice for Order #{order.OrderId} - Book Store Nepal";
        string body = GenerateInvoiceEmail(user, order);

        await _emailService.SendEmailAsync(user.Email, subject, body);

        return Ok(new { 
            Success = true,
            OrderId = order.OrderId,
            ClaimCode = order.ClaimCode,
            CompletionDate = order.OrderDate,
            Message = "Order completed and invoice sent."
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { 
            Success = false, 
            Error = ex.Message 
        });
    }
}

private string GenerateInvoiceEmail(Users user, Orders order)
{
    var itemsHtml = new StringBuilder();
    foreach (var item in order.OrderItems)
    {
        itemsHtml.AppendLine($@"
            <tr>
                <td>{item.Book?.Title ?? "N/A"}</td>
                <td>{item.Quantity}</td>
                <td>NPR {item.UnitPrice:F2}</td>
                <td>NPR {item.Quantity * item.UnitPrice:F2}</td>
            </tr>");
    }

    return $@"
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .invoice {{ max-width: 800px; margin: 0 auto; }}
            .header {{ text-align: center; margin-bottom: 20px; }}
            .details {{ margin-bottom: 30px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .total {{ font-weight: bold; text-align: right; }}
            .footer {{ margin-top: 30px; font-style: italic; }}
        </style>
    </head>
    <body>
        <div class='invoice'>
            <div class='header'>
                <h2>Book Store Nepal</h2>
                <h3>INVOICE</h3>
                <p>Invoice #: {order.OrderId}</p>
                <p>Date: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")}</p>
            </div>
            
            <div class='details'>
                <p><strong>Customer:</strong> {user.Name}</p>
                <p><strong>Email:</strong> {user.Email}</p>
                <p><strong>Claim Code:</strong> {order.ClaimCode}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsHtml}
                </tbody>
            </table>
            
            <div class='total'>
                <p>Subtotal: NPR {order.TotalPrice:F2}</p>
                {(order.DiscountPercent.HasValue && order.DiscountPercent > 0 ? 
                    $@"<p>Discount ({order.DiscountPercent}%): NPR {(order.TotalPrice * order.DiscountPercent.Value/100):F2}</p>
                    <p>Grand Total: NPR {order.TotalPrice * (1 - order.DiscountPercent.Value/100):F2}</p>" 
                    : $@"<p>Grand Total: NPR {order.TotalPrice:F2}</p>")}
            </div>
            
            <div class='footer'>
                <p>Thank you for your purchase!</p>
                <p>Please present this claim code when collecting your order: <strong>{order.ClaimCode}</strong></p>
            </div>
        </div>
    </body>
    </html>";
}

[HttpDelete("deleteOrder/{orderId}")]
public async Task<IActionResult> DeleteOrder(int orderId)
{
    try
    {
        // Find the order including its related items
        var order = await _db.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
        {
            return NotFound(new { 
                Success = false, 
                Message = "Order not found" 
            });
        }

        // Check if order can be deleted based on status
        if (order.Status != "Completed")
        {
            return BadRequest(new {
                Success = false,
                Message = $"Cannot delete order with status: {order.Status}"
            });
        }

        // First delete all order items
        _db.OrderItems.RemoveRange(order.OrderItems);

        // Then delete the order
        _db.Orders.Remove(order);

        await _db.SaveChangesAsync();

        return Ok(new {
            Success = true,
            Message = "Order deleted successfully",
            DeletedOrderId = orderId
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new {
            Success = false,
            Message = "An error occurred while deleting the order",
            Error = ex.Message
        });
    }
}

    }
}
