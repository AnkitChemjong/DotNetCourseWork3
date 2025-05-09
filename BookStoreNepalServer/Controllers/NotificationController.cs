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
            var query = _db.Notification
                          .Where(n => n.UserId == userId);

            if (onlyUnread)
                query = query.Where(n => !n.IsRead);

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
               .ToListAsync();

            return Ok(notifications);
        }


    }
}
