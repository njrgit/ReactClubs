using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clubs {
    public class List {
        public class Query : IRequest<List<ClubDto>> { }

        public class Handler : IRequestHandler<Query, List<ClubDto>> {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler (DataContext context, IMapper mapper) {
                _mapper = mapper;
                _context = context;
            }

            public async Task<List<ClubDto>> Handle (Query request, CancellationToken cancellationToken) {
                var clubs = await _context.Clubs.Include (x => x.UserClubs).ThenInclude (x => x.AppUser).ToListAsync ();

                return _mapper.Map<List<Club>,List<ClubDto>>(clubs);
            }
        }
    }
}