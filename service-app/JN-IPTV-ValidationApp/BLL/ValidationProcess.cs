using FunctionApp1.TableModel;
using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApp1.BLL
{
    internal class ValidationProcess
    {
        public async static Task ValidateEmailPaid(CloudTable tableEmailPaid, string email)
        {
            var emalLower = email.Trim().ToLower();
            var emailPaidQuery = new TableQuery<TableEmailPaid>().Where(
                TableQuery.GenerateFilterCondition("Email", QueryComparisons.Equal, emalLower));

            var tablePaidResults = await tableEmailPaid.ExecuteQuerySegmentedAsync(emailPaidQuery, null);

            var dateNow = DateTime.UtcNow;
            foreach (var tablePaidItem in tablePaidResults)
            {
                switch (tablePaidItem.GetPayType())
                {
                    case PayTypeCode.Month:
                        if (tablePaidItem.CreationDate.AddMonths(1) >= dateNow)
                            return;
                        break;
                    case PayTypeCode.Year:
                        if (tablePaidItem.CreationDate.AddYears(1) >= dateNow)
                            return;
                        break;
                    default:
                        break;
                }
            }

            throw new Exception("No subscription found for " + email);
        }

        public static async Task ValidateEmailAndDeviceKey(CloudTable tableEmailKey, string email, string deviceKey)
        {
            var emailLower = email.Trim().ToLower();
            var emailKeyQuery = new TableQuery<TableEmailKey>().Where(
                TableQuery.CombineFilters(TableQuery.GenerateFilterCondition("Email", QueryComparisons.Equal, emailLower),
                TableOperators.And,
                TableQuery.GenerateFilterCondition("DeviceKey", QueryComparisons.Equal, deviceKey)));

            var tableEmailKeyResults = await tableEmailKey.ExecuteQuerySegmentedAsync(emailKeyQuery, null);

            foreach (var tablePaidItem in tableEmailKeyResults)
            {
                return;
            }

            throw new Exception("Email and Device Key are not related");
        }
    }
}
