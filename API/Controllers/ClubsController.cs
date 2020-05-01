using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Clubs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    public class ClubsController : BaseController {
        [HttpGet]
        public async Task<ActionResult<List<ClubDto>>> List () {
            return await Mediator.Send (new List.Query ());
        }

        [HttpGet ("{id}")]
        [Authorize]
        public async Task<ActionResult<ClubDto>> SingleClub (Guid id) {
            return await Mediator.Send (new SingleClub.Query { id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> CreateSingleClub (CreateSingleClub.Command command) {
            return await Mediator.Send (command);
        }

        [HttpPut ("{id}")]
        [Authorize (Policy = "IsClubHost")]
        public async Task<ActionResult<Unit>> EditSingleClub (Guid id, EditClub.Command command) {
            command.Id = id;
            return await Mediator.Send (command);
        }

        [HttpDelete ("{id}")]
        [Authorize (Policy = "IsClubHost")]
        public async Task<ActionResult<Unit>> DeleteSingleClub (Guid id) {
            return await Mediator.Send (new DeleteClub.Command { Id = id });
        }

        [HttpPost ("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend (Guid id) {
            return await Mediator.Send (new Attend.Command { Id = id });
        }

        [HttpDelete ("{id}/attend")]
        public async Task<ActionResult<Unit>> Unattend (Guid id) {
            return await Mediator.Send (new Unattend.Command { Id = id });
        }
    }
}