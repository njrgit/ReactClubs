using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Club
    {
        [MaxLength(255)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LeagueName { get; set; }
        public string StadiumName { get; set; }
        public DateTime DateEstablished { get; set; }
        public string ShortName {get; set;}
        public virtual ICollection<UserClub> UserClubs { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
    }
}