
using System;
using Microsoft.EntityFrameworkCore;
using BookStoreNepalServer.Models;

namespace BookStoreNepalServer.Database;

public class DB : DbContext
{
    public DB(DbContextOptions<DB> options): base(options)
    {

  
        
    }

     public DbSet<Users> Users { get; set; }
      public DbSet<OrderItem> OrderItems { get; set; }

      public DbSet<Orders> Orders {get; set;}

     public DbSet<Books> Books { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Cart> Carts { get; set; }

     public DbSet<BannerAnnouncement> BannerAnnouncement { get; set; }

     public DbSet<Notification> Notifications { get; set; }
    public DbSet<Whitelist> Whitelists { get; set; }

}
