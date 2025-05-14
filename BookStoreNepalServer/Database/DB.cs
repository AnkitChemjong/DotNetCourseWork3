
using System;
using Microsoft.EntityFrameworkCore;
using BookStoreNepalServer.Models;
// This class represents the Entity Framework Core database context for the BookStoreNepalServer application.
// It is responsible for managing database operations and mapping entity models to database tables.

namespace BookStoreNepalServer.Database;

public class DB : DbContext
{
    // Constructor that accepts DbContextOptions and passes them to the base DbContext.
    // This allows configuration of the database connection from external sources like dependency injection.
    public DB(DbContextOptions<DB> options): base(options)
    {

  
        
    }
     // DbSets represent tables in the database. Each set maps to an entity model.


     public DbSet<Users> Users { get; set; } // Table for storing user information
      public DbSet<OrderItem> OrderItems { get; set; } // Table for storing individual items in orders

      public DbSet<Orders> Orders {get; set;} // Table for storing order records

     public DbSet<Books> Books { get; set; }// Table for storing book details
    public DbSet<Review> Reviews { get; set; }// Table for storing user reviews for books
    public DbSet<Cart> Carts { get; set; }// Table for storing user cart items

     public DbSet<BannerAnnouncement> BannerAnnouncement { get; set; } // Table for banner announcements on the site

     public DbSet<Notification> Notifications { get; set; }// Table for user notifications
    public DbSet<Whitelist> Whitelists { get; set; } // Table for whitelisted email addresses or IPs

}
