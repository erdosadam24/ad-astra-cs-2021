﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Models
{
	public class Comment
	{
		public int Id { get; set; }
		public CaffFile File { get; set; }
		public int FileID { get; set; }
	}
}
