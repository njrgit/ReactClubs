using System;
using System.Collections.Generic;

namespace Domain
{
    public class Club
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LeagueName { get; set; }
        public string StadiumName { get; set; }
        public DateTime DateEstablished { get; set; }
        public string ShortName {get; set;}
        public virtual ICollection<UserClub> UserClubs { get; set; }
    }
}