using System.Diagnostics;
using System;
using System.Text;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private  readonly SymmetricSecurityKey _key;
        private readonly ILogger _logger;

        public JwtGenerator(IConfiguration configuration, ILogger<JwtGenerator> logger)
        {
            _logger = logger;

            var tokenKeyFromAppSettings = configuration["TokenKey"];

            var connectionString = configuration.GetConnectionString("DefaultConnectionString");

            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKeyFromAppSettings));

            _logger.LogInformation($"this is from the jwt generator {tokenKeyFromAppSettings}");

            _logger.LogInformation($"This is the connection string test {connectionString}");
        }   

        public string CreateToken(AppUser user)
        {

            var claims = new List<Claim>{

                new Claim(JwtRegisteredClaimNames.NameId, user.UserName )
            };

            // generate signing credentials

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}