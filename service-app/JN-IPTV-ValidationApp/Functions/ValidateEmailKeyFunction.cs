
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Microsoft.Azure.Cosmos.Table;
using FunctionApp1.BLL;
using FunctionApp1.TableModel;
using Newtonsoft.Json;

namespace FunctionApp1
{
    public static class ValidateEmailKeyFunction
    {
        [FunctionName("ValidateEmailKeyFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log,
            [Table("tbemailpaid")] CloudTable tableEmailPaid, [Table("tbemailkey")] CloudTable tableEmailKey)
        {
            log.LogInformation("ValidateEmailKeyFunction Started");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var emailKey = JsonConvert.DeserializeObject<EmailKey>(requestBody);
                log.LogInformation(emailKey.email);
                log.LogInformation(emailKey.deviceKey);
                await ValidationProcess.ValidateEmailPaid(tableEmailPaid, emailKey.email);
                await ValidationProcess.ValidateEmailAndDeviceKey(tableEmailKey, emailKey.email, emailKey.deviceKey);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }

            log.LogInformation("ValidateEmailKeyFunction Finished");
            return new OkResult();
        }

        public class EmailKey
        {
            public string email { get; set; }
            public string deviceKey { get; set; }
        }

    }
}



