using System.Net;
using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Persistence;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Comments
{
    public class CreateComment
    {
        public class Command : IRequest<CommentsDto>
        {
            public string Body { get; set; }
            public Guid ClubId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            async Task<CommentsDto> IRequestHandler<Command, CommentsDto>.Handle(Command request, CancellationToken cancellationToken)
            {

                var club = await _context.Clubs.FindAsync(request.ClubId);

                if (club == null)
                {

                    throw new RestException(HttpStatusCode.NotFound, new { Club = "Not Found" });
                }

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {

                    Author = user,
                    Club = club,
                    Body = request.Body,
                    CreatedAtTime = DateTime.Now

                };

                club.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return _mapper.Map<CommentsDto>(comment);
                }

                throw new Exception("Problem saving club chnages");
            }
        }
    }
}