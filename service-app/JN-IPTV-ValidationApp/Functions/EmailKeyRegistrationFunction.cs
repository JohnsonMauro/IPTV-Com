
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

namespace IPTV.Validation.App
{
    public static class EmailKeyRegistrationFunction
    {
        const string emailFormKey = "emailFormKey";
        const string deviceFormKey = "deviceFormKey";

        [FunctionName("EmailKeyRegistrationFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log,
            [Table("tbemailkey")] CloudTable tableEmailKey, [Table("tbemailpaid")] CloudTable tableEmailPaid)
        {
            log.LogInformation("EmailKeyRegistrationFunction Started");

            try
            {
                switch (req.Method.ToLower())
                {
                    case "get":
                        log.LogInformation("Get");
                        string responseMessage = CreateBodyResponse();
                        return new ContentResult { Content = responseMessage, ContentType = "text/html" };
                    case "post":
                        if (!req.Form.ContainsKey(emailFormKey) || !req.Form.ContainsKey(deviceFormKey)
                        || string.IsNullOrWhiteSpace(req.Form[emailFormKey]) || string.IsNullOrWhiteSpace(req.Form[deviceFormKey]))
                        {
                            return new BadRequestObjectResult("Email and Device Key cannot be empty");
                        }
                        var email = req.Form[emailFormKey];

                        await ValidationProcess.ValidateEmailPaid(tableEmailPaid, email);

                        var deviceKey = req.Form[deviceFormKey];
                        await RegisterEmailKeyProcess.RegisterEmaiDeviceKey(tableEmailKey, email, deviceKey);

                        break;
                    default:
                        return new BadRequestObjectResult("Http method not supported");
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
           
            log.LogInformation("EmailKeyRegistrationFunction Finished");
            return new OkObjectResult("Email and Device Key succesfully reigstered");
        }

        private static string CreateBodyResponse()
        {
            var response = "<body style='background-color: #262626; font-family: Arial;'><div style='padding: 20px; font-size: 3vh; color: #efefef;'>"
                + "<h1>JN-IPTV</h1><div><p>Type your email, device key and press submit</p></div><div>"
                + "<form method='post' enctype='application/json'> Email <input required style='font-size: 3vh' name='"+ emailFormKey + "' type='text' width='150px'> <br><br> Device key <input required style='font-size: 3vh' name='"+ deviceFormKey + "' type='text' width='150px'> <br><br>"
                + "<input style='font-size: 3vh' type='submit' value='submit'>  </form></div></div></body>";

            return response;
        }

    }
}



