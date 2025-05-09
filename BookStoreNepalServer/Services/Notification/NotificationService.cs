using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;             
using BookStoreNepalServer.Hubs;
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;              


namespace BookStoreNepalServer.Services.Notification
{
    public class NotificationService
    
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly DB _context; 

        public NotificationService(
            IHubContext<NotificationHub> hubContext,
            DB context   
        )
        {
            _hubContext = hubContext;
            _context    = context;
        }

        public async Task SendOrderPlacedNotificationAsync(int userId, int orderId)

        {
    
             try {
            
            var message = $"Your order #{orderId} was placed successfully!";

            // 1️Save to database
            var notification = new  Models.Notification
            {
                UserId    = userId,
                OrderId   = orderId,
                Message   = message,
                CreatedAt = DateTime.UtcNow
            };
            _context.Notification.Add(notification);
           
            
            // Push via SignalR
            await _hubContext
                .Clients
                .User(userId.ToString())
                .SendAsync("ReceiveNotification", message);
             } catch(Exception ex) {
                 Console.WriteLine($" Failed to send notification: {ex.Message}");
             }
        }
    }
}
