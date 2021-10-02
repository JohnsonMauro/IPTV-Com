using FunctionApp1.TableModel;
using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApp1.BLL
{
    internal class RegisterEmailKeyProcess
    {
        public static Task RegisterEmaiDeviceKey(CloudTable tableEmailKey, string email, string deviceKey)
        {
            var tableKey = new TableEmailKey(email, deviceKey);
            var insertOrUpdateOp = TableOperation.InsertOrMerge(tableKey);
            return tableEmailKey.ExecuteAsync(insertOrUpdateOp);
        }
    }
}
