using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Clubs
{
    public class CreateSingleClub
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string LeagueName { get; set; }
            public string StadiumName { get; set; }
            public DateTime DateEstablished { get; set; }
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
                var club  = new Club
                {
                    Id = request.Id,
                    Name = request.Name,
                    LeagueName = request.LeagueName,
                    StadiumName = request.StadiumName,
                    DateEstablished = request.DateEstablished
                };

                _context.Clubs.Add(club);
                var success = await _context.SaveChangesAsync() > 0;

                if(success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving club chnages");
            }
        }
    }
}