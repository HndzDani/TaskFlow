using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Models
{
    public class Tarea
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "No puede ser nulo o vacío.")]
        [MaxLength(100, ErrorMessage = "Máximo 100 caracteres.")]
        public string Titulo { get; set; }

        [MaxLength(300, ErrorMessage = "Máximo 300 caracteres.")]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "Indique si la Tarea esta: Completada, En progreso o Pendiente")]
        [MaxLength(20, ErrorMessage = "Máximo 20 caracteres.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "Indique si la Prioridad es: Alta, Baja o Media")]
        [MaxLength(15, ErrorMessage = "Máximo 15 caracteres.")]
        public string Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateOnly? FechaVencimiento { get; set; }
        public DateTime? FechaActualizacion { get; set; }


    }
}
