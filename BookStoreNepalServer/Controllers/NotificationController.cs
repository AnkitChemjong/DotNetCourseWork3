using BookStoreNepalServer.Services.Notification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStoreNepalServer.Database;
using BookStoreNepalServer.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {

        private readonly NotificationService _notificationService;
             private readonly DB _db;

    public NotificationController(NotificationService notificationService, DB db)
    {
        _notificationService = notificationService;
         _db = db;
    }



     [HttpPost("order-placed")]
    public async Task<IActionResult> OrderPlaced(int userId, int orderId)
    {
        await _notificationService.SendOrderPlacedNotificationAsync(userId, orderId);
        return Ok(new { message = "Notification sent." });
    }
     [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int userId, [FromQuery] bool onlyUnread = false)
        {
            var query = _db.Notifications
                          .Where(n => n.UserId == userId);

            if (onlyUnread)
                query = query.Where(n => !n.IsRead);

                    var notifications = await query
                .AsNoTracking()
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPatch("{id}/mark-as-read")]
public async Task<IActionResult> MarkAsRead(int id)
{
    var notification = await _db.Notifications.FindAsync(id);
    if (notification == null)
        return NotFound();

    notification.IsRead = true;
    await _db.SaveChangesAsync();

    return Ok();
}


 [HttpPatch("mark-all-as-read/{userId}")]
    public async Task<IActionResult> MarkAllAsRead(int userId)
    {
        var list = await _db.Notifications
                             .Where(n => n.UserId == userId && !n.IsRead)
                             .ToListAsync();
        list.ForEach(n => n.IsRead = true);
        await _db.SaveChangesAsync();
        return Ok();
    }


[HttpPost("test-broadcast/{userId}")]
public async Task<IActionResult> TestBroadcast(int userId)
{
    await _notificationService.SendOrderPlacedNotificationAsync(userId, 999);
    
    return Ok("broadcast sent");
}


    }

    
}



