using System;
using System.Collections.Generic;
using System.Linq;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static void SeedData(DataContext context)
        {
            if (!context.Clubs.Any())
            {
                var clubs = new List<Club>{

                new Club
                {
                  Name = "Liverpool",
                  LeagueName = "Premier League",
                  StadiumName = "Anfield",
                  DateEstablished = DateTime.Now.AddYears(-100)
                },
                new Club
                {
                  Name = "Man City",
                  LeagueName = "Premier League",
                  StadiumName = "Eithad",
                  DateEstablished = DateTime.Now.AddYears(-80)
                }

              };

                context.AddRange(clubs);
                context.SaveChanges();
            }
        }
    }
}