using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models.Responses
{
	public class UserInfoResponse
	{
		public string UserID { get; set; }
		public string UserName { get; set; }
		public string Email { get; set; }
		public List<string> Roles { get; set; }
	}
}
