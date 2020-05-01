using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clubs {
    public class Attend {
        public class Command : IRequest {

            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command> {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor) {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken) {

                //Map model from command
                // Add Context 

                var club = await _context.Clubs.FindAsync (request.Id);

                if (club == null) {
                    throw new RestException (HttpStatusCode.NotFound, new { Club = "Could not find Club" });
                }

                var user = await _context.Users.SingleOrDefaultAsync (x => x.UserName == _userAccessor.GetCurrentUsername ());

                var attendance = await _context.UserClubs.SingleOrDefaultAsync (x => x.ClubId == club.Id && x.AppUserId == user.Id);

                if (attendance != null) {

                    throw new RestException (HttpStatusCode.BadRequest, new { attendance = "Already Attending this club" });
                }

                attendance = new Domain.UserClub {
                    Club = club,
                        AppUser = user,
                        IsHost = false,
                        DateJoined = DateTime.Now
                };

                _context.UserClubs.Add(attendance);

                var success = await _context.SaveChangesAsync () > 0;

                if (success) {
                    return Unit.Value;
                }

                throw new Exception ("Problem saving club chnages");
            }
        }
    }
}