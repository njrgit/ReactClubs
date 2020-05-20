using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> GetTask(string username)
        {
            return await Mediator.Send(new Details.Query { UserName = username });
        }

        [HttpPut("editprofile")]
        public async Task<ActionResult<Unit>> Edit([FromBody]EditProfile.Command editProfile)
        {
            return await Mediator.Send(editProfile);
        }

        [HttpGet("{username}/clubs")]
        public async Task<ActionResult<List<UserClubDto>>> GetUserClubs(string username, string predicate)
        {
            return await Mediator.Send(new ListClubs.Query { Username = username, Predicate = predicate });
        }

    }
}