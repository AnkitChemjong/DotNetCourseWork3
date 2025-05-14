using BookStoreNepalServer.Services.Notification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    // Define the API route for handling notifications
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {

        private readonly NotificationService _notificationService;
             private readonly DB _db;
             // Constructor to inject the NotificationService and DB context

    public NotificationController(NotificationService notificationService, DB db)
    {
        _notificationService = notificationService;
         _db = db;
    }


 // Endpoint to send an order-placed notification to the user
     [HttpPost("order-placed")]
    public async Task<IActionResult> OrderPlaced(int userId, int orderId)
    {
         // Send the order placed notification using the service
        await _notificationService.SendOrderPlacedNotificationAsync(userId, orderId);
        return Ok(new { message = "Notification sent." });
    }
    // Endpoint to retrieve notifications for a specific user, optionally only unread ones
     [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int userId, [FromQuery] bool onlyUnread = false)
        {
            var query = _db.Notifications
                          .Where(n => n.UserId == userId);
 // Filter by unread notifications if requested
            if (onlyUnread)
                query = query.Where(n => !n.IsRead);

                    var notifications = await query
                .AsNoTracking()
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

 // Endpoint to mark a specific notification as read by its ID
        [HttpPatch("{id}/mark-as-read")]
public async Task<IActionResult> MarkAsRead(int id)
{
     // Find the notification by ID
    var notification = await _db.Notifications.FindAsync(id);
    if (notification == null)
        return NotFound();
 // Mark the notification as read and save changes
    notification.IsRead = true;
    await _db.SaveChangesAsync();

    return Ok();
}

// Endpoint to mark all unread notifications as read for a specific user
 [HttpPatch("mark-all-as-read/{userId}")]
    public async Task<IActionResult> MarkAllAsRead(int userId)
    {
        // Find all unread notifications for the user
        var list = await _db.Notifications
                             .Where(n => n.UserId == userId && !n.IsRead)
                             .ToListAsync();
        // Mark each notification as read
        list.ForEach(n => n.IsRead = true);
        await _db.SaveChangesAsync();
        return Ok();
    }

// Endpoint to test broadcasting a notification to the user (e.g., for debugging or testing purposes)
[HttpPost("test-broadcast/{userId}")]
public async Task<IActionResult> TestBroadcast(int userId)
{
     // Send a test notification (for order with ID 999, this is likely for testing purposes)
    await _notificationService.SendOrderPlacedNotificationAsync(userId, 999);
    
    return Ok("broadcast sent");
}


    }

    
}



