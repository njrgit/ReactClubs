using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Clubs
{
    public class SingleClub
    {
        public class Query : IRequest<Club>
        {
            public Guid id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Club>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Club> Handle(Query request, CancellationToken cancellationToken)
            {  
                var club  = await _context.Clubs.FindAsync(request.id);

                if (club == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {clubs = "Not Found"});
                }

                return club;
            }
        }
    }
}