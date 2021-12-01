using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models.Responses
{
	public class PagedCaffFiles
	{
		public int TotalSize { get; set; }
		public List<CaffFile> Files { get; set; }
		
	}
}
