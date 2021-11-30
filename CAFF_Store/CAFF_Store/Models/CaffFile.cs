using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models
{
	public class CaffFile
	{
		public string UserID { get; set; }
		public byte[] Data { get; set; }
		public string FileName { get; set; }
		public List<Comment> Comments { get; set; }
	}
}
