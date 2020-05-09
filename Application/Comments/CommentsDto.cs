using System;
using Domain;

namespace Application.Comments
{
    public class CommentsDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAtTime { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
    }
}