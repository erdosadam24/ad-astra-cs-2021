using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models.Requests
{
	public class AddCommentRequest
	{
		public string Body { get; set; }
		public int FileId { get; set; }
	}
}
