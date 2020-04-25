using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Clubs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ClubsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<Club>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Club>> SingleClub(Guid id)
        {
            return await Mediator.Send(new SingleClub.Query{id= id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> CreateSingleClub (CreateSingleClub.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditSingleClub(Guid id,EditClub.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteSingleClub(Guid id)
        {
            return await Mediator.Send(new DeleteClub.Command{Id = id});
        }
    }
}