using System;
// Data Transfer Object (DTO) used to update the discount details of a book.
// Contains the book ID, discount amount, and the duration for which the discount is active.


namespace BookStoreNepalServer.DTO;

public class UpdateDiscountRequest
{
        // The ID of the book whose discount is being updated.
 public int BookId { get; set; }
  // The discount percentage or amount to be applied to the book.
        public decimal Discount { get; set; }
        // The start date of the discount period.
        public DateTime DiscountStartDate { get; set; }
        // The end date of the discount period.
        public DateTime DiscountEndDate { get; set; }
}
