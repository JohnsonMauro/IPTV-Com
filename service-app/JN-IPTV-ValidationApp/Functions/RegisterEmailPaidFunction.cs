
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
    public static class RegisterEmailPaidFunction
    {
        [Disable]
        [FunctionName("RegisterEmailPaidFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log,
            [Table("tbemailpaid")] CloudTable tableEmailPaid)
        {
            log.LogInformation("RegisterEmailPaidFunction Started");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var emailPaid = JsonConvert.DeserializeObject<EmailPaid>(requestBody);

                await RegisterEmailPaidProcess.AddEmailPaid(tableEmailPaid, emailPaid.email, (PayTypeCode)emailPaid.payType);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }

            log.LogInformation("RegisterEmailPaidFunction Finished");
            return new OkResult();
        }

        public class EmailPaid
        {
            public string email { get; set; }
            public int payType { get; set; }
        }

    }
}



