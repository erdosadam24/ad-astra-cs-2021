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
		public static bool createBmpForCaffFile(string caffPath)
		{
			try
			{
				var proc = Process.Start(@"regenerated_parser.exe", caffPath);
				proc.WaitForExit();
				return true;

			}catch(Exception e)
			{
				return false;
			}
			
			
		}
		
	}
}
