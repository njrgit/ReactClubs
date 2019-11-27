using System;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Clubs
{
    public class EditClub
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string LeagueName { get; set; }
            public string StadiumName { get; set; }
            public DateTime? DateEstablished { get; set; }

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

                //Map model from command
                // Add Context 

                var club = await _context.Clubs.FindAsync(request.Id);

                if(club == null)
                {
                    throw new Exception($"Could not find club with id : {request.Id}");
                }

                club.Name = request.Name ?? club.Name;
                club.LeagueName = request.LeagueName ?? club.LeagueName;
                club.StadiumName = request.StadiumName ?? club.StadiumName;
                club.DateEstablished = request.DateEstablished ?? club.DateEstablished;

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