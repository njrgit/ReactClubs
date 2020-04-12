using System.Net;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Clubs
{
    public class DeleteClub
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var club = await _context.Clubs.FindAsync(request.Id);

                if (club == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {clubs = "Not Found"});
                }

                _context.Remove(club);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving club chnages");
            }
        }
    }
}