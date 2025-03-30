using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        //Obtener todos los usuarios
        [HttpGet("GetUsers")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            var usersWithClassification = users.Select(user => new
            {
                id = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                identification = user.Identification,
                lastAccessDate = user.LastAccessDate,
                classification = user.LastAccessDate == null ? "Sin acceso" :
                       (DateTime.Now - user.LastAccessDate.Value).TotalHours <= 12 ? "Hechicero" :
                       (DateTime.Now - user.LastAccessDate.Value).TotalHours <= 48 ? "Luchador" :
                       (DateTime.Now - user.LastAccessDate.Value).TotalDays <= 7 ? "Explorador" : "Olvidado",
                Score = CalculateScore(user.FirstName, user.LastName, user.Email)
            }).ToList();

            return Ok(usersWithClassification);
        }

        //Obtener un usuario por Id
        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "El usuario no existe" });
            }

            return user;
        }

        //crear un usuario
        [HttpPost("CreateUser")]
        public async Task<ActionResult<UserDto>> CreateUser(UserDto user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest(new { message = "El Email ya existe" });
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        //Actualizar un usuario especifico por el Id
        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "El ID del usuario no existe" });
            }

            _context.Users.Attach(user);

            _context.Entry(user).Property(u => u.Email).IsModified = true;
            _context.Entry(user).Property(u => u.Identification).IsModified = true;
            _context.Entry(user).Property(u => u.FirstName).IsModified = true;
            _context.Entry(user).Property(u => u.LastName).IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { message = "El usuario no existe" });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //Eliminar un usuario
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "El Usuario no existe" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private int CalculateScore(string firstName, string lastName, string email)
        {
            int score = 0;

            // Calcular longitud del nombre completo
            int fullNameLength = (firstName + " " + lastName).Replace(" ", "").Length;
            if (fullNameLength > 10)
                score += 20;
            else if (fullNameLength >= 5 && fullNameLength <= 10)
                score += 10;

            // Calcular puntaje según dominio del correo
            string domain = email.Split('@').Last();
            if (domain == "gmail.com")
                score += 40;
            else if (domain == "hotmail.com")
                score += 20;
            else
                score += 10;

            return score;
        }
    }
}
