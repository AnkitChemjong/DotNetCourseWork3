using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models;

public class Cart
{
     [Key]
   public int CartId {get;set;}
[Required]
      public int OriginalPrice {get;set;}
      [Required]
      public int DiscountedPrice {get;set;}
      [Required]
      public int Discount {get;set;}

   [Required]
   
    public int TotalItems { get; set; }  
    [Required]
    public decimal CartTotal { get; set; }  
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // Foreign Keys
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("Book")]
        public int BookId { get; set; }

        // Navigation
        public Users? User { get; set; }
        public Books? Book { get; set; }

}
