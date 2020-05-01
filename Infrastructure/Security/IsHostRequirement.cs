using System;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security {
    public class IsHostRequirement : IAuthorizationRequirement {

    }

    public class IHostRequirementHandler : AuthorizationHandler<IsHostRequirement> {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public IHostRequirementHandler (IHttpContextAccessor httpContextAccessor, DataContext context) {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync (AuthorizationHandlerContext context, IsHostRequirement requirement) {
            
            var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x=>x.Type == ClaimTypes.NameIdentifier)?.Value;

            var clubId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x=>x.Key == "id").Value.ToString());

            var club = _context.Clubs.FindAsync(clubId).Result;

            var host = club.UserClubs.FirstOrDefault(x=>x.IsHost);

            if(host?.AppUser?.UserName == currentUserName){
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}