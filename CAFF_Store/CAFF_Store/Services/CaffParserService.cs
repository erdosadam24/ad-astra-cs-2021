using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace CAFF_Store.Services
{
	public class CaffParserService
	{
		public static void createBmpForCaffFile(string caffPath)
		{
			var proc = Process.Start(@"E:\Repos\ad-astra-cs-2021\parser.exe", caffPath);
			proc.WaitForExit();
			
		}
		
	}
}
