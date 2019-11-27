using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clubs
{
    public class List
    {
        public class Query : IRequest<List<Club>>{}

        public class Handler : IRequestHandler<Query, List<Club>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Club>> Handle(Query request, CancellationToken cancellationToken)
            {
                var clubs  = await _context.Clubs.ToListAsync();

                return clubs;
            }
        }
    }
}