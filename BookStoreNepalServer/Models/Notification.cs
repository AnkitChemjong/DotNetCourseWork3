using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Recipient user is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid UserId.")]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public Users User { get; set; }

        // Optional link back to an order
        [Range(1, int.MaxValue, ErrorMessage = "OrderId must be a positive integer.")]
        public int? OrderId { get; set; }

        [Required(ErrorMessage = "Notification message is required.")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Message must be between 5 and 200 characters.")]
        public string Message { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [Display(Name = "Created At")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Display(Name = "Read Status")]
        public bool IsRead { get; set; } = false;

        // Concurrency token to handle parallel updates
        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
