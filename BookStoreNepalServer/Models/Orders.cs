using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Required(ErrorMessage = "Initial price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Initial price must be positive")]
        public decimal InitialPrice { get; set; }

        [Range(0, 100, ErrorMessage = "Discount must be between 0% and 100%")]
        public decimal? DiscountPercent { get; set; }

     
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        

        public Users User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }= new List<OrderItem>();

}
