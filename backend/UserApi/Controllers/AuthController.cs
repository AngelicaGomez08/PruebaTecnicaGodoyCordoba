using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email && u.Identification == loginDto.Password);

            if (user == null)
                return Unauthorized(new { message = "Email o password incorrectos" });

            user.LastAccessDate = DateTime.UtcNow;
            _context.SaveChanges();

            return Ok(new { message = "Login satisfactorio" });
        }
    }
}
