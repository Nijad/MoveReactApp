using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Server.IISIntegration;
using MoveReactApp.Server.Helper;

namespace MoveReactApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddControllers();
            builder.Services.AddTransient<IClaimsTransformation, RoleAuthorization>();
            //builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
            //                .AddNegotiate();
            builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme)
                .AddNegotiate();
            builder.Services.AddAuthorization(
                options =>
                { 
                    options.AddPolicy("AllowReactApp", policy => 
                        policy.RequireRole("INTERNET\\Domain Users")); 
                }
            );
            //builder.Services.AddAuthorization(options => options.FallbackPolicy = options.DefaultPolicy);
            
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins(/*"http://localhost",
                            "http://localhost:4200",
                            "https://localhost:7230",
                            "http://localhost:90",
                            "https://localhost:54785",*/
                            "https://localhost:54785") // React app URL
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();
            app.UseCors("AllowReactApp");
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("Referrer-Policy", "no-referrer-when-downgrade"); // 🔥 Allow cross-origin referrer
                if (context.Request.Method == HttpMethods.Options)
                {
                    context.Response.StatusCode = 200;
                    return;
                }
                await next();
            });
            // Ensure CORS middleware is placed before other middleware
            

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowReactApp");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}