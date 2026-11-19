using System.ComponentModel.DataAnnotations;

namespace TaskFlow.DTOs
{
    public class TareaRespuestaDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string? Descripcion { get; set; }
        public string Estado { get; set; }
        public string Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateOnly? FechaVencimiento { get; set; }
        public DateTime? FechaActualizacion { get; set; }
    }
}
