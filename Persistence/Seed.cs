using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence {
  public class Seed {
    public static async Task SeedData (DataContext context, UserManager<AppUser> userManager) {

      if (!userManager.Users.Any ()) {
        var users = new List<AppUser>{

          new AppUser{
            DisplayName = "Niro",
            UserName = "niro",
            Email = "niro@test.com"
          },
          
          new AppUser{
            DisplayName = "Anthony",
            UserName = "anthony",
            Email = "niro@test.com"
          },
          
          new AppUser{
            DisplayName = "Nilesha",
            UserName = "nili",
            Email = "niro@test.com"
          }
        };

        foreach (var user in users)
        {
          await userManager.CreateAsync(user,"Pa$$w0rd");   
        }
      }

      if (!context.Clubs.Any ()) {
        var clubs = new List<Club> {

          new Club {
          Name = "Liverpool",
          LeagueName = "Premier League",
          StadiumName = "Anfield",
          DateEstablished = DateTime.Now.AddYears (-100)
          },
          new Club {
          Name = "Man City",
          LeagueName = "Premier League",
          StadiumName = "Eithad",
          DateEstablished = DateTime.Now.AddYears (-80)
          }

        };

        context.AddRange (clubs);
        context.SaveChanges ();
      }
    }
  }
}