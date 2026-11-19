using System.ComponentModel.DataAnnotations;

namespace TaskFlow.DTOs
{
    public class ActualizarTareaDTO
    {
        [Required(ErrorMessage = "No puede ser nulo o vacío.")]
        [MaxLength(100, ErrorMessage = "Máximo 100 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(300, ErrorMessage = "Máximo 300 caracteres.")]
        public string? Descripcion { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Pendiente|En progreso|Completada)$", ErrorMessage = "El estado debe ser Pendiente, En progreso o Completada.")]
        [MaxLength(20, ErrorMessage = "Máximo 20 caracteres.")]
        public string Estado { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Baja|Media|Alta)$", ErrorMessage = "La prioridad debe ser Baja, Media o Alta.")]
        [MaxLength(15, ErrorMessage = "Máximo 15 caracteres.")]
        public string Prioridad { get; set; } = string.Empty;
        public DateOnly? FechaVencimiento { get; set; }

    }
}
