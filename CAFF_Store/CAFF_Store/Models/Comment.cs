using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CAFF_Store.Models
{
	public class Comment
	{
		public int CommentId { get; set; }
		public string FileName { get; set; }
		public string Body { get; set; }
		public string Author { get; set; }
		[JsonIgnore]
		public string UserId { get; set; }
		public DateTime Created { get; set; }

		public DateTime Updated { get; set; }
	}
}
