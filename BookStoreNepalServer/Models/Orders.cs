using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreNepalServer.Models;

public class Orders
{

    [Key]
        public int OrderId { get; set; }

        [Required]
        public string ClaimCode { get; set; } = Guid.NewGuid().ToString()[..8].ToUpper();

        [DataType(DataType.DateTime)]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "Order status is required")]
        public string Status { get; set; } = "Placed";  

        [Required(ErrorMessage = "Total price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total price must be positive")]
        public decimal TotalPrice { get; set; }

        [Range(0, 100, ErrorMessage = "Discount must be between 0% and 100%")]
        public decimal? DiscountPercent { get; set; }

     
        [Required]
        public int UserId { get; set; }

        
        public Users User { get; set; }

}
