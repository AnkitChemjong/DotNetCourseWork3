using System;

namespace BookStoreNepalServer.DTO;

public class UpdateDiscountRequest
{
 public int BookId { get; set; }
        public decimal Discount { get; set; }
        public DateTime DiscountStartDate { get; set; }
        public DateTime DiscountEndDate { get; set; }
}
