using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models
{
	public class CaffFile
	{
		public string FileName { get; set; }
		public string Author { get; set; }
		public string UserID { get; set; }
		public string Created { get; set; }

		public string Data { get; set; }
		public string Cover { get; set; }

		public List<Comment> Comments { get; set; }
	}
}