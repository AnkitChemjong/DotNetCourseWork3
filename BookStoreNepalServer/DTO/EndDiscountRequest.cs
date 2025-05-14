using System;
// Data Transfer Object (DTO) used for ending a discount on a specific book.
// This class contains only the BookId, which identifies the book for which the discount should be removed.
namespace BookStoreNepalServer.DTO;

public class EndDiscountRequest
{
    // The ID of the book whose discount is to be ended.
public int BookId { get; set; }
}
