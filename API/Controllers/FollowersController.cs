using System.Reflection.Metadata.Ecma335;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Profiles;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username){

            return await Mediator.Send(new AddFollowing.Command{Username = username});
        }

        [HttpDelete("{username}/unfollow")]
        public async Task<ActionResult<Unit>> Unfollow(string username)
        {
            return await Mediator.Send(new DeleteFollowing.Command { Username = username });
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<Profile>>> GetFollowings(string username, string predicate)
        {
            return await Mediator.Send(new FollowersList.Query { Username = username, Predicate = predicate });
        }
    }
}