using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace FunctionApp1.TableModel
{
    public class TableEmailPaid : TableEntity
    {
        public TableEmailPaid()
        {

        }

        public TableEmailPaid(string email, PayTypeCode payType)
        {
            Email = email.Trim().ToLower();
            PayType = (int)payType;
            PartitionKey = TableConstants.PartitionKey;
            RowKey = Guid.NewGuid().ToString();
            this.CreationDate = DateTime.UtcNow;
        }

        public string Email { get; set; }
        public int PayType { get; set; }
        public DateTime CreationDate { get; set; }

        public PayTypeCode GetPayType()
        {
            return (PayTypeCode)PayType;
        }
    }

    public enum PayTypeCode
    {
        Month = 1,
        Year = 2
    }
}
