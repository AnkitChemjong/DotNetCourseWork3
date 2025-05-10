using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models;

public class Books
{

     [Key]
        public int BookId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Author is required")]
        [MaxLength(50, ErrorMessage = "Author cannot exceed 50 characters")]
        
        public string Author { get; set; }

        [Required(ErrorMessage = "ISBN is required")]
        [RegularExpression(@"^\d{10}(\d{3})?$", ErrorMessage = "Invalid ISBN format (10 or 13 digits)")]
        public string ISBN { get; set; }

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Genre is required")]
        [MaxLength(30, ErrorMessage = "Genre cannot exceed 30 characters")]
        public string Genre { get; set; }

        [Required(ErrorMessage = "Format is required")]
        [MaxLength(20, ErrorMessage = "Format cannot exceed 20 characters")]
        public string Format { get; set; }

        [Required(ErrorMessage = "Language is required")]
        [MaxLength(20, ErrorMessage = "Language cannot exceed 20 characters")]
        public string Language { get; set; }
        
        [Required(ErrorMessage = "Discount is required")]
    [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100")]
    public decimal Discount { get; set; }

    [Required(ErrorMessage = "Discount start date is required")]
    [DataType(DataType.Date, ErrorMessage = "Invalid start date format")]
    public DateTime DiscountStartDate { get; set; }

    [Required(ErrorMessage = "Discount end date is required")]
    [DataType(DataType.Date, ErrorMessage = "Invalid end date format")]
    public DateTime DiscountEndDate { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 10000, ErrorMessage = "Price must be between $0.01 and $10,000")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Publisher name is required")]
        [MaxLength(50, ErrorMessage = "Publisher name cannot exceed 50 characters")]

        public string Publisher { get; set; } 
        [Required(ErrorMessage = "coverImage name is required")]
        public string coverImage { get; set; } 

        [DataType(DataType.Date)]
        public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

        public bool IsOnSale { get; set; } = false;
        
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
         public ICollection<Cart> Carts { get; set; } = new List<Cart>();
         [InverseProperty("Book")]
        public ICollection<Whitelist> WhiteLists { get; set; } = new List<Whitelist>();

}
