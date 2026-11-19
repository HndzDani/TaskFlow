
using System.ComponentModel.DataAnnotations;

namespace TaskFlow.DTOs
{
    public class CrearTareaDTO
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El título no puede superar los 100 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(300, ErrorMessage = "La descripción no puede superar los 300 caracteres.")]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "Debes seleccionar un estado.")]
        [RegularExpression(
            "^(Pendiente|En progreso|Completada)$",
            ErrorMessage = "El estado debe ser Pendiente, En progreso o Completada."
        )]
        [MaxLength(20, ErrorMessage = "El estado no puede superar los 20 caracteres.")]
        public string Estado { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debes seleccionar una prioridad.")]
        [RegularExpression(
            "^(Baja|Media|Alta)$",
            ErrorMessage = "La prioridad debe ser Baja, Media o Alta."
        )]
        [MaxLength(15, ErrorMessage = "La prioridad no puede superar los 15 caracteres.")]
        public string Prioridad { get; set; } = string.Empty;

        public DateOnly? FechaVencimiento { get; set; }
    }
}
