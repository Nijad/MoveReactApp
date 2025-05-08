using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models;
using MoveReactApp.Server.Models.DTOs;
using System.Net;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "INTERNET\\Domain Users")]
    public class TerminalProgramController : ControllerBase
    {
        private readonly ILogger<TerminalProgramController> _logger;
        private readonly IUserHelper userHelper;
        private readonly Operations operations = new();
        private readonly string username = "";
        public TerminalProgramController(ILogger<TerminalProgramController> logger, IUserHelper user)
        {
            _logger = logger;
            userHelper = user;
            username = userHelper.GetUserName();
        }

        [HttpPost("StartStop")]
        public IActionResult StartStop([FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            int status = int.Parse(form["statusId"].ToString());
            try
            {
                operations.StartStop(status, username);
            }
            catch (Exception ex)
            {
                string msg = "";
                if (status == 0)
                    msg = "Failed to run terminal";
                else
                    msg = "Failed to stop terminal";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }
            return Ok();
        }

        [HttpGet]
        public IActionResult GetTerminalAttributes()
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            bool responding = false;
            try
            {
                try
                {
                    responding = TerminalAttribute.Responding();
                    if (!responding)
                        if (TerminalAttribute.AnyProcessWithName())
                            operations.StopWithError("Not Responding", TerminalStatusEnum.stopped);
                        else
                            operations.StartStop(TerminalAttribute.StatusId, "anonymous");
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                    if (ex.Message.StartsWith("Process with an Id of") && ex.Message.EndsWith("is not running."))
                    {
                        msg = "Terminal was ended out of application";
                        operations.StopWithError(msg, TerminalStatusEnum.closed);
                    }
                    else
                    {
                        msg = "Not Responding";
                        operations.StopWithError(msg, TerminalStatusEnum.stopped);
                    }
                    _logger.LogError(ex, msg);
                }

                operations.GetTerminalAttributes();
            }
            catch (Exception ex)
            {
                string msg = "Failed to get terminal attributes.";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }
            AttributesDTO attrs = new AttributesDTO();
            return Ok(attrs);
        }
    }
}
