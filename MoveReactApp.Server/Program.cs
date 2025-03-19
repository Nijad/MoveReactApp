using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Server.IISIntegration;
using MoveReactApp.Server.Helper;
using NLog;
using NLog.Web;

namespace MoveReactApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
            
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            builder.Logging.ClearProviders();
            builder.Host.UseNLog();
            try
            {
                builder.Services.AddHttpContextAccessor();
                builder.Services.AddTransient<IUserHelper, UserHelper>();
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

                WebApplication app = builder.Build();
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
            }catch(Exception ex)
            {
                logger.Error(ex);
            }
            finally
            {
                LogManager.Shutdown();
            }
        }
    }
}