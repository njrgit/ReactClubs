using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListClubs
    {
        public class Query : IRequest<List<UserClubDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserClubDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserClubDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserClubs
                    .OrderBy(a => a.Club.DateEstablished)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Club.DateEstablished <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Club.DateEstablished >= DateTime.Now);
                        break;
                }

                var activities = queryable.ToList();
                var activitiesToReturn = new List<UserClubDto>();

                foreach (var activity in activities)
                {
                    var userActivity = new UserClubDto
                    {
                        Id = activity.Club.Id,
                        Title = activity.Club.Name,
                        Category = activity.Club.LeagueName,
                        Date = activity.Club.DateEstablished
                    };

                    activitiesToReturn.Add(userActivity);
                }

                return activitiesToReturn;
            }
        }
    }
}