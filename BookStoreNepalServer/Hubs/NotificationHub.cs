using System;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

// SignalR hub for managing real-time user connections and disconnections.
// Used in the BookStoreNepalServer to handle notifications and user presence tracking.
namespace BookStoreNepalServer.Hubs;

public class NotificationHub  : Hub
{
   // Called automatically when a new client establishes a connection to the hub.
    // Retrieves the user's unique identifier from the connection's claims and logs the connection.
       public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User connected: {userId}");
        await base.OnConnectedAsync();
    }

 // Called automatically when a client disconnects from the hub.
    // Retrieves the user's unique identifier from the connection's claims and logs the disconnection.
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User disconnected: {userId}");
        await base.OnDisconnectedAsync(exception);
    }
   

} 
