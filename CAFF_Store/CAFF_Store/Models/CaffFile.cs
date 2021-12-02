using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CAFF_Store.Models
{
	public class CaffFile
	{
		public string FileName { get; set; }
		public string Author { get; set; }
		[JsonIgnore]
		public string UserId { get; set; }
		public DateTime Created { get; set; }

		public string Data { get; set; }
		public string Cover { get; set; }

		public List<Comment> Comments { get; set; }
	}
}