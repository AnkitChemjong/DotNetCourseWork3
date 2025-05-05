using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreNepalServer.Models
{
    public class BannerAnnouncement
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Message must be between 5 and 200 characters.")]
        public string Message { get; set; }

        [Required(ErrorMessage = "StartTime is required.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "EndTime is required.")]
         public DateTime EndTime { get; set; }

        [Required(ErrorMessage = "UserId is required.")]
        
        public int UserId { get; set; }

        public Users User { get; set; }
    }
}
