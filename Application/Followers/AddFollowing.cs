using System.Net;
using System.Net.Http;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Errors;

namespace Application.Followers
{
    public class AddFollowing
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if(target == null){
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });
                }

                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

                if(following != null){
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are already following this user" });
                }

                if(following == null){

                    following = new Domain.UserFollowing
                    {

                        Observer = observer,
                        Target = target
                    };
                }

                _context.Add(following);

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