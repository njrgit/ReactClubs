using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clubs
{
    public class List
    {

        public class ClubEnvelope
        {
            public List<ClubDto> Clubs { get; set; }

            public int ClubCount { get; set; }
        }

        public class Query : IRequest<ClubEnvelope>
        {

            public Query(int? limit, int? offSet, bool isGoing, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                OffSet = offSet;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? OffSet { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ClubEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<ClubEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Clubs
                .Where(x => x.DateEstablished >= request.StartDate)
                .OrderBy(x => x.DateEstablished)
                .AsQueryable();

                if (request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserClubs.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.IsGoing)
                {
                    queryable = queryable.Where(x => x.UserClubs.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var clubs = await queryable
                .Skip(request.OffSet ?? 0)
                .Take(request.Limit ?? 3).ToListAsync();

                return new ClubEnvelope
                {
                    Clubs = _mapper.Map<List<Club>, List<ClubDto>>(clubs),
                    ClubCount = queryable.Count()
                };
            }
        }
    }
}