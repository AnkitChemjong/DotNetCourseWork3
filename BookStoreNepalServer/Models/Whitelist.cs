using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreNepalServer.Models;

public class Whitelist
{
[Key]
   public int ListId {get;set;}
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // Foreign Keys
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("Book")]
        public int BookId { get; set; }

        public Users? User { get; set; }
        [InverseProperty("WhiteLists")]
        public Books? Book { get; set; }
}
