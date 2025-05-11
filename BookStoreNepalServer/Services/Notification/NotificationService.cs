using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using BookStoreNepalServer.Hubs;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;

namespace BookStoreNepalServer.Services.Notification
{
    public class NotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly DB _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            IHubContext<NotificationHub> hubContext,
            DB context,
            ILogger<NotificationService> logger
        )
        {
            _hubContext = hubContext;
            _context = context;
            _logger = logger;
        }

       public async Task SendOrderPlacedNotificationAsync(int userId, int orderId)
{
    try
    {
        var message = $"Your order #{orderId} was placed successfully!";
        var notification = new Models.Notification
        {
            UserId    = userId,
            OrderId   = orderId,
            Message   = message,
            CreatedAt = DateTime.UtcNow
        };

        // 1) Save to database
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // 2) Build a lightweight DTO to send
        var dto = new
        {
            id        = notification.Id,
            message   = notification.Message,
            createdAt = notification.CreatedAt,
            isRead    = notification.IsRead
        };

        // 3) Send to just that one user (assuming your Hub is set up to map
        //    the ASP-NET identity NameIdentifier to SignalR.UserIdentifier)
        await _hubContext
            .Clients
            .User(userId.ToString())
            .SendAsync("ReceiveNotification", dto);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to send notification");
    }
}

    }
}
