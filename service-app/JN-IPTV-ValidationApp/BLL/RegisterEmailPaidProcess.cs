using FunctionApp1.TableModel;
using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApp1.BLL
{
    internal class RegisterEmailPaidProcess
    {
        public static Task AddEmailPaid(CloudTable tableEmailPaid, string email, PayTypeCode payType)
        {
            var tablePaid = new TableEmailPaid(email, payType);

            var insertOp = TableOperation.Insert(tablePaid);
            return tableEmailPaid.ExecuteAsync(insertOp);
        }
    }
}
