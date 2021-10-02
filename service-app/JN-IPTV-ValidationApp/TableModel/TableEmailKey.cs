using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace FunctionApp1.TableModel
{
    public class TableEmailKey : TableEntity
    {
        public TableEmailKey()
        {

        }
        public TableEmailKey(string email, string deviceKey)
        {
            PartitionKey = TableConstants.PartitionKey;
            RowKey = email.Trim().ToLower();
            Email = email.Trim().ToLower();
            DeviceKey = deviceKey;
        }

        public string Email { get; set; }
        public string DeviceKey { get; set; }
    }
}
