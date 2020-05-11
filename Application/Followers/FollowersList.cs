using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowersList
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;

            public Handler(DataContext context, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _context = context;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryVariable = _context.Followings.AsQueryable();

                var userFollowing = new List<UserFollowing>();

                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        {

                            userFollowing = await queryVariable.Where(x => x.Target.UserName == request.Username).ToListAsync();

                            foreach (var follower in userFollowing)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                            }
                            break;
                        }

                    case "following":
                        {

                            userFollowing = await queryVariable.Where(x => x.Observer.UserName == request.Username).ToListAsync();

                            foreach (var follower in userFollowing)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Target.UserName));
                            }
                            break;
                        }
                }

                return profiles;
            }
        }
    }
}