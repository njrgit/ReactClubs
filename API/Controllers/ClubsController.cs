using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Clubs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/{controller}")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClubsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Club>>> List()
        {
            return await _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Club>> SingleClub(Guid id)
        {
            return await _mediator.Send(new SingleClub.Query{id= id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> CreateSingleClub (CreateSingleClub.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditSingleClub(Guid id,EditClub.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteSingleClub(Guid id)
        {
            return await _mediator.Send(new DeleteClub.Command{Id = id});
        }
    }
}