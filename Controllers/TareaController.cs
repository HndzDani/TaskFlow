
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.DTOs;
using TaskFlow.Models;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TareaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TareaController> _logger;

        public TareaController(AppDbContext context,ILogger<TareaController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // OBTENER TODAS LAS TAREAS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TareaRespuestaDTO>>> ObtenerTodosDatos()
        {
            var lista = await _context.Tareas
                .AsNoTracking()
                .Select(t => new TareaRespuestaDTO
                {
                    Id = t.Id,
                    Titulo = t.Titulo,
                    Descripcion = t.Descripcion,
                    Estado = t.Estado,
                    Prioridad = t.Prioridad,
                    FechaCreacion = t.FechaCreacion,
                    FechaVencimiento = t.FechaVencimiento,
                    FechaActualizacion = t.FechaActualizacion
                })
                .ToListAsync();

            return Ok(lista);
        }

        // OBTENER TAREA POR ID
        [HttpGet("{id}")]
        public async Task<ActionResult<TareaRespuestaDTO>> ObtenerPorId(int id)
        {
            var tarea = await _context.Tareas
                .AsNoTracking()
                .Where(t => t.Id == id)
                .Select(t => new TareaRespuestaDTO
                {
                    Id = t.Id,
                    Titulo = t.Titulo,
                    Descripcion = t.Descripcion,
                    Estado = t.Estado,
                    Prioridad = t.Prioridad,
                    FechaCreacion = t.FechaCreacion,
                    FechaVencimiento = t.FechaVencimiento,
                    FechaActualizacion = t.FechaActualizacion
                })
                .FirstOrDefaultAsync();

            if (tarea == null)
                return NotFound();

            return Ok(tarea);
        }

        // CREAR TAREA
        [HttpPost]
        public async Task<ActionResult<TareaRespuestaDTO>> CrearTarea(CrearTareaDTO dto)
        {
            var tarea = new Tarea
            {
                Titulo = dto.Titulo,
                Descripcion = dto.Descripcion,
                Estado = dto.Estado,
                Prioridad = dto.Prioridad,
                FechaCreacion = DateTime.Now,
                FechaVencimiento = dto.FechaVencimiento,
                FechaActualizacion = null
            };

            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Se creó una tarea correctamente.");

            var respuesta = new TareaRespuestaDTO
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                Estado = tarea.Estado,
                Prioridad = tarea.Prioridad,
                FechaCreacion = tarea.FechaCreacion,
                FechaVencimiento = tarea.FechaVencimiento,
                FechaActualizacion = tarea.FechaActualizacion
            };

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = tarea.Id },
                respuesta
            );
        }

        // ACTUALIZAR TAREA
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarTarea(int id, ActualizarTareaDTO dto)
        {
            var tarea = await _context.Tareas.FindAsync(id);

            if (tarea == null)
                return NotFound("ID no encontrado.");

            tarea.Titulo = dto.Titulo;
            tarea.Descripcion = dto.Descripcion;
            tarea.Estado = dto.Estado;
            tarea.Prioridad = dto.Prioridad;
            tarea.FechaVencimiento = dto.FechaVencimiento;
            tarea.FechaActualizacion = DateTime.Now;

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Tarea con ID {TareaId} actualizada correctamente.",
                id
            );

            return Ok("Tarea actualizada correctamente.");
        }

        // ELIMINAR TAREA
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPorId(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);

            if (tarea == null)
                return NotFound("Tarea no encontrada.");

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Tarea con ID {TareaId} eliminada correctamente.",
                id
            );

            return Ok("Tarea eliminada con éxito.");
        }
    }
}
