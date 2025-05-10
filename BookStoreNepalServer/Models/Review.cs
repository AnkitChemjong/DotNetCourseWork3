using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models;

public class Review
{

     [Key]
        public int ReviewId { get; set; }

        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars")]
        public int Rating { get; set; }

        [MaxLength(500, ErrorMessage = "Comment cannot exceed 500 characters")]
        public string Comment { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

    
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
