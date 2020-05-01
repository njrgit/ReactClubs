using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clubs {
    public class SingleClub {
        public class Query : IRequest<ClubDto> {
            public Guid id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ClubDto> {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler (DataContext context, IMapper mapper) {
                _mapper = mapper;
                _context = context;
            }

            public async Task<ClubDto> Handle (Query request, CancellationToken cancellationToken) {
                var club = await _context.Clubs.FindAsync(request.id);

                if (club == null) {
                    throw new RestException (HttpStatusCode.NotFound, new { clubs = "Not Found" });
                }

                var clubToReturn = _mapper.Map<Club,ClubDto>(club);

                return clubToReturn;
            }
        }
    }
}