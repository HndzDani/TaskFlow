using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TaskFlow.Data;
using TaskFlow.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(Options =>

   Options.UseSqlServer(
       builder.Configuration.GetConnectionString("DefaultConnection")
   )
);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();

