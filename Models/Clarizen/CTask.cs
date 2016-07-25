using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Clarizen.Models
{
    public class CTask
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Owner { get; set; }

        public string Parent { get; set; }

        public int SubTaskCount { get; set; }
    }
}