using System;
namespace Domain
{
    public class UserClub
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid ClubId { get; set; }
        public virtual Club Club { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}