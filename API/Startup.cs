using System.Collections.Immutable;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Text;
using Application.Clubs;
using Application.Interfaces;
using API.Middleware;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using API.SignalR;
using Application.Profiles;

namespace API
{
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {

            services.AddControllers ( opt =>{

                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
                .AddFluentValidation (
                    config => {
                        config.RegisterValidatorsFromAssemblyContaining<CreateSingleClub> ();
                    });

            services.AddDbContext<DataContext> (opt => {
                var connectionstring = Configuration.GetConnectionString ("DefaultConnectionString");
                opt.UseLazyLoadingProxies();
                opt.UseSqlite (connectionstring);
            });

            services.AddCors (opt => {
                opt.AddPolicy (name:"NewCorsPolicy", policy => {
                    policy.AllowAnyHeader ().AllowAnyMethod().WithOrigins("http://localhost:3000").AllowCredentials();
                });
            });

            services.AddMediatR (typeof (List.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler));

            services.AddSignalR(); 

            var builder = services.AddIdentityCore<AppUser> ();

            var identityBuilder = new IdentityBuilder (builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext> ();
            identityBuilder.AddSignInManager<SignInManager<AppUser>> ();

            services.AddAuthorization(opt =>{

                opt.AddPolicy("IsClubHost", policy =>{
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IHostRequirementHandler>();
            
            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (Configuration["TokenKey"]));

            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (opt => {

                    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters {

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateAudience = false,
                    ValidateIssuer = false
                    };

                    opt.Events = new JwtBearerEvents
                    {

                        OnMessageReceived = context =>
                        {

                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                            {

                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IJwtGenerator, JwtGenerator> ();
            services.AddScoped<IUserAccessor, UserAccessor> ();
            services.AddScoped<IPhotoAccessor, PhotoAccessor> ();
            services.AddScoped<IProfileReader, ProfileReader> ();
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {

            app.UseMiddleware<ErrorHandlingMiddleware> ();

            if (env.IsDevelopment ()) {
                //      app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting ();
            
            app.UseCors("NewCorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization ();

            app.UseEndpoints (endpoints => {
                endpoints.MapControllers ();
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}