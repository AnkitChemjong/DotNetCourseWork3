using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models;

public class OrderItem
{

      [Key]
        public int OrderItemId { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Unit price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be positive")]
        public decimal UnitPrice { get; set; }
        
        [Required]
        public int OrderId { get; set; }

        [Required]
        [ForeignKey("Book")]
        public int BookId { get; set; }

        
        public Orders Order { get; set; }
        public Books Book { get; set; }

}
