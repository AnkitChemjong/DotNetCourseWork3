using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;

namespace BookStoreNepalServer.Controllers
{
    [Route("api/banner")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly DB _db;
        private readonly IConfiguration _config;
        
        public BannerController(DB db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // POST: api/banner/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateBanner([FromBody] BannerAnnouncement model)
        {
            _db.BannerAnnouncement.Add(model);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Banner created" });
        }
    
        // GET: api/banner/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveBanner()
        {
            var now = DateTime.UtcNow;
            var banner = await _db.BannerAnnouncement
                .FirstOrDefaultAsync(b => b.StartTime <= now && b.EndTime >= now);

            return banner != null ? Ok(banner) : NoContent();
        }
    }
}
