using System;
using System.ComponentModel;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
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
            public string ShortName {get; set;}

        }

        public class CommadValidator : AbstractValidator<Command>
        {
            public CommadValidator()
            {
                RuleFor( x => x.Name).NotEmpty();
                RuleFor( x => x.LeagueName).NotEmpty();
                RuleFor( x => x.StadiumName).NotEmpty();
            }
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

                if (club == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {clubs = "Not Found"});
                }
                club.Name = request.Name ?? club.Name;
                club.LeagueName = request.LeagueName ?? club.LeagueName;
                club.StadiumName = request.StadiumName ?? club.StadiumName;
                club.DateEstablished = request.DateEstablished ?? club.DateEstablished;
                club.ShortName = request.ShortName ?? club.ShortName;

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