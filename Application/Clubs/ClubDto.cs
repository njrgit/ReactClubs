using System.Collections;
using System;
using System.Collections.Generic;
using Domain;
using System.Text.Json.Serialization;

namespace Application.Clubs {
    public class ClubDto {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LeagueName { get; set; }
        public string StadiumName { get; set; }
        public DateTime DateEstablished { get; set; }
        public string ShortName { get; set; }

        [JsonPropertyName("attendees")]
        public ICollection<AttendeeDto> UserClubs {get; set;}
    }
}