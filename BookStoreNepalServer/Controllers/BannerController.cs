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

   
    [HttpPost("create")]
    public async Task<IActionResult> CreateBanner([FromBody] BannerAnnouncement model)
    {

        if (!ModelState.IsValid)
        {
                var errors = ModelState
          .Where(kvp => kvp.Value.Errors.Count > 0)
          .ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
          );

        return BadRequest(new { errors });
        }


        if (model.StartTime == null || model.EndTime == null)
            return BadRequest("StartTime and EndTime are required.");

        if (model.EndTime <= model.StartTime)
        {
            ModelState.AddModelError("EndTime", "EndTime must be after StartTime.");
            return BadRequest(ModelState);
        }

       


        _db.BannerAnnouncement.Add(model);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Banner created successfully." });
    }

        // GET: api/banner/active
        [HttpGet("active")]
            public async Task<IActionResult> GetActiveBanner()
            {
            var now = DateTime.UtcNow;
            Console.WriteLine($"GET /active at {now:o}");
            var banner = await _db.BannerAnnouncement
                .FirstOrDefaultAsync(b => b.StartTime <= now && b.EndTime >= now);
            if (banner != null)
                Console.WriteLine($"  returning banner Id={banner.Id} Message={banner.Message}");
            else
                Console.WriteLine("  no active banner found");

            return banner != null ? Ok(banner) : NoContent();
            }

    }
}
