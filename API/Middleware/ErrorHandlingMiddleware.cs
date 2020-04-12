using System.Net;
using System;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace API.Middleware {
    public class ErrorHandlingMiddleware {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware (RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandExceptionAsync(context, ex,_logger);
            };            
        }

        private async Task HandExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;
            
            switch (ex)
            {
                case RestException re:
                    logger.LogError(ex,"REST Error");
                    errors = re.Errors;
                    context.Response.StatusCode = (int) re.Code;
                    break;
                
                case Exception exception:
                    logger.LogError(ex, "Server Error");
                    errors = string.IsNullOrWhiteSpace(exception.Message) ? "Error" : exception.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";

            if(errors != null)
            {
                var result = JsonSerializer.Serialize(new {
                    errors
                });

                await context.Response.WriteAsync(result);
            }
        }
    }
}