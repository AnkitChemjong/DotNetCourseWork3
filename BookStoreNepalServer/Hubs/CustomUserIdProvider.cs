
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
// Custom implementation of IUserIdProvider used to specify how to identify users in SignalR hubs.
// This class tells SignalR to use the user's NameIdentifier claim (usually the user ID) as the unique identifier for connections.

namespace BookStoreNepalServer.Hubs
{
    public class CustomUserIdProvider : IUserIdProvider
    {
      // Retrieves the unique user ID from the connection's claims.
        // SignalR uses this ID to send messages to specific users.
        // Returns null if the claim is not present or the user is not authenticated.
       public string GetUserId(HubConnectionContext connection) {
    return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
  }
    }
}