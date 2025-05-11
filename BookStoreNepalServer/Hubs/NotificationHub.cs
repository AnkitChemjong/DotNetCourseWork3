using System;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace BookStoreNepalServer.Hubs;

public class NotificationHub  : Hub
{

       public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User connected: {userId}");
        await base.OnConnectedAsync();
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User disconnected: {userId}");
        await base.OnDisconnectedAsync(exception);
    }
   

} 
