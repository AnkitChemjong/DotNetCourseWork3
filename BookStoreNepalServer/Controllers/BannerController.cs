using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using BookStoreNepalServer.Models;
using BookStoreNepalServer.Database;
// This controller manages banner announcements for the BookStoreNepalServer API.
// It includes endpoints for creating a new banner and fetching the currently active banner.

namespace BookStoreNepalServer.Controllers
{
    [Route("api/banner")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly DB _db; // Database context to access the database
        private readonly IConfiguration _config;  // Application configuration
        // Constructor that injects the database context and configuration
        public BannerController(DB db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

   // POST: api/banner/create
        // Endpoint to create a new banner announcement.
        // Validates the input, checks for any currently active banners, and updates them before adding the new one.
    [HttpPost("create")]
    public async Task<IActionResult> CreateBanner([FromBody] BannerAnnouncement model)
    {
// Validate incoming model
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

       // Ensure StartTime and EndTime are provided and valid
        if (model.StartTime == null || model.EndTime == null)
            return BadRequest("StartTime and EndTime are required.");

        if (model.EndTime <= model.StartTime)
        {
            ModelState.AddModelError("EndTime", "EndTime must be after StartTime.");
            return BadRequest(ModelState);
        }


        var now = DateTime.UtcNow;
         // Find all active banners (those currently within the valid date range)
    var actives = await _db.BannerAnnouncement
        .Where(b => b.StartTime <= now && b.EndTime >= now)
        .ToListAsync();

    // “Close them out” immediately before adding the new one
    foreach (var old in actives)
    {
        // either set EndTime to just before new banner starts:
        old.EndTime = model.StartTime <= now
            ? now.AddSeconds(-1)
            : model.StartTime.AddSeconds(-1);

        // or it can have an `old.IsActive = false;` flag instead
        _db.BannerAnnouncement.Update(old);
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
