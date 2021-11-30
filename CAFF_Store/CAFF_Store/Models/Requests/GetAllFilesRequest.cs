using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models.Requests
{
	public class GetAllFilesRequest
	{
		public int PageSize { get; set; } = 9;
		public int PageNumber { get; set; } = 1;
		public string NameFilter { get; set; } = "";
	}
}
